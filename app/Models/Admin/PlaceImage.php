<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaceImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'place_id',
        'image_path',
    ];

    public function place()
    {
        return $this->belongsTo(Place::class);
    }
}
