<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CepController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);

Route::post('/users', [UserController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post("/logout", [AuthController::class, 'logout']);
    Route::get('/me', [UserController::class, 'me']);

    Route::get('/users/endereco', [UserController::class, 'endereco']);
    Route::get('/users/stats', [UserController::class, 'stats']);
    // antes ficava fora do grupo auth:sanctum — sem token nenhum
    Route::middleware('ability:tasks:read')->get('/tasks/user', [TaskController::class, 'getTaskByUser']);

    Route::middleware('ability:users:read')->group(function () {
        Route::get('/users/{id}', [UserController::class, 'getById']);
    });
    Route::middleware("Isadmin")->get("/users", [UserController::class, 'index']);

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
