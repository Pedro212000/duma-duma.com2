<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response; // correct Response interface

class RoleManager
{
    public function handle(Request $request, Closure $next, $role): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        if (Auth::user()->role !== $role) {
            return $this->redirectUser(Auth::user()->role);
        }

        return $next($request);
    }

    private function redirectUser($role)
    {
        $redirectRoutes = [
            'admin' => 'admin.dashboard',
            'publisher' => 'publisher.dashboard',
        ];

        return isset($redirectRoutes[$role])
            ? redirect()->route($redirectRoutes[$role])
            : redirect()->route('login');
    }
}
