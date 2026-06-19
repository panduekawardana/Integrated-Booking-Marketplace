<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $reviews = $request->user()
            ->reviews()
            ->with('booking')
            ->latest()
            ->paginate(10);

        return Inertia::render('customer/Reviews', [
            'reviews' => $reviews,
        ]);
    }

    public function create(Booking $booking): Response|RedirectResponse
    {
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        if ($booking->status->value !== 'completed') {
            return redirect()->route('customer.bookings.show', $booking)
                ->with('error', 'You can only review completed bookings.');
        }

        if ($booking->reviews()->where('user_id', auth()->id())->exists()) {
            return redirect()->route('customer.bookings.show', $booking)
                ->with('info', 'You have already reviewed this booking.');
        }

        return Inertia::render('customer/ReviewForm', [
            'booking' => $booking->load('items.bookable'),
        ]);
    }

    public function store(StoreReviewRequest $request, Booking $booking): RedirectResponse
    {
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        if ($booking->reviews()->where('user_id', auth()->id())->exists()) {
            return back()->with('error', 'You have already reviewed this booking.');
        }

        Review::create([
            'user_id' => auth()->id(),
            'booking_id' => $booking->id,
            'rating' => $request->input('rating'),
            'review_text' => $request->input('review_text'),
        ]);

        return redirect()->route('customer.bookings.show', $booking)
            ->with('success', 'Review submitted successfully!');
    }

    public function update(StoreReviewRequest $request, Booking $booking, Review $review): RedirectResponse
    {
        if ($review->user_id !== auth()->id()) {
            abort(403);
        }

        $review->update([
            'rating' => $request->input('rating'),
            'review_text' => $request->input('review_text'),
            'is_approved' => false,
            'approved_at' => null,
        ]);

        return redirect()->route('customer.reviews.index')
            ->with('success', 'Review updated successfully.');
    }

    public function destroy(Booking $booking, Review $review): RedirectResponse
    {
        if ($review->user_id !== auth()->id()) {
            abort(403);
        }

        $review->delete();

        return redirect()->route('customer.reviews.index')
            ->with('success', 'Review deleted.');
    }
}
