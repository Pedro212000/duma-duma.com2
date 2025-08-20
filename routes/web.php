<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
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

    Route::get('users', [UserController::class, 'index'])->name('users.index');
});

// Publisher Route
Route::middleware(['auth', 'verified', 'roleManager:publisher'])->group(function () {
    Route::get('publisher/dashboard', function () {
        return Inertia::render('Publisher/dashboard');
    })->name('publisher.dashboard');
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
