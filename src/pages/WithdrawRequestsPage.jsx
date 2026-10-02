import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Calendar, 
  Download, 
  Check, 
  X, 
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
  Building
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Withdraw requests mock data matching the screenshot
const initialRequests = [
  {
    id: '#WR1250',
    user: {
      name: 'Rohit Sharma',
      email: 'rohit@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    },
    amount: '₹5,000',
    amountVal: 5000,
    method: 'UPI',
    accountDetails: 'UPI ID rohit@upi',
    requestedOn: {
      date: '25 May 2025',
      time: '10:30 AM'
    },
    status: 'Pending'
  },
  {
    id: '#WR1249',
    user: {
      name: 'Priya Singh',
      email: 'priya.singh@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    amount: '₹3,200',
    amountVal: 3200,
    method: 'Bank Transfer',
    accountDetails: 'HDFC Bank **** 4321',
    requestedOn: {
      date: '25 May 2025',
      time: '09:15 AM'
    },
    status: 'Pending'
  },
  {
    id: '#WR1248',
    user: {
      name: 'Amit Kumar',
      email: 'amit.kumar@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    amount: '₹7,500',
    amountVal: 7500,
    method: 'UPI',
    accountDetails: 'UPI ID amit@upi',
    requestedOn: {
      date: '24 May 2025',
      time: '07:45 PM'
    },
    status: 'Approved'
  },
  {
    id: '#WR1247',
    user: {
      name: 'Sneha Patel',
      email: 'sneha.patel@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    },
    amount: '₹2,800',
    amountVal: 2800,
    method: 'Bank Transfer',
    accountDetails: 'ICICI Bank **** 1122',
    requestedOn: {
      date: '24 May 2025',
      time: '06:20 PM'
    },
    status: 'Rejected'
  },
  {
    id: '#WR1246',
    user: {
      name: 'Vikash Yadav',
      email: 'vikash.yadav@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    amount: '₹4,600',
    amountVal: 4600,
    method: 'UPI',
    accountDetails: 'UPI ID vikash@upi',
    requestedOn: {
      date: '24 May 2025',
      time: '04:10 PM'
    },
    status: 'Pending'
  },
  {
    id: '#WR1245',
    user: {
      name: 'Neha Joshi',
      email: 'neha.joshi@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
    },
    amount: '₹6,900',
    amountVal: 6900,
    method: 'Bank Transfer',
    accountDetails: 'Axis Bank **** 7788',
    requestedOn: {
      date: '23 May 2025',
      time: '08:30 PM'
    },
    status: 'Approved'
  }
];

// Withdrawal summary configuration
const summaryData = [
  { name: 'Approved', value: 1320000, color: '#10B981' },
  { name: 'Pending', value: 245000, color: '#F59E0B' },
  { name: 'Rejected', value: 280000, color: '#EF4444' }
];

const WithdrawRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeSubTab, setActiveSubTab] = useState('All Requests');

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://api.mantrajyotish.com";
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/withdraw/all`, { headers })
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setRequests(json.data);
        } else {
          setRequests(initialRequests);
        }
      })
      .catch(() => {
        setRequests(initialRequests);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Interactive approve/reject actions
  const handleApprove = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const handleReject = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
  };

  const handleApproveAll = () => {
    setRequests(prev => prev.map(r => r.status === 'Pending' ? { ...r, status: 'Approved' } : r));
  };

  // Filter logic
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const matchesSearch = 
        String(r.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(r.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(r.accountDetails || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(r.id || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDropdown = statusFilter === 'All' || r.status === statusFilter;

      let matchesTab = true;
      if (activeSubTab === 'Pending') matchesTab = r.status === 'Pending';
      else if (activeSubTab === 'Approved') matchesTab = r.status === 'Approved';
      else if (activeSubTab === 'Rejected') matchesTab = r.status === 'Rejected';

      return matchesSearch && matchesDropdown && matchesTab;
    });
  }, [requests, searchQuery, statusFilter, activeSubTab]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Request ID,User Name,User Email,Amount,Method,Account Details,Date,Time,Status\n'];
    const rows = filteredRequests.map(r => 
      `${r.id},"${r.user?.name || 'User'}",${r.user?.email || 'N/A'},${String(r.amount || '').replace('₹', '')},"${r.method}","${r.accountDetails}",${r.requestedOn?.date || ''},${r.requestedOn?.time || ''},${r.status}`
    );
    const blob = new Blob([...headers, ...rows.map(ro => ro + '\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Withdraw_Requests_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  if (loading) {
    return (
      <div className="space-y-6 select-none pb-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-44 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>

        {/* 4 Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-1.5 flex-1">
                <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="h-10 w-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-10 w-44 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700/40 rounded-xl w-full" />
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-44 bg-slate-100 dark:bg-slate-700/40 rounded-2xl w-full" />
              <div className="h-44 bg-slate-100 dark:bg-slate-700/40 rounded-2xl w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none pb-8">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
            Withdraw Requests <span className="text-[#FA5A24]">✨</span>
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">Withdraw Requests</span>
          </div>
        </div>

        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 border border-[#FA5A24]/40 hover:bg-[#FA5A24]/5 text-[#FA5A24] rounded-xl text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Export</span>
        </button>
      </div>

      {/* 4 Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: '245', trend: '▲ 14.6%', isUp: true, color: 'text-orange-500 bg-orange-50/70', icon: Wallet },
          { label: 'Pending Requests', value: '18', trend: '▲ 8.4%', isUp: true, color: 'text-amber-500 bg-amber-50/70', icon: Clock },
          { label: 'Approved Requests', value: '186', trend: '▲ 16.2%', isUp: true, color: 'text-emerald-500 bg-emerald-50/70', icon: CheckCircle },
          { label: 'Rejected Requests', value: '41', trend: '▼ 5.3%', isUp: false, color: 'text-rose-500 bg-rose-50/70', icon: XCircle }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-100/80 rounded-2xl p-4.5 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} flex-shrink-0`}>
              <item.icon size={18} />
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block truncate">{item.label}</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-base font-extrabold text-slate-800" style={{ fontFamily: 'Outfit' }}>{item.value}</span>
                <span className={`text-[8px] font-bold ${item.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.trend}
                </span>
              </div>
              <span className="text-[8px] text-slate-400 font-semibold mt-0.5 block">this month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Content Split Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Filters Toolbar */}
        <div className="flex flex-col lg:flex-row items-center gap-3 justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Input bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search by user name, email, UPI ID, bank..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FCFAF8] border border-slate-200 text-xs rounded-xl outline-none focus:border-orange-200 focus:bg-white font-medium text-slate-700 transition-all duration-200"
              />
            </div>

            {/* Date dropdown */}
            <div className="relative w-full sm:w-52">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <select className="w-full pl-8 pr-4 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow">
                <option>01 May 2025 - 31 May 2025</option>
                <option>Today</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Status Select */}
            <div className="relative w-full sm:w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>
          </div>

          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-[#FA5A24]/40 hover:bg-[#FA5A24]/5 text-[#FA5A24] rounded-xl text-xs font-bold transition-all">
            <SlidersHorizontal size={13} />
            <span>Filters</span>
          </button>
        </div>

        {/* Sub-tabs row */}
        <div className="flex items-center gap-6 border-b border-slate-100 pb-1.5 flex-shrink-0 overflow-x-auto scrollbar-none">
          {['All Requests', 'Pending', 'Approved', 'Rejected'].map((tab) => {
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

        {/* Grid Splits: Left Side Table vs Right Side Widgets */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* Table Container Column */}
          <div className="xl:col-span-2 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[9px] font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-3">Request ID</th>
                    <th className="py-3 px-3">User</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Account Details</th>
                    <th className="py-3 px-3">Requested On</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 text-xs text-slate-700 font-semibold">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-3 font-bold text-slate-600 select-text">{req.id}</td>
                        
                        {/* User profile */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2.5">
                            <img src={req.user.avatar} className="w-7 h-7 rounded-full object-cover shadow-sm border border-slate-100" alt="" />
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-800 leading-tight">{req.user.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold mt-0.5 select-text">{req.user.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-3 font-extrabold text-slate-800">{req.amount}</td>

                        {/* Method type */}
                        <td className="py-4 px-3 text-slate-500 font-bold text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-slate-50 rounded flex items-center justify-center border border-slate-200">
                              {req.method.includes('UPI') ? 'U' : 'B'}
                            </span>
                            <span>{req.method}</span>
                          </div>
                        </td>

                        {/* Account Details */}
                        <td className="py-4 px-3 text-slate-600 font-bold text-[11px] select-text">
                          {req.accountDetails}
                        </td>

                        {/* Date Requested */}
                        <td className="py-4 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 leading-tight">{req.requestedOn.date}</span>
                            <span className="text-[9px] text-slate-400 font-extrabold mt-0.5 uppercase">{req.requestedOn.time}</span>
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="py-4 px-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wider ${
                            req.status === 'Approved'
                              ? 'bg-[#E6F4EA] text-[#137333]'
                              : req.status === 'Pending'
                              ? 'bg-[#FEF3C7] text-[#D97706]'
                              : 'bg-red-50 text-red-600'
                          }`}>
                            {req.status}
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="py-4 px-3 text-center">
                          {req.status === 'Pending' ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => handleApprove(req.id)}
                                className="p-1 border border-emerald-200 hover:bg-emerald-50 text-emerald-600 rounded-md transition-colors"
                                title="Approve Request"
                              >
                                <Check size={12} />
                              </button>
                              <button 
                                onClick={() => handleReject(req.id)}
                                className="p-1 border border-rose-200 hover:bg-rose-50 text-rose-500 rounded-md transition-colors"
                                title="Reject Request"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-300 font-bold">—</span>
                          )}
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-slate-400 font-bold">
                        No requests found matching your current query filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold">Showing 1 to {filteredRequests.length} of 50 entries</span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-extrabold hover:bg-slate-50">&lt;</button>
                <button className="px-3 py-1 bg-[#FA5A24] text-white rounded-lg text-[10px] font-extrabold">1</button>
                <button className="px-3 py-1 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-extrabold">2</button>
                <button className="px-3 py-1 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-extrabold">3</button>
                <button className="px-2 py-1 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-extrabold">&gt;</button>
              </div>
            </div>
          </div>

          {/* Right Side Column Widgets */}
          <div className="space-y-6">
            
            {/* Widget 1: Withdrawal Summary Donut */}
            <div className="bg-[#FCFAF8] border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-4">Withdrawal Summary</h4>
              <div className="flex items-center gap-5 justify-between">
                <div className="w-28 h-28 flex-shrink-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summaryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={48}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {summaryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Central Text inside donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase leading-none block">Total</span>
                    <span className="text-[11px] font-extrabold text-slate-800 mt-0.5 leading-none block" style={{ fontFamily: 'Outfit' }}>₹18.45L</span>
                  </div>
                </div>

                {/* Donut Legend lists */}
                <div className="flex-1 space-y-2 text-[10px] font-bold">
                  {[
                    { label: 'Approved', value: '₹13,20,000', color: 'bg-[#10B981]' },
                    { label: 'Pending', value: '₹2,45,000', color: 'bg-[#F59E0B]' },
                    { label: 'Rejected', value: '₹2,80,000', color: 'bg-[#EF4444]' }
                  ].map((legend, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${legend.color} flex-shrink-0`}></span>
                        <span className="text-slate-400 truncate">{legend.label}</span>
                      </div>
                      <span className="text-slate-700">{legend.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Widget 2: Recent Withdrawals */}
            <div className="bg-[#FCFAF8] border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Recent Withdrawals</h4>
                <button className="text-[9px] font-extrabold text-[#FA5A24] hover:underline flex items-center">View All <ChevronRight size={10} /></button>
              </div>
              <div className="divide-y divide-slate-100/60">
                {[
                  { user: 'Rohit Sharma', date: '25 May 2025, 10:30 AM', amount: '₹5,000', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
                  { user: 'Priya Singh', date: '25 May 2025, 09:15 AM', amount: '₹3,200', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
                  { user: 'Amit Kumar', date: '24 May 2025, 07:45 PM', amount: '₹7,500', status: 'Approved', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
                  { user: 'Sneha Patel', date: '24 May 2025, 06:20 PM', amount: '₹2,800', status: 'Rejected', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' }
                ].map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-[10px] font-bold">
                    <div className="flex items-center gap-2">
                      <img src={item.avatar} className="w-7 h-7 rounded-full object-cover border border-slate-100" alt="" />
                      <div>
                        <span className="text-slate-700 block leading-none">{item.user}</span>
                        <span className="text-[8px] text-slate-400 font-semibold block mt-0.5 leading-none">{item.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-800 block leading-none">{item.amount}</span>
                      <span className={`inline-block text-[8px] mt-0.5 leading-none ${
                        item.status === 'Pending'
                          ? 'text-amber-500'
                          : item.status === 'Approved'
                          ? 'text-emerald-500'
                          : 'text-rose-500'
                      }`}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Quick Actions panel */}
            <div className="bg-[#FCFAF8] border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Quick Actions</h4>
              
              <button 
                onClick={handleApproveAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-emerald-500/40 hover:bg-emerald-50/20 text-emerald-600 rounded-xl text-xs font-bold transition-all"
              >
                <CheckCircle size={14} />
                <span>Approve All Pending</span>
              </button>

              <button 
                onClick={handleExportCSV}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#FA5A24]/40 hover:bg-[#FA5A24]/5 text-[#FA5A24] rounded-xl text-xs font-bold transition-all"
              >
                <Download size={14} />
                <span>Download Report</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default WithdrawRequestsPage;
