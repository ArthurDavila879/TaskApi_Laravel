<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
//7|IN8RPqUez2He1CKA6YHPOXlbcsffpQXanSqNoUQC6ee56129
class AuthController extends Controller
{
    public function login(Request $request)
    {
        if (Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['Authorized',"token" => $request->user()->createToken('auth-token', [
    'tasks:read',
    'tasks:write',
    'tasks:delete',
    'tasks:update',

])->plainTextToken], 200,
            );
        }

        return response()->json('Not Authorized', 403);
    }
}
