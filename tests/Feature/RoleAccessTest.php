<?php

use App\Models\User;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('guests can view service listing pages', function () {
    $listingRoutes = [
        '/services/travel-packages',
        '/services/motor-rentals',
        '/services/tour-guides',
        '/services/homestays',
    ];

    foreach ($listingRoutes as $route) {
        $response = $this->get($route);
        $response->assertStatus(200);
    }
});

test('guests are redirected to login when accessing service detail pages', function () {
    $detailRoutes = [
        route('services.travel-packages.show', 1, false),
        route('services.motor-rentals.show', 1, false),
        route('services.tour-guides.show', 1, false),
        route('services.homestays.show', 1, false),
    ];

    foreach ($detailRoutes as $route) {
        $response = $this->get($route);
        $response->assertRedirect(route('login', absolute: false));
    }
});

test('guests can view the landing page', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});

test('admin routes are forbidden for customer users', function () {
    $user = User::factory()->asCustomer()->create();

    $response = $this->actingAs($user)->get('/admin/dashboard');

    $response->assertForbidden();
});

test('admin routes are accessible for admin users', function () {
    $user = User::factory()->asAdmin()->create()->fresh();

    $response = $this->actingAs($user)->get('/admin/dashboard');

    $response->assertStatus(200);
});

test('admin routes are forbidden for unauthenticated users', function () {
    $response = $this->get('/admin/dashboard');

    $response->assertRedirect(route('login', absolute: false));
});
