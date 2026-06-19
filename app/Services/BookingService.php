<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Homestay;
use App\Models\MotorRental;
use App\Models\Payment;
use App\Models\TourGuide;
use App\Models\TravelPackage;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function createBooking(array $data, int $userId): Booking
    {
        return DB::transaction(function () use ($data, $userId) {
            $totalAmount = 0;
            $items = [];

            foreach ($data['items'] as $itemData) {
                $bookable = $this->resolveBookable($itemData['bookable_type'], $itemData['bookable_id']);
                $unitPrice = $bookable->price ?? $bookable->price_per_day ?? $bookable->price_per_night ?? 0;
                $subtotal = $unitPrice * $itemData['quantity'];

                $totalAmount += $subtotal;

                $items[] = new BookingItem([
                    'bookable_type' => $this->mapBookableType($itemData['bookable_type']),
                    'bookable_id' => $itemData['bookable_id'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                    'date_from' => $itemData['date_from'],
                    'date_to' => $itemData['date_to'] ?? null,
                    'notes' => $itemData['notes'] ?? null,
                ]);
            }

            $booking = Booking::create([
                'user_id' => $userId,
                'total_amount' => $totalAmount,
                'discount_amount' => 0,
                'final_amount' => $totalAmount,
                'status' => BookingStatus::Pending,
                'notes' => $data['notes'] ?? null,
            ]);

            $booking->items()->saveMany($items);

            $booking->load('items');

            Payment::create([
                'booking_id' => $booking->id,
                'payment_code' => 'PAY-'.strtoupper(substr(md5(uniqid()), 0, 10)),
                'gross_amount' => $booking->final_amount,
                'status' => PaymentStatus::Pending,
            ]);

            return $booking->fresh(['items', 'payments', 'user']);
        });
    }

    public function confirmBooking(Booking $booking): void
    {
        $booking->update([
            'status' => BookingStatus::Confirmed,
            'confirmed_at' => now(),
        ]);
    }

    public function completeBooking(Booking $booking): void
    {
        $booking->update([
            'status' => BookingStatus::Completed,
            'completed_at' => now(),
        ]);
    }

    public function cancelBooking(Booking $booking, ?string $reason = null): void
    {
        $booking->update([
            'status' => BookingStatus::Cancelled,
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);
    }

    private function resolveBookable(string $type, int $id)
    {
        $model = match ($type) {
            'travel_package' => TravelPackage::class,
            'motor_rental' => MotorRental::class,
            'tour_guide' => TourGuide::class,
            'homestay' => Homestay::class,
            default => throw new \InvalidArgumentException("Invalid bookable type: {$type}"),
        };

        return $model::findOrFail($id);
    }

    private function mapBookableType(string $type): string
    {
        return match ($type) {
            'travel_package' => TravelPackage::class,
            'motor_rental' => MotorRental::class,
            'tour_guide' => TourGuide::class,
            'homestay' => Homestay::class,
            default => throw new \InvalidArgumentException("Invalid bookable type: {$type}"),
        };
    }
}
