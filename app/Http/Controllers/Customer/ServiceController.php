<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Homestay;
use App\Models\MotorRental;
use App\Models\Review;
use App\Models\TourGuide;
use App\Models\TravelPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function travelPackages(Request $request): Response
    {
        $query = TravelPackage::with('media');

        if ($origin = $request->input('origin')) {
            $query->where('origin', 'like', "%{$origin}%");
        }

        if ($destination = $request->input('destination')) {
            $query->where('destination', 'like', "%{$destination}%");
        }

        if ($minPrice = $request->input('min_price')) {
            $query->where('price', '>=', $minPrice);
        }

        if ($maxPrice = $request->input('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        if ($sort = $request->input('sort')) {
            match ($sort) {
                'price_asc' => $query->orderBy('price'),
                'price_desc' => $query->orderBy('price', 'desc'),
                'newest' => $query->latest(),
                default => $query->latest(),
            };
        } else {
            $query->latest();
        }

        $packages = $query->paginate(12)->withQueryString();

        return Inertia::render('services/TravelPackages', [
            'packages' => $packages,
            'filters' => $request->only(['origin', 'destination', 'min_price', 'max_price', 'sort']),
        ]);
    }

    public function travelPackageDetail(TravelPackage $travelPackage): Response
    {
        $travelPackage->load('media');

        $reviews = Review::whereHas('booking.items', function ($q) use ($travelPackage) {
            $q->where('bookable_type', TravelPackage::class)
                ->where('bookable_id', $travelPackage->id);
        })->where('is_approved', true)->with('user')->latest()->get();

        return Inertia::render('services/TravelPackageDetail', [
            'service' => $travelPackage,
            'reviews' => $reviews,
        ]);
    }

    public function motorRentals(Request $request): Response
    {
        $query = MotorRental::with('media');

        if ($brand = $request->input('brand')) {
            $query->where('brand', 'like', "%{$brand}%");
        }

        if ($motorType = $request->input('motor_type')) {
            $query->where('motor_type', $motorType);
        }

        if ($transmission = $request->input('transmission')) {
            $query->where('transmission', $transmission);
        }

        if ($minPrice = $request->input('min_price')) {
            $query->where('price_per_day', '>=', $minPrice);
        }

        if ($maxPrice = $request->input('max_price')) {
            $query->where('price_per_day', '<=', $maxPrice);
        }

        $motors = $query->paginate(12)->withQueryString();

        return Inertia::render('services/MotorRentals', [
            'motors' => $motors,
            'filters' => $request->only(['brand', 'motor_type', 'transmission', 'min_price', 'max_price']),
        ]);
    }

    public function motorRentalDetail(MotorRental $motorRental): Response
    {
        $motorRental->load('media');

        $reviews = Review::whereHas('booking.items', function ($q) use ($motorRental) {
            $q->where('bookable_type', MotorRental::class)
                ->where('bookable_id', $motorRental->id);
        })->where('is_approved', true)->with('user')->latest()->get();

        return Inertia::render('services/MotorRentalDetail', [
            'service' => $motorRental,
            'reviews' => $reviews,
        ]);
    }

    public function tourGuides(Request $request): Response
    {
        $query = TourGuide::with('media');

        if ($language = $request->input('language')) {
            $query->whereJsonContains('languages', $language);
        }

        if ($specialty = $request->input('specialty')) {
            $query->whereJsonContains('specialties', $specialty);
        }

        if ($minPrice = $request->input('min_price')) {
            $query->where('price_per_day', '>=', $minPrice);
        }

        if ($maxPrice = $request->input('max_price')) {
            $query->where('price_per_day', '<=', $maxPrice);
        }

        $guides = $query->paginate(12)->withQueryString();

        return Inertia::render('services/TourGuides', [
            'guides' => $guides,
            'filters' => $request->only(['language', 'specialty', 'min_price', 'max_price']),
        ]);
    }

    public function tourGuideDetail(TourGuide $tourGuide): Response
    {
        $tourGuide->load('media');

        $reviews = Review::whereHas('booking.items', function ($q) use ($tourGuide) {
            $q->where('bookable_type', TourGuide::class)
                ->where('bookable_id', $tourGuide->id);
        })->where('is_approved', true)->with('user')->latest()->get();

        return Inertia::render('services/TourGuideDetail', [
            'service' => $tourGuide,
            'reviews' => $reviews,
        ]);
    }

    public function homestays(Request $request): Response
    {
        $query = Homestay::with('media');

        if ($city = $request->input('city')) {
            $query->where('city', 'like', "%{$city}%");
        }

        if ($minPrice = $request->input('min_price')) {
            $query->whereHas('rooms', function ($q) use ($minPrice) {
                $q->where('price_per_night', '>=', $minPrice);
            });
        }

        if ($maxPrice = $request->input('max_price')) {
            $query->whereHas('rooms', function ($q) use ($maxPrice) {
                $q->where('price_per_night', '<=', $maxPrice);
            });
        }

        $homestays = $query->withCount('rooms')->paginate(12)->withQueryString();

        return Inertia::render('services/Homestays', [
            'homestays' => $homestays,
            'filters' => $request->only(['city', 'min_price', 'max_price']),
        ]);
    }

    public function homestayDetail(Homestay $homestay): Response
    {
        $homestay->load(['media', 'rooms']);

        $reviews = Review::whereHas('booking.items', function ($q) use ($homestay) {
            $q->where('bookable_type', Homestay::class)
                ->where('bookable_id', $homestay->id);
        })->where('is_approved', true)->with('user')->latest()->get();

        return Inertia::render('services/HomestayDetail', [
            'service' => $homestay,
            'reviews' => $reviews,
        ]);
    }
}
