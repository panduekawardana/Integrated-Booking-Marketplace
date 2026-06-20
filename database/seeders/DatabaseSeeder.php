<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call(RolePermissionSeeder::class);

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'phone' => '08123456789',
            'nationality' => 'Indonesia',
            'currency_preference' => 'IDR',
            'is_active' => true,
        ]);
        $admin->assignRole('admin');

        $customer = User::factory()->create([
            'name' => 'Customer',
            'email' => 'customer@example.com',
            'password' => bcrypt('password'),
            'role' => 'customer',
            'phone' => '08123456780',
            'nationality' => 'Indonesia',
            'currency_preference' => 'IDR',
            'is_active' => true,
        ]);
        $customer->assignRole('customer');
    }
}
