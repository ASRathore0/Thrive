import { apiRequest } from '../lib/api';
import type { FlightBookingRequest, FlightBookingResponse, FlightSearchRequest, FlightSearchResponse } from '../types/api';

export async function searchFlights(payload: FlightSearchRequest): Promise<FlightSearchResponse> {
  return apiRequest<FlightSearchResponse>('/flights/search', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createFlightBooking(payload: FlightBookingRequest): Promise<FlightBookingResponse> {
  return apiRequest<FlightBookingResponse>('/flights/book', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
