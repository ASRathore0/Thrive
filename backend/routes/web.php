<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Travelomate API is running',
        'status' => 'ok',
    ]);
});
