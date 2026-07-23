import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Download, 
  Eye, 
  X,
  Calendar,
  User,
  Info,
  DollarSign,
  Send
} from 'lucide-react';

// Chats History Mock Data matching the design pattern
const initialChats = [
  {
    id: '#CH1250',
    user: {
      name: 'Rohit Sharma',
      email: 'rohit@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    },
    astrologer: {
      name: 'Dr. Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    duration: '24 Min',
    dateTime: {
      date: '25 May 2025',
      time: '10:30 AM'
    },
    status: 'Completed',
    amount: '₹499',
    messages: [
      { sender: 'user', text: 'Hello maam, I wanted to ask about my career change. Should I switch jobs now?', time: '10:30 AM' },
      { sender: 'astro', text: 'Namaste Rohit, let me look at your chart. Please share your birth place and exact birth time details.', time: '10:31 AM' },
      { sender: 'user', text: 'Delhi, India. Birth time is exactly 04:32 PM, 12th March 1994.', time: '10:31 AM' },
      { sender: 'astro', text: 'Thank you. Currently you are running Saturn Mahadasha. A job switch after August 2025 will be very beneficial. Avoid making sudden decisions now.', time: '10:33 AM' },
      { sender: 'user', text: 'Okay thank you! Will keep that in mind.', time: '10:34 AM' }
    ]
  },
  {
    id: '#CH1249',
    user: {
      name: 'Priya Singh',
      email: 'priya.singh@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    astrologer: {
      name: 'Astro Vikram',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    duration: '12 Min',
    dateTime: {
      date: '25 May 2025',
      time: '09:15 AM'
    },
    status: 'Active',
    amount: '₹299',
    messages: [
      { sender: 'user', text: 'Hi, will I get my visa approval this month?', time: '09:15 AM' },
      { sender: 'astro', text: 'Hello Priya, yes, transit of Jupiter indicates favorable travel patterns. Visa should be approved by next week.', time: '09:16 AM' }
    ]
  },
  {
    id: '#CH1248',
    user: {
      name: 'Amit Kumar',
      email: 'amit.kumar@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    astrologer: {
      name: 'Dr. Neha Joshi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
    },
    duration: '30 Min',
    dateTime: {
      date: '24 May 2025',
      time: '07:45 PM'
    },
    status: 'Completed',
    amount: '₹599',
    messages: [
      { sender: 'user', text: 'Astro Neha ji, please predict my marriage timing.', time: '07:45 PM' },
      { sender: 'astro', text: 'Namaste Amit, 7th lord Venus placement suggests marriage is highly likely between October 2025 and January 2026.', time: '07:47 PM' }
    ]
  },
  {
    id: '#CH1247',
    user: {
      name: 'Sneha Patel',
      email: 'sneha.patel@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    },
    astrologer: {
      name: 'Astro Rahul',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop'
    },
    duration: '0 Min',
    dateTime: {
      date: '24 May 2025',
      time: '06:20 PM'
    },
    status: 'Missed',
    amount: '₹0',
    messages: []
  },
  {
    id: '#CH1246',
    user: {
      name: 'Vikash Yadav',
      email: 'vikash.yadav@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    astrologer: {
      name: 'Dr. Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    duration: '15 Min',
    dateTime: {
      date: '24 May 2025',
      time: '04:10 PM'
    },
    status: 'Completed',
    amount: '₹299',
    messages: [
      { sender: 'user', text: 'Hello, what gemstone is good for my health?', time: '04:10 PM' },
      { sender: 'astro', text: 'Namaste, wearing a Ruby (Manik) on your ring finger will strengthen the Sun in your chart and improve overall vitality.', time: '04:12 PM' }
    ]
  }
];

const ChatsPage = () => {
  const [chats, setChats] = useState(initialChats);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedChat, setSelectedChat] = useState(null);

  // Dynamic statistics
  const stats = useMemo(() => {
    const total = chats.length;
    const active = chats.filter(c => c.status === 'Active').length;
    const completed = chats.filter(c => c.status === 'Completed').length;
    const missed = chats.filter(c => c.status === 'Missed').length;
    return { total, active, completed, missed };
  }, [chats]);

  // Filters logic
  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const matchesSearch = 
        chat.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.astrologer.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || chat.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [chats, searchQuery, statusFilter]);

  // CSV export
  const handleExportCSV = () => {
    const headers = ['Chat ID,User Name,User Email,Astrologer Name,Duration,Date,Time,Status,AmountSpent\n'];
    const rows = filteredChats.map(c => 
      `${c.id},"${c.user.name}",${c.user.email},"${c.astrologer.name}",${c.duration},${c.dateTime.date},${c.dateTime.time},${c.status},${c.amount.replace('₹', '')}`
    );
    const blob = new Blob([...headers, ...rows.map(r => r + '\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Chats_History_Export_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
            Chats <span className="text-[#FA5A24]">✨</span>
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">Chats</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Chats', value: '2,548', trend: '▲ 14.2%', isUp: true, color: 'text-indigo-500 bg-indigo-50', icon: MessageSquare },
          { label: 'Active Chats', value: '42', trend: '▲ 5.5%', isUp: true, color: 'text-amber-500 bg-amber-50', icon: Clock },
          { label: 'Completed Chats', value: '2,356', trend: '▲ 16.1%', isUp: true, color: 'text-emerald-500 bg-emerald-50', icon: CheckCircle2 },
          { label: 'Missed Chats', value: '150', trend: '▼ 1.8%', isUp: false, color: 'text-rose-500 bg-rose-50', icon: XCircle }
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

      {/* Filter Options */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-4 justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Input bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search by chat ID, user name, astrologer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FCFAF8] border border-slate-200 text-xs rounded-xl outline-none focus:border-orange-200 focus:bg-white font-medium text-slate-700 transition-all duration-200"
              />
            </div>

            {/* Date select mock */}
            <div className="relative w-full sm:w-56">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <select 
                className="w-full pl-9 pr-4 py-2.5 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
              >
                <option>01 May 2025 - 31 May 2025</option>
                <option>Today</option>
                <option>Yesterday</option>
                <option>Last 7 days</option>
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
                <option value="Active">Active</option>
                <option value="Missed">Missed</option>
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
                <th className="py-4 px-4">Chat ID</th>
                <th className="py-4 px-4">User</th>
                <th className="py-4 px-4">Astrologer</th>
                <th className="py-4 px-4">Duration</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Amount Spent</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-xs text-slate-700">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <tr key={chat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-4 font-bold text-slate-600 select-text">{chat.id}</td>
                    
                    {/* User profile item */}
                    <td className="py-4.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={chat.user.avatar} 
                          alt={chat.user.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-sm"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{chat.user.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 select-text">{chat.user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Astrologer profile item */}
                    <td className="py-4.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={chat.astrologer.avatar} 
                          alt={chat.astrologer.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-sm"
                        />
                        <span className="font-bold text-slate-800">{chat.astrologer.name}</span>
                      </div>
                    </td>

                    {/* Duration of active session */}
                    <td className="py-4.5 px-4 font-semibold text-slate-600">
                      {chat.duration}
                    </td>

                    {/* Date and specific schedule time */}
                    <td className="py-4.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{chat.dateTime.date}</span>
                        <span className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">{chat.dateTime.time}</span>
                      </div>
                    </td>

                    {/* Colored Status badges */}
                    <td className="py-4.5 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wider ${
                        chat.status === 'Completed'
                          ? 'bg-[#E6F4EA] text-[#137333]'
                          : chat.status === 'Active'
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {chat.status}
                      </span>
                    </td>

                    {/* Transaction price */}
                    <td className="py-4.5 px-4 font-extrabold text-slate-800">{chat.amount}</td>
                    
                    {/* View options button */}
                    <td className="py-4.5 px-4 text-center">
                      <button 
                        onClick={() => setSelectedChat(chat)}
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
                    No chat history records match your selection query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-bold">
            Showing 1 to {filteredChats.length} of {chats.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-400 text-xs font-extrabold hover:bg-slate-50">&lt;</button>
            <button className="px-3.5 py-1.5 bg-[#FA5A24] text-white rounded-lg text-xs font-extrabold shadow-sm">1</button>
            <button className="px-3.5 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-xs font-extrabold hover:bg-slate-50">2</button>
            <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-400 text-xs font-extrabold hover:bg-slate-50">&gt;</button>
          </div>
        </div>
      </div>

      {/* Chat Details and Transcript Viewer Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden flex flex-col h-[80vh] max-h-[680px] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#FA5A24]" />
                <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>Chat Logs #{selectedChat.id.replace('#', '')}</h3>
              </div>
              <button 
                onClick={() => setSelectedChat(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Info Summary Row */}
            <div className="bg-[#FCFAF8] p-4 border-b border-slate-100 flex-shrink-0 grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-500">
              <div>
                <span className="block text-slate-400 font-medium">USER</span>
                <span className="text-slate-800 block mt-0.5">{selectedChat.user.name}</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="block text-slate-400 font-medium">ASTROLOGER</span>
                <span className="text-slate-800 block mt-0.5">{selectedChat.astrologer.name}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">DURATION / PRICE</span>
                <span className="text-slate-800 block mt-0.5">{selectedChat.duration} / {selectedChat.amount}</span>
              </div>
            </div>
            
            {/* Scrollable Live Chat Transcript Log Body */}
            <div className="flex-1 overflow-y-auto p-5 bg-[#FAF9F6] space-y-4">
              <div className="text-center my-2">
                <span className="inline-block px-3 py-1 bg-slate-200/50 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Session Date: {selectedChat.dateTime.date} {selectedChat.dateTime.time}
                </span>
              </div>

              {selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((msg, index) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div 
                      key={index} 
                      className={`flex flex-col max-w-[85%] ${
                        isUser ? 'mr-auto items-start' : 'ml-auto items-end'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[9px] font-bold text-slate-400">
                        {isUser ? (
                          <>
                            <img src={selectedChat.user.avatar} className="w-3.5 h-3.5 rounded-full object-cover" alt="" />
                            <span>{selectedChat.user.name}</span>
                          </>
                        ) : (
                          <>
                            <span>{selectedChat.astrologer.name}</span>
                            <img src={selectedChat.astrologer.avatar} className="w-3.5 h-3.5 rounded-full object-cover" alt="" />
                          </>
                        )}
                      </div>
                      <div className={`p-3 rounded-2xl text-[11px] font-semibold leading-relaxed shadow-sm ${
                        isUser 
                          ? 'bg-white text-slate-700 border border-slate-100 rounded-tl-none' 
                          : 'bg-[#FA5A24] text-white rounded-tr-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-slate-400 font-semibold mt-1 px-1">{msg.time}</span>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2 py-16">
                  <XCircle size={32} className="text-slate-300" />
                  <span className="font-bold text-xs">No chat transcript available for missed sessions.</span>
                </div>
              )}
            </div>

            {/* Modal Action Footer */}
            <div className="flex justify-end p-5 border-t border-slate-100 bg-white flex-shrink-0">
              <button 
                onClick={() => setSelectedChat(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatsPage;
