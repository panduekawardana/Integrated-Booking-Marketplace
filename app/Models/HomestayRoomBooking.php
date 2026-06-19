<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HomestayRoomBooking extends Model
{
    protected $table = 'homestay_room_bookings';

    protected $fillable = [
        'booking_item_id', 'homestay_room_id', 'quantity',
        'unit_price', 'subtotal', 'nights', 'check_in', 'check_out',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'check_in' => 'date',
            'check_out' => 'date',
        ];
    }

    public function bookingItem(): BelongsTo
    {
        return $this->belongsTo(BookingItem::class);
    }

    public function homestayRoom(): BelongsTo
    {
        return $this->belongsTo(HomestayRoom::class);
    }
}
