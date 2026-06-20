<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTourGuideRequest;
use App\Models\TourGuide;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TourGuideController extends Controller
{
    public function index(Request $request): Response
    {
        $query = TourGuide::withoutGlobalScopes();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('bio', 'like', "%{$search}%");
            });
        }

        if ($request->input('trashed')) {
            $query->onlyTrashed();
        }

        $guides = $query->with('media')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/TourGuides/Index', [
            'guides' => $guides,
            'filters' => $request->only(['search', 'trashed']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/TourGuides/Create');
    }

    public function store(StoreTourGuideRequest $request)
    {
        $data = $request->validated();
        $data['is_active'] = $data['is_active'] ?? false;
        $data['languages'] = is_string($data['languages'] ?? null)
            ? array_map('trim', explode(',', $data['languages']))
            : ($data['languages'] ?? null);
        $data['specialties'] = is_string($data['specialties'] ?? null)
            ? array_map('trim', explode(',', $data['specialties']))
            : ($data['specialties'] ?? null);
        $guide = TourGuide::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $image) {
                $path = $image->store('tour-guides', 'public');
                $guide->media()->create([
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

        return redirect()->route('admin.tour-guides.index')
            ->with('success', 'Tour guide created successfully.');
    }

    public function edit(TourGuide $tourGuide): Response
    {
        $tourGuide->load('media');

        return Inertia::render('admin/TourGuides/Edit', [
            'guide' => $tourGuide,
        ]);
    }

    public function update(StoreTourGuideRequest $request, TourGuide $tourGuide)
    {
        $data = $request->validated();
        $data['is_active'] = $data['is_active'] ?? false;
        $data['languages'] = is_string($data['languages'] ?? null)
            ? array_map('trim', explode(',', $data['languages']))
            : ($data['languages'] ?? null);
        $data['specialties'] = is_string($data['specialties'] ?? null)
            ? array_map('trim', explode(',', $data['specialties']))
            : ($data['specialties'] ?? null);
        $tourGuide->update($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $image) {
                $path = $image->store('tour-guides', 'public');
                $tourGuide->media()->create([
                    'url' => asset('storage/'.$path),
                    'path' => $path,
                    'disk' => 'public',
                    'mime_type' => $image->getMimeType(),
                    'size' => $image->getSize(),
                    'is_primary' => $i === 0 && ! $tourGuide->media()->where('is_primary', true)->exists(),
                    'sort_order' => $i,
                ]);
            }
        }

        return redirect()->route('admin.tour-guides.index')
            ->with('success', 'Tour guide updated successfully.');
    }

    public function destroy(TourGuide $tourGuide)
    {
        $tourGuide->delete();

        return redirect()->route('admin.tour-guides.index')
            ->with('success', 'Tour guide deleted.');
    }

    public function restore(int $id)
    {
        $guide = TourGuide::withoutGlobalScopes()->withTrashed()->findOrFail($id);
        $guide->restore();

        return redirect()->route('admin.tour-guides.index')
            ->with('success', 'Tour guide restored.');
    }
}
