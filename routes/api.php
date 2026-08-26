<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CepController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);

Route::post('/users', [UserController::class, 'store']);


Route::middleware('auth:sanctum')->group(function () {
Route::middleware('auth:sanctum')->get('/users/endereco', [UserController::class, 'endereco']);

    Route::middleware('ability:users:read')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'getById']);
    });

    Route::middleware('ability:users:write')->put('/users/{id}', [UserController::class, 'update']);
    Route::middleware('ability:users:delete')->delete('/users/{id}', [UserController::class, 'destroy']);

    Route::middleware('ability:tasks:read')->group(function () {
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::get('/tasks/{id}', [TaskController::class, 'show']);
    });

    Route::middleware('ability:tasks:write')->group(function () {
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::put('/tasks/{id}', [TaskController::class, 'update']);
    });

    Route::middleware('ability:tasks:delete')->delete('/tasks/{id}', [TaskController::class, 'destroy']);

});