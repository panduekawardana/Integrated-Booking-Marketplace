<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Services\BookingService;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(
        protected BookingService $bookingService,
        protected MidtransService $midtransService,
    ) {}

    public function index(Request $request): Response
    {
        $bookings = $request->user()
            ->bookings()
            ->with(['items.bookable', 'payments'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('customer/Bookings', [
            'bookings' => $bookings,
        ]);
    }

    public function show(Booking $booking): Response
    {
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        $booking->load(['items.bookable', 'payments', 'reviews']);

        return Inertia::render('customer/BookingDetail', [
            'booking' => $booking,
        ]);
    }

    public function store(StoreBookingRequest $request)
    {
        $booking = $this->bookingService->createBooking(
            $request->validated(),
            $request->user()->id
        );

        $payment = $booking->payments()->first();

        try {
            $snapToken = $this->midtransService->createSnapToken($booking, $payment);

            return Inertia::render('payment/PaymentProcess', [
                'snapToken' => $snapToken,
                'booking' => $booking->load('items.bookable', 'payments'),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('customer.bookings.show', $booking)
                ->with('error', 'Failed to create payment: '.$e->getMessage());
        }
    }
}
