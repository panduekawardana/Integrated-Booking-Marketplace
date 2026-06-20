<?php

namespace Database\Factories;

use App\Models\MotorRental;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MotorRental>
 */
class MotorRentalFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company().' Motor Rental',
            'brand' => fake()->company(),
            'motor_type' => fake()->randomElement(['Scooter', 'Sport', 'Cruiser', 'Touring', 'Moped']),
            'plate_number' => strtoupper(fake()->bothify('?? #### ??')),
            'description' => fake()->paragraph(),
            'price_per_day' => fake()->randomFloat(2, 50000, 500000),
            'insurance_price' => fake()->randomFloat(2, 10000, 100000),
            'cc' => fake()->numberBetween(110, 1500),
            'transmission' => fake()->randomElement(['manual', 'matic']),
            'is_active' => true,
        ];
    }
}
