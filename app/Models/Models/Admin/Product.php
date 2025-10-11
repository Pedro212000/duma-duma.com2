<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'location',
        'description',
        'images',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'images' => 'array', // store/retrieve images as array from JSON column
    ];
}
