<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Payment;
use Midtrans\Config;
use Midtrans\Notification;
use Midtrans\Snap;
use Midtrans\Transaction;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$clientKey = config('services.midtrans.client_key');
        Config::$isProduction = config('services.midtrans.is_production', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function createSnapToken(Booking $booking, Payment $payment): string
    {
        $items = $booking->items->map(function ($item) {
            return [
                'id' => $item->bookable_type.'-'.$item->bookable_id,
                'price' => (int) $item->unit_price,
                'quantity' => $item->quantity,
                'name' => $this->getItemName($item),
            ];
        })->toArray();

        $params = [
            'transaction_details' => [
                'order_id' => $payment->payment_code,
                'gross_amount' => (int) $booking->final_amount,
            ],
            'item_details' => $items,
            'customer_details' => [
                'first_name' => $booking->user->name,
                'email' => $booking->user->email,
                'phone' => $booking->user->phone ?? '',
            ],
        ];

        return Snap::getSnapToken($params);
    }

    public function handleNotification(): ?Payment
    {
        $notification = new Notification;

        $payment = Payment::where('payment_code', $notification->order_id)->first();

        if (! $payment) {
            return null;
        }

        $transactionStatus = $notification->transaction_status;
        $fraudStatus = $notification->fraud_status;
        $paymentMethod = $notification->payment_type;
        $paymentChannel = $notification->bank ?? $notification->store ?? null;

        $payment->update([
            'midtrans_transaction_id' => $notification->transaction_id,
            'midtrans_order_id' => $notification->order_id,
            'payment_method' => $paymentMethod,
            'payment_channel' => $paymentChannel,
            'transaction_time' => $notification->transaction_time,
            'fraud_status' => $fraudStatus,
            'status' => $this->mapStatus($transactionStatus, $fraudStatus),
            'raw_response' => (array) $notification,
        ]);

        if ($payment->status->value === 'success') {
            $payment->update(['paid_at' => now()]);

            $payment->booking->update([
                'status' => 'confirmed',
                'confirmed_at' => now(),
            ]);
        } elseif ($payment->status->value === 'expired') {
            $payment->update(['expired_at' => now()]);

            $payment->booking->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancellation_reason' => 'Pembayaran expired',
            ]);
        }

        return $payment;
    }

    public function checkTransaction(string $orderId): array
    {
        return Transaction::status($orderId);
    }

    private function mapStatus(string $transactionStatus, ?string $fraudStatus): string
    {
        return match (true) {
            $transactionStatus === 'capture' && $fraudStatus === 'accept' => 'success',
            $transactionStatus === 'settlement' => 'success',
            $transactionStatus === 'deny' || $fraudStatus === 'deny' => 'failed',
            $transactionStatus === 'cancel' || $transactionStatus === 'expire' => 'expired',
            $transactionStatus === 'pending' => 'pending',
            $transactionStatus === 'refund' || $transactionStatus === 'partial_refund' => 'refund',
            default => 'pending',
        };
    }

    private function getItemName($item): string
    {
        if ($item->bookable) {
            return $item->bookable->name;
        }

        $type = class_basename($item->bookable_type);

        return match ($type) {
            'TravelPackage' => 'Travel Package #'.$item->bookable_id,
            'MotorRental' => 'Motor Rental #'.$item->bookable_id,
            'TourGuide' => 'Tour Guide #'.$item->bookable_id,
            'Homestay' => 'Homestay #'.$item->bookable_id,
            default => 'Service #'.$item->bookable_id,
        };
    }
}
