<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Payment extends Model
{
    protected $fillable = [
        'booking_id', 'payment_code', 'midtrans_transaction_id',
        'midtrans_order_id', 'gross_amount', 'status', 'payment_method',
        'payment_channel', 'transaction_time', 'fraud_status',
        'raw_response', 'paid_at', 'expired_at', 'refunded_at',
        'refund_amount', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'gross_amount' => 'decimal:2',
            'status' => PaymentStatus::class,
            'raw_response' => 'array',
            'refund_amount' => 'decimal:2',
            'transaction_time' => 'datetime',
            'paid_at' => 'datetime',
            'expired_at' => 'datetime',
            'refunded_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Payment $payment) {
            if (empty($payment->payment_code)) {
                $payment->payment_code = 'PAY-'.strtoupper(Str::random(10));
            }
        });
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
