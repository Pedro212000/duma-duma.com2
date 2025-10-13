<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'description',
        'images',
    ];

    protected $casts = [
        'images' => 'array', // store/retrieve images as array from JSON column
    ];

    public function getPictureUrlAttribute()
    {
        // Get first image from the images array or a single image string
        $path = is_array($this->images) ? $this->images[0] : $this->images;

        // Return public URL
        return $path
            ? asset('storage/' . $path)
            : asset('images/no-image.png'); // fallback
    }
}
