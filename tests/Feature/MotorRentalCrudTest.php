<?php

use App\Models\MotorRental;
use App\Models\User;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('admin can create a motor rental', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $response = $this->actingAs($admin)->post(route('admin.motor-rentals.store', absolute: false), [
        'name' => 'Yamaha NMAX',
        'brand' => 'Yamaha',
        'motor_type' => 'Scooter',
        'plate_number' => 'B 1234 AB',
        'description' => 'Good condition',
        'price_per_day' => 150000,
        'insurance_price' => 25000,
        'cc' => 150,
        'transmission' => 'matic',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.motor-rentals.index', absolute: false));

    $this->assertDatabaseHas('motor_rentals', [
        'name' => 'Yamaha NMAX',
        'is_active' => true,
    ]);
});

test('admin can create an inactive motor rental', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $this->actingAs($admin)->post(route('admin.motor-rentals.store', absolute: false), [
        'name' => 'Old Scooter',
        'brand' => 'Honda',
        'motor_type' => 'Moped',
        'plate_number' => 'B 5678 CD',
        'description' => 'Needs repair',
        'price_per_day' => 50000,
        'insurance_price' => 10000,
        'cc' => 110,
        'transmission' => 'matic',
        'is_active' => false,
    ]);

    $this->assertDatabaseHas('motor_rentals', [
        'name' => 'Old Scooter',
        'is_active' => false,
    ]);
});

test('admin can create a motor rental without is_active (defaults to false)', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $this->actingAs($admin)->post(route('admin.motor-rentals.store', absolute: false), [
        'name' => 'Default Motor',
        'brand' => 'Suzuki',
        'motor_type' => 'Sport',
        'plate_number' => 'B 9012 EF',
        'description' => 'Testing default',
        'price_per_day' => 200000,
        'insurance_price' => 30000,
        'cc' => 250,
        'transmission' => 'manual',
    ]);

    $this->assertDatabaseHas('motor_rentals', [
        'name' => 'Default Motor',
        'is_active' => false,
    ]);
});

test('motor rental creation requires required fields', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $response = $this->actingAs($admin)->post(route('admin.motor-rentals.store', absolute: false), []);

    $response->assertSessionHasErrors(['name', 'brand', 'motor_type', 'plate_number', 'price_per_day']);
});

test('admin can view motor rentals index', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    MotorRental::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.motor-rentals.index', absolute: false));

    $response->assertStatus(200);
});

test('admin can update a motor rental', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    $rental = MotorRental::factory()->create([
        'name' => 'Original Motor',
        'is_active' => true,
    ]);

    $this->actingAs($admin)->put(route('admin.motor-rentals.update', $rental->id, absolute: false), [
        'name' => 'Updated Motor',
        'brand' => $rental->brand,
        'motor_type' => $rental->motor_type,
        'plate_number' => $rental->plate_number,
        'description' => $rental->description,
        'price_per_day' => $rental->price_per_day,
        'insurance_price' => $rental->insurance_price,
        'cc' => $rental->cc,
        'transmission' => $rental->transmission,
        'is_active' => false,
    ]);

    $this->assertDatabaseHas('motor_rentals', [
        'id' => $rental->id,
        'name' => 'Updated Motor',
        'is_active' => false,
    ]);
});

test('admin can soft delete a motor rental', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    $rental = MotorRental::factory()->create();

    $this->actingAs($admin)->delete(route('admin.motor-rentals.destroy', $rental->id, absolute: false));

    $this->assertSoftDeleted($rental);
});

test('admin can restore a soft deleted motor rental', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    $rental = MotorRental::factory()->create();
    $rental->delete();

    $this->actingAs($admin)->post(route('admin.motor-rentals.restore', $rental->id, absolute: false));

    $this->assertNotSoftDeleted($rental);
});
