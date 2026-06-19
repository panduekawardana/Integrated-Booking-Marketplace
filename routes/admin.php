<?php

use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HomestayController;
use App\Http\Controllers\Admin\MotorRentalController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TourGuideController;
use App\Http\Controllers\Admin\TravelPackageController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('travel-packages', TravelPackageController::class)
        ->withTrashed(['show', 'edit', 'update']);
    Route::post('travel-packages/{id}/restore', [TravelPackageController::class, 'restore'])->name('travel-packages.restore');

    Route::resource('motor-rentals', MotorRentalController::class)
        ->withTrashed(['show', 'edit', 'update']);
    Route::post('motor-rentals/{id}/restore', [MotorRentalController::class, 'restore'])->name('motor-rentals.restore');

    Route::resource('tour-guides', TourGuideController::class)
        ->withTrashed(['show', 'edit', 'update']);
    Route::post('tour-guides/{id}/restore', [TourGuideController::class, 'restore'])->name('tour-guides.restore');

    Route::resource('homestays', HomestayController::class)
        ->withTrashed(['show', 'edit', 'update']);
    Route::post('homestays/{id}/restore', [HomestayController::class, 'restore'])->name('homestays.restore');
    Route::get('homestays/{homestay}/rooms', [HomestayController::class, 'rooms'])->name('homestays.rooms');
    Route::post('homestays/{homestay}/rooms', [HomestayController::class, 'storeRoom'])->name('homestays.rooms.store');
    Route::put('homestays/{homestay}/rooms/{room}', [HomestayController::class, 'updateRoom'])->name('homestays.rooms.update');
    Route::delete('homestays/{homestay}/rooms/{room}', [HomestayController::class, 'destroyRoom'])->name('homestays.rooms.destroy');

    Route::get('bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::post('bookings/{booking}/confirm', [BookingController::class, 'confirm'])->name('bookings.confirm');
    Route::post('bookings/{booking}/complete', [BookingController::class, 'complete'])->name('bookings.complete');
    Route::post('bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

    Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::get('payments/{payment}', [PaymentController::class, 'show'])->name('payments.show');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::post('users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');

    Route::get('reviews', [ReviewController::class, 'index'])->name('reviews.index');
    Route::post('reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');

    Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('settings', [SettingsController::class, 'update'])->name('settings.update');
});
