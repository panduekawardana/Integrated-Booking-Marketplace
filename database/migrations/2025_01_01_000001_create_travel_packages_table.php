<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('travel_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('origin');
            $table->string('destination');
            $table->text('description');
            $table->json('itinerary')->nullable();
            $table->decimal('price', 15, 2);
            $table->integer('max_pax');
            $table->integer('duration_days');
            $table->text('includes')->nullable();
            $table->text('excludes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('travel_packages');
    }
};
