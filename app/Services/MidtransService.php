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

    public function isConfigured(): bool
    {
        return ! empty(config('services.midtrans.server_key'));
    }

    public function createSnapToken(Booking $booking, Payment $payment): string
    {
        if (! $this->isConfigured()) {
            throw new \RuntimeException('Payment gateway (Midtrans) belum dikonfigurasi. Silakan hubungi administrator.');
        }

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

        return $this->updatePaymentStatus(
            $payment,
            $notification->transaction_status,
            $notification->fraud_status,
            [
                'midtrans_transaction_id' => $notification->transaction_id,
                'midtrans_order_id' => $notification->order_id,
                'payment_method' => $notification->payment_type,
                'payment_channel' => $notification->bank ?? $notification->store ?? null,
                'transaction_time' => $notification->transaction_time,
                'notes' => 'Webhook notification',
            ],
        );
    }

    public function queryAndUpdatePayment(string $orderId): ?Payment
    {
        $payment = Payment::where('payment_code', $orderId)->first();

        if (! $payment) {
            return null;
        }

        try {
            $status = Transaction::status($orderId);

            return $this->updatePaymentStatus(
                $payment,
                $status['transaction_status'] ?? 'pending',
                $status['fraud_status'] ?? null,
                [
                    'midtrans_transaction_id' => $status['transaction_id'] ?? $payment->midtrans_transaction_id,
                    'midtrans_order_id' => $status['order_id'] ?? $orderId,
                    'payment_method' => $status['payment_type'] ?? $payment->payment_method,
                    'payment_channel' => $status['bank'] ?? $status['store'] ?? $payment->payment_channel,
                    'transaction_time' => $status['transaction_time'] ?? $payment->transaction_time,
                    'notes' => 'Updated via finish callback',
                ],
            );
        } catch (\Exception $e) {
            return $payment;
        }
    }

    public function checkTransaction(string $orderId): array
    {
        return Transaction::status($orderId);
    }

    private function updatePaymentStatus(Payment $payment, string $transactionStatus, ?string $fraudStatus, array $data): Payment
    {
        $newStatus = $this->mapStatus($transactionStatus, $fraudStatus);

        $payment->update(array_merge($data, [
            'fraud_status' => $fraudStatus,
            'status' => $newStatus,
        ]));

        if ($newStatus === 'success') {
            $payment->update(['paid_at' => $payment->paid_at ?? now()]);

            if ($payment->booking->status->value === 'pending') {
                $payment->booking->update([
                    'status' => 'confirmed',
                    'confirmed_at' => now(),
                ]);
            }
        } elseif ($newStatus === 'expired') {
            $payment->update(['expired_at' => $payment->expired_at ?? now()]);

            $payment->booking->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancellation_reason' => 'Pembayaran expired',
            ]);
        }

        return $payment->fresh();
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
