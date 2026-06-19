<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class BookingItem extends Model
{
    protected $fillable = [
        'booking_id', 'bookable_type', 'bookable_id', 'quantity',
        'unit_price', 'subtotal', 'date_from', 'date_to', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'date_from' => 'date',
            'date_to' => 'date',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function bookable(): MorphTo
    {
        return $this->morphTo();
    }

    public function homestayRoomBookings(): HasMany
    {
        return $this->hasMany(HomestayRoomBooking::class);
    }
}
