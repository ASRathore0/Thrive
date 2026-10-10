<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FlightController extends Controller
{
    public function search(Request $request)
    {
        $data = $request->validate([
            'origin' => ['required', 'string'],
            'destination' => ['required', 'string'],
            'departure_date' => ['required', 'date'],
            'return_date' => ['nullable', 'date'],
            'travelers' => ['required', 'integer', 'min:1'],
            'cabin_class' => ['required', 'string'],
        ]);

        return response()->json([
            'flights' => [
                [
                    'id' => 'flt-101',
                    'airline' => 'Indigo',
                    'flight_number' => '6E 222',
                    'departure_time' => '08:30',
                    'arrival_time' => '10:45',
                    'duration' => '2h 15m',
                    'price' => 5420,
                    'currency' => 'INR',
                    'stops' => 0,
                ],
                [
                    'id' => 'flt-202',
                    'airline' => 'Air India',
                    'flight_number' => 'AI 405',
                    'departure_time' => '11:10',
                    'arrival_time' => '13:35',
                    'duration' => '2h 25m',
                    'price' => 6180,
                    'currency' => 'INR',
                    'stops' => 1,
                ],
            ],
        ]);
    }

    public function book(Request $request)
    {
        $data = $request->validate([
            'flight_id' => ['required', 'string'],
            'origin' => ['required', 'string'],
            'destination' => ['required', 'string'],
            'departure_date' => ['required', 'date'],
            'travelers' => ['required', 'integer', 'min:1'],
            'cabin_class' => ['required', 'string'],
            'passenger_name' => ['required', 'string', 'max:120'],
            'passenger_email' => ['required', 'email', 'max:255'],
            'passenger_phone' => ['required', 'string', 'max:30'],
        ]);

        return response()->json([
            'message' => 'Flight booking created successfully.',
            'booking' => [
                'id' => 'book-'.time(),
                'status' => 'confirmed',
                ...$data,
            ],
        ], 201);
    }
}
