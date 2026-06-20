<?php

namespace Database\Factories;

use App\Models\Homestay;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Homestay>
 */
class HomestayFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company().' Homestay',
            'description' => fake()->paragraph(),
            'address' => fake()->address(),
            'city' => fake()->city(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'facilities' => fake()->randomElement([['WiFi', 'AC', 'Parking'], ['WiFi', 'AC', 'Pool', 'Parking'], ['WiFi', 'Parking'], ['AC', 'Parking']]),
            'rules' => fake()->randomElement(['No smoking', 'No pets', 'No smoking, No pets', 'Check-in after 2 PM']),
            'check_in_time' => fake()->randomElement(['14:00:00', '13:00:00', '15:00:00']),
            'check_out_time' => fake()->randomElement(['12:00:00', '11:00:00', '10:00:00']),
            'is_active' => true,
        ];
    }
}
