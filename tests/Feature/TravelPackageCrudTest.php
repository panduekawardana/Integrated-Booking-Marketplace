<?php

use App\Models\TravelPackage;
use App\Models\User;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('admin can create a travel package', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $response = $this->actingAs($admin)->post(route('admin.travel-packages.store', absolute: false), [
        'name' => 'Bali Adventure',
        'origin' => 'Jakarta',
        'destination' => 'Bali',
        'description' => 'Amazing trip to Bali',
        'price' => 1500000,
        'max_pax' => 10,
        'duration_days' => 5,
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.travel-packages.index', absolute: false));

    $this->assertDatabaseHas('travel_packages', [
        'name' => 'Bali Adventure',
        'origin' => 'Jakarta',
        'destination' => 'Bali',
        'is_active' => true,
    ]);
});

test('admin can create an inactive travel package', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $this->actingAs($admin)->post(route('admin.travel-packages.store', absolute: false), [
        'name' => 'Inactive Trip',
        'origin' => 'Jakarta',
        'destination' => 'Bandung',
        'description' => 'An inactive package',
        'price' => 500000,
        'max_pax' => 5,
        'duration_days' => 2,
        'is_active' => false,
    ]);

    $this->assertDatabaseHas('travel_packages', [
        'name' => 'Inactive Trip',
        'is_active' => false,
    ]);
});

test('admin can create a travel package without is_active (defaults to false)', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $this->actingAs($admin)->post(route('admin.travel-packages.store', absolute: false), [
        'name' => 'Default Active Trip',
        'origin' => 'Jakarta',
        'destination' => 'Yogyakarta',
        'description' => 'Testing default',
        'price' => 750000,
        'max_pax' => 8,
        'duration_days' => 3,
    ]);

    $this->assertDatabaseHas('travel_packages', [
        'name' => 'Default Active Trip',
        'is_active' => false,
    ]);
});

test('travel package creation requires required fields', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $response = $this->actingAs($admin)->post(route('admin.travel-packages.store', absolute: false), []);

    $response->assertSessionHasErrors(['name', 'origin', 'destination', 'description', 'price', 'max_pax', 'duration_days']);
});

test('admin can view travel packages index', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    TravelPackage::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.travel-packages.index', absolute: false));

    $response->assertStatus(200);
});

test('admin can update a travel package', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    $package = TravelPackage::factory()->create([
        'name' => 'Original Name',
        'is_active' => true,
    ]);

    $this->actingAs($admin)->put(route('admin.travel-packages.update', $package->id, absolute: false), [
        'name' => 'Updated Name',
        'origin' => $package->origin,
        'destination' => $package->destination,
        'description' => $package->description,
        'price' => $package->price,
        'max_pax' => $package->max_pax,
        'duration_days' => $package->duration_days,
        'is_active' => false,
    ]);

    $this->assertDatabaseHas('travel_packages', [
        'id' => $package->id,
        'name' => 'Updated Name',
        'is_active' => false,
    ]);
});

test('admin can soft delete a travel package', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    $package = TravelPackage::factory()->create();

    $this->actingAs($admin)->delete(route('admin.travel-packages.destroy', $package->id, absolute: false));

    $this->assertSoftDeleted($package);
});

test('admin can restore a soft deleted travel package', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    $package = TravelPackage::factory()->create();
    $package->delete();

    $this->actingAs($admin)->post(route('admin.travel-packages.restore', $package->id, absolute: false));

    $this->assertNotSoftDeleted($package);
});
