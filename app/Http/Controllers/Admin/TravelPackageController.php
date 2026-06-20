<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTravelPackageRequest;
use App\Models\TravelPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TravelPackageController extends Controller
{
    public function index(Request $request): Response
    {
        $query = TravelPackage::withoutGlobalScopes();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('origin', 'like', "%{$search}%")
                    ->orWhere('destination', 'like', "%{$search}%");
            });
        }

        if ($request->input('trashed')) {
            $query->onlyTrashed();
        }

        $packages = $query->with('media')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/TravelPackages/Index', [
            'packages' => $packages,
            'filters' => $request->only(['search', 'trashed']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/TravelPackages/Create');
    }

    public function store(StoreTravelPackageRequest $request)
    {
        $data = $request->validated();
        $data['itinerary'] = $data['itinerary'] ?? null;
        $data['includes'] = $data['includes'] ?? null;
        $data['excludes'] = $data['excludes'] ?? null;
        $data['is_active'] = $data['is_active'] ?? false;

        $package = TravelPackage::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $image) {
                $path = $image->store('travel-packages', 'public');
                $package->media()->create([
                    'url' => asset('storage/'.$path),
                    'path' => $path,
                    'disk' => 'public',
                    'mime_type' => $image->getMimeType(),
                    'size' => $image->getSize(),
                    'is_primary' => $i === 0,
                    'sort_order' => $i,
                ]);
            }
        }

        return redirect()->route('admin.travel-packages.index')
            ->with('success', 'Travel package created successfully.');
    }

    public function edit(TravelPackage $travelPackage): Response
    {
        $travelPackage->load('media');

        return Inertia::render('admin/TravelPackages/Edit', [
            'package' => $travelPackage,
        ]);
    }

    public function update(StoreTravelPackageRequest $request, TravelPackage $travelPackage)
    {
        $data = $request->validated();
        $data['is_active'] = $data['is_active'] ?? false;
        $travelPackage->update($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $image) {
                $path = $image->store('travel-packages', 'public');
                $travelPackage->media()->create([
                    'url' => asset('storage/'.$path),
                    'path' => $path,
                    'disk' => 'public',
                    'mime_type' => $image->getMimeType(),
                    'size' => $image->getSize(),
                    'is_primary' => $i === 0 && ! $travelPackage->media()->where('is_primary', true)->exists(),
                    'sort_order' => $i,
                ]);
            }
        }

        return redirect()->route('admin.travel-packages.index')
            ->with('success', 'Travel package updated successfully.');
    }

    public function destroy(TravelPackage $travelPackage)
    {
        $travelPackage->delete();

        return redirect()->route('admin.travel-packages.index')
            ->with('success', 'Travel package deleted.');
    }

    public function restore(int $id)
    {
        $package = TravelPackage::withoutGlobalScopes()->withTrashed()->findOrFail($id);
        $package->restore();

        return redirect()->route('admin.travel-packages.index')
            ->with('success', 'Travel package restored.');
    }
}
