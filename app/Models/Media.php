<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Media extends Model
{
    protected $fillable = [
        'mediable_type', 'mediable_id', 'url', 'path', 'disk',
        'mime_type', 'size', 'is_primary', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'sort_order' => 'integer',
            'size' => 'integer',
        ];
    }

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }
}
