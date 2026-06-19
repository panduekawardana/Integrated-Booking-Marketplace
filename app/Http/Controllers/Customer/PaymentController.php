<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\MidtransService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(protected MidtransService $midtransService) {}

    public function process(Booking $booking): Response|RedirectResponse
    {
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        $payment = $booking->payments()->latest()->first();

        if (! $payment || $payment->status->value === 'success') {
            return redirect()->route('customer.bookings.show', $booking)
                ->with('info', 'This booking has already been paid.');
        }

        try {
            $snapToken = $this->midtransService->createSnapToken($booking, $payment);

            return Inertia::render('payment/PaymentProcess', [
                'snapToken' => $snapToken,
                'booking' => $booking->load('items.bookable', 'payments'),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('customer.bookings.show', $booking)
                ->with('error', 'Failed to process payment: '.$e->getMessage());
        }
    }

    public function callback(Request $request)
    {
        try {
            $payment = $this->midtransService->handleNotification();

            if ($payment) {
                return response()->json(['status' => 'ok']);
            }

            return response()->json(['status' => 'not_found'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function finish(Request $request)
    {
        $orderId = $request->input('order_id');
        $payment = Payment::where('payment_code', $orderId)->first();

        if ($payment) {
            return redirect()->route('customer.bookings.show', $payment->booking)
                ->with('success', 'Payment completed successfully!');
        }

        return redirect()->route('customer.bookings.index')
            ->with('info', 'Payment processed.');
    }

    public function unfinish(Request $request)
    {
        $orderId = $request->input('order_id');
        $payment = Payment::where('payment_code', $orderId)->first();

        if ($payment) {
            return redirect()->route('customer.bookings.show', $payment->booking)
                ->with('warning', 'Payment was not completed. Please try again.');
        }

        return redirect()->route('customer.bookings.index');
    }

    public function error(Request $request)
    {
        $orderId = $request->input('order_id');
        $payment = Payment::where('payment_code', $orderId)->first();

        if ($payment) {
            return redirect()->route('customer.bookings.show', $payment->booking)
                ->with('error', 'Payment failed. Please try again.');
        }

        return redirect()->route('customer.bookings.index');
    }
}
