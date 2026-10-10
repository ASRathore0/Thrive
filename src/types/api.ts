export type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};

export type DashboardStats = {
  total_bookings: number;
  upcoming_trips: number;
  pending_approvals: number;
  spend_this_month: number;
};

export type RecentBooking = {
  id: number;
  type: 'flight' | 'hotel' | 'tour';
  status: 'confirmed' | 'pending' | 'cancelled';
  origin?: string;
  destination?: string;
  departure_date?: string;
  hotel_name?: string;
};

export type DashboardResponse = {
  stats: DashboardStats;
  recent_bookings: RecentBooking[];
};

export type FlightSearchRequest = {
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  travelers: number;
  cabin_class: string;
};

export type FlightSearchResponse = {
  flights: Array<{
    id: string;
    airline: string;
    flight_number: string;
    departure_time: string;
    arrival_time: string;
    duration: string;
    price: number;
    currency: string;
    stops: number;
  }>;
};

export type FlightBookingRequest = FlightSearchRequest & {
  flight_id: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
};

export type FlightBookingResponse = {
  message: string;
  booking: FlightBookingRequest & { id: string; status: 'confirmed' };
};

export type HotelSearchRequest = {
  city: string;
  check_in: string;
  check_out: string;
  rooms: number;
  guests: number;
  budget?: number;
};

export type HotelSearchResponse = {
  hotels: Array<{
    id: string;
    name: string;
    city: string;
    rating: number;
    price_per_night: number;
    currency: string;
    image?: string;
  }>;
};

export type HotelBookingRequest = {
  hotel_id: string;
  hotel_name: string;
  city: string;
  check_in: string;
  check_out: string;
  rooms: number;
  guests: number;
  booking_type: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  payment_method: string;
  special_requests?: string;
};

export type HotelBookingResponse = {
  message: string;
  booking: HotelBookingRequest & {
    id: string;
    status: 'confirmed';
  };
};
