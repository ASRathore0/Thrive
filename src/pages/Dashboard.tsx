import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  Plus,
  Calendar,
  MapPin,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  X,
  CreditCard,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookingData, setBookingData] = useState({
    type: 'flight',
    origin: '',
    destination: '',
    date: ''
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: History },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'sports', label: 'Sports Tours', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleStartBooking = (type = 'flight') => {
    if (type === 'flight') {
      navigate('/flight-booking');
      return;
    }
    if (type === 'hotel') {
      navigate('/hotel-booking');
      return;
    }
    setBookingData({ ...bookingData, type });
    setBookingStep(1);
    setIsBookingModalOpen(true);
  };

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (id === 'flights') navigate('/flight-booking');
    if (id === 'hotels') navigate('/hotel-booking');
  };

  const nextStep = () => setBookingStep(prev => prev + 1);

  useEffect(() => {
    if (isBookingModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isBookingModalOpen]);

  return (
    <div className="flex h-screen bg-white overflow-hidden text-secondary">
      {/* Sidebar - adding a subtle gradient for depth */}
      <aside className="w-72 bg-secondary text-white flex flex-col hidden md:flex relative overflow-hidden transition-all border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
        
        <div className="p-8 relative z-10">
          <div className="flex items-center mb-10 cursor-pointer transition-transform duration-300 hover:scale-105" onClick={() => window.location.reload()}>
            <img 
              src="/Thrive logo.png" 
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
      <main className={`flex-1 flex flex-col min-w-0 overflow-y-auto relative ${isDarkMode ? 'bg-[#0F1014] text-white' : 'bg-gray-50/50 text-secondary'}`}>
        {/* Subtle Background Visuals */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-[10%] -right-[5%] w-[80%] h-[80%] bg-no-repeat bg-contain opacity-[0.04] mix-blend-multiply"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")' }}
          />
          <div className={`absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b ${isDarkMode ? 'from-[#0F1014] via-[#0F1014]/80' : 'from-white via-white/80'} to-transparent`} />
          
          {/* Abstract Grid Pattern */}
          <div className={`absolute inset-0 ${isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.015]'}`} style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #EE1C25 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          {/* Large decorative "T" watermark */}
          <div className={`absolute top-40 right-[-10rem] rotate-12 select-none ${isDarkMode ? 'opacity-[0.01] text-white' : 'opacity-[0.02] text-secondary'}`}>
            <span className="text-[60rem] font-black leading-none">T</span>
          </div>
        </div>

        {/* Header */}
        <header className={`h-20 min-h-[5rem] flex-shrink-0 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20 ${
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

        <div className="p-8 space-y-8 relative z-10">
          {/* Welcome Area */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-4xl font-bold tracking-tight mb-2">Welcome back, Anurag</h2>
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center">
                      <Plane className="w-3 h-3 text-primary" />
                    </div>
                    <span>You have <span className="font-bold text-secondary">2 upcoming</span> corporate trips this month.</span>
                  </div>
                </motion.div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartBooking()}
                className="bg-primary hover:bg-primary-dark text-white px-7 py-3.5 rounded-[22px] font-bold flex items-center gap-2 transition-all shadow-[0_15px_30px_-5px_rgba(238,28,37,0.4)] group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                Plan New Trip
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'flight', label: 'Book Flight', icon: Plane, color: 'bg-blue-600', img: 'https://photos.flightaware.com/photos/retriever/547e8960441e03c1f85309c6078452664e677ee6' },
                { id: 'hotel', label: 'Book Hotel', icon: Hotel, color: 'bg-secondary', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop' },
                { id: 'sports', label: 'Sports Package', icon: Trophy, color: 'bg-primary', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop' },
                { id: 'transport', label: 'VIP Transfer', icon: MapPin, color: 'bg-zinc-800', img: 'https://vipvitotravel.com.tr/wp-content/uploads/2025/06/airport-transferr.jpg' },
              ].map((item, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
                  onClick={() => handleStartBooking(item.id)}
                  className="relative h-56 rounded-[32px] overflow-hidden group text-left border border-white/40 shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all"
                >
                  <img src={item.img} className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={item.label} />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent group-hover:from-secondary group-hover:via-secondary/60 transition-all duration-500" />
                  
                  <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-start gap-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className={`${item.color} w-10 h-10 rounded-xl text-white shadow-xl flex items-center justify-center backdrop-blur-md`}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <span className="text-2xl font-black text-white tracking-tighter leading-none block">{item.label}</span>
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">Request concierge</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Trips & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            {/* Upcoming Trips */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <div className="w-2 h-6 bg-primary rounded-full" />
                  Upcoming Corporate Trips
                </h3>
                <button className="text-sm font-semibold text-primary hover:underline px-4 py-2 hover:bg-primary/5 rounded-lg transition-all">View all</button>
              </div>
              
              <div className="space-y-4">
                {[
                  { dest: 'London, UK', date: 'May 24 - May 28', type: 'Business Conference', status: 'Confirmed', price: '$1,240' },
                  { dest: 'Dubai, UAE', date: 'June 12 - June 15', type: 'Sales Meeting', status: 'Pending Approval', price: '$890' },
                ].map((trip, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-16 shrink-0">
                        <div className="absolute inset-0 bg-primary/5 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                        <div className="relative w-full h-full rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center text-secondary">
                          <Calendar size={20} className="mb-0.5 text-primary" />
                          <span className="text-[10px] font-extrabold uppercase tracking-tighter">MAY</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-xl group-hover:text-primary transition-colors">{trip.dest}</p>
                        <p className="text-sm text-gray-500 font-medium">{trip.date} • {trip.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-lg font-bold">{trip.price}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Est. Cost</p>
                      </div>
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold ${
                        trip.status === 'Confirmed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {trip.status}
                      </span>
                      <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Sports Tours */}
              <div className="pt-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <div className="w-2 h-6 bg-secondary rounded-full" />
                    Sports Travel Highlights
                  </h3>
                  <button className="text-sm font-semibold text-secondary hover:underline px-4 py-2 hover:bg-secondary/5 rounded-lg transition-all">Explore all tours</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative h-64 rounded-[40px] overflow-hidden group cursor-pointer shadow-xl"
                  >
                    <img 
                      src="https://img-cdn.publive.online/fit-in/640x360/filters:format(webp)/socialsamosa/media/media_files/2026/02/05/53-2-2026-02-05-18-37-19.jpg" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt="T20 World Cup"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                    <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/30">
                      <p className="text-xs font-bold text-white uppercase tracking-widest">Limited Slots</p>
                    </div>
                    <div className="absolute bottom-8 left-8 text-white">
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2 px-2 border-l-2 border-primary">Cricket</p>
                      <h4 className="font-extrabold text-2xl mb-1">T20 World Cup 2026</h4>
                      <p className="text-sm text-gray-300 font-medium">Official Hospitality & VIP Concierge</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="relative h-64 rounded-[40px] overflow-hidden group cursor-pointer shadow-xl"
                  >
                    <img 
                      src="https://www.proxcskiing.com/wp-content/uploads/2026/02/Feature5226fv0141-1024x683.jpg" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt="Olympic Games"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                    <div className="absolute bottom-8 left-8 text-white">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 px-2 border-l-2 border-blue-400">Multi-Sport</p>
                      <h4 className="font-extrabold text-2xl mb-1">Winter Olympics</h4>
                      <p className="text-sm text-gray-300 font-medium">Elite Team Logistics & Accommodation</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Right Column / Sidebar Insights */}
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-secondary text-white p-8 rounded-[48px] relative overflow-hidden shadow-2xl"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="p-2 bg-primary rounded-xl text-white">
                      <TrendingUp size={20} />
                    </div>
                    <h4 className="font-bold tracking-tight">Travel ROI Savings</h4>
                  </div>
                  <div className="mb-10">
                    <p className="text-5xl font-bold mb-1 tracking-tighter text-white">$4,280</p>
                    <p className="text-sm text-gray-400 font-medium">Total quarterly savings with Thrive</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                      <span>Efficiency Goal</span>
                      <span className="text-primary">75%</span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary rounded-full relative shadow-[0_0_20px_rgba(238,28,37,0.5)]" 
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-6">Next audit in 12 days</p>
                </div>
                {/* Abstract background for card */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white p-8 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Compliance</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Policy Engine</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[
                    { label: 'In-Policy Bookings', value: '92%', color: 'text-green-600' },
                    { label: 'Pre-Approval Rate', value: '100%', color: 'text-secondary' },
                    { label: 'Carbon Neutrality', value: '12%', color: 'text-blue-600' },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center group cursor-pointer">
                      <span className="text-sm font-medium text-gray-500 group-hover:text-secondary transition-colors italic">{stat.label}</span>
                      <span className={`font-extrabold text-xl ${stat.color} tracking-tight`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-10 py-4 rounded-[20px] bg-gray-50 text-secondary text-sm font-bold hover:bg-secondary hover:text-white transition-all shadow-sm">
                  Generate Analytical Report
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal Overlay */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px] z-50"
            >
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-6 right-6 z-20 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>

              {/* Sidebar Info */}
              <div className="w-full md:w-72 bg-gray-900 p-8 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                   <Plane size={240} />
                </div>
                
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                    <span className="font-black text-xl">T</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">New {bookingData.type === 'flight' ? 'Flight' : bookingData.type === 'hotel' ? 'Hotel' : 'Booking'}</h3>
                  <p className="text-gray-400 text-sm">Follow the Thrive policy guidelines for maximum ROI savings.</p>
                </div>

                <div className="relative z-10 space-y-4">
                  {[
                    { s: 1, l: 'Trip Details' },
                    { s: 2, l: 'Review & Policy' },
                    { s: 3, l: 'Confirmation' }
                  ].map((step) => (
                    <div key={step.s} className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${bookingStep >= step.s ? 'bg-primary ring-4 ring-primary/20' : 'bg-gray-700'}`} />
                      <span className={`text-sm font-bold transition-colors ${bookingStep === step.s ? 'text-white' : 'text-gray-500'}`}>{step.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 bg-white p-12 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {bookingStep === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h4 className="text-3xl font-black mb-1 tracking-tight">Where are we going?</h4>
                        <p className="text-gray-500">Enter your trip specifics below for AI-optimized routing.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Origin</label>
                          <div className="relative">
                            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                            <input 
                              placeholder="New Delhi (DEL)"
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:bg-white outline-none transition-all font-medium"
                              value={bookingData.origin}
                              onChange={e => setBookingData({...bookingData, origin: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Destination</label>
                          <div className="relative">
                            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                            <input 
                              placeholder="London (LHR)"
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:bg-white outline-none transition-all font-medium"
                              value={bookingData.destination}
                              onChange={e => setBookingData({...bookingData, destination: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Dates</label>
                        <div className="relative">
                          <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                          <input 
                            type="date"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:bg-white outline-none transition-all font-medium"
                            value={bookingData.date}
                            onChange={e => setBookingData({...bookingData, date: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="pt-8 flex justify-between items-center border-t border-gray-100">
                         <div className="flex items-center gap-2">
                            <ShieldCheck className="text-green-500 w-4 h-4" />
                            <p className="text-xs text-gray-400 font-medium">Policy-aware routing is active.</p>
                         </div>
                         <button 
                          onClick={nextStep}
                          className="bg-secondary text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-primary transition-all shadow-xl shadow-secondary/10"
                         >
                           Continue
                           <ChevronRight size={18} />
                         </button>
                      </div>
                    </motion.div>
                  )}

                  {bookingStep === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="bg-green-50 p-6 rounded-[32px] border border-green-100 flex items-start gap-4">
                        <div className="shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <h5 className="font-black text-green-900 tracking-tight">Policy Compliant</h5>
                          <p className="text-sm text-green-700/80 font-medium">Great news! This trip fits within your corporate travel policy. AI-approval is ready.</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-8 rounded-[40px] space-y-5 border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-5">
                          <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Route / Destination</span>
                          <span className="font-black text-lg">{bookingData.origin || 'DEL'} <ChevronRight className="inline mx-2 text-gray-300" size={16} /> {bookingData.destination || 'LHR'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-5">
                          <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Departure Date</span>
                          <span className="font-black text-lg">{bookingData.date || '2024-05-28'}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <div className="flex flex-col">
                            <span className="text-secondary font-black text-2xl tracking-tighter">Estimated Total</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Taxes and fees included</span>
                          </div>
                          <span className="font-black text-4xl text-primary tracking-tighter">$1,142<span className="text-lg">.50</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-5 bg-blue-50/50 border border-blue-100 rounded-3xl">
                         <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                            <CreditCard size={20} />
                         </div>
                         <div>
                            <p className="text-sm font-black text-blue-900 leading-tight">Corporate Method</p>
                            <p className="text-xs font-bold text-blue-600/70 uppercase tracking-widest">Visa ending in 4282</p>
                         </div>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => setBookingStep(1)}
                          className="flex-1 bg-gray-100 py-5 rounded-[22px] text-gray-500 font-black text-lg hover:bg-gray-200 transition-all border border-transparent"
                        >
                          Go Back
                        </button>
                        <button 
                          onClick={nextStep}
                          className="flex-[2] bg-primary py-5 rounded-[22px] text-white font-black text-lg shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all"
                        >
                          Finalize Booking
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {bookingStep === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-8 py-10"
                    >
                      <div className="w-32 h-32 bg-green-100 rounded-[44px] flex items-center justify-center text-green-600 relative overflow-hidden group shadow-2xl shadow-green-600/10">
                         <motion.div 
                           initial={{ scale: 0, rotate: -45 }}
                           animate={{ scale: 1, rotate: 0 }}
                           transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                         >
                           <CheckCircle2 size={72} />
                         </motion.div>
                         <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 to-transparent animate-pulse" />
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-4xl font-black tracking-tight text-secondary">Trip Secured!</h4>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium leading-relaxed italic">
                          "Travel intelligence, Human at the core"
                        </p>
                        <p className="text-sm text-gray-400 max-w-xs mx-auto">
                           Confirmation #THV-9284-B. Your itinerary is sync'd to your corporate calendar.
                        </p>
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <button 
                          className="flex-1 px-8 py-4 bg-gray-50 text-secondary border border-gray-100 rounded-2xl font-black hover:bg-gray-100 transition-all text-sm"
                        >
                          Download PDF
                        </button>
                        <button 
                          onClick={() => setIsBookingModalOpen(false)}
                          className="flex-1 px-8 py-4 bg-secondary text-white rounded-2xl font-black hover:shadow-2xl hover:scale-105 transition-all text-sm"
                        >
                          Dashboard
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
