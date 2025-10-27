<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    use HasFactory;

    protected $fillable = [
        'place_code',
        'name',
        'town_name',
        'town_code',
        'barangay',
        'description',
    ];

    public function images()
    {
        return $this->hasMany(\App\Models\Admin\PlaceImage::class, 'place_id');
    }

    // 🔹 Automatically generate a product_code when creating a new place
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($place) {
            // Get the latest place
            $latest = self::latest('id')->first();
            $nextId = $latest ? $latest->id + 1 : 1;

            // Format: product0001, product0002, etc.
            $place->place_code = 'place' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
        });
    }
}
