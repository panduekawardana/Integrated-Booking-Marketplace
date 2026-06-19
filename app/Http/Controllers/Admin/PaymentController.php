<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Payment::with(['booking.user']);

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('payment_code', 'like', "%{$search}%")
                    ->orWhere('midtrans_transaction_id', 'like', "%{$search}%");
            });
        }

        $payments = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Payment $payment): Response
    {
        $payment->load(['booking.user', 'booking.items']);

        return Inertia::render('admin/Payments/Show', [
            'payment' => $payment,
        ]);
    }
}
