<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('homestay_room_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('homestay_room_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->integer('nights');
            $table->date('check_in');
            $table->date('check_out');
            $table->timestamps();

            $table->index('booking_item_id', 'hs_room_booking_item_id_index');
            $table->index('homestay_room_id', 'hs_room_booking_room_id_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homestay_room_bookings');
    }
};
