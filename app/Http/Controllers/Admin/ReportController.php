<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $period = $request->input('period', 'monthly');
        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : now()->subMonth();
        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : now();

        $revenueQuery = Payment::whereIn('status', [PaymentStatus::Success]);

        $bookingQuery = Booking::whereIn('status', [BookingStatus::Confirmed, BookingStatus::Completed]);

        $revenueData = $this->getRevenueData($revenueQuery, $period, $startDate, $endDate);
        $bookingData = $this->getBookingData($bookingQuery, $period, $startDate, $endDate);

        $totalRevenue = $revenueQuery->whereBetween('created_at', [$startDate, $endDate])->sum('gross_amount');
        $totalBookings = $bookingQuery->whereBetween('created_at', [$startDate, $endDate])->count();

        $serviceBreakdown = [
            'travel_package' => Booking::whereHas('items', function ($q) {
                $q->where('bookable_type', 'App\Models\TravelPackage');
            })->whereBetween('created_at', [$startDate, $endDate])->count(),
            'motor_rental' => Booking::whereHas('items', function ($q) {
                $q->where('bookable_type', 'App\Models\MotorRental');
            })->whereBetween('created_at', [$startDate, $endDate])->count(),
            'tour_guide' => Booking::whereHas('items', function ($q) {
                $q->where('bookable_type', 'App\Models\TourGuide');
            })->whereBetween('created_at', [$startDate, $endDate])->count(),
            'homestay' => Booking::whereHas('items', function ($q) {
                $q->where('bookable_type', 'App\Models\Homestay');
            })->whereBetween('created_at', [$startDate, $endDate])->count(),
        ];

        return Inertia::render('admin/Reports/Index', [
            'revenueData' => $revenueData,
            'bookingData' => $bookingData,
            'totalRevenue' => $totalRevenue,
            'totalBookings' => $totalBookings,
            'serviceBreakdown' => $serviceBreakdown,
            'filters' => [
                'period' => $period,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
        ]);
    }

    private function getRevenueData($query, string $period, Carbon $startDate, Carbon $endDate): array
    {
        $data = [];

        if ($period === 'daily') {
            $current = $startDate->copy();
            while ($current->lte($endDate)) {
                $dayTotal = (clone $query)->whereDate('created_at', $current)->sum('gross_amount');
                $data[] = [
                    'label' => $current->format('M d'),
                    'value' => (float) $dayTotal,
                ];
                $current->addDay();
            }
        } elseif ($period === 'weekly') {
            $current = $startDate->copy()->startOfWeek();
            while ($current->lte($endDate)) {
                $weekEnd = $current->copy()->endOfWeek();
                $weekTotal = (clone $query)->whereBetween('created_at', [$current, $weekEnd])->sum('gross_amount');
                $data[] = [
                    'label' => $current->format('M d').' - '.$weekEnd->format('M d'),
                    'value' => (float) $weekTotal,
                ];
                $current->addWeek();
            }
        } else {
            $current = $startDate->copy()->startOfMonth();
            while ($current->lte($endDate)) {
                $monthEnd = $current->copy()->endOfMonth();
                $monthTotal = (clone $query)->whereBetween('created_at', [$current, $monthEnd])->sum('gross_amount');
                $data[] = [
                    'label' => $current->format('M Y'),
                    'value' => (float) $monthTotal,
                ];
                $current->addMonth();
            }
        }

        return $data;
    }

    private function getBookingData($query, string $period, Carbon $startDate, Carbon $endDate): array
    {
        $data = [];

        if ($period === 'daily') {
            $current = $startDate->copy();
            while ($current->lte($endDate)) {
                $dayCount = (clone $query)->whereDate('created_at', $current)->count();
                $data[] = [
                    'label' => $current->format('M d'),
                    'value' => $dayCount,
                ];
                $current->addDay();
            }
        } elseif ($period === 'weekly') {
            $current = $startDate->copy()->startOfWeek();
            while ($current->lte($endDate)) {
                $weekEnd = $current->copy()->endOfWeek();
                $weekCount = (clone $query)->whereBetween('created_at', [$current, $weekEnd])->count();
                $data[] = [
                    'label' => $current->format('M d').' - '.$weekEnd->format('M d'),
                    'value' => $weekCount,
                ];
                $current->addWeek();
            }
        } else {
            $current = $startDate->copy()->startOfMonth();
            while ($current->lte($endDate)) {
                $monthEnd = $current->copy()->endOfMonth();
                $monthCount = (clone $query)->whereBetween('created_at', [$current, $monthEnd])->count();
                $data[] = [
                    'label' => $current->format('M Y'),
                    'value' => $monthCount,
                ];
                $current->addMonth();
            }
        }

        return $data;
    }
}
