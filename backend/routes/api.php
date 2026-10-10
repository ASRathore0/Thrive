<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FlightController;
use App\Http\Controllers\HotelController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::post('/flights/search', [FlightController::class, 'search']);
    Route::post('/flights/book', [FlightController::class, 'book']);

    Route::get('/hotels/content/locations', [HotelController::class, 'contentLocations']);
    Route::get('/hotels/content/location/hotels', [HotelController::class, 'contentLocationHotels']);
    Route::post('/hotels/search', [HotelController::class, 'search']);
    Route::post('/hotels/book', [HotelController::class, 'book']);
});
