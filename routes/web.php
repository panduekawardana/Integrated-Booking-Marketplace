<?php

use App\Http\Controllers\Customer\BookingController;
use App\Http\Controllers\Customer\DashboardController;
use App\Http\Controllers\Customer\PaymentController;
use App\Http\Controllers\Customer\ReviewController;
use App\Http\Controllers\Customer\ServiceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WebhookController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('customer.dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/bookings', [BookingController::class, 'index'])->name('customer.bookings.index');
    Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('customer.bookings.show');
    Route::post('/bookings', [BookingController::class, 'store'])->name('customer.bookings.store');

    Route::get('/bookings/{booking}/payment', [PaymentController::class, 'process'])->name('customer.payments.process');
    Route::get('/payments/finish', [PaymentController::class, 'finish'])->name('customer.payments.finish');
    Route::get('/payments/unfinish', [PaymentController::class, 'unfinish'])->name('customer.payments.unfinish');
    Route::get('/payments/error', [PaymentController::class, 'error'])->name('customer.payments.error');

    Route::get('/reviews', [ReviewController::class, 'index'])->name('customer.reviews.index');
    Route::get('/bookings/{booking}/reviews/create', [ReviewController::class, 'create'])->name('customer.reviews.create');
    Route::post('/bookings/{booking}/reviews', [ReviewController::class, 'store'])->name('customer.reviews.store');
    Route::put('/bookings/{booking}/reviews/{review}', [ReviewController::class, 'update'])->name('customer.reviews.update');
    Route::delete('/bookings/{booking}/reviews/{review}', [ReviewController::class, 'destroy'])->name('customer.reviews.destroy');
});

Route::get('/services/travel-packages', [ServiceController::class, 'travelPackages'])->name('services.travel-packages');
Route::get('/services/travel-packages/{travelPackage}', [ServiceController::class, 'travelPackageDetail'])->name('services.travel-packages.show');
Route::get('/services/motor-rentals', [ServiceController::class, 'motorRentals'])->name('services.motor-rentals');
Route::get('/services/motor-rentals/{motorRental}', [ServiceController::class, 'motorRentalDetail'])->name('services.motor-rentals.show');
Route::get('/services/tour-guides', [ServiceController::class, 'tourGuides'])->name('services.tour-guides');
Route::get('/services/tour-guides/{tourGuide}', [ServiceController::class, 'tourGuideDetail'])->name('services.tour-guides.show');
Route::get('/services/homestays', [ServiceController::class, 'homestays'])->name('services.homestays');
Route::get('/services/homestays/{homestay}', [ServiceController::class, 'homestayDetail'])->name('services.homestays.show');

Route::post('/webhook/midtrans', [WebhookController::class, 'midtrans'])->name('webhook.midtrans');

require __DIR__.'/auth.php';
