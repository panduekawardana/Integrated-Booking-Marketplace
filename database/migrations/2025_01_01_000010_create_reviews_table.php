<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('rating')->unsigned();
            $table->text('review_text')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('booking_id');
            $table->unique(['booking_id', 'user_id'], 'reviews_booking_user_unique');
            $table->index('is_approved');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
