<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Place;
use App\Models\Admin\PlaceImage;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Storage;

class PlaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $places = Place::with('images')->where('status', 'Approved')->get()->map(function ($place) {
            $imageData = $place->images->map(function ($image) {
                $path = $image->image_path;

                // If the path already starts with http (external URL), return as-is
                if (str_starts_with($path, 'http')) {
                    return [
                        'id' => $image->id,
                        'image_path' => $path,
                    ];
                }

                return [
                    'id' => $image->id,
                    'image_path' => asset('storage/' . $path),
                ];
            });

            // ✅ Return each place with its transformed image data
            return [
                'id' => $place->id,
                'name' => $place->name,
                'barangay' => $place->barangay,
                'town_name' => $place->town_name,
                'description' => $place->description,
                'images' => $imageData,
            ];
        });

        return Inertia::render('Admin/Places/Index', [
            'places' => $places,
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Places/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'town_name' => 'required|string|max:255',
            'town' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'description' => 'required|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:1024', // 1MB
        ]);
        // Create place (without images)
        $place = Place::create([
            'name' => ucwords(strtolower($validated['name'])),
            'town_name' => $validated['town_name'],
            'town_code' => $validated['town'],
            'barangay' => $validated['barangay'],
            'description' => ucwords(strtolower($validated['description'])),
            'status' => "Approved",
        ]);

        // Handle images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Store the file and get the relative path
                $path = $image->store('uploads/places', 'public');


                // Create a new PlaceImage record for each uploaded file
                PlaceImage::create([
                    'place_id' => $place->id,
                    'image_path' => $path,
                ]);
            }
        }

        return redirect()
            ->route('places.index')
            ->with('success', 'Place created successfully!');
    }

    public function deleteImage(Request $request, $placeId)
    {
        try {
            $imageId = $request->input('image_id');

            // 🧭 Find the image
            $image = PlaceImage::where('id', $imageId)
                ->where('place_id', $placeId)
                ->first();

            if (!$image) {
                return response()->json(['message' => 'Image not found'], 404);
            }

            // 🗑️ Delete file from storage if it exists
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }

            // 🗑️ Delete database record
            $image->delete();

            return response()->json(['message' => 'Image deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting image', 'error' => $e->getMessage()], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Place $place)
    {
        $place->load('images');

        // ✅ Format image data for frontend
        $images = $place->images->map(function ($image) {
            return [
                'id' => $image->id,
                'image_path' => $image->image_path,
                'url' => Storage::url($image->image_path),
            ];
        });

        // ✅ Return Inertia view with proper data
        return Inertia::render('Admin/Places/Edit', [
            'place' => array_merge($place->toArray(), [
                'images' => $images,
                'picture_url' => $images->isNotEmpty() ? $images->first()['url'] : null,
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Place $place)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'town_name' => 'required|string|max:255',
            'town_code' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'existingImages' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $place->update([
            'name' => ucwords(strtolower($validated['name'])),
            'town_name' => $validated['town_name'],
            'town_code' => $validated['town_code'],
            'barangay' => $validated['barangay'],
            'description' => ucwords(strtolower($validated['description'])),
        ]);

        // ✅ Handle deleted images safely
        if ($request->has('existingImages')) {
            $existingIds = $validated['existingImages'] ?? [];

            if (!empty($existingIds)) {
                $place->images()
                    ->whereNotIn('id', $existingIds)
                    ->get()
                    ->each(function ($img) {
                        if (Storage::disk('public')->exists($img->image_path)) {
                            Storage::disk('public')->delete($img->image_path);
                        }
                        $img->delete();
                    });
            }
        }

        // ✅ Handle new uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('uploads/places', 'public');
                PlaceImage::create([
                    'place_id' => $place->id,
                    'image_path' => $path,
                ]);
            }
        }

        return redirect()->route('places.index')
            ->with('message', 'Place updated successfully');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Place $place)
    {
        DB::transaction(function () use ($place) {
            foreach ($place->images as $image) {
                if (Storage::disk('public')->exists($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);
                }

                $image->delete();
            }
            $place->delete();
        });

        return redirect()->back()->with('message', 'Place and associated images deleted successfully.');
    }
}
