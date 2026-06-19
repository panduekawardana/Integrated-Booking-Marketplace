<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('motor_rentals', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('brand');
            $table->string('motor_type');
            $table->string('plate_number', 50);
            $table->text('description')->nullable();
            $table->decimal('price_per_day', 15, 2);
            $table->decimal('insurance_price', 15, 2)->default(0);
            $table->integer('cc')->nullable();
            $table->enum('transmission', ['manual', 'matic'])->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('is_active');
            $table->index('brand');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('motor_rentals');
    }
};
