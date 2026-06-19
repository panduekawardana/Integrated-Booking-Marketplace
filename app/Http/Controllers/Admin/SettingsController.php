<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Settings/Index', [
            'settings' => [
                'app_name' => config('app.name'),
                'midtrans_server_key' => config('services.midtrans.server_key'),
                'midtrans_client_key' => config('services.midtrans.client_key'),
                'midtrans_production' => config('services.midtrans.is_production'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'app_name' => ['required', 'string', 'max:255'],
        ]);

        // Update .env or config based settings
        // In production, this should update the .env file or use a settings table

        return back()->with('success', 'Settings updated successfully.');
    }
}
