<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'town',
        'barangay',
        'description',
    ];
    public function images()
    {
        return $this->hasMany(\App\Models\Admin\ProductImage::class, 'product_id');
    }

}

