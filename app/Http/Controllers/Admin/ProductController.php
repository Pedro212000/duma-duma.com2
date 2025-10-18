<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Admin\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'location' => $product->location,
                'description' => $product->description,
                'images' => $product->images,
                'picture_url' => $product->picture_url,
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
        // ✅ Validate input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:1024', // 1MB per image
        ]);

        // ✅ Create product record (without images first)
        $product = Product::create([
            'name' => $validated['name'],
            'location' => $validated['location'],
            'description' => $validated['description'],
        ]);

        // ✅ Handle image uploads (if any)
        if ($request->hasFile('images')) {
            $uploadedPaths = [];

            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public'); // stored in storage/app/public/products
                $uploadedPaths[] = $path;
            }

            // ✅ Update product with uploaded image paths
            $product->update(['images' => $uploadedPaths]);
        }

        // ✅ Redirect back to product list (or show success)
        return redirect()
            ->route('products.index')
            ->with('success', 'Product created successfully!');
    }

    public function deleteImage(Request $request, Product $product)
    {
        $imagePath = $request->input('image');

        // ✅ Safely normalize $images
        $images = $product->images;
        if (is_string($images)) {
            $decoded = json_decode($images, true);
            $images = is_array($decoded) ? $decoded : [];
        } elseif (!is_array($images)) {
            $images = [];
        }

        // ✅ Filter out the deleted image
        $updatedImages = array_values(array_filter($images, fn($img) => $img !== $imagePath));

        // ✅ Save updated images
        $product->images = json_encode($updatedImages);
        $product->save();

        // ✅ Delete file if it exists
        if (\Storage::disk('public')->exists($imagePath)) {
            \Storage::disk('public')->delete($imagePath);
        }

        return response()->json(['message' => 'Image deleted successfully']);
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
    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', ['product' => $product]);
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
        ]);

        $product->update([
            'name' => $request->input('name'),
            'location' => $request->input('location'),
            'description' => $request->input('description'),
        ]);
        return redirect()->route('products.index')->with('message', 'Product Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
