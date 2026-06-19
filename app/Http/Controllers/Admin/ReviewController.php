<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Review::with(['user', 'booking']);

        if ($request->input('pending')) {
            $query->where('is_approved', false);
        }

        if ($service = $request->input('service_type')) {
            $query->whereHas('booking.items', function ($q) use ($service) {
                $q->where('bookable_type', $service);
            });
        }

        $reviews = $query->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/Reviews/Index', [
            'reviews' => $reviews,
            'filters' => $request->only(['pending', 'service_type']),
        ]);
    }

    public function approve(Review $review)
    {
        $review->update([
            'is_approved' => true,
            'approved_at' => now(),
        ]);

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Review approved.');
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Review deleted.');
    }
}
