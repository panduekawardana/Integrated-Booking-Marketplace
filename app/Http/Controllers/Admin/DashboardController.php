<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Homestay;
use App\Models\MotorRental;
use App\Models\TourGuide;
use App\Models\TravelPackage;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalBookings = Booking::count();
        $totalRevenue = Booking::where('status', BookingStatus::Completed)
            ->orWhere('status', BookingStatus::Confirmed)
            ->sum('final_amount');

        $recentBookings = Booking::with(['user', 'items'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'user' => $booking->user?->name ?? 'N/A',
                    'total_amount' => $booking->final_amount,
                    'status' => $booking->status->value,
                    'items_count' => $booking->items->count(),
                    'created_at' => $booking->created_at->toDateTimeString(),
                ];
            });

        $stats = [
            'total_bookings' => $totalBookings,
            'total_revenue' => $totalRevenue,
            'total_customers' => User::where('role', 'customer')->count(),
            'total_travel_packages' => TravelPackage::withoutGlobalScopes()->count(),
            'total_motor_rentals' => MotorRental::withoutGlobalScopes()->count(),
            'total_tour_guides' => TourGuide::withoutGlobalScopes()->count(),
            'total_homestays' => Homestay::withoutGlobalScopes()->count(),
        ];

        return Inertia::render('admin/Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
        ]);
    }
}
