<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class HotelController extends Controller
{
    public function contentLocations(Request $request)
    {
        $data = $request->validate([
            'locationType' => ['sometimes', 'string', 'in:CITY,LOCALITY'],
            'pageSize' => ['sometimes', 'integer', 'min:1', 'max:2000'],
            'nextPageToken' => ['sometimes', 'nullable', 'string'],
        ]);

        $baseUrl = env('HOTEL_API_BASE_URL');

        if (empty($baseUrl)) {
            return response()->json([
                'message' => 'Hotel provider base URL is not configured.',
            ], 400);
        }

        $query = [
            'locationType' => $data['locationType'] ?? 'CITY',
            'pageSize' => $data['pageSize'] ?? 1000,
        ];

        if (array_key_exists('nextPageToken', $data) && $data['nextPageToken'] !== null && $data['nextPageToken'] !== '') {
            $query['nextPageToken'] = $data['nextPageToken'];
        }

        $response = Http::withHeaders($this->buildHotelApiHeaders())
            ->acceptJson()
            ->timeout(30)
            ->get($this->hotelApiBaseUrl($baseUrl).'/content/locations', $query);

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Unable to fetch hotel locations from provider.',
                'provider' => $response->json() ?: null,
            ], $response->status());
        }

        return response()->json($response->json());
    }

    public function contentLocationHotels(Request $request)
    {
        $data = $request->validate([
            'locationType' => ['sometimes', 'string', 'in:CITY,LOCALITY'],
            'locationId' => ['required', 'integer'],
            'pageSize' => ['sometimes', 'integer', 'min:1', 'max:2000'],
            'nextPageToken' => ['sometimes', 'nullable', 'string'],
        ]);

        $baseUrl = env('HOTEL_API_BASE_URL');

        if (empty($baseUrl)) {
            return response()->json([
                'message' => 'Hotel provider base URL is not configured.',
            ], 400);
        }

        $metaData = $request->header('x-meta-data');
        $headers = $this->buildHotelApiHeaders();
        if (!empty($metaData)) {
            $headers['x-meta-data'] = $metaData;
        } elseif (!empty($data['locationId'])) {
            $headers['x-meta-data'] = json_encode(['locationVersion' => 'V2']);
        }

        $query = [
            'locationType' => $data['locationType'] ?? 'CITY',
            'locationId' => $data['locationId'],
            'pageSize' => $data['pageSize'] ?? 2000,
        ];

        if (array_key_exists('nextPageToken', $data) && $data['nextPageToken'] !== null && $data['nextPageToken'] !== '') {
            $query['nextPageToken'] = $data['nextPageToken'];
        }

        $response = Http::withHeaders($headers)
            ->acceptJson()
            ->timeout(30)
            ->get($this->hotelApiBaseUrl($baseUrl).'/content/location/hotels', $query);

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Unable to fetch hotels for location from provider.',
                'provider' => $response->json() ?: null,
            ], $response->status());
        }

        return response()->json($response->json());
    }

    public function search(Request $request)
    {
        $data = $request->validate([
            'city' => ['required', 'string'],
            'check_in' => ['required', 'date'],
            'check_out' => ['required', 'date'],
            'rooms' => ['required', 'integer', 'min:1'],
            'guests' => ['required', 'integer', 'min:1'],
        ]);

        $baseUrl = env('HOTEL_API_BASE_URL');

        if (!empty($baseUrl)) {
            try {
                $apiBaseUrl = $this->hotelApiBaseUrl($baseUrl);
                $locationId = $this->resolveLocationId($data['city'], $apiBaseUrl);

                if ($locationId !== null) {
                    $payload = [
                        'location' => [
                            'type' => 'CITY',
                            'id' => (int) $locationId,
                        ],
                        'checkInDate' => $data['check_in'],
                        'checkOutDate' => $data['check_out'],
                        'rooms' => $this->buildRoomPaxArray((int) $data['rooms'], (int) $data['guests']),
                        'customerInfo' => [
                            'ip' => $request->ip() ?? '127.0.0.1',
                            'userAgent' => $request->userAgent() ?? 'Travelomate/1.0',
                        ],
                    ];

                    $response = Http::withHeaders($this->buildHotelApiHeaders(true))
                        ->acceptJson()
                        ->timeout(30)
                        ->post($apiBaseUrl.'/search-by-location', $payload);

                    if ($response->successful()) {
                        $normalizedHotels = $this->normalizeHotels($response->json(), $data['city']);

                        if (!empty($normalizedHotels)) {
                            return response()->json([
                                'hotels' => $normalizedHotels,
                            ]);
                        }
                    }
                }
            } catch (\Throwable $e) {
                Log::warning('Hotel external API failed: '.$e->getMessage());
            }
        }

        return response()->json([
            'hotels' => $this->fallbackHotels($data['city']),
        ]);
    }

    public function book(Request $request)
    {
        $data = $request->validate([
            'hotel_id' => ['required', 'string'],
            'hotel_name' => ['required', 'string'],
            'city' => ['required', 'string'],
            'check_in' => ['required', 'date'],
            'check_out' => ['required', 'date'],
            'rooms' => ['required', 'integer', 'min:1'],
            'guests' => ['required', 'integer', 'min:1'],
            'booking_type' => ['required', 'string', 'in:official,guest,personal'],
            'guest_name' => ['required', 'string', 'max:120'],
            'guest_email' => ['required', 'email', 'max:255'],
            'guest_phone' => ['required', 'string', 'max:30'],
            'payment_method' => ['required', 'string', 'in:company-account,corporate-card,pay-at-hotel'],
            'special_requests' => ['nullable', 'string', 'max:1000'],
        ]);

        return response()->json([
            'message' => 'Hotel booking created successfully.',
            'booking' => [
                'id' => 'hotel-book-'.time(),
                'status' => 'confirmed',
                ...$data,
            ],
        ], 201);
    }

    private function hotelApiBaseUrl(string $baseUrl): string
    {
        $normalized = rtrim($baseUrl, '/');
        $lower = strtolower($normalized);

        if (str_ends_with($lower, '/hotels/api/v4')) {
            return $normalized;
        }

        if (str_ends_with($lower, '/hotels/api')) {
            return $normalized.'/v4';
        }

        return $normalized.'/hotels/api/v4';
    }

    private function buildHotelApiHeaders(bool $includeLineage = false): array
    {
        $headers = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ];

        if ($key = env('HOTEL_API_KEY')) {
            $headers['X-CT-API-KEY'] = $key;
        }

        if ($includeLineage && ($lineage = env('HOTEL_API_LINEAGE_ID'))) {
            $headers['x-lineage-id'] = $lineage;
        }

        $headers['x-request-id'] = (string) Str::uuid();

        return $headers;
    }

    private function resolveLocationId(string $city, string $baseUrl): ?int
    {
        $knownCityMap = [
            'bengaluru' => 32550,
            'bangalore' => 32550,
            'hyderabad' => 33897,
            'lucknow' => 34849,
        ];

        $normalized = strtolower(trim($city));

        if (isset($knownCityMap[$normalized])) {
            return $knownCityMap[$normalized];
        }

        try {
            $response = Http::withHeaders($this->buildHotelApiHeaders())
                ->acceptJson()
                ->timeout(30)
                ->get($baseUrl.'/content/locations', [
                    'locationType' => 'CITY',
                    'pageSize' => 1000,
                    'nextPageToken' => 0,
                ]);

            if (!$response->successful()) {
                return null;
            }

            $payload = $response->json();
            $locationsHierarchy = $payload['locationsHierarchy'] ?? [];

            foreach ($locationsHierarchy as $location) {
                $name = $location['name'] ?? $location['displayName'] ?? $location['city'] ?? '';

                if (is_string($name) && strtolower($name) === $normalized) {
                    return (int) ($location['id'] ?? $location['locationId'] ?? 0);
                }
            }

            $metadataMap = $payload['locationIdToMetadataMap'] ?? [];
            foreach ($metadataMap as $locationId => $meta) {
                $name = $meta['name'] ?? $meta['displayName'] ?? $meta['city'] ?? '';

                if (is_string($name) && strtolower($name) === $normalized) {
                    return (int) $locationId;
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Hotel location lookup failed: '.$e->getMessage());
        }

        return null;
    }

    private function buildRoomPaxArray(int $rooms, int $guests): array
    {
        $roomPax = [];

        if ($rooms <= 0 || $guests <= 0) {
            return [['adults' => 1]];
        }

        $remainingGuests = $guests;

        for ($i = 0; $i < $rooms; $i++) {
            $adultsInRoom = (int) ceil($remainingGuests / max(1, $rooms - $i));
            $adultsInRoom = min($adultsInRoom, 8);
            $roomPax[] = [
                'adults' => $adultsInRoom,
                'childAges' => [],
            ];
            $remainingGuests -= $adultsInRoom;
        }

        return $roomPax;
    }

    private function normalizeHotels(array $payload, string $fallbackCity): array
    {
        $items = $payload['hotels'] ?? $payload['data']['hotels'] ?? $payload['results'] ?? [];

        if (!is_array($items)) {
            return [];
        }

        $normalized = [];

        foreach ($items as $hotel) {
            if (!is_array($hotel)) {
                continue;
            }

            $hotelId = $hotel['hotelId'] ?? $hotel['id'] ?? $hotel['hotel_id'] ?? null;
            $candidateName = $hotel['name'] ?? $hotel['hotelName'] ?? $hotel['hotel_name'] ?? 'Hotel';
            $rooms = $hotel['rooms'] ?? [];
            $minPrice = 0;

            foreach ($rooms as $room) {
                if (!is_array($room)) {
                    continue;
                }

                foreach ($room['rates'] ?? [] as $rate) {
                    if (!is_array($rate)) {
                        continue;
                    }

                    $pricing = $rate['pricing'] ?? [];
                    $totals = $pricing['totals'] ?? [];
                    $baseFare = $totals['baseFare'] ?? $totals['base_fare'] ?? 0;

                    if ($baseFare > 0 && ($minPrice === 0 || (float) $baseFare < $minPrice)) {
                        $minPrice = (float) $baseFare;
                    }
                }
            }

            if ($minPrice === 0) {
                $minPrice = (float) ($hotel['price_per_night'] ?? $hotel['price'] ?? $hotel['pricePerNight'] ?? 0);
            }

            $normalized[] = [
                'id' => (string) ($hotelId ?? uniqid('hotel_')),
                'name' => is_string($candidateName) ? $candidateName : 'Hotel',
                'city' => $hotel['city'] ?? $hotel['hotelLocation']['city'] ?? $fallbackCity,
                'rating' => (float) ($hotel['ratings'] ?? $hotel['starRating'] ?? $hotel['rating'] ?? 0),
                'price_per_night' => (int) round($minPrice > 0 ? $minPrice : ($hotel['price_per_night'] ?? 0)),
                'currency' => $hotel['currency'] ?? 'INR',
                'image' => $hotel['image'] ?? $hotel['image_url'] ?? $hotel['thumbnail'] ?? 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            ];
        }

        return $normalized;
    }

    private function fallbackHotels(string $city): array
    {
        return [
            [
                'id' => 'htl-1001',
                'name' => 'The Leela Palace',
                'city' => $city,
                'rating' => 4.9,
                'price_per_night' => 11999,
                'currency' => 'INR',
                'image' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            ],
            [
                'id' => 'htl-1002',
                'name' => 'ITC Gardenia',
                'city' => $city,
                'rating' => 4.8,
                'price_per_night' => 9899,
                'currency' => 'INR',
                'image' => 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',
            ],
        ];
    }
}
