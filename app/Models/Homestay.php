<?php

namespace App\Models;

use App\Models\Scopes\ActiveScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

#[ScopedBy([ActiveScope::class])]
class Homestay extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'description', 'address', 'city',
        'latitude', 'longitude', 'facilities', 'rules',
        'check_in_time', 'check_out_time', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'facilities' => 'array',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'is_active' => 'boolean',
            'check_in_time' => 'datetime:H:i:s',
            'check_out_time' => 'datetime:H:i:s',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Homestay $homestay) {
            if (empty($homestay->slug)) {
                $homestay->slug = Str::slug($homestay->name).'-'.Str::random(5);
            }
        });
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(HomestayRoom::class);
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
