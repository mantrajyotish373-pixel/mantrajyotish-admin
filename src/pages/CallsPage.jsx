import React, { useState, useMemo } from 'react';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneMissed, 
  PhoneCall,
  Video, 
  Calendar, 
  Clock, 
  Eye, 
  X, 
  Download, 
  Search,
  User,
  MapPin,
  Mail,
  VideoOff,
  PhoneOff,
  CheckCircle
} from 'lucide-react';

// Call list mock data matching your screenshot details
const initialCalls = [
  {
    id: 1,
    user: {
      name: 'Rohit Sharma',
      phone: '+91 98765 43210',
      email: 'rohit@gmail.com',
      location: 'Jaipur, Rajasthan',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      isOnline: true
    },
    astrologer: {
      name: 'Dr. Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    callType: 'Video Call',
    dateTime: {
      date: '25 May 2025',
      time: '10:30 AM'
    },
    duration: '30 Min',
    status: 'Upcoming'
  },
  {
    id: 2,
    user: {
      name: 'Priya Singh',
      phone: '+91 87654 32109',
      email: 'priya.singh@gmail.com',
      location: 'Lucknow, Uttar Pradesh',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      isOnline: true
    },
    astrologer: {
      name: 'Astro Vikram',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    callType: 'Audio Call',
    dateTime: {
      date: '25 May 2025',
      time: '11:15 AM'
    },
    duration: '20 Min',
    status: 'Upcoming'
  },
  {
    id: 3,
    user: {
      name: 'Amit Kumar',
      phone: '+91 76543 21098',
      email: 'amit.kumar@gmail.com',
      location: 'Patna, Bihar',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      isOnline: false
    },
    astrologer: {
      name: 'Dr. Neha Joshi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
    },
    callType: 'Video Call',
    dateTime: {
      date: '25 May 2025',
      time: '12:00 PM'
    },
    duration: '30 Min',
    status: 'Upcoming'
  },
  {
    id: 4,
    user: {
      name: 'Sneha Patel',
      phone: '+91 65432 10987',
      email: 'sneha.patel@gmail.com',
      location: 'Ahmedabad, Gujarat',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      isOnline: true
    },
    astrologer: {
      name: 'Astro Rahul',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop'
    },
    callType: 'Audio Call',
    dateTime: {
      date: '25 May 2025',
      time: '02:30 PM'
    },
    duration: '20 Min',
    status: 'Upcoming'
  },
  {
    id: 5,
    user: {
      name: 'Vikash Yadav',
      phone: '+91 54321 09876',
      email: 'vikash.yadav@gmail.com',
      location: 'Ranchi, Jharkhand',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      isOnline: false
    },
    astrologer: {
      name: 'Dr. Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    callType: 'Video Call',
    dateTime: {
      date: '25 May 2025',
      time: '04:00 PM'
    },
    duration: '30 Min',
    status: 'Upcoming'
  },
  {
    id: 6,
    user: {
      name: 'Neha Joshi',
      phone: '+91 43210 98765',
      email: 'neha.joshi@gmail.com',
      location: 'Pune, Maharashtra',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      isOnline: true
    },
    astrologer: {
      name: 'Astro Vikram',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    callType: 'Audio Call',
    dateTime: {
      date: '25 May 2025',
      time: '05:30 PM'
    },
    duration: '20 Min',
    status: 'Upcoming'
  }
];

const CallsPage = () => {
  const [calls, setCalls] = useState(initialCalls);
  const [searchQuery, setSearchQuery] = useState('');
  const [callTypeFilter, setCallTypeFilter] = useState('All');
  const [activeSubTab, setActiveSubTab] = useState('Upcoming Calls');
  
  // Set first row as selected call details by default (just like screenshot)
  const [selectedCall, setSelectedCall] = useState(initialCalls[0]);

  // Filtering calls based on sub-tab navigation and query options
  const filteredCalls = useMemo(() => {
    return calls.filter(call => {
      // Search
      const matchesSearch = 
        call.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.user.phone.includes(searchQuery) ||
        call.astrologer.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Call type
      const matchesType = callTypeFilter === 'All' || call.callType === callTypeFilter;

      // Sub tabs mapping
      let matchesTab = true;
      if (activeSubTab === 'Upcoming Calls') {
        matchesTab = call.status === 'Upcoming';
      } else if (activeSubTab === 'Missed Calls') {
        matchesTab = call.status === 'Missed';
      } else if (activeSubTab === 'Completed Calls') {
        matchesTab = call.status === 'Completed';
      }

      return matchesSearch && matchesType && matchesTab;
    });
  }, [calls, searchQuery, callTypeFilter, activeSubTab]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Call ID,User Name,User Phone,Astrologer Name,Call Type,Date,Time,Duration,Status\n'];
    const rows = filteredCalls.map(c => 
      `${c.id},"${c.user.name}",${c.user.phone},"${c.astrologer.name}","${c.callType}",${c.dateTime.date},${c.dateTime.time},${c.duration},${c.status}`
    );
    const blob = new Blob([...headers, ...rows.map(r => r + '\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Calls_History_Export_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full w-full select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 flex-shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
            Calls <span className="text-[#FA5A24]">✨</span>
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">Calls</span>
          </div>
        </div>
      </div>

      {/* Main Split Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch overflow-hidden w-full min-h-0">
        
        {/* Left Side: Table & Filters */}
        <div className="flex-grow flex flex-col overflow-hidden min-h-0 bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
          
          {/* Header Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 flex-shrink-0">
            {[
              { label: 'Total Calls', value: '1,450', percent: '▲ 12.5%', color: 'bg-orange-50 text-orange-500', icon: PhoneCall },
              { label: 'Upcoming Calls', value: '320', percent: '▲ 10.2%', color: 'bg-emerald-50 text-emerald-600', icon: PhoneIncoming },
              { label: 'Missed Calls', value: '86', percent: '▼ 8.6%', color: 'bg-rose-50 text-rose-500', icon: PhoneMissed },
              { label: 'Completed Calls', value: '1,044', percent: '▲ 15.3%', color: 'bg-amber-50 text-amber-500', icon: CheckCircle }
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-50/50 border border-slate-100/60 rounded-xl p-3.5 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color} flex-shrink-0`}>
                  <stat.icon size={16} />
                </div>
                <div>
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-extrabold text-slate-800" style={{ fontFamily: 'Outfit' }}>{stat.value}</span>
                    <span className="text-[8px] font-extrabold text-slate-400">{stat.percent}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filtering bar */}
          <div className="flex flex-col md:flex-row items-center gap-3 justify-between mb-5 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              
              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search by user name, astrologer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#FCFAF8] border border-slate-200 text-xs rounded-xl outline-none focus:border-orange-200 focus:bg-white font-medium text-slate-700 transition-all duration-200"
                />
              </div>

              {/* Date dropdown mock */}
              <div className="relative w-full sm:w-48">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <select className="w-full pl-8 pr-4 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow">
                  <option>01 May 2025 - 31 May 2025</option>
                  <option>Today</option>
                  <option>Yesterday</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
              </div>

              {/* Call Type dropdown selector */}
              <div className="relative w-full sm:w-36">
                <select
                  value={callTypeFilter}
                  onChange={(e) => setCallTypeFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
                >
                  <option value="All">All Call Types</option>
                  <option value="Video Call">Video Call</option>
                  <option value="Audio Call">Audio Call</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
              </div>

            </div>

            <button 
              onClick={handleExportCSV}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all duration-200"
            >
              <Download size={13} />
              <span>Export</span>
            </button>
          </div>

          {/* Sub-tabs Row list selector */}
          <div className="flex items-center gap-6 border-b border-slate-100 pb-1.5 mb-4 flex-shrink-0 overflow-x-auto scrollbar-none">
            {['Upcoming Calls', 'Missed Calls', 'Completed Calls', 'All Calls'].map((tab) => {
              const isActive = activeSubTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`pb-1 text-xs font-bold border-b-2 transition-all outline-none whitespace-nowrap ${
                    isActive ? 'border-[#FA5A24] text-[#FA5A24]' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Call Data Table */}
          <div className="flex-grow overflow-y-auto min-h-0">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[9px] font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Astrologer</th>
                  <th className="py-3 px-3">Call Type</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70 text-xs text-slate-700 font-semibold">
                {filteredCalls.length > 0 ? (
                  filteredCalls.map((call) => {
                    const isSelected = selectedCall?.id === call.id;
                    const isVideo = call.callType.includes('Video');
                    return (
                      <tr 
                        key={call.id} 
                        onClick={() => setSelectedCall(call)}
                        className={`hover:bg-slate-50/40 transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#FFF5F1]/30' : ''
                        }`}
                      >
                        {/* User info */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img src={call.user.avatar} className="w-7 h-7 rounded-full object-cover shadow-sm border border-slate-100" alt="" />
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-800 leading-tight">{call.user.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold mt-0.5 select-text">{call.user.phone}</span>
                            </div>
                          </div>
                        </td>

                        {/* Astrologer info */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img src={call.astrologer.avatar} className="w-7 h-7 rounded-full object-cover shadow-sm border border-slate-100" alt="" />
                            <span className="font-extrabold text-slate-800 leading-tight">{call.astrologer.name}</span>
                          </div>
                        </td>

                        {/* Call Type and icon indicators */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center">
                              {isVideo 
                                ? <Video size={11} className="text-indigo-600" />
                                : <Phone size={11} className="text-emerald-600" />
                              }
                            </span>
                            <span className="text-slate-500 text-[11px] font-bold">{call.callType}</span>
                          </div>
                        </td>

                        {/* Scheduled time info */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{call.dateTime.date}</span>
                            <span className="text-[9px] text-slate-400 font-extrabold mt-0.5 uppercase">{call.dateTime.time}</span>
                          </div>
                        </td>

                        {/* Duration length */}
                        <td className="py-3.5 px-3 text-slate-500 font-bold">
                          {call.duration}
                        </td>

                        {/* Status badging */}
                        <td className="py-3.5 px-3">
                          <span className={`inline-flex text-[9px] font-extrabold tracking-wider ${
                            call.status === 'Completed'
                              ? 'text-emerald-600'
                              : call.status === 'Missed'
                              ? 'text-rose-500'
                              : 'text-orange-500'
                          }`}>
                            {call.status}
                          </span>
                        </td>

                        {/* Call Action buttons column */}
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className={`p-1.5 rounded-lg border transition-colors ${
                              isVideo 
                                ? 'bg-orange-50 border-orange-100 hover:bg-orange-100 text-[#FA5A24]' 
                                : 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100 text-emerald-600'
                            }`}>
                              {isVideo ? <Video size={11} /> : <Phone size={11} />}
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCall(call);
                              }}
                              className="p-1.5 border border-slate-200 hover:bg-[#FA5A24]/5 text-slate-400 hover:text-[#FA5A24] rounded-lg transition-colors"
                            >
                              <Eye size={11} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400 font-bold">
                      No call records match your selected sub-tab filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer list pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 mt-4 border-t border-slate-100 flex-shrink-0">
            <span className="text-[10px] text-slate-400 font-bold">
              Showing 1 to {filteredCalls.length} of 320 entries
            </span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-extrabold hover:bg-slate-50">&lt;</button>
              <button className="px-3 py-1 bg-[#FA5A24] text-white rounded-lg text-[10px] font-extrabold shadow-sm">1</button>
              <button className="px-3 py-1 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-extrabold hover:bg-slate-50">2</button>
              <button className="px-3 py-1 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-extrabold hover:bg-slate-50">3</button>
              <span className="px-1 text-slate-400 text-xs">...</span>
              <button className="px-3 py-1 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-extrabold hover:bg-slate-50">54</button>
              <button className="px-2 py-1 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-extrabold hover:bg-slate-50">&gt;</button>
            </div>
          </div>

        </div>

        {/* Right Side: Sticky Call Details Panel */}
        {selectedCall && (
          <div className="w-full lg:w-[320px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-shrink-0 flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-200">
            
            {/* Header info */}
            <div className="flex items-center justify-between p-4.5 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider" style={{ fontFamily: 'Outfit' }}>Call Details</h3>
              <button 
                onClick={() => setSelectedCall(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content body info */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* User Profile Card */}
              <div className="flex flex-col items-center text-center p-4 bg-slate-50/50 border border-slate-100 rounded-xl relative">
                <img src={selectedCall.user.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md mb-2.5" alt="" />
                
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <span className="font-extrabold text-slate-800 text-sm leading-tight">{selectedCall.user.name}</span>
                  {selectedCall.user.isOnline && (
                    <span className="bg-[#E6F4EA] text-[#137333] px-1.5 py-0.5 rounded text-[8px] font-bold">Online</span>
                  )}
                </div>

                <div className="space-y-1 text-[10px] text-slate-500 font-bold pl-0.5">
                  <div className="select-text">{selectedCall.user.phone}</div>
                  <div className="select-text">{selectedCall.user.email}</div>
                  <div className="text-slate-400">{selectedCall.user.location}</div>
                </div>
              </div>

              {/* Call Settings specs */}
              <div className="space-y-3 bg-[#FCFAF8] p-4 rounded-xl border border-slate-100/60 text-[11px] font-semibold text-slate-600">
                <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                  <span className="text-slate-400 font-medium">Astrologer</span>
                  <span className="font-bold text-slate-800">{selectedCall.astrologer.name}</span>
                </div>
                
                <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                  <span className="text-slate-400 font-medium">Call Type</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    {selectedCall.callType.includes('Video') ? <Video size={12} className="text-indigo-600" /> : <Phone size={12} className="text-emerald-600" />}
                    <span>{selectedCall.callType}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                  <span className="text-slate-400 font-medium">Date & Time</span>
                  <span className="font-bold text-slate-850">{selectedCall.dateTime.date}, {selectedCall.dateTime.time}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                  <span className="text-slate-400 font-medium">Duration</span>
                  <span className="font-bold text-slate-800">{selectedCall.duration} Minutes</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400 font-medium">Status</span>
                  <span className={`font-bold ${
                    selectedCall.status === 'Completed'
                      ? 'text-emerald-600'
                      : selectedCall.status === 'Missed'
                      ? 'text-rose-500'
                      : 'text-orange-500'
                  }`}>{selectedCall.status}</span>
                </div>
              </div>

            </div>

            {/* Action buttons */}
            <div className="p-4.5 border-t border-slate-100 bg-slate-50/50 space-y-2 flex-shrink-0">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FA5A24] text-white hover:bg-orange-600 rounded-xl text-xs font-bold shadow-sm transition-colors">
                {selectedCall.callType.includes('Video') 
                  ? <><Video size={14} /> <span>Start Video Call</span></>
                  : <><Phone size={14} /> <span>Start Audio Call</span></>
                }
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#FA5A24]/40 hover:bg-[#FA5A24]/5 text-[#FA5A24] bg-white rounded-xl text-xs font-bold transition-all">
                <Calendar size={14} />
                <span>Reschedule Call</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CallsPage;
