<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Map products so images are always an array and include picture_url (first image accessible URL)
        $products = Product::all()->map(function ($product) {
            $images = json_decode($product->images, true) ?? [];

            // Convert each stored path to a public URL
            $imageUrls = array_map(function ($path) {
                return asset('storage/' . $path);
            }, $images);

            return [
                'id' => $product->id,
                'name' => $product->name,
                'location' => $product->location,
                'description' => $product->description,
                'images' => $imageUrls,
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
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:1024', // 1MB
        ]);

        // Create product (without images)
        $product = Product::create([
            'name' => $validated['name'],
            'location' => $validated['location'],
            'description' => $validated['description'],
        ]);

        $uploadedPaths = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // store returns relative path like "uploads/products/xxx.png" (inside storage/app/public)
                $path = $image->store('uploads/products', 'public');
                $uploadedPaths[] = $path;
            }
        }

        // Save images as JSON array (even if empty)
        if (!empty($uploadedPaths)) {
            $product->update(['images' => json_encode($uploadedPaths)]);
        } else {
            $product->update(['images' => json_encode([])]);
        }

        return redirect()
            ->route('products.index')
            ->with('success', 'Product created successfully!');
    }

    /**
     * Delete single image from product (AJAX)
     */
    public function deleteImage(Request $request, Product $product)
    {
        $imagePathInput = $request->input('image'); // can be full url (/storage/...) or relative

        // Normalize incoming image path to the relative storage path
        if (empty($imagePathInput)) {
            return response()->json(['message' => 'No image provided'], 422);
        }

        // Example incoming values:
        // - "/storage/uploads/products/abc.png"
        // - "http://127.0.0.1:8000/storage/uploads/products/abc.png"
        // - "uploads/products/abc.png"
        $relative = $imagePathInput;

        // If it contains '/storage/', chop up to that point
        if (strpos($imagePathInput, '/storage/') !== false) {
            $relative = substr($imagePathInput, strpos($imagePathInput, '/storage/') + strlen('/storage/'));
        } elseif (strpos($imagePathInput, 'storage/') !== false) {
            // covers "storage/uploads/..."
            $relative = substr($imagePathInput, strpos($imagePathInput, 'storage/') + strlen('storage/'));
        } else {
            // if contains full URL, try parse_url
            $parsed = parse_url($imagePathInput, PHP_URL_PATH);
            if ($parsed && strpos($parsed, '/storage/') !== false) {
                $relative = substr($parsed, strpos($parsed, '/storage/') + strlen('/storage/'));
            }
        }

        // Ensure product images is array
        $images = $product->images;
        if (is_string($images)) {
            $decoded = json_decode($images, true);
            $images = is_array($decoded) ? $decoded : [];
        } elseif (!is_array($images)) {
            $images = [];
        }

        // Remove the image (matching by relative path)
        $updatedImages = array_values(array_filter($images, fn($img) => $img !== $relative));

        // Save updated images to DB
        $product->images = json_encode($updatedImages);
        $product->save();

        // Delete the file from storage if exists
        if (Storage::disk('public')->exists($relative)) {
            Storage::disk('public')->delete($relative);
        }

        return response()->json(['message' => 'Image deleted successfully']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        // send product with normalized images (like index)
        $images = $product->images;
        if (is_string($images)) {
            $decoded = json_decode($images, true);
            $images = is_array($decoded) ? $decoded : ($images !== '' ? [$images] : []);
        } elseif (!is_array($images)) {
            $images = [];
        }

        return Inertia::render('Admin/Products/Edit', [
            'product' => array_merge($product->toArray(), [
                'images' => $images,
                'picture_url' => count($images) ? Storage::url($images[0]) : null,
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'existingImages' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Start with existing images the user chose to keep (should be relative paths)
        $updatedImages = $request->existingImages ?? [];

        // If existingImages contains full URLs, normalize them here (strip leading /storage/ or full url)
        $updatedImages = array_map(function ($img) {
            if (strpos($img, '/storage/') !== false) {
                return substr($img, strpos($img, '/storage/') + strlen('/storage/'));
            } elseif (strpos($img, 'storage/') !== false) {
                return substr($img, strpos($img, 'storage/') + strlen('storage/'));
            } else {
                return $img;
            }
        }, $updatedImages);

        // Handle newly uploaded files
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('uploads/products', 'public'); // -> "uploads/products/xxx.png"
                $updatedImages[] = $path; // store relative path only
            }
        }

        // Save updates (images as JSON)
        $product->update([
            'name' => $request->input('name'),
            'location' => $request->input('location'),
            'description' => $request->input('description'),
            'images' => json_encode($updatedImages),
        ]);

        return redirect()->route('products.index')
            ->with('message', 'Product Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
