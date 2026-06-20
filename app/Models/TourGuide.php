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
class TourGuide extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'bio', 'languages', 'specialties',
        'price_per_day', 'max_pax', 'phone', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'languages' => 'array',
            'specialties' => 'array',
            'price_per_day' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (TourGuide $guide) {
            if (empty($guide->slug)) {
                $guide->slug = Str::slug($guide->name).'-'.Str::random(5);
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
