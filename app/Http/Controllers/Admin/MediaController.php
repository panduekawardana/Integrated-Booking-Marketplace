<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function destroy(Media $media): RedirectResponse
    {
        Storage::disk($media->disk)->delete($media->path);

        $media->delete();

        return back()->with('success', 'Image deleted successfully.');
    }
}
