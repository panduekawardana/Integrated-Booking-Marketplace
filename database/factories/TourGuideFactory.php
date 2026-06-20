<?php

namespace Database\Factories;

use App\Models\TourGuide;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TourGuide>
 */
class TourGuideFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'bio' => fake()->paragraph(),
            'languages' => fake()->randomElement([['English'], ['English', 'Indonesian'], ['English', 'Japanese'], ['English', 'French', 'German']]),
            'specialties' => fake()->randomElement([['Hiking'], ['History'], ['Food'], ['Photography'], ['Adventure', 'Hiking']]),
            'price_per_day' => fake()->randomFloat(2, 200000, 2000000),
            'max_pax' => fake()->numberBetween(1, 10),
            'phone' => fake()->phoneNumber(),
            'is_active' => true,
        ];
    }
}
