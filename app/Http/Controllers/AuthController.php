<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        if (Auth::attempt($request->only('email', 'password'))) {
            $token = $request->user()->createToken('auth-token', [
                'tasks:read',
                'tasks:write',
                'tasks:delete',
                'tasks:update',
                'users:read',
                'users:write',
                'users:delete',
            ])->plainTextToken;

            return response()->json(['token' => $token], 200);
        }

        return response()->json(['message' => 'Not Authorized'], 403);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out'], 200);
    }
}
