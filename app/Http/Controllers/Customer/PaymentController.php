<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
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
                ->with('info', 'Pembayaran booking ini sudah lunas.');
        }

        if (! $this->midtransService->isConfigured()) {
            return redirect()->route('customer.bookings.show', $booking)
                ->with('warning', 'Pembayaran offline: Silakan lakukan transfer ke rekening kami yang tertera di halaman ini.');
        }

        try {
            $snapToken = $this->midtransService->createSnapToken($booking, $payment);

            return Inertia::render('payment/PaymentProcess', [
                'snapToken' => $snapToken,
                'paymentCode' => $payment->payment_code,
                'booking' => $booking->load('items.bookable.media', 'payments'),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('customer.bookings.show', $booking)
                ->with('error', 'Gagal memproses pembayaran: '.$e->getMessage());
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

        $payment = $this->midtransService->queryAndUpdatePayment($orderId);

        if ($payment) {
            $message = $payment->status->value === 'success'
                ? 'Pembayaran berhasil! Booking telah dikonfirmasi.'
                : 'Pembayaran telah diproses. Status: '.$payment->status->value;

            return redirect()->route('customer.bookings.show', $payment->booking)
                ->with('success', $message);
        }

        return redirect()->route('customer.bookings.index')
            ->with('info', 'Pembayaran telah diproses.');
    }

    public function unfinish(Request $request)
    {
        $orderId = $request->input('order_id');

        // Cek status transaksi ke Midtrans, mungkin sudah sukses walau user tutup popup
        $payment = $this->midtransService->queryAndUpdatePayment($orderId);

        if ($payment) {
            if ($payment->status->value === 'success') {
                return redirect()->route('customer.bookings.show', $payment->booking)
                    ->with('success', 'Pembayaran berhasil! Booking telah dikonfirmasi.');
            }

            return redirect()->route('customer.bookings.show', $payment->booking)
                ->with('warning', 'Pembayaran belum selesai. Silakan coba lagi.');
        }

        return redirect()->route('customer.bookings.index');
    }

    public function error(Request $request)
    {
        $orderId = $request->input('order_id');

        // Cek status transaksi ke Midtrans
        $payment = $this->midtransService->queryAndUpdatePayment($orderId);

        if ($payment) {
            if ($payment->status->value === 'success') {
                return redirect()->route('customer.bookings.show', $payment->booking)
                    ->with('success', 'Pembayaran berhasil! Booking telah dikonfirmasi.');
            }

            return redirect()->route('customer.bookings.show', $payment->booking)
                ->with('error', 'Pembayaran gagal. Silakan coba lagi.');
        }

        return redirect()->route('customer.bookings.index');
    }
}
