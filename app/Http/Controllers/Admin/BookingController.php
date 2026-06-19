<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Notifications\BookingCancelled;
use App\Notifications\BookingConfirmed;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Booking::with(['user', 'items', 'payments']);

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('booking_code', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $bookings = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/Bookings/Index', [
            'bookings' => $bookings,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to']),
        ]);
    }

    public function show(Booking $booking): Response
    {
        $booking->load(['user', 'items.bookable', 'payments', 'reviews.user']);

        return Inertia::render('admin/Bookings/Show', [
            'booking' => $booking,
        ]);
    }

    public function confirm(Booking $booking)
    {
        if ($booking->status->value !== 'pending') {
            return back()->with('error', 'Only pending bookings can be confirmed.');
        }

        $booking->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        $booking->user->notify(new BookingConfirmed($booking));

        return redirect()->route('admin.bookings.show', $booking)
            ->with('success', 'Booking confirmed successfully.');
    }

    public function complete(Booking $booking)
    {
        if ($booking->status->value !== 'confirmed') {
            return back()->with('error', 'Only confirmed bookings can be completed.');
        }

        $booking->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return redirect()->route('admin.bookings.show', $booking)
            ->with('success', 'Booking marked as completed.');
    }

    public function cancel(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'cancellation_reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $validated['cancellation_reason'] ?? null,
        ]);

        $booking->user->notify(new BookingCancelled($booking));

        return redirect()->route('admin.bookings.show', $booking)
            ->with('success', 'Booking cancelled.');
    }
}
