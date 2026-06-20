<?php

namespace Database\Factories;

use App\Models\Homestay;
use App\Models\HomestayRoom;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HomestayRoom>
 */
class HomestayRoomFactory extends Factory
{
    public function definition(): array
    {
        return [
            'homestay_id' => Homestay::factory(),
            'name' => fake()->randomElement(['Standard Room', 'Deluxe Room', 'Suite', 'Family Room', 'VIP Room']),
            'description' => fake()->paragraph(),
            'price_per_night' => fake()->randomFloat(2, 100000, 2000000),
            'max_guests' => fake()->numberBetween(1, 6),
            'total_rooms' => fake()->numberBetween(1, 10),
            'facilities' => fake()->randomElement([['AC', 'TV', 'WiFi'], ['AC', 'TV', 'WiFi', 'Mini Bar'], ['AC', 'TV', 'WiFi', 'Kitchen']]),
            'size_sqm' => fake()->numberBetween(15, 100),
            'is_active' => true,
        ];
    }
}
