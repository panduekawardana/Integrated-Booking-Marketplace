<?php

use App\Models\Homestay;
use App\Models\User;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('admin can create a homestay', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $response = $this->actingAs($admin)->post(route('admin.homestays.store', absolute: false), [
        'name' => 'Beach Homestay',
        'description' => 'Nice place near the beach',
        'address' => '123 Beach St',
        'city' => 'Bali',
        'latitude' => -8.4095,
        'longitude' => 115.1889,
        'facilities' => ['WiFi', 'AC', 'Parking'],
        'rules' => 'No smoking',
        'check_in_time' => '14:00:00',
        'check_out_time' => '12:00:00',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.homestays.index', absolute: false));

    $this->assertDatabaseHas('homestays', [
        'name' => 'Beach Homestay',
        'is_active' => true,
    ]);
});

test('admin can create an inactive homestay', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $this->actingAs($admin)->post(route('admin.homestays.store', absolute: false), [
        'name' => 'Closed Homestay',
        'description' => 'Temporarily closed',
        'address' => '456 Main St',
        'city' => 'Jakarta',
        'latitude' => -6.2088,
        'longitude' => 106.8456,
        'facilities' => ['WiFi'],
        'rules' => 'No pets',
        'check_in_time' => '14:00:00',
        'check_out_time' => '12:00:00',
        'is_active' => false,
    ]);

    $this->assertDatabaseHas('homestays', [
        'name' => 'Closed Homestay',
        'is_active' => false,
    ]);
});

test('admin can create a homestay without is_active (defaults to false)', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $this->actingAs($admin)->post(route('admin.homestays.store', absolute: false), [
        'name' => 'Default Homestay',
        'description' => 'Testing default',
        'address' => '789 Oak St',
        'city' => 'Bandung',
        'latitude' => -6.9175,
        'longitude' => 107.6191,
        'facilities' => ['AC', 'Parking'],
        'rules' => 'No smoking',
        'check_in_time' => '14:00:00',
        'check_out_time' => '12:00:00',
    ]);

    $this->assertDatabaseHas('homestays', [
        'name' => 'Default Homestay',
        'is_active' => false,
    ]);
});

test('homestay creation requires required fields', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $response = $this->actingAs($admin)->post(route('admin.homestays.store', absolute: false), []);

    $response->assertSessionHasErrors(['name', 'address', 'city']);
});

test('admin can view homestays index', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    Homestay::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.homestays.index', absolute: false));

    $response->assertStatus(200);
});

test('admin can update a homestay', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    $homestay = Homestay::factory()->create([
        'name' => 'Original Homestay',
        'is_active' => true,
    ]);

    $this->actingAs($admin)->put(route('admin.homestays.update', $homestay->id, absolute: false), [
        'name' => 'Updated Homestay',
        'description' => $homestay->getRawOriginal('description'),
        'address' => $homestay->address,
        'city' => $homestay->city,
        'latitude' => $homestay->getRawOriginal('latitude'),
        'longitude' => $homestay->getRawOriginal('longitude'),
        'facilities' => $homestay->facilities,
        'rules' => $homestay->getRawOriginal('rules'),
        'check_in_time' => $homestay->getRawOriginal('check_in_time'),
        'check_out_time' => $homestay->getRawOriginal('check_out_time'),
        'is_active' => false,
    ]);

    $this->assertDatabaseHas('homestays', [
        'id' => $homestay->id,
        'name' => 'Updated Homestay',
        'is_active' => false,
    ]);
});

test('admin can soft delete a homestay', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    $homestay = Homestay::factory()->create();

    $this->actingAs($admin)->delete(route('admin.homestays.destroy', $homestay->id, absolute: false));

    $this->assertSoftDeleted($homestay);
});

test('admin can restore a soft deleted homestay', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    $homestay = Homestay::factory()->create();
    $homestay->delete();

    $this->actingAs($admin)->post(route('admin.homestays.restore', $homestay->id, absolute: false));

    $this->assertNotSoftDeleted($homestay);
});
