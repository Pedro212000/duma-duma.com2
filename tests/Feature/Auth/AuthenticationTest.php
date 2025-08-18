<?php

use App\Models\User;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create([
        'role' => 'admin', // or publisher
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password', // plain text, not hashed
    ]);

    $this->assertAuthenticatedAs($user);

    if ($user->role === 'admin') {
        $response->assertRedirect(route('admin.dashboard'));
    } elseif ($user->role === 'publisher') {
        $response->assertRedirect(route('publisher.dashboard'));
    } else {
        $response->assertRedirect(route('home'));
    }
});


test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});