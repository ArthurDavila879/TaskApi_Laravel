<?php

use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/users', [UserController::class, 'index']);

Route::post('/users', [UserController::class, 'store']);

Route::put('/users/{id}', [UserController::class, 'update']);

Route::get('/users/{id}', [UserController::class, 'getById']);

Route::delete('/users/{id}', [UserController::class, 'destroy']);


Route::get('/tasks', [TaskController::class, 'index']);

Route::post('/tasks', [TaskController::class, 'store']);