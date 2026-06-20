<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class HomestayRoom extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'homestay_id', 'name', 'description', 'price_per_night',
        'max_guests', 'total_rooms', 'facilities', 'size_sqm', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'facilities' => 'array',
            'price_per_night' => 'decimal:2',
            'size_sqm' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function homestay(): BelongsTo
    {
        return $this->belongsTo(Homestay::class);
    }

    public function roomBookings(): HasMany
    {
        return $this->hasMany(HomestayRoomBooking::class);
    }
}
