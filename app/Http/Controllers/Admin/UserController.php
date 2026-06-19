<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::where('role', 'customer');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->withCount('bookings')
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(User $user): Response
    {
        $user->loadCount('bookings');
        $user->load(['bookings' => function ($query) {
            $query->latest()->take(10);
        }]);

        return Inertia::render('admin/Users/Show', [
            'user' => $user,
        ]);
    }

    public function toggleActive(User $user)
    {
        $user->update(['is_active' => ! $user->is_active]);

        $status = $user->is_active ? 'activated' : 'deactivated';

        return redirect()->route('admin.users.index')
            ->with('success', "User {$status} successfully.");
    }
}
