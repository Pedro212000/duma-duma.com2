<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Place;
use App\Models\Admin\PlaceImage;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
