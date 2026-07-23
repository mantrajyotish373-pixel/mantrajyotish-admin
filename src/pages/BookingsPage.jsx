import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Download, 
  Eye, 
  Plus, 
  X,
  MessageSquare, 
  Phone, 
  Video,
  User,
  Info,
  DollarSign
} from 'lucide-react';

// Bookings Mock Data matching the user's screenshot
const initialBookings = [
  {
    id: '#BK1250',
    user: {
      name: 'Rohit Sharma',
      email: 'rohit@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    },
    astrologer: {
      name: 'Dr. Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    service: 'Chat Session',
    dateTime: {
      date: '25 May 2025',
      time: '10:30 AM'
    },
    status: 'Completed',
    amount: '₹499'
  },
  {
    id: '#BK1249',
    user: {
      name: 'Priya Singh',
      email: 'priya.singh@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    astrologer: {
      name: 'Astro Vikram',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    service: 'Call Session',
    dateTime: {
      date: '25 May 2025',
      time: '09:15 AM'
    },
    status: 'Pending',
    amount: '₹299'
  },
  {
    id: '#BK1248',
    user: {
      name: 'Amit Kumar',
      email: 'amit.kumar@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    astrologer: {
      name: 'Dr. Neha Joshi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
    },
    service: 'Video Call',
    dateTime: {
      date: '24 May 2025',
      time: '07:45 PM'
    },
    status: 'Completed',
    amount: '₹599'
  },
  {
    id: '#BK1247',
    user: {
      name: 'Sneha Patel',
      email: 'sneha.patel@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    },
    astrologer: {
      name: 'Astro Rahul',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop'
    },
    service: 'Chat Session',
    dateTime: {
      date: '24 May 2025',
      time: '06:20 PM'
    },
    status: 'Cancelled',
    amount: '₹499'
  },
  {
    id: '#BK1246',
    user: {
      name: 'Vikash Yadav',
      email: 'vikash.yadav@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    astrologer: {
      name: 'Dr. Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    service: 'Call Session',
    dateTime: {
      date: '24 May 2025',
      time: '04:10 PM'
    },
    status: 'Completed',
    amount: '₹299'
  }
];

const BookingsPage = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states for creating a new booking
  const [newBookingData, setNewBookingData] = useState({
    userName: '',
    userEmail: '',
    astroName: '',
    service: 'Chat Session',
    date: '25 May 2025',
    time: '12:00 PM',
    status: 'Pending',
    amount: '₹299'
  });

  // Calculate quick stats dynamically from current state
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'Pending').length;
    const completed = bookings.filter(b => b.status === 'Completed').length;
    const cancelled = bookings.filter(b => b.status === 'Cancelled').length;
    return { total, pending, completed, cancelled };
  }, [bookings]);

  // Filter lists based on search bar and dropdown filter values
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = 
        booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.astrologer.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Function to download/export list as raw CSV
  const handleExportCSV = () => {
    const headers = ['Booking ID,User Name,User Email,Astrologer Name,Service,Date,Time,Status,Amount\n'];
    const rows = filteredBookings.map(b => 
      `${b.id},"${b.user.name}",${b.user.email},"${b.astrologer.name}","${b.service}",${b.dateTime.date},${b.dateTime.time},${b.status},${b.amount.replace('₹', '')}`
    );
    const blob = new Blob([...headers, ...rows.map(r => r + '\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Bookings_Export_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  // Service icons selector helper
  const renderServiceIcon = (service) => {
    if (service.includes('Chat')) {
      return <MessageSquare size={13} className="text-indigo-600" />;
    } else if (service.includes('Call') || service.includes('Voice')) {
      return <Phone size={13} className="text-emerald-600" />;
    } else {
      return <Video size={13} className="text-rose-600" />;
    }
  };

  // Handle adding new booking record
  const handleAddNewBooking = (e) => {
    e.preventDefault();
    const nextId = `#BK${1250 + bookings.length + 1}`;
    const newRecord = {
      id: nextId,
      user: {
        name: newBookingData.userName || 'Guest User',
        email: newBookingData.userEmail || 'guest@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
      },
      astrologer: {
        name: newBookingData.astroName || 'Dr. Ananya Sharma',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      },
      service: newBookingData.service,
      dateTime: {
        date: newBookingData.date,
        time: newBookingData.time
      },
      status: newBookingData.status,
      amount: newBookingData.amount.startsWith('₹') ? newBookingData.amount : `₹${newBookingData.amount}`
    };

    setBookings([newRecord, ...bookings]);
    setIsAddOpen(false);
    // Reset form states
    setNewBookingData({
      userName: '',
      userEmail: '',
      astroName: '',
      service: 'Chat Session',
      date: '25 May 2025',
      time: '12:00 PM',
      status: 'Pending',
      amount: '₹299'
    });
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header bar and button options */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
            Bookings <span className="text-[#FA5A24]">✨</span>
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">Bookings</span>
          </div>
        </div>

        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FA5A24] text-white rounded-xl text-xs font-bold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200"
        >
          <Plus size={15} />
          <span>New Booking ✨</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: '1,248', trend: '▲ 12.5%', isUp: true, color: 'text-[#FA5A24] bg-[#FFF5F1]', icon: Calendar },
          { label: 'Pending Bookings', value: '142', trend: '▲ 8.2%', isUp: true, color: 'text-amber-500 bg-amber-50', icon: Clock },
          { label: 'Completed Bookings', value: '982', trend: '▲ 15.7%', isUp: true, color: 'text-emerald-500 bg-emerald-50', icon: CheckCircle2 },
          { label: 'Cancelled Bookings', value: '124', trend: '▼ 3.1%', isUp: false, color: 'text-rose-500 bg-rose-50', icon: XCircle }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color} flex-shrink-0`}>
              <item.icon size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{item.label}</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>{item.value}</span>
                <span className={`text-[10px] font-bold ${item.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.trend}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and query options card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-4 justify-between">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Input bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search by booking ID, user name, astrologer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FCFAF8] border border-slate-200 text-xs rounded-xl outline-none focus:border-orange-200 focus:bg-white font-medium text-slate-700 transition-all duration-200"
              />
            </div>

            {/* Date range picker dropdown mockup */}
            <div className="relative w-full sm:w-56">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <select 
                className="w-full pl-9 pr-4 py-2.5 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
              >
                <option>01 May 2025 - 31 May 2025</option>
                <option>Today</option>
                <option>Yesterday</option>
                <option>Last 7 Days</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Status Option selector */}
            <div className="relative w-full sm:w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>
          </div>

          <button 
            onClick={handleExportCSV}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all duration-200"
          >
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Booking ID</th>
                <th className="py-4 px-4">User</th>
                <th className="py-4 px-4">Astrologer</th>
                <th className="py-4 px-4">Service</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-xs text-slate-700">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-4 font-bold text-slate-600 select-text">{booking.id}</td>
                    
                    {/* User profile item */}
                    <td className="py-4.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={booking.user.avatar} 
                          alt={booking.user.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-sm"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{booking.user.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 select-text">{booking.user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Astrologer profile item */}
                    <td className="py-4.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={booking.astrologer.avatar} 
                          alt={booking.astrologer.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-sm"
                        />
                        <span className="font-bold text-slate-800">{booking.astrologer.name}</span>
                      </div>
                    </td>

                    {/* Service type and icon */}
                    <td className="py-4.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                          {renderServiceIcon(booking.service)}
                        </span>
                        <span className="font-semibold text-slate-600">{booking.service}</span>
                      </div>
                    </td>

                    {/* Date and specific schedule time */}
                    <td className="py-4.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{booking.dateTime.date}</span>
                        <span className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">{booking.dateTime.time}</span>
                      </div>
                    </td>

                    {/* Colored Status badges */}
                    <td className="py-4.5 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wider ${
                        booking.status === 'Completed'
                          ? 'bg-[#E6F4EA] text-[#137333]'
                          : booking.status === 'Pending'
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {booking.status}
                      </span>
                    </td>

                    {/* Transaction price */}
                    <td className="py-4.5 px-4 font-extrabold text-slate-800">{booking.amount}</td>
                    
                    {/* View options button */}
                    <td className="py-4.5 px-4 text-center">
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 border border-slate-200 hover:bg-[#FA5A24]/5 hover:border-[#FA5A24]/30 text-slate-400 hover:text-[#FA5A24] rounded-lg transition-colors inline-flex items-center justify-center"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 font-bold">
                    No bookings found matching your filter selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-bold">
            Showing 1 to {filteredBookings.length} of {bookings.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-400 text-xs font-extrabold hover:bg-slate-50">&lt;</button>
            <button className="px-3.5 py-1.5 bg-[#FA5A24] text-white rounded-lg text-xs font-extrabold shadow-sm">1</button>
            <button className="px-3.5 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-xs font-extrabold hover:bg-slate-50">2</button>
            <button className="px-3.5 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-xs font-extrabold hover:bg-slate-50">3</button>
            <button className="px-3.5 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-xs font-extrabold hover:bg-slate-50">4</button>
            <button className="px-3.5 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-xs font-extrabold hover:bg-slate-50">5</button>
            <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-400 text-xs font-extrabold hover:bg-slate-50">&gt;</button>
          </div>
        </div>
      </div>

      {/* Booking Details View Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-[#FA5A24]" />
                <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>Booking Information</h3>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs font-semibold text-slate-600">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span>Booking ID</span>
                <span className="font-extrabold text-slate-800">{selectedBooking.id}</span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">User Details</span>
                <div className="flex items-center gap-3 bg-[#FCFAF8] p-3 rounded-xl border border-slate-100/50">
                  <img src={selectedBooking.user.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="User avatar" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{selectedBooking.user.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{selectedBooking.user.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Astrologer Details</span>
                <div className="flex items-center gap-3 bg-[#FCFAF8] p-3 rounded-xl border border-slate-100/50">
                  <img src={selectedBooking.astrologer.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="Astro avatar" />
                  <span className="font-bold text-slate-800">{selectedBooking.astrologer.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[9px] text-slate-400 block uppercase">Service</span>
                  <span className="font-bold text-slate-800 block mt-1">{selectedBooking.service}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[9px] text-slate-400 block uppercase">Scheduled Time</span>
                  <span className="font-bold text-slate-800 block mt-1">{selectedBooking.dateTime.date} - {selectedBooking.dateTime.time}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[9px] text-slate-400 block uppercase">Price Amount</span>
                  <span className="font-extrabold text-slate-850 block mt-1">{selectedBooking.amount}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[9px] text-slate-400 block uppercase">Status</span>
                  <span className={`inline-flex px-2.5 py-1 rounded text-[9px] font-extrabold mt-1.5 ${
                    selectedBooking.status === 'Completed'
                      ? 'bg-[#E6F4EA] text-[#137333]'
                      : selectedBooking.status === 'Pending'
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : 'bg-red-50 text-red-600'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-5 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2.5 bg-slate-800 text-white hover:bg-slate-700 rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Form Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddNewBooking} className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plus size={16} className="text-[#FA5A24]" />
                <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>Create New Booking</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs font-semibold text-slate-600 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">User Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter user name"
                  value={newBookingData.userName}
                  onChange={(e) => setNewBookingData({...newBookingData, userName: e.target.value})}
                  className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">User Email *</label>
                <input 
                  type="email" 
                  required
                  placeholder="user@gmail.com"
                  value={newBookingData.userEmail}
                  onChange={(e) => setNewBookingData({...newBookingData, userEmail: e.target.value})}
                  className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Assign Astrologer *</label>
                <select 
                  value={newBookingData.astroName}
                  onChange={(e) => setNewBookingData({...newBookingData, astroName: e.target.value})}
                  className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-bold text-slate-750"
                >
                  <option value="Dr. Ananya Sharma">Dr. Ananya Sharma</option>
                  <option value="Astro Vikram">Astro Vikram</option>
                  <option value="Dr. Neha Joshi">Dr. Neha Joshi</option>
                  <option value="Astro Rahul">Astro Rahul</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Service Mode *</label>
                  <select 
                    value={newBookingData.service}
                    onChange={(e) => setNewBookingData({...newBookingData, service: e.target.value})}
                    className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-bold text-slate-750"
                  >
                    <option value="Chat Session">Chat Session</option>
                    <option value="Call Session">Call Session</option>
                    <option value="Video Call">Video Call</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Amount Price *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="₹299"
                    value={newBookingData.amount}
                    onChange={(e) => setNewBookingData({...newBookingData, amount: e.target.value})}
                    className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Date *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="25 May 2025"
                    value={newBookingData.date}
                    onChange={(e) => setNewBookingData({...newBookingData, date: e.target.value})}
                    className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Time Slot *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="12:00 PM"
                    value={newBookingData.time}
                    onChange={(e) => setNewBookingData({...newBookingData, time: e.target.value})}
                    className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Initial Status *</label>
                <select 
                  value={newBookingData.status}
                  onChange={(e) => setNewBookingData({...newBookingData, status: e.target.value})}
                  className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-bold text-slate-750"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-slate-100 bg-slate-50/50">
              <button 
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 bg-[#FA5A24] text-white hover:bg-orange-600 rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                Save Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
