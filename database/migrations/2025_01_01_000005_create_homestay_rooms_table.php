<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('homestay_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('homestay_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price_per_night', 15, 2);
            $table->integer('max_guests');
            $table->integer('total_rooms');
            $table->json('facilities')->nullable();
            $table->decimal('size_sqm', 8, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('homestay_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homestay_rooms');
    }
};
