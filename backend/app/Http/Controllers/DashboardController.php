<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'stats' => [
                'total_bookings' => 24,
                'upcoming_trips' => 6,
                'pending_approvals' => 3,
                'spend_this_month' => 185000,
            ],
            'recent_bookings' => [
                [
                    'id' => 1,
                    'type' => 'flight',
                    'status' => 'confirmed',
                    'origin' => 'Delhi',
                    'destination' => 'Mumbai',
                    'departure_date' => '2026-09-22',
                ],
                [
                    'id' => 2,
                    'type' => 'hotel',
                    'status' => 'pending',
                    'hotel_name' => 'The Oberoi',
                    'destination' => 'Bengaluru',
                    'departure_date' => '2026-09-28',
                ],
                [
                    'id' => 3,
                    'type' => 'tour',
                    'status' => 'confirmed',
                    'origin' => 'Hyderabad',
                    'destination' => 'Goa',
                    'departure_date' => '2026-10-02',
                ],
            ],
        ]);
    }
}
