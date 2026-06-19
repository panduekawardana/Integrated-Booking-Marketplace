<?php

namespace App\Http\Controllers;

use App\Services\MidtransService;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function __construct(protected MidtransService $midtransService) {}

    public function midtrans(Request $request)
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
}
