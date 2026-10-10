import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, CheckCircle2, Clock3, Hotel, LayoutDashboard, MapPin, Moon, Plane, Search, Settings, Sun, Trophy, User, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

import { getDashboard } from '../services/dashboard';
import type { DashboardResponse, RecentBooking } from '../types/api';

const themeKey = 'travelomate_bookings_theme';
type BookingFilter = 'all' | 'flight' | 'hotel' | 'tour';
type DisplayBooking = Omit<RecentBooking, 'id'> & { id: string | number; source?: 'local' | 'dashboard'; reference?: string; guest?: string; email?: string; price?: number; currency?: string; flightNumber?: string };

const readSessionBooking = (key: string): Record<string, unknown> | null => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) as Record<string, unknown> : null;
  } catch {
    return null;
  }
};

export default function MyBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [isDarkMode, setIsDarkMode] = useState(() => sessionStorage.getItem(themeKey) === 'dark');
  const [filter, setFilter] = useState<BookingFilter>('all');
  const [bookings, setBookings] = useState<DisplayBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<DisplayBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    sessionStorage.setItem(themeKey, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const loadBookings = async () => {
      const localBookings: DisplayBooking[] = [];
      const flightState = readSessionBooking('travelomate_flight_booking_state');
      const hotelState = readSessionBooking('travelomate_hotel_booking_state');
      const flightConfirmation = flightState?.confirmation as Record<string, unknown> | undefined;
      const hotelConfirmation = hotelState?.bookingConfirmation as Record<string, unknown> | undefined;
      const flightBooking = flightConfirmation?.booking as Record<string, unknown> | undefined;
      const hotelBooking = hotelConfirmation?.booking as Record<string, unknown> | undefined;

      if (flightBooking?.id) {
        localBookings.push({
          id: String(flightBooking.id), type: 'flight', status: 'confirmed', origin: String(flightBooking.origin ?? ''), destination: String(flightBooking.destination ?? ''), departure_date: String(flightBooking.departure_date ?? ''), source: 'local', reference: String(flightBooking.id), guest: String(flightBooking.passenger_name ?? ''), email: String(flightBooking.passenger_email ?? ''), flightNumber: String((flightState?.selectedFlight as Record<string, unknown> | undefined)?.flight_number ?? ''), price: Number((flightState?.selectedFlight as Record<string, unknown> | undefined)?.price ?? 0), currency: String((flightState?.selectedFlight as Record<string, unknown> | undefined)?.currency ?? 'INR'),
        });
      }
      if (hotelBooking?.id) {
        localBookings.push({
          id: String(hotelBooking.id), type: 'hotel', status: 'confirmed', destination: String(hotelBooking.city ?? ''), hotel_name: String(hotelBooking.hotel_name ?? ''), departure_date: String(hotelBooking.check_in ?? ''), source: 'local', reference: String(hotelBooking.id), guest: String(hotelBooking.guest_name ?? ''), email: String(hotelBooking.guest_email ?? ''),
        });
      }

      try {
        const response: DashboardResponse = await getDashboard();
        const dashboardBookings = response.recent_bookings.map((booking) => ({ ...booking, source: 'dashboard' as const }));
        const existingKeys = new Set(localBookings.map((booking) => `${booking.type}-${booking.id}`));
        setBookings([...localBookings, ...dashboardBookings.filter((booking) => !existingKeys.has(`${booking.type}-${booking.id}`))]);
      } catch {
        setBookings(localBookings);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const navItems = [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, { id: 'bookings', label: 'My Bookings', icon: Calendar }, { id: 'flights', label: 'Flights', icon: Plane }, { id: 'hotels', label: 'Hotels', icon: Hotel }, { id: 'sports', label: 'Sports Tours', icon: Trophy }, { id: 'settings', label: 'Settings', icon: Settings }];
  const visibleBookings = useMemo(() => filter === 'all' ? bookings : bookings.filter((booking) => booking.type === filter), [bookings, filter]);
  const go = (id: string) => { setActiveTab(id); if (id === 'dashboard') navigate('/dashboard'); if (id === 'flights') navigate('/flight-booking'); if (id === 'hotels') navigate('/hotel-booking'); };
  const typeLabel = (type: DisplayBooking['type']) => type === 'flight' ? 'Flight' : type === 'hotel' ? 'Hotel' : 'Sports tour';
  const typeIcon = (type: DisplayBooking['type']) => type === 'flight' ? Plane : type === 'hotel' ? Hotel : Trophy;

  return <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#0F1014] text-white' : 'bg-gray-50 text-secondary'}`}>
    <aside className="hidden w-72 flex-col bg-secondary text-white md:flex"><div className="p-8"><div className="mb-10 cursor-pointer" onClick={() => navigate('/dashboard')}><img src="./Thrive logo.png" alt="Thrive by Travelomate" className="h-20 w-auto object-contain" /></div><nav className="space-y-1">{navItems.map((item) => <button key={item.id} onClick={() => go(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 ${activeTab === item.id ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><item.icon size={20} /><span>{item.label}</span></button>)}</nav></div><div className="mt-auto p-6"><div className="rounded-3xl border border-white/10 bg-white/5 p-5"><p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Account Manager</p><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-black">TM</div><div><p className="text-sm font-bold">Travelomate Support</p><p className="text-[10px] text-gray-500">Available 24/7</p></div></div></div></div></aside>
    <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto"><header className={`sticky top-0 z-20 flex h-20 items-center justify-between border-b px-8 backdrop-blur-md ${isDarkMode ? 'border-white/5 bg-white/10' : 'border-gray-200 bg-white/80'}`}><div className="relative w-96 max-w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input placeholder="Search flights, hotels or tournaments..." className={`w-full rounded-xl border border-transparent py-2.5 pl-10 pr-4 outline-none ${isDarkMode ? 'bg-black/40 text-white' : 'bg-black/5'}`} /></div><div className="flex items-center gap-5"><button type="button" onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-500 hover:text-primary">{isDarkMode ? <Sun size={22} /> : <Moon size={22} />}</button><button type="button" className="relative text-gray-500"><Bell size={22} /><span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" /></button><div className="flex items-center gap-3 border-l border-gray-200 pl-5"><div className="text-right"><p className="text-sm font-bold">Anurag</p><p className="text-xs text-gray-500">Corporate Manager</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-white"><User size={20} /></div></div></div></header>
      <div className={`min-h-[calc(100vh-5rem)] flex-1 p-5 md:p-10 ${isDarkMode ? 'bg-[#0F1014]' : 'bg-gray-50'}`}><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 border-b pb-7 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Travelomate workspace</p><h1 className="mt-2 text-4xl font-bold tracking-tight">My bookings</h1><p className="mt-2 text-sm text-gray-500">Keep every trip, stay, and booking reference in one place.</p></div><div className="flex gap-3"><button type="button" onClick={() => navigate('/flight-booking')} className="rounded-xl border border-primary px-4 py-2.5 text-sm font-bold text-primary">Book a flight</button><button type="button" onClick={() => navigate('/hotel-booking')} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white">Book a hotel</button></div></div><div className="mt-8 flex flex-wrap gap-2">{(['all', 'flight', 'hotel', 'tour'] as BookingFilter[]).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${filter === item ? 'bg-primary text-white' : isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-600'}`}>{item === 'all' ? 'All bookings' : `${item}s`}</button>)}</div>{isLoading ? <div className="mt-8 rounded-3xl border border-dashed border-gray-300 p-16 text-center text-gray-500">Loading your bookings...</div> : visibleBookings.length === 0 ? <div className={`mt-8 rounded-3xl border p-16 text-center ${isDarkMode ? 'border-gray-800 bg-[#17181d]' : 'border-gray-200 bg-white'}`}><Calendar className="mx-auto text-gray-400" size={42} /><h2 className="mt-4 text-xl font-bold">No bookings in this view</h2><p className="mt-2 text-sm text-gray-500">Your confirmed flight and hotel bookings will appear here.</p></div> : <div className="mt-8 grid gap-4">{visibleBookings.map((booking) => { const Icon = typeIcon(booking.type); return <motion.button key={`${booking.type}-${booking.id}`} type="button" whileHover={{ y: -2 }} onClick={() => setSelectedBooking(booking)} className={`grid w-full gap-5 rounded-2xl border p-5 text-left shadow-sm transition-shadow hover:shadow-lg md:grid-cols-[56px_1fr_auto] ${isDarkMode ? 'border-gray-800 bg-[#17181d]' : 'border-gray-200 bg-white'}`}><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={24} /></div><div><div className="flex flex-wrap items-center gap-3"><span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{typeLabel(booking.type)}</span><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{booking.status}</span></div><h2 className="mt-2 text-xl font-bold">{booking.type === 'hotel' ? booking.hotel_name : `${booking.origin ?? ''} to ${booking.destination ?? ''}`}</h2><p className="mt-1 text-sm text-gray-500">{booking.departure_date ? `Travel date: ${booking.departure_date}` : 'Date pending'}{booking.flightNumber ? ` · ${booking.flightNumber}` : ''}</p></div><div className="flex items-center justify-between gap-4 md:block md:text-right"><div className="flex items-center gap-1 text-sm text-gray-500 md:justify-end"><Calendar size={15} /> View details</div><p className="mt-2 text-xs text-gray-400">Ref: {booking.reference ?? `TM-${booking.id}`}</p></div></motion.button>; })}</div>}</div></div>
+    </main>
+    {selectedBooking && <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/70 p-4 backdrop-blur-sm"><motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border p-6 shadow-2xl md:p-8 ${isDarkMode ? 'border-gray-800 bg-[#17181d]' : 'border-gray-200 bg-white'}`}><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{typeLabel(selectedBooking.type)} booking</p><h2 className="mt-2 text-2xl font-bold">Booking details</h2></div><button type="button" onClick={() => setSelectedBooking(null)} className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"><XCircle size={22} /></button></div><div className="mt-7 space-y-4"><div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-700"><CheckCircle2 size={20} /><span className="font-semibold">{selectedBooking.status === 'confirmed' ? 'Confirmed booking' : `Booking ${selectedBooking.status}`}</span></div><div className="grid gap-4 rounded-2xl border border-gray-200 p-5"><div className="flex justify-between gap-4"><span className="text-gray-500">Reference</span><strong>{selectedBooking.reference ?? `TM-${selectedBooking.id}`}</strong></div><div className="flex justify-between gap-4"><span className="text-gray-500">Type</span><strong>{typeLabel(selectedBooking.type)}</strong></div><div className="flex justify-between gap-4"><span className="text-gray-500">Route / destination</span><strong className="text-right">{selectedBooking.type === 'hotel' ? `${selectedBooking.hotel_name} · ${selectedBooking.destination}` : `${selectedBooking.origin} to ${selectedBooking.destination}`}</strong></div><div className="flex justify-between gap-4"><span className="text-gray-500">Date</span><strong>{selectedBooking.departure_date ?? 'Pending'}</strong></div>{selectedBooking.guest && <div className="flex justify-between gap-4"><span className="text-gray-500">Traveller</span><strong>{selectedBooking.guest}</strong></div>}{selectedBooking.email && <div className="flex justify-between gap-4"><span className="text-gray-500">Email</span><strong>{selectedBooking.email}</strong></div>}</div><div className="flex items-start gap-2 rounded-xl bg-primary/5 p-4 text-sm text-gray-600"><Clock3 size={18} className="mt-0.5 shrink-0 text-primary" /> Keep this reference ready when contacting Travelomate support.</div></div><button type="button" onClick={() => setSelectedBooking(null)} className="mt-7 w-full rounded-xl bg-primary px-5 py-3 font-bold text-white">Close details</button></motion.div></div>}
  </div>;
}
