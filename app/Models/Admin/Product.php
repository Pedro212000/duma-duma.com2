<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_code',
        'name',
        'town',
        'barangay',
        'description',
    ];

    public function images()
    {
        return $this->hasMany(\App\Models\Admin\ProductImage::class, 'product_id');
    }

    // 🔹 Automatically generate a product_code when creating a new product
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            // Get the latest product
            $latest = self::latest('id')->first();
            $nextId = $latest ? $latest->id + 1 : 1;

            // Format: product0001, product0002, etc.
            $product->product_code = 'product' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
        });
    }
}
