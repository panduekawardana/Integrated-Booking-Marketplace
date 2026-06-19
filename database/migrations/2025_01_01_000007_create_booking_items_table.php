<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->string('bookable_type');
            $table->unsignedBigInteger('bookable_id');
            $table->index(['bookable_type', 'bookable_id'], 'booking_items_bookable_index');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->date('date_from');
            $table->date('date_to')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('booking_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_items');
    }
};
