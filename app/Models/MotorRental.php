<?php

namespace App\Models;

use App\Models\Scopes\ActiveScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

#[ScopedBy([ActiveScope::class])]
class MotorRental extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'brand', 'motor_type', 'plate_number', 'description',
        'price_per_day', 'insurance_price', 'cc', 'transmission', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_per_day' => 'decimal:2',
            'insurance_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (MotorRental $motor) {
            if (empty($motor->slug)) {
                $motor->slug = Str::slug($motor->name).'-'.Str::random(5);
            }
        });
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function primaryImage(): ?Media
    {
        return $this->media()->where('is_primary', true)->first();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
