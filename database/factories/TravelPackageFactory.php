<?php

namespace Database\Factories;

use App\Models\TravelPackage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TravelPackage>
 */
class TravelPackageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->city().' Adventure',
            'origin' => fake()->city(),
            'destination' => fake()->city(),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 100000, 10000000),
            'max_pax' => fake()->numberBetween(1, 20),
            'duration_days' => fake()->numberBetween(1, 14),
            'is_active' => true,
        ];
    }
}
