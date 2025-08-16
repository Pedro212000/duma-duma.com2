<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::middleware(['auth', 'verified', 'roleManager:admin'])->group(function () {
    Route::get('admin/dashboard', function () {
        return Inertia::render('Admin/dashboard');
    })->name('admin.dashboard');
});

// Publisher Route
Route::middleware(['auth', 'verified', 'roleManager:publisher'])->group(function () {
    Route::get('publisher/dashboard', function () {
        return Inertia::render('Publisher/dashboard');
    })->name('publisher.dashboard');
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
