<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHomestayRequest;
use App\Http\Requests\StoreHomestayRoomRequest;
use App\Models\Homestay;
use App\Models\HomestayRoom;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomestayController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Homestay::withCount('rooms')->withoutGlobalScopes();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($request->input('trashed')) {
            $query->onlyTrashed();
        }

        $homestays = $query->with('media')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/Homestays/Index', [
            'homestays' => $homestays,
            'filters' => $request->only(['search', 'trashed']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/Homestays/Create');
    }

    public function store(StoreHomestayRequest $request)
    {
        $data = $request->validated();
        $data['is_active'] = $data['is_active'] ?? false;
        $data['facilities'] = is_string($data['facilities'] ?? null)
            ? array_map('trim', explode(',', $data['facilities']))
            : ($data['facilities'] ?? null);
        $homestay = Homestay::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $image) {
                $path = $image->store('homestays', 'public');
                $homestay->media()->create([
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

        return redirect()->route('admin.homestays.index')
            ->with('success', 'Homestay created successfully.');
    }

    public function edit(Homestay $homestay): Response
    {
        $homestay->load(['media', 'rooms']);

        return Inertia::render('admin/Homestays/Edit', [
            'homestay' => $homestay,
        ]);
    }

    public function update(StoreHomestayRequest $request, Homestay $homestay)
    {
        $data = $request->validated();
        $data['is_active'] = $data['is_active'] ?? false;
        $data['facilities'] = is_string($data['facilities'] ?? null)
            ? array_map('trim', explode(',', $data['facilities']))
            : ($data['facilities'] ?? null);
        $homestay->update($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $image) {
                $path = $image->store('homestays', 'public');
                $homestay->media()->create([
                    'url' => asset('storage/'.$path),
                    'path' => $path,
                    'disk' => 'public',
                    'mime_type' => $image->getMimeType(),
                    'size' => $image->getSize(),
                    'is_primary' => $i === 0 && ! $homestay->media()->where('is_primary', true)->exists(),
                    'sort_order' => $i,
                ]);
            }
        }

        return redirect()->route('admin.homestays.index')
            ->with('success', 'Homestay updated successfully.');
    }

    public function destroy(Homestay $homestay)
    {
        $homestay->delete();

        return redirect()->route('admin.homestays.index')
            ->with('success', 'Homestay deleted.');
    }

    public function restore(int $id)
    {
        $homestay = Homestay::withoutGlobalScopes()->withTrashed()->findOrFail($id);
        $homestay->restore();

        return redirect()->route('admin.homestays.index')
            ->with('success', 'Homestay restored.');
    }

    public function rooms(Homestay $homestay): Response
    {
        $homestay->load('rooms');

        return Inertia::render('admin/Homestays/Rooms/Index', [
            'homestay' => $homestay,
        ]);
    }

    public function storeRoom(StoreHomestayRoomRequest $request, Homestay $homestay)
    {
        $data = $request->validated();
        $data['is_active'] = $data['is_active'] ?? false;
        $homestay->rooms()->create($data);

        return redirect()->route('admin.homestays.rooms', $homestay)
            ->with('success', 'Room created successfully.');
    }

    public function updateRoom(StoreHomestayRoomRequest $request, Homestay $homestay, HomestayRoom $room)
    {
        $data = $request->validated();
        $data['is_active'] = $data['is_active'] ?? false;
        $room->update($data);

        return redirect()->route('admin.homestays.rooms', $homestay)
            ->with('success', 'Room updated successfully.');
    }

    public function destroyRoom(Homestay $homestay, HomestayRoom $room)
    {
        $room->delete();

        return redirect()->route('admin.homestays.rooms', $homestay)
            ->with('success', 'Room deleted.');
    }
}
