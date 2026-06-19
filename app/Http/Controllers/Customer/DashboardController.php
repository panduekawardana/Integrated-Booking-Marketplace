<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Homestay;
use App\Models\MotorRental;
use App\Models\TourGuide;
use App\Models\TravelPackage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_bookings' => auth()->user()->bookings()->count(),
            'pending_bookings' => auth()->user()->bookings()->where('status', 'pending')->count(),
            'completed_bookings' => auth()->user()->bookings()->where('status', 'completed')->count(),
        ];

        $recentBookings = auth()->user()
            ->bookings()
            ->with('items.bookable')
            ->latest()
            ->take(5)
            ->get();

        $travelPackages = TravelPackage::with('media')->latest()->take(4)->get();
        $motorRentals = MotorRental::with('media')->latest()->take(4)->get();
        $tourGuides = TourGuide::with('media')->latest()->take(4)->get();
        $homestays = Homestay::with('media')->latest()->take(4)->get();

        return Inertia::render('customer/Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'travelPackages' => $travelPackages,
            'motorRentals' => $motorRentals,
            'tourGuides' => $tourGuides,
            'homestays' => $homestays,
        ]);
    }
}
