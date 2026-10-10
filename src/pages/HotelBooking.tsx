import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Plane,
  Hotel,
  Trophy,
  History,
  Settings,
  Search,
  Bell,
  User,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  X,
  Sun,
  Moon,
  Bed,
} from 'lucide-react';
import { motion } from 'motion/react';

import { createHotelBooking, searchHotels } from '../services/hotels';
import type { HotelBookingResponse, HotelSearchResponse } from '../types/api';

const getDateInputValue = (daysAhead: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

const hotelBookingStorageKey = 'travelomate_hotel_booking_state';

type HotelBookingState = {
  isDarkMode: boolean;
  bookingType: string;
  hotels: HotelSearchResponse['hotels'];
  city: string;
  checkIn: string;
  checkOut: string;
  rooms: string;
  guests: string;
  selectedHotel: HotelSearchResponse['hotels'][number] | null;
  bookingStep: 'details' | 'review' | 'confirmed';
  bookingConfirmation: HotelBookingResponse | null;
  guestDetails: {
    name: string;
    email: string;
    phone: string;
    paymentMethod: string;
    specialRequests: string;
  };
};

const getSavedBookingState = (): Partial<HotelBookingState> => {
  try {
    const savedState = sessionStorage.getItem(hotelBookingStorageKey);
    return savedState ? JSON.parse(savedState) as Partial<HotelBookingState> : {};
  } catch {
    return {};
  }
};

const savedBookingState = getSavedBookingState();

export default function HotelBooking() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hotels');
  const [bookingType, setBookingType] = useState(savedBookingState.bookingType ?? 'official');
  const [isDarkMode, setIsDarkMode] = useState(savedBookingState.isDarkMode ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hotels, setHotels] = useState<HotelSearchResponse['hotels']>(savedBookingState.hotels ?? []);
  const [city, setCity] = useState(savedBookingState.city ?? 'Bengaluru');
  const [checkIn, setCheckIn] = useState(savedBookingState.checkIn ?? getDateInputValue(7));
  const [checkOut, setCheckOut] = useState(savedBookingState.checkOut ?? getDateInputValue(10));
  const [rooms, setRooms] = useState(savedBookingState.rooms ?? '1');
  const [guests, setGuests] = useState(savedBookingState.guests ?? '2');
  const [selectedHotel, setSelectedHotel] = useState<HotelSearchResponse['hotels'][number] | null>(savedBookingState.selectedHotel ?? null);
  const [bookingStep, setBookingStep] = useState<'details' | 'review' | 'confirmed'>(savedBookingState.bookingStep ?? 'details');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingConfirmation, setBookingConfirmation] = useState<HotelBookingResponse | null>(savedBookingState.bookingConfirmation ?? null);
  const [guestDetails, setGuestDetails] = useState(savedBookingState.guestDetails ?? { name: 'Anurag', email: 'admin@travelomate.in', phone: '', paymentMethod: 'company-account', specialRequests: '' });

  useEffect(() => {
    const state: HotelBookingState = { isDarkMode, bookingType, hotels, city, checkIn, checkOut, rooms, guests, selectedHotel, bookingStep, bookingConfirmation, guestDetails };
    sessionStorage.setItem(hotelBookingStorageKey, JSON.stringify(state));
  }, [isDarkMode, bookingType, hotels, city, checkIn, checkOut, rooms, guests, selectedHotel, bookingStep, bookingConfirmation, guestDetails]);

  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
  const totalPrice = selectedHotel ? selectedHotel.price_per_night * nights * Number(rooms) : 0;

  const navItems = useMemo(
    () => [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'bookings', label: 'My Bookings', icon: History },
      { id: 'flights', label: 'Flights', icon: Plane },
      { id: 'hotels', label: 'Hotels', icon: Hotel },
      { id: 'sports', label: 'Sports Tours', icon: Trophy },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    [],
  );

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (id === 'dashboard') navigate('/dashboard');
    if (id === 'bookings') navigate('/my-bookings');
    if (id === 'flights') navigate('/flight-booking');
    if (id === 'hotels') navigate('/hotel-booking');
  };

  const handleSearch = async () => {
    if (!city || !checkIn || !checkOut || checkOut <= checkIn) {
      setError('Please provide a city, check-in date, and check-out date.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await searchHotels({
        city,
        check_in: checkIn,
        check_out: checkOut,
        rooms: Number(rooms),
        guests: Number(guests),
      });

      if (!response.hotels?.length) {
        setHotels([]);
        setError('No hotels found for the selected dates.');
        return;
      }

      setHotels(response.hotels);
    } catch (requestError) {
      setHotels([]);
      setError(requestError instanceof Error ? requestError.message : 'Unable to fetch hotel data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHotel = (hotel: HotelSearchResponse['hotels'][number]) => {
    setSelectedHotel(hotel);
    setBookingStep('details');
    setBookingError('');
    setBookingConfirmation(null);
  };

  const handleContinueToReview = () => {
    if (!guestDetails.name.trim() || !guestDetails.email.trim() || !guestDetails.phone.trim()) {
      setBookingError('Please add the guest name, email, and phone number to continue.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(guestDetails.email)) {
      setBookingError('Please enter a valid email address.');
      return;
    }
    setBookingError('');
    setBookingStep('review');
  };

  const handleConfirmBooking = async () => {
    if (!selectedHotel) return;
    setBookingLoading(true);
    setBookingError('');
    try {
      const response = await createHotelBooking({
        hotel_id: selectedHotel.id,
        hotel_name: selectedHotel.name,
        city: selectedHotel.city,
        check_in: checkIn,
        check_out: checkOut,
        rooms: Number(rooms),
        guests: Number(guests),
        booking_type: bookingType,
        guest_name: guestDetails.name.trim(),
        guest_email: guestDetails.email.trim(),
        guest_phone: guestDetails.phone.trim(),
        payment_method: guestDetails.paymentMethod,
        special_requests: guestDetails.specialRequests.trim() || undefined,
      });
      setBookingConfirmation(response);
      setBookingStep('confirmed');
    } catch (requestError) {
      setBookingError(requestError instanceof Error ? requestError.message : 'Unable to confirm this booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const closeBookingFlow = () => {
    setSelectedHotel(null);
    setBookingStep('details');
    setBookingError('');
    setBookingConfirmation(null);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden text-secondary">
      <aside className="w-72 bg-secondary text-white flex flex-col hidden md:flex relative overflow-hidden transition-all border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />

        <div className="p-8 relative z-10">
          <div className="flex items-center mb-10 cursor-pointer transition-transform duration-300 hover:scale-105" onClick={() => navigate('/dashboard')}>
            <img src="./Thrive logo.png" alt="Thrive by Travelomate" className="h-20 w-auto object-contain" />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 relative z-10">
          <div className="bg-white/5 rounded-3xl p-5 border border-white/10 backdrop-blur-md">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-3">Account Manager</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-white font-black text-sm">TM</div>
              <div>
                <p className="text-sm font-bold leading-none mb-1">Travelomate Support</p>
                <p className="text-[10px] text-gray-500 font-medium">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className={`flex-1 flex flex-col min-w-0 overflow-y-auto relative ${isDarkMode ? 'bg-[#0F1014]' : 'bg-gray-50'}`}>
        <header className={`h-20 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20 ${
          isDarkMode ? 'bg-white/10 border-b border-white/5 text-white' : 'bg-white/80 border-b border-gray-200 text-secondary'
        }`}>
          <div className="relative w-96 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search flights, hotels or tournaments..."
              className={`w-full pl-10 pr-4 py-2.5 border border-transparent rounded-xl outline-none transition-all shadow-inner ${
                isDarkMode
                  ? 'bg-black/40 focus:bg-black/60 focus:border-gray-700 text-white placeholder:text-gray-500'
                  : 'bg-black/5 focus:bg-white focus:border-gray-300 text-secondary placeholder:text-gray-500'
              }`}
            />
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`relative p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-primary'}`}>
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button className={`relative p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-primary'}`}>
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-transparent" />
            </button>
            <div className={`flex items-center gap-3 pl-6 border-l ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="text-right">
                <p className="text-sm font-bold">Anurag</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Corporate Manager</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shadow-md ring-2 ring-white/10">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        <div className={`flex-1 relative min-h-[calc(100vh-5rem)] ${hotels.length > 0 ? 'overflow-y-auto' : 'flex items-center justify-center p-4'}`}>
          {hotels.length === 0 && <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("./mainbg2.png")' }} />}

          {hotels.length === 0 ? <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative z-10 w-full max-w-5xl max-h-[88vh] overflow-y-auto rounded-3xl backdrop-blur-xl border shadow-2xl p-8 pt-12 mt-8 transition-colors duration-300 ${
              isDarkMode ? 'bg-[#0F1014]/100 border-gray-800' : 'bg-white/90 border-gray-100'
            }`}
            style={{ scrollbarWidth: 'thin' }}
          >
            <div className="space-y-8 mt-4">
              <div className="flex items-center gap-8">
                {[
                  { id: 'official', label: 'Official Booking' },
                  { id: 'guest', label: 'Official Guest' },
                  { id: 'personal', label: 'Personal' },
                ].map((type) => (
                  <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      bookingType === type.id ? 'border-primary' : isDarkMode ? 'border-gray-500 group-hover:border-gray-400' : 'border-gray-300 group-hover:border-gray-400'
                    }`}>
                      {bookingType === type.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <span className={`text-sm font-medium ${
                      bookingType === type.id
                        ? isDarkMode ? 'text-white' : 'text-secondary'
                        : isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                    }`}>
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-4 flex-wrap">
                <div className="relative w-48">
                  <select
                    value={rooms}
                    onChange={(event) => setRooms(event.target.value)}
                    className={`w-full appearance-none bg-transparent border rounded-xl px-4 py-3 text-sm outline-none cursor-pointer transition-colors ${
                      isDarkMode ? 'border-gray-800 text-white focus:border-gray-600' : 'border-gray-200 text-secondary focus:border-gray-400'
                    }`}
                  >
                    <option value="1">1 Room, 1 Guest</option>
                    <option value="2">2 Rooms, 2 Guests</option>
                    <option value="2">2 Rooms, 3 Guests</option>
                    <option value="3">3 Rooms, 4 Guests</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative w-48">
                  <select
                    value={guests}
                    onChange={(event) => setGuests(event.target.value)}
                    className={`w-full appearance-none bg-transparent border rounded-xl px-4 py-3 text-sm outline-none cursor-pointer transition-colors ${
                      isDarkMode ? 'border-gray-800 text-white focus:border-gray-600' : 'border-gray-200 text-secondary focus:border-gray-400'
                    }`}
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative flex-1 min-w-[220px]">
                  <input
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="City"
                    className={`w-full bg-transparent border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
                      isDarkMode ? 'border-gray-800 text-white focus:border-gray-600' : 'border-gray-200 text-secondary focus:border-gray-400'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-black" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(event) => setCheckIn(event.target.value)}
                    className={`w-full bg-transparent border rounded-xl pl-12 pr-4 py-3 text-sm outline-none transition-colors ${
                      isDarkMode ? 'border-gray-800 text-white focus:border-gray-600' : 'border-gray-200 text-secondary focus:border-gray-400'
                    }`}
                  />
                </div>

                <div className="relative flex-1 min-w-[200px]">
                  <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-black" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(event) => setCheckOut(event.target.value)}
                    className={`w-full bg-transparent border rounded-xl pl-12 pr-4 py-3 text-sm outline-none transition-colors ${
                      isDarkMode ? 'border-gray-800 text-white focus:border-gray-600' : 'border-gray-200 text-secondary focus:border-gray-400'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-4">
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-10 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors uppercase text-sm tracking-wider disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Loading...' : 'Search'}
                </button>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {!isLoading && hotels.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                      <img
                        src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                        alt={hotel.name}
                        className="h-44 w-full rounded-xl object-cover"
                      />

                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-secondary">{hotel.name}</h3>
                          <p className="text-sm text-gray-500">{hotel.city}</p>
                        </div>
                        <div className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                          ★ {hotel.rating.toFixed(1)}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">From</p>
                          <p className="text-xl font-bold text-secondary">
                            {hotel.currency} {hotel.price_per_night.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <button type="button" onClick={() => handleSelectHotel(hotel)} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">Book now</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div> : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative z-10 min-h-[calc(100vh-5rem)] w-full px-5 py-8 md:px-10 lg:px-14 ${isDarkMode ? 'bg-[#0F1014] text-white' : 'bg-gray-50 text-secondary'}`}
            >
              <div className="mx-auto max-w-7xl">
                <div className="flex flex-col justify-between gap-5 border-b border-gray-200 pb-7 md:flex-row md:items-end">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Hotel search results</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Stays in {city}</h1>
                    <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {checkIn} to {checkOut} · {nights} night{nights === 1 ? '' : 's'} · {rooms} room{Number(rooms) === 1 ? '' : 's'} · {guests} guest{Number(guests) === 1 ? '' : 's'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHotels([])}
                    className={`flex items-center gap-2 self-start rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors md:self-auto ${isDarkMode ? 'border-gray-700 text-white hover:bg-white/10' : 'border-gray-200 bg-white text-secondary hover:bg-gray-100'}`}
                  >
                    <ArrowLeft size={17} /> Modify search
                  </button>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
                  <aside className={`h-fit rounded-2xl border p-5 ${isDarkMode ? 'border-gray-800 bg-[#17181d]' : 'border-gray-200 bg-white'}`}>
                    <p className="text-sm font-bold">Refine your stay</p>
                    <div className="mt-5 space-y-4 text-sm">
                      <label className="flex items-center justify-between gap-3"><span>Breakfast included</span><input type="checkbox" className="h-4 w-4 accent-primary" /></label>
                      <label className="flex items-center justify-between gap-3"><span>Free cancellation</span><input type="checkbox" className="h-4 w-4 accent-primary" /></label>
                      <label className="flex items-center justify-between gap-3"><span>4+ rating</span><input type="checkbox" className="h-4 w-4 accent-primary" /></label>
                    </div>
                    <div className={`mt-6 border-t pt-5 text-xs leading-5 ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-100 text-gray-500'}`}>
                      Prices shown are per night. Final availability is confirmed before booking.
                    </div>
                  </aside>

                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{hotels.length} properties found</p>
                      <select className={`rounded-lg border bg-transparent px-3 py-2 text-sm outline-none ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-secondary'}`} defaultValue="recommended">
                        <option value="recommended">Recommended</option>
                        <option value="price-low">Price: low to high</option>
                        <option value="rating">Guest rating</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      {hotels.map((hotel) => (
                        <article key={hotel.id} className={`grid overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-lg md:grid-cols-[230px_1fr_auto] ${isDarkMode ? 'border-gray-800 bg-[#17181d]' : 'border-gray-200 bg-white'}`}>
                          <img src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} alt={hotel.name} className="h-52 w-full object-cover md:h-full" />
                          <div className="p-5 md:p-6">
                            <div className="flex items-start justify-between gap-3">
                              <div><h2 className="text-xl font-bold">{hotel.name}</h2><p className={`mt-1 flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}><MapPin size={15} /> {hotel.city}</p></div>
                              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">★ {hotel.rating.toFixed(1)}</span>
                            </div>
                            <div className={`mt-8 flex flex-wrap gap-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}><span className="rounded-full bg-green-50 px-3 py-1.5 text-green-700">Free cancellation</span><span className="rounded-full bg-gray-100 px-3 py-1.5">Instant confirmation</span></div>
                          </div>
                          <div className="flex min-w-[180px] flex-col justify-between border-t p-5 md:border-l md:border-t-0 md:p-6"><div className="md:text-right"><p className={`text-xs uppercase tracking-[0.16em] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>From</p><p className="mt-1 text-2xl font-bold">{hotel.currency} {hotel.price_per_night.toLocaleString('en-IN')}</p><p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>per night</p></div><button type="button" onClick={() => handleSelectHotel(hotel)} className="mt-5 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90">View rooms and book</button></div>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {selectedHotel && (
          <div className={`absolute inset-x-0 bottom-0 top-20 z-30 overflow-y-auto p-0 ${isDarkMode ? 'bg-[#0F1014]' : 'bg-gray-50'}`}>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={`min-h-screen ${isDarkMode ? 'bg-[#0F1014] text-white' : 'bg-gray-50 text-secondary'}`}>
              <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col">
                <header className={`flex items-center justify-between border-b px-5 py-5 md:px-10 ${isDarkMode ? 'border-gray-800 bg-[#17181d]' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={closeBookingFlow} className={`rounded-xl p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-secondary'}`} aria-label="Close booking flow"><X size={22} /></button>
                    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Hotel booking</p><h2 className="text-xl font-bold">Complete your stay</h2></div>
                  </div>
                  {bookingStep !== 'confirmed' && <div className={`hidden items-center gap-3 text-sm font-semibold sm:flex ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{['Guest details', 'Review', 'Confirmation'].map((label, index) => { const stepIndex = bookingStep === 'details' ? 0 : 1; return <React.Fragment key={label}><span className={index <= stepIndex ? 'text-primary' : ''}>{index + 1}. {label}</span>{index < 2 && <span className={isDarkMode ? 'text-gray-700' : 'text-gray-300'}>/</span>}</React.Fragment>; })}</div>}
                </header>

                <div className="grid flex-1 gap-6 p-5 md:p-10 lg:grid-cols-[1fr_360px]">
                  <section className={`rounded-3xl border p-6 shadow-sm md:p-8 ${isDarkMode ? 'border-gray-800 bg-[#17181d] [&_input]:border-gray-700 [&_input]:bg-[#0F1014] [&_input]:text-white [&_textarea]:border-gray-700 [&_textarea]:bg-[#0F1014] [&_textarea]:text-white [&_select]:border-gray-700 [&_select]:bg-[#0F1014] [&_select]:text-white [&_.border-gray-200]:border-gray-700 [&_.border-gray-100]:border-gray-800 [&_.bg-gray-50]:bg-[#0F1014]' : 'border-gray-200 bg-white'}`}>
                    {bookingStep === 'details' && <div className="space-y-8"><div><p className="mb-2 text-sm font-semibold text-primary">Step 1 of 3</p><h3 className="text-3xl font-bold tracking-tight">Who is staying?</h3><p className="mt-2 text-gray-500">We'll use these details for the reservation and check-in.</p></div><div className="grid gap-5 md:grid-cols-2"><label className="space-y-2 text-sm font-semibold md:col-span-2">Guest name<div className="relative"><UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input value={guestDetails.name} onChange={(event) => setGuestDetails({ ...guestDetails, name: event.target.value })} className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 font-normal outline-none transition-colors focus:border-primary" placeholder="Full name" /></div></label><label className="space-y-2 text-sm font-semibold">Email address<div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="email" value={guestDetails.email} onChange={(event) => setGuestDetails({ ...guestDetails, email: event.target.value })} className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 font-normal outline-none transition-colors focus:border-primary" placeholder="name@company.com" /></div></label><label className="space-y-2 text-sm font-semibold">Phone number<div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="tel" value={guestDetails.phone} onChange={(event) => setGuestDetails({ ...guestDetails, phone: event.target.value })} className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 font-normal outline-none transition-colors focus:border-primary" placeholder="+91 98765 43210" /></div></label><label className="space-y-2 text-sm font-semibold md:col-span-2">Payment method<div className="relative"><CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><select value={guestDetails.paymentMethod} onChange={(event) => setGuestDetails({ ...guestDetails, paymentMethod: event.target.value })} className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 font-normal outline-none transition-colors focus:border-primary"><option value="company-account">Company account</option><option value="corporate-card">Corporate card</option><option value="pay-at-hotel">Pay at hotel</option></select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /></div></label><label className="space-y-2 text-sm font-semibold md:col-span-2">Special requests <span className="font-normal text-gray-400">(optional)</span><textarea value={guestDetails.specialRequests} onChange={(event) => setGuestDetails({ ...guestDetails, specialRequests: event.target.value })} className="min-h-28 w-full resize-y rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none transition-colors focus:border-primary" placeholder="Late arrival, accessibility needs, or room preferences" /></label></div>{bookingError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{bookingError}</div>}<div className="flex justify-end border-t border-gray-100 pt-6"><button type="button" onClick={handleContinueToReview} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary/90">Review booking <ArrowRight size={18} /></button></div></div>}

                    {bookingStep === 'review' && <div className="space-y-8"><div><p className="mb-2 text-sm font-semibold text-primary">Step 2 of 3</p><h3 className="text-3xl font-bold tracking-tight">Review and confirm</h3><p className="mt-2 text-gray-500">Check the details before we create your reservation.</p></div><div className="divide-y divide-gray-100 rounded-2xl border border-gray-200"><div className="grid gap-2 p-5 sm:grid-cols-2"><span className="text-sm text-gray-500">Guest</span><span className="font-semibold sm:text-right">{guestDetails.name}<br /><span className="text-sm font-normal text-gray-500">{guestDetails.email} · {guestDetails.phone}</span></span></div><div className="grid gap-2 p-5 sm:grid-cols-2"><span className="text-sm text-gray-500">Stay</span><span className="font-semibold sm:text-right">{checkIn} to {checkOut}<br /><span className="text-sm font-normal text-gray-500">{nights} night{nights === 1 ? '' : 's'} · {rooms} room{Number(rooms) === 1 ? '' : 's'} · {guests} guest{Number(guests) === 1 ? '' : 's'}</span></span></div><div className="grid gap-2 p-5 sm:grid-cols-2"><span className="text-sm text-gray-500">Payment</span><span className="font-semibold sm:text-right">{guestDetails.paymentMethod === 'company-account' ? 'Company account' : guestDetails.paymentMethod === 'corporate-card' ? 'Corporate card' : 'Pay at hotel'}</span></div>{guestDetails.specialRequests && <div className="grid gap-2 p-5 sm:grid-cols-2"><span className="text-sm text-gray-500">Requests</span><span className="font-semibold sm:text-right">{guestDetails.specialRequests}</span></div>}</div>{bookingError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{bookingError}</div>}<div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row"><button type="button" onClick={() => setBookingStep('details')} className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 font-bold text-secondary transition-colors hover:bg-gray-50"><ArrowLeft size={18} /> Edit details</button><button type="button" onClick={handleConfirmBooking} disabled={bookingLoading} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">{bookingLoading ? 'Confirming...' : 'Confirm booking'} <ShieldCheck size={18} /></button></div></div>}

                    {bookingStep === 'confirmed' && bookingConfirmation && <div className="flex min-h-[520px] flex-col items-center justify-center text-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600"><CheckCircle2 size={44} /></div><p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-green-600">Booking confirmed</p><h3 className="mt-3 text-4xl font-bold tracking-tight">You're all set.</h3><p className="mt-3 max-w-md text-gray-500">Your stay at {selectedHotel.name} is confirmed. We've sent the details to {guestDetails.email}.</p><div className="mt-8 rounded-2xl bg-gray-50 px-8 py-5 text-left"><p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Booking reference</p><p className="mt-1 text-xl font-bold text-secondary">{bookingConfirmation.booking.id}</p></div><button type="button" onClick={closeBookingFlow} className="mt-8 rounded-xl bg-primary px-7 py-3 font-bold text-white transition-colors hover:bg-primary/90">Back to hotels</button></div>}
                  </section>

                  <aside className={`h-fit rounded-3xl border p-5 shadow-sm lg:sticky lg:top-6 ${isDarkMode ? 'border-gray-800 bg-[#17181d]' : 'border-gray-200 bg-white'}`}><img src={selectedHotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} alt={selectedHotel.name} className="h-48 w-full rounded-2xl object-cover" /><div className="mt-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold">{selectedHotel.name}</h3><p className={`mt-1 flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}><MapPin size={15} /> {selectedHotel.city}</p></div><span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">★ {selectedHotel.rating.toFixed(1)}</span></div><div className={`mt-5 space-y-3 border-t pt-5 text-sm ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}><div className="flex justify-between"><span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Room rate</span><span className="font-semibold">{selectedHotel.currency} {selectedHotel.price_per_night.toLocaleString('en-IN')} / night</span></div><div className="flex justify-between"><span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Duration</span><span className="font-semibold">{nights} nights</span></div><div className="flex justify-between"><span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Rooms</span><span className="font-semibold">{rooms}</span></div><div className={`flex justify-between border-t pt-3 text-base ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}><span className="font-bold">Estimated total</span><span className="font-bold text-primary">{selectedHotel.currency} {totalPrice.toLocaleString('en-IN')}</span></div></div></div><div className="mt-5 flex items-start gap-2 rounded-xl bg-green-50 p-3 text-xs leading-5 text-green-700"><ShieldCheck size={16} className="mt-0.5 shrink-0" /> Secure booking with flexible support from Travelomate.</div></aside>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
