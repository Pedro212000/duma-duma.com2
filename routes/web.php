<?php

use App\Http\Controllers\Admin\PlaceController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::get('/', function () {
    return Inertia::render('Landingpage/App');
})->name('home');


Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    $user = auth()->user();

    if ($user->hasRole('admin')) {
        return redirect()->route('admin.dashboard');
    }

    if ($user->hasRole('publisher')) {
        return redirect()->route('publisher.dashboard');
    }

    // Optional: generic fallback for users without a role
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::middleware(['auth', 'verified', 'roleManager:admin'])->group(function () {
    Route::get('admin/dashboard', function () {
        return Inertia::render('Admin/dashboard');
    })->name('admin.dashboard');

    Route::resource('users', UserController::class);
    Route::delete('/users/{user}', [UserController::class, "destroy"])->name('users.destroy');
    Route::put('/users/{user}', [UserController::class, "update"])->name('users.update');

    Route::resource('products', controller: ProductController::class);
    Route::put('/products/{product}', [ProductController::class, "update"])->name('products.update');
    Route::post('/products/{product}/delete-image', [ProductController::class, 'deleteImage'])->name('products.deleteImage');
    Route::delete('/products/{product}', [ProductController::class, "destroy"])->name('products.destroy');

    Route::resource('places', controller: PlaceController::class);




});

// Publisher Route
Route::middleware(['auth', 'verified', 'roleManager:publisher'])->group(function () {
    Route::get('publisher/dashboard', function () {
        return Inertia::render('Publisher/dashboard');
    })->name('publisher.dashboard');
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
