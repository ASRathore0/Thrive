import { apiRequest } from '../lib/api';
import type { HotelBookingRequest, HotelBookingResponse, HotelSearchRequest, HotelSearchResponse } from '../types/api';

export async function searchHotels(payload: HotelSearchRequest): Promise<HotelSearchResponse> {
  return apiRequest<HotelSearchResponse>('/hotels/search', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createHotelBooking(payload: HotelBookingRequest): Promise<HotelBookingResponse> {
  return apiRequest<HotelBookingResponse>('/hotels/book', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
