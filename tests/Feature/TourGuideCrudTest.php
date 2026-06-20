<?php

use App\Models\TourGuide;
use App\Models\User;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('admin can create a tour guide', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $response = $this->actingAs($admin)->post(route('admin.tour-guides.store', absolute: false), [
        'name' => 'John Doe',
        'bio' => 'Experienced guide',
        'languages' => ['English', 'Indonesian'],
        'specialties' => ['Hiking', 'History'],
        'price_per_day' => 500000,
        'max_pax' => 5,
        'phone' => '08123456789',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.tour-guides.index', absolute: false));

    $this->assertDatabaseHas('tour_guides', [
        'name' => 'John Doe',
        'is_active' => true,
    ]);
});

test('admin can create an inactive tour guide', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $this->actingAs($admin)->post(route('admin.tour-guides.store', absolute: false), [
        'name' => 'Jane Smith',
        'bio' => 'Not available',
        'languages' => ['English'],
        'specialties' => ['Food'],
        'price_per_day' => 300000,
        'max_pax' => 3,
        'phone' => '08123456788',
        'is_active' => false,
    ]);

    $this->assertDatabaseHas('tour_guides', [
        'name' => 'Jane Smith',
        'is_active' => false,
    ]);
});

test('admin can create a tour guide without is_active (defaults to false)', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $this->actingAs($admin)->post(route('admin.tour-guides.store', absolute: false), [
        'name' => 'Default Guide',
        'bio' => 'Testing default',
        'languages' => ['English'],
        'specialties' => ['Photography'],
        'price_per_day' => 400000,
        'max_pax' => 4,
        'phone' => '08123456787',
    ]);

    $this->assertDatabaseHas('tour_guides', [
        'name' => 'Default Guide',
        'is_active' => false,
    ]);
});

test('tour guide creation requires required fields', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();

    $response = $this->actingAs($admin)->post(route('admin.tour-guides.store', absolute: false), []);

    $response->assertSessionHasErrors(['name', 'price_per_day', 'max_pax']);
});

test('admin can view tour guides index', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    TourGuide::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.tour-guides.index', absolute: false));

    $response->assertStatus(200);
});

test('admin can update a tour guide', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    $guide = TourGuide::factory()->create([
        'name' => 'Original Guide',
        'is_active' => true,
    ]);

    $this->actingAs($admin)->put(route('admin.tour-guides.update', $guide->id, absolute: false), [
        'name' => 'Updated Guide',
        'bio' => $guide->bio,
        'languages' => $guide->languages,
        'specialties' => $guide->specialties,
        'price_per_day' => $guide->price_per_day,
        'max_pax' => $guide->max_pax,
        'phone' => $guide->phone,
        'is_active' => false,
    ]);

    $this->assertDatabaseHas('tour_guides', [
        'id' => $guide->id,
        'name' => 'Updated Guide',
        'is_active' => false,
    ]);
});

test('admin can soft delete a tour guide', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    $guide = TourGuide::factory()->create();

    $this->actingAs($admin)->delete(route('admin.tour-guides.destroy', $guide->id, absolute: false));

    $this->assertSoftDeleted($guide);
});

test('admin can restore a soft deleted tour guide', function () {
    $admin = User::factory()->asAdmin()->create()->fresh();
    $guide = TourGuide::factory()->create();
    $guide->delete();

    $this->actingAs($admin)->post(route('admin.tour-guides.restore', $guide->id, absolute: false));

    $this->assertNotSoftDeleted($guide);
});
