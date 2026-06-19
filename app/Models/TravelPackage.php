<?php

namespace App\Models;

use App\Models\Scopes\ActiveScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

#[ScopedBy([ActiveScope::class])]
class TravelPackage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'origin', 'destination', 'description', 'itinerary',
        'price', 'max_pax', 'duration_days', 'includes', 'excludes', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'itinerary' => 'array',
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (TravelPackage $package) {
            if (empty($package->slug)) {
                $package->slug = Str::slug($package->name).'-'.Str::random(5);
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
