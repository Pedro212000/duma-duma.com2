<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Product;
use App\Models\Admin\ProductImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('images')->get()->map(function ($product) {
            $imageData = $product->images->map(function ($image) {
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

            // ✅ Return each product with its transformed image data
            return [
                'id' => $product->id,
                'name' => $product->name,
                'barangay' => $product->barangay,
                'town_name' => $product->town,
                'description' => $product->description,
                'images' => $imageData,
            ];
        });

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'town_name' => 'required|string|max:255',
            'town' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'description' => 'required|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:1024', // 1MB
        ]);
        // Create product (without images)
        $product = Product::create([
            'name' => ucwords(strtolower($validated['name'])),
            'town_name' => $validated['town_name'],
            'town_code' => $validated['town'],
            'barangay' => $validated['barangay'],
            'description' => ucwords(strtolower($validated['description'])),
        ]);

        // Handle images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Store the file and get the relative path
                $path = $image->store('uploads/products', 'public');


                // Create a new ProductImage record for each uploaded file
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                ]);
            }
        }

        return redirect()
            ->route('products.index')
            ->with('success', 'Product created successfully!');
    }


    /**
     * Delete single image from product (AJAX)
     */

    public function deleteImage(Request $request, $productId)
    {
        try {
            $imageId = $request->input('image_id');

            // 🧭 Find the image
            $image = ProductImage::where('id', $imageId)
                ->where('product_id', $productId)
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
     * Show the form for editing the specified resource.
     */

    public function edit(Product $product)
    {
        // ✅ Load the related images
        $product->load('images');

        // ✅ Format image data for frontend
        $images = $product->images->map(function ($image) {
            return [
                'id' => $image->id,
                'image_path' => $image->image_path,
                'url' => Storage::url($image->image_path),
            ];
        });

        // ✅ Return Inertia view with proper data
        return Inertia::render('Admin/Products/Edit', [
            'product' => array_merge($product->toArray(), [
                'images' => $images,
                'picture_url' => $images->isNotEmpty() ? $images->first()['url'] : null,
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'town' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'existingImages' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $product->update([
            'name' => $validated['name'],
            'town' => $validated['town'],
            'barangay' => $validated['barangay'],
            'description' => $validated['description'],
        ]);

        // ✅ Handle deleted images safely
        if ($request->has('existingImages')) {
            $existingIds = $validated['existingImages'] ?? [];

            if (!empty($existingIds)) {
                $product->images()
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
                $path = $file->store('uploads/products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                ]);
            }
        }

        return redirect()->route('products.index')
            ->with('message', 'Product updated successfully');
    }

    public function destroy(Product $product)
    {
        DB::transaction(function () use ($product) {
            foreach ($product->images as $image) {
                if (Storage::disk('public')->exists($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);
                }

                $image->delete();
            }
            $product->delete();
        });

        return redirect()->back()->with('message', 'Product and associated images deleted successfully.');
    }
}
