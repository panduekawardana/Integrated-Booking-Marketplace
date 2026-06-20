<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMotorRentalRequest;
use App\Models\MotorRental;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MotorRentalController extends Controller
{
    public function index(Request $request): Response
    {
        $query = MotorRental::withoutGlobalScopes();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('plate_number', 'like', "%{$search}%");
            });
        }

        if ($request->input('trashed')) {
            $query->onlyTrashed();
        }

        $motors = $query->with('media')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/MotorRentals/Index', [
            'motors' => $motors,
            'filters' => $request->only(['search', 'trashed']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/MotorRentals/Create');
    }

    public function store(StoreMotorRentalRequest $request)
    {
        $data = $request->validated();
        $data['is_active'] = $data['is_active'] ?? false;
        $motor = MotorRental::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $image) {
                $path = $image->store('motor-rentals', 'public');
                $motor->media()->create([
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

        return redirect()->route('admin.motor-rentals.index')
            ->with('success', 'Motor rental created successfully.');
    }

    public function edit(MotorRental $motorRental): Response
    {
        $motorRental->load('media');

        return Inertia::render('admin/MotorRentals/Edit', [
            'motor' => $motorRental,
        ]);
    }

    public function update(StoreMotorRentalRequest $request, MotorRental $motorRental)
    {
        $data = $request->validated();
        $data['is_active'] = $data['is_active'] ?? false;
        $motorRental->update($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $image) {
                $path = $image->store('motor-rentals', 'public');
                $motorRental->media()->create([
                    'url' => asset('storage/'.$path),
                    'path' => $path,
                    'disk' => 'public',
                    'mime_type' => $image->getMimeType(),
                    'size' => $image->getSize(),
                    'is_primary' => $i === 0 && ! $motorRental->media()->where('is_primary', true)->exists(),
                    'sort_order' => $i,
                ]);
            }
        }

        return redirect()->route('admin.motor-rentals.index')
            ->with('success', 'Motor rental updated successfully.');
    }

    public function destroy(MotorRental $motorRental)
    {
        $motorRental->delete();

        return redirect()->route('admin.motor-rentals.index')
            ->with('success', 'Motor rental deleted.');
    }

    public function restore(int $id)
    {
        $motor = MotorRental::withoutGlobalScopes()->withTrashed()->findOrFail($id);
        $motor->restore();

        return redirect()->route('admin.motor-rentals.index')
            ->with('success', 'Motor rental restored.');
    }
}
