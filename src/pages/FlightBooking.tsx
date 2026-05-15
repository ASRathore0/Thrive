import React, { useState } from 'react';
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
  ArrowLeftRight, 
  Calendar, 
  Clock, 
  ChevronDown, 
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { motion } from 'motion/react';

export default function FlightBooking() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flights');
  const [bookingType, setBookingType] = useState('official');
  const [tripType, setTripType] = useState('round-trip');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: History },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'sports', label: 'Sports Tours', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (id === 'dashboard') navigate('/dashboard');
    if (id === 'flights') navigate('/flight-booking');
    if (id === 'hotels') navigate('/hotel-booking');
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden text-secondary">
      {/* Sidebar - adding a subtle gradient for depth */}
      <aside className="w-72 bg-secondary text-white flex flex-col hidden md:flex relative overflow-hidden transition-all border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
        
        <div className="p-8 relative z-10">
          <div className="flex items-center mb-10 cursor-pointer transition-transform duration-300 hover:scale-105" onClick={() => navigate('/dashboard')}>
            <img 
              src="./Thrive logo.png" 
              alt="Thrive by Travelomate" 
              className="h-20 w-auto object-contain"
            />
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
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

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-w-0 overflow-y-auto relative ${isDarkMode ? 'bg-[#0F1014]' : 'bg-gray-50'}`}>
        {/* Header */}
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
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-primary'}`}
            >
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

        {/* Flight Booking Content Area */}
        <div className="flex-1 relative flex items-center justify-center p-4 min-h-[calc(100vh-5rem)]">
          {/* Background Image inside main */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/flight-bg.png")' }}
          />
          
          {/* Main Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl backdrop-blur-xl border shadow-2xl p-8 pt-12 mt-8 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-[#0F1014]/100 border-gray-800' 
                : 'bg-white/90 border-gray-100 shadow-gray-0'
            }`}
            style={{ scrollbarWidth: 'thin' }}
          >
        {/* Top Tabs */}
        {/* <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex rounded-2xl overflow-hidden bg-[#1A1B20] border border-gray-800 shadow-xl">
          <button className="flex items-center gap-2 px-12 py-4 bg-primary text-white font-bold transition-colors">
            <Plane size={20} />
            Flight
          </button>
          <button className="flex items-center gap-2 px-12 py-4 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors font-medium">
            <Hotel size={20} />
            Hotel
          </button>
        </div> */}

        {/* Form Content */}
        <div className="space-y-8 mt-4">
          {/* Radio Buttons */}
          <div className="flex items-center gap-8">
            {[
              { id: 'official', label: 'Official Booking' },
              { id: 'guest', label: 'Official Guest' },
              { id: 'personal', label: 'Personal' }
            ].map((type) => (
              <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  bookingType === type.id 
                    ? 'border-primary' 
                    : isDarkMode ? 'border-gray-500 group-hover:border-gray-400' : 'border-gray-300 group-hover:border-gray-400'
                }`}>
                  {bookingType === type.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                </div>
                <span className={`text-sm font-medium ${
                  bookingType === type.id 
                    ? (isDarkMode ? 'text-white' : 'text-secondary') 
                    : (isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700')
                }`}>
                  {type.label}
                </span>
              </label>
            ))}
          </div>

          {/* Select Dropdowns */}
          <div className="flex gap-4">
            <div className="relative w-48">
              <select className={`w-full appearance-none bg-transparent border rounded-xl px-4 py-3 text-sm outline-none cursor-pointer transition-colors ${
                isDarkMode 
                  ? 'border-gray-800 text-white focus:border-gray-600' 
                  : 'border-gray-200 text-secondary focus:border-gray-400'
              }`}>
                <option>Round Trip</option>
                <option>One Way</option>
                <option>Multi-city</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative w-48">
              <select className={`w-full appearance-none bg-transparent border rounded-xl px-4 py-3 text-sm outline-none cursor-pointer transition-colors ${
                isDarkMode 
                  ? 'border-gray-800 text-white focus:border-gray-600' 
                  : 'border-gray-200 text-secondary focus:border-gray-400'
              }`}>
                <option>Economy</option>
                <option>Premium Economy</option>
                <option>Business</option>
                <option>First Class</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative w-48">
              <select className={`w-full appearance-none bg-transparent border rounded-xl px-4 py-3 text-sm outline-none cursor-pointer transition-colors ${
                isDarkMode 
                  ? 'border-gray-800 text-white focus:border-gray-600' 
                  : 'border-gray-200 text-secondary focus:border-gray-400'
              }`}>
                <option>1 Traveller</option>
                <option>2 Travellers</option>
                <option>3 Travellers</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Origin / Destination */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Plane size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-45" />
              <input 
                type="text" 
                placeholder="Origin" 
                className={`w-full bg-transparent border rounded-xl pl-12 pr-4 py-4 text-sm outline-none transition-colors ${
                  isDarkMode 
                    ? 'border-gray-800 text-white focus:border-gray-600' 
                    : 'border-gray-200 text-secondary focus:border-gray-400'
                }`}
                defaultValue="Delhi (DEL)"
              />
            </div>
            <button className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}>
              <ArrowLeftRight size={20} className="text-primary" />
            </button>
            <div className="relative flex-1">
              <Plane size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-[135deg]" />
              <input 
                type="text" 
                placeholder="Destination" 
                className={`w-full bg-transparent border rounded-xl pl-12 pr-4 py-4 text-sm outline-none transition-colors ${
                  isDarkMode 
                    ? 'border-gray-800 text-white focus:border-gray-600' 
                    : 'border-gray-200 text-secondary focus:border-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Dates & Times */}
          <div className="flex gap-4">
            {/* Departure */}
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1">
                <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className={`border rounded-xl pl-12 pr-4 py-2 cursor-text transition-colors ${
                  isDarkMode ? 'border-gray-800 hover:border-gray-600' : 'border-gray-200 hover:border-gray-400'
                }`}>
                  <p className="text-gray-400 text-xs mb-0.5">Departure Date</p>
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-secondary'}`}>Select date</p>
                </div>
              </div>
              <div className="relative flex-1">
                <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className={`border rounded-xl pl-12 pr-4 py-2 cursor-text transition-colors ${
                  isDarkMode ? 'border-gray-800 hover:border-gray-600' : 'border-gray-200 hover:border-gray-400'
                }`}>
                  <p className="text-gray-400 text-xs mb-0.5">Departure Time</p>
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-secondary'}`}>Anytime</p>
                </div>
              </div>
            </div>

            {/* Return */}
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1">
                <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className={`border rounded-xl pl-12 pr-4 py-2 cursor-text transition-colors ${
                  isDarkMode ? 'border-gray-800 hover:border-gray-600' : 'border-gray-200 hover:border-gray-400'
                }`}>
                  <p className="text-gray-400 text-xs mb-0.5">Return Date</p>
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-secondary'}`}>Select date</p>
                </div>
              </div>
              <div className="relative flex-1">
                <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className={`border rounded-xl pl-12 pr-4 py-2 cursor-text transition-colors ${
                  isDarkMode ? 'border-gray-800 hover:border-gray-600' : 'border-gray-200 hover:border-gray-400'
                }`}>
                  <p className="text-gray-400 text-xs mb-0.5">Return Time</p>
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-secondary'}`}>Anytime</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button className="flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors">
              More Options
              <ChevronDown size={16} />
            </button>
            <div className="flex items-center gap-4">
              <button className="px-8 py-3 rounded-xl border border-primary text-primary font-bold hover:bg-primary/5 transition-colors uppercase text-sm tracking-wider">
                Add to Cart
              </button>
              <button className="px-10 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors uppercase text-sm tracking-wider">
                Search
              </button>
            </div>
          </div>
        </div>
      </motion.div>
        </div>
      </main>
    </div>
  );
}
