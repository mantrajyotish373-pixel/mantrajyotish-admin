import React, { useState, useMemo, useEffect } from 'react';
import { 
  IndianRupee, 
  Wallet, 
  Clock, 
  RotateCcw, 
  CreditCard, 
  Search, 
  Calendar, 
  Download, 
  Eye, 
  X, 
  SlidersHorizontal,
  MessageSquare,
  Phone,
  Video,
  Info,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Payments list mock data matching the screenshot
const initialTransactions = [
  {
    id: '#TXN1250',
    user: {
      name: 'Rohit Sharma',
      email: 'rohit@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    },
    service: 'Chat Session',
    dateTime: {
      date: '25 May 2025',
      time: '10:30 AM'
    },
    method: 'Razorpay',
    methodDetail: '**** 4587',
    amount: '₹499',
    status: 'Completed'
  },
  {
    id: '#TXN1249',
    user: {
      name: 'Priya Singh',
      email: 'priya.singh@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    service: 'Call Session',
    dateTime: {
      date: '25 May 2025',
      time: '09:15 AM'
    },
    method: 'UPI',
    methodDetail: 'priya@upi',
    amount: '₹299',
    status: 'Pending'
  },
  {
    id: '#TXN1248',
    user: {
      name: 'Amit Kumar',
      email: 'amit.kumar@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    service: 'Video Call',
    dateTime: {
      date: '24 May 2025',
      time: '07:45 PM'
    },
    method: 'Paytm',
    methodDetail: '**** 9876',
    amount: '₹599',
    status: 'Completed'
  },
  {
    id: '#TXN1247',
    user: {
      name: 'Sneha Patel',
      email: 'sneha.patel@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    },
    service: 'Chat Session',
    dateTime: {
      date: '24 May 2025',
      time: '06:20 PM'
    },
    method: 'Credit Card',
    methodDetail: '**** 1122',
    amount: '₹499',
    status: 'Failed'
  },
  {
    id: '#TXN1246',
    user: {
      name: 'Vikash Yadav',
      email: 'vikash.yadav@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    service: 'Call Session',
    dateTime: {
      date: '24 May 2025',
      time: '04:10 PM'
    },
    method: 'UPI',
    methodDetail: 'vikash@upi',
    amount: '₹299',
    status: 'Completed'
  },
  {
    id: '#TXN1245',
    user: {
      name: 'Neha Joshi',
      email: 'neha.joshi@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
    },
    service: 'Video Call',
    dateTime: {
      date: '23 May 2025',
      time: '08:30 PM'
    },
    method: 'Razorpay',
    methodDetail: '**** 4567',
    amount: '₹799',
    status: 'Completed'
  }
];

// Refund request items list matching the sidebar recap
const refundRequestsMock = [
  { id: 1, user: 'Rohit Sharma', date: '25 May 2025, 11:30 AM', amount: '₹499', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
  { id: 2, user: 'Priya Singh', date: '25 May 2025, 10:15 AM', amount: '₹299', status: 'Approved', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: 3, user: 'Amit Kumar', date: '24 May 2025, 07:50 PM', amount: '₹599', status: 'Rejected', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' }
];

// Payment summary donut chart data configuration
const summaryData = [
  { name: 'Completed', value: 310200, color: '#10B981' },
  { name: 'Pending', value: 24800, color: '#F59E0B' },
  { name: 'Refunded', value: 10600, color: '#3B82F6' },
  { name: 'Failed', value: 3200, color: '#EF4444' }
];

const mapTransactions = (data) => {
  return data.map((item, idx) => {
    const u = item.user || {};
    const firstName = u.firstname || '';
    const lastName = u.lastname || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Anonymous User';
    
    const mode = item.appointment?.consultationMode || 'Chat';
    const serviceName = mode.charAt(0).toUpperCase() + mode.slice(1) + ' Session';
    
    const dateRaw = item.createdAt ? new Date(item.createdAt) : new Date();
    const formattedDate = dateRaw.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = dateRaw.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const method = item.paymentGateway || 'UPI';
    const statusVal = item.paymentStatus === 'success' || item.paymentStatus === 'paid'
      ? 'Completed' 
      : (item.paymentStatus === 'failed' ? 'Failed' : 'Pending');

    return {
      id: item._id || ('#TXN' + idx),
      user: {
        name: fullName,
        email: u.email || 'no-email@example.com',
        avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
      },
      service: serviceName,
      dateTime: {
        date: formattedDate,
        time: formattedTime
      },
      method: method,
      methodDetail: item.transactionId ? 'ID: ' + item.transactionId : 'Live Order',
      amount: '₹' + (item.amount || 0),
      amountRaw: item.amount || 0,
      status: statusVal
    };
  });
};

const PaymentsPage = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('All Transactions');
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Mount fetch to load live transactions
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";
    fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/payment/all`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch payment transactions');
        }
        return res.json();
      })
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setTransactions(mapTransactions(json.data));
        } else {
          throw new Error('Invalid API response format');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
        setTransactions(initialTransactions);
      });
  }, []);

  // Reset page index on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeSubTab, methodFilter, statusFilter]);

  // Handle search bar ID lookup dynamically
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (/^[0-9a-fA-F]{24}$/.test(trimmed)) {
      setIsLoading(true);
      setError(null);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";
      fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/payment/${trimmed}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Transaction ID not found');
          }
          return res.json();
        })
        .then(json => {
          if (json.success && json.data) {
            setTransactions(mapTransactions([json.data]));
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.warn('ID lookup failed, falling back to local search.', err.message);
          setIsLoading(false);
        });
    } else if (trimmed === '') {
      setIsLoading(true);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";
      fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/payment/all`)
        .then(res => res.json())
        .then(json => {
          if (json.success && Array.isArray(json.data)) {
            setTransactions(mapTransactions(json.data));
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [searchQuery]);

  // Dynamic statistics computations
  const dynamicStats = useMemo(() => {
    let revenue = 0;
    let completed = 0;
    let pending = 0;
    let refunded = 0;
    let failed = 0;
    
    transactions.forEach(t => {
      const amt = t.amountRaw || 0;
      if (t.status === 'Completed') {
        completed += amt;
        revenue += amt;
      } else if (t.status === 'Pending') {
        pending += amt;
      } else if (t.status === 'Refunded') {
        refunded += amt;
      } else if (t.status === 'Failed') {
        failed += amt;
      }
    });

    const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

    return {
      totalRevenue: formatCurrency(revenue),
      completedPayments: formatCurrency(completed),
      pendingPayments: formatCurrency(pending),
      refundedAmount: formatCurrency(refunded),
      failedPayments: formatCurrency(failed),
      totalTxns: transactions.length.toLocaleString('en-IN')
    };
  }, [transactions]);

  // Dynamic pie chart dataset
  const dynamicSummaryData = useMemo(() => {
    let completed = 0;
    let pending = 0;
    let refunded = 0;
    let failed = 0;
    
    transactions.forEach(t => {
      const amt = t.amountRaw || 0;
      if (t.status === 'Completed') completed += amt;
      else if (t.status === 'Pending') pending += amt;
      else if (t.status === 'Refunded') refunded += amt;
      else if (t.status === 'Failed') failed += amt;
    });

    return [
      { name: 'Completed', value: completed, color: '#10B981' },
      { name: 'Pending', value: pending, color: '#F59E0B' },
      { name: 'Refunded', value: refunded, color: '#3B82F6' },
      { name: 'Failed', value: failed, color: '#EF4444' }
    ];
  }, [transactions]);

  // Filters logic
  const filteredTxns = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = 
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMethod = methodFilter === 'All' || t.method === methodFilter;
      
      const matchesFilterDropdown = statusFilter === 'All' || t.status === statusFilter;

      let matchesTab = true;
      if (activeSubTab === 'Completed') matchesTab = t.status === 'Completed';
      else if (activeSubTab === 'Pending') matchesTab = t.status === 'Pending';
      else if (activeSubTab === 'Refunded') matchesTab = t.status === 'Refunded';
      else if (activeSubTab === 'Failed') matchesTab = t.status === 'Failed';

      return matchesSearch && matchesMethod && matchesFilterDropdown && matchesTab;
    });
  }, [transactions, searchQuery, methodFilter, statusFilter, activeSubTab]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTxns.length / itemsPerPage) || 1;
  const paginatedTxns = filteredTxns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }
    return pages;
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Transaction ID,User Name,User Email,Service,Date,Time,Method,Details,Amount,Status\n'];
    const rows = filteredTxns.map(t => 
      `${t.id},"${t.user.name}",${t.user.email},"${t.service}",${t.dateTime.date},${t.dateTime.time},"${t.method}","${t.methodDetail}",${t.amount.replace('₹', '')},${t.status}`
    );
    const blob = new Blob([...headers, ...rows.map(r => r + '\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Payments_Export_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  // Service icon picker helper
  const renderServiceIcon = (service) => {
    if (service.includes('Chat')) {
      return <MessageSquare size={12} className="text-indigo-600" />;
    } else if (service.includes('Call')) {
      return <Phone size={12} className="text-emerald-600" />;
    } else {
      return <Video size={12} className="text-rose-600" />;
    }
  };

  return (
    <div className="space-y-6 select-none pb-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
            Payments <span className="text-[#FA5A24]">✨</span>
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">Payments</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all">
            <RotateCcw size={14} className="text-[#FA5A24]" />
            <span>Refund Requests</span>
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FA5A24] text-white rounded-xl text-xs font-bold hover:bg-orange-600 shadow-md transition-all"
          >
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 5 Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Revenue', value: dynamicStats.totalRevenue, trend: '▲ 18.7%', isUp: true, color: 'text-orange-500 bg-orange-50/70', icon: IndianRupee },
          { label: 'Completed Payments', value: dynamicStats.completedPayments, trend: '▲ 16.3%', isUp: true, color: 'text-emerald-500 bg-emerald-50/70', icon: Wallet },
          { label: 'Pending Payments', value: dynamicStats.pendingPayments, trend: '▲ 8.6%', isUp: true, color: 'text-purple-500 bg-purple-50/70', icon: Clock },
          { label: 'Refunded Amount', value: dynamicStats.refundedAmount, trend: '▼ 3.2%', isUp: false, color: 'text-blue-500 bg-blue-50/70', icon: RotateCcw },
          { label: 'Total Transactions', value: dynamicStats.totalTxns, trend: '▲ 12.5%', isUp: true, color: 'text-amber-500 bg-amber-50/70', icon: CreditCard }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-100/80 rounded-2xl p-4.5 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} flex-shrink-0`}>
              <item.icon size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block truncate">{item.label}</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-base font-extrabold text-slate-800" style={{ fontFamily: 'Outfit' }}>{item.value}</span>
                <span className={`text-[8px] font-bold ${item.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Content Split Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Filter Toolbar */}
        <div className="flex flex-col lg:flex-row items-center gap-3 justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Input bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search by transaction ID, user, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FCFAF8] border border-slate-200 text-xs rounded-xl outline-none focus:border-orange-200 focus:bg-white font-medium text-slate-700 transition-all duration-200"
              />
            </div>

            {/* Date Picker mock */}
            <div className="relative w-full sm:w-48">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <select className="w-full pl-8 pr-4 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow">
                <option>01 May 2025 - 31 May 2025</option>
                <option>Today</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Payment Method Select */}
            <div className="relative w-full sm:w-44">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
              >
                <option value="All">All Payment Methods</option>
                <option value="UPI">UPI</option>
                <option value="Razorpay">Razorpay</option>
                <option value="Paytm">Paytm</option>
                <option value="Credit Card">Credit Card</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Status Select */}
            <div className="relative w-full sm:w-36">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>
          </div>

          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-[#FA5A24]/40 hover:bg-[#FA5A24]/5 text-[#FA5A24] rounded-xl text-xs font-bold transition-all">
            <SlidersHorizontal size={13} />
            <span>Filters</span>
          </button>
        </div>

        {/* Sub-tabs Options Row */}
        <div className="flex items-center gap-6 border-b border-slate-100 pb-1.5 flex-shrink-0 overflow-x-auto scrollbar-none">
          {['All Transactions', 'Completed', 'Pending', 'Refunded', 'Failed'].map((tab) => {
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
                    <th className="py-3 px-3">Transaction ID</th>
                    <th className="py-3 px-3">User</th>
                    <th className="py-3 px-3">Service</th>
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Payment Method</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 text-xs text-slate-700 font-semibold">
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-slate-400 font-medium">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 rounded-full border-2 border-t-[#FA5A24] border-orange-100 animate-spin" />
                          <span>Loading transaction logs...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-amber-600 bg-amber-50/50 rounded-xl font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <AlertCircle size={15} />
                          <span>Could not load live transactions ({error}). Showing offline cache.</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedTxns.length > 0 ? (
                    paginatedTxns.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-3 font-bold text-slate-600 select-text">{txn.id}</td>
                        
                        {/* User Column */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2.5">
                            <img src={txn.user.avatar} className="w-7 h-7 rounded-full object-cover shadow-sm border border-slate-100" alt="" />
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-800 leading-tight">{txn.user.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold mt-0.5 select-text">{txn.user.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Service mode */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-50 flex items-center justify-center flex-shrink-0">
                              {renderServiceIcon(txn.service)}
                            </span>
                            <span className="text-slate-500 font-bold text-[11px]">{txn.service}</span>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 leading-tight">{txn.dateTime.date}</span>
                            <span className="text-[9px] text-slate-400 font-extrabold mt-0.5 uppercase">{txn.dateTime.time}</span>
                          </div>
                        </td>

                        {/* Payment Method */}
                        <td className="py-4 px-3 text-slate-500 font-bold text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-slate-100/80 rounded flex items-center justify-center text-[8px] font-extrabold border border-slate-200/50 text-[#FA5A24]">
                              {txn.method.charAt(0)}
                            </span>
                            <span>{txn.method} {txn.methodDetail}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-3 font-extrabold text-slate-850">{txn.amount}</td>

                        {/* Status badges */}
                        <td className="py-4 px-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wider ${
                            txn.status === 'Completed'
                              ? 'bg-[#E6F4EA] text-[#137333]'
                              : txn.status === 'Pending'
                              ? 'bg-[#FEF3C7] text-[#D97706]'
                              : 'bg-red-50 text-red-600'
                          }`}>
                            {txn.status}
                          </span>
                        </td>

                        {/* Actions view */}
                        <td className="py-4 px-3 text-center">
                          <button 
                            onClick={() => setSelectedTxn(txn)}
                            className="p-1.5 border border-slate-200 hover:bg-[#FA5A24]/5 hover:border-[#FA5A24]/30 text-slate-400 hover:text-[#FA5A24] rounded-lg transition-all"
                          >
                            <Eye size={11} />
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-slate-400 font-bold">
                        No transactions found matching your filters selection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table pagination stats footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold">
                Showing {filteredTxns.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredTxns.length)} of {filteredTxns.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-extrabold hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  &lt;
                </button>
                {getPageNumbers().map((p, idx) => {
                  if (p === '...') {
                    return <span key={`dots-${idx}`} className="text-slate-400 text-[10px] px-1 select-none">...</span>;
                  }
                  const isActive = p === currentPage;
                  return (
                    <button
                      key={`page-${p}`}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1 text-[10px] font-extrabold rounded-lg cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-[#FA5A24] text-white shadow-sm' 
                          : 'border border-slate-200 text-slate-505 hover:bg-orange-50/50 hover:text-[#FA5A24]'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-extrabold hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Right Side Widgets Column */}
          <div className="space-y-6">
            
            {/* Widget 1: Payment Summary Donut Chart */}
            <div className="bg-[#FCFAF8] border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-4">Payment Summary</h4>
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
                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none block">Total</span>
                    <span className="text-[11px] font-extrabold text-slate-800 mt-0.5 leading-none block" style={{ fontFamily: 'Outfit' }}>₹3.45L</span>
                  </div>
                </div>

                {/* Donut Legend lists */}
                <div className="flex-1 space-y-2 text-[10px] font-bold">
                  {[
                    { label: 'Completed', value: '₹3,10,200', color: 'bg-[#10B981]' },
                    { label: 'Pending', value: '₹24,800', color: 'bg-[#F59E0B]' },
                    { label: 'Refunded', value: '₹10,600', color: 'bg-[#3B82F6]' },
                    { label: 'Failed', value: '₹3,200', color: 'bg-[#EF4444]' }
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

            {/* Widget 2: Payment Methods list */}
            <div className="bg-[#FCFAF8] border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Payment Methods</h4>
              <div className="space-y-3.5">
                {[
                  { name: 'UPI', count: '1,250 Transactions', amount: '₹1,45,600', color: 'bg-emerald-500' },
                  { name: 'Razorpay', count: '850 Transactions', amount: '₹1,10,400', color: 'bg-indigo-500' },
                  { name: 'Paytm', count: '200 Transactions', amount: '₹45,200', color: 'bg-blue-500' },
                  { name: 'Credit Card', count: '100 Transactions', amount: '₹30,400', color: 'bg-amber-500' },
                  { name: 'Other Wallets', count: '50 Transactions', amount: '₹14,000', color: 'bg-slate-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5 text-[10px] font-bold">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 bg-slate-200/50 rounded flex items-center justify-center text-[7px] text-slate-500">{item.name.charAt(0)}</span>
                        <div>
                          <span className="text-slate-700 block leading-none">{item.name}</span>
                          <span className="text-[8px] text-slate-400 font-semibold block mt-0.5 leading-none">{item.count}</span>
                        </div>
                      </div>
                      <span className="text-slate-800">{item.amount}</span>
                    </div>
                    {/* Visual Progress Bar matching the shares */}
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: idx === 0 ? '60%' : idx === 1 ? '45%' : idx === 2 ? '20%' : '10%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Recent Refund Requests */}
            <div className="bg-[#FCFAF8] border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Recent Refund Requests</h4>
                <button className="text-[9px] font-extrabold text-[#FA5A24] hover:underline flex items-center">View All <ChevronRight size={10} /></button>
              </div>
              <div className="divide-y divide-slate-100/60">
                {refundRequestsMock.map((refund) => (
                  <div key={refund.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-[10px] font-bold">
                    <div className="flex items-center gap-2">
                      <img src={refund.avatar} className="w-7 h-7 rounded-full object-cover border border-slate-100" alt="" />
                      <div>
                        <span className="text-slate-700 block leading-none">{refund.user}</span>
                        <span className="text-[8px] text-slate-400 font-semibold block mt-0.5 leading-none">{refund.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-800 block leading-none">{refund.amount}</span>
                      <span className={`inline-block text-[8px] mt-0.5 leading-none ${
                        refund.status === 'Pending'
                          ? 'text-amber-500'
                          : refund.status === 'Approved'
                          ? 'text-emerald-500'
                          : 'text-rose-500'
                      }`}>{refund.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Transaction Details Info Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-[#FA5A24]" />
                <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>Transaction Summary</h3>
              </div>
              <button 
                onClick={() => setSelectedTxn(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs font-semibold text-slate-600">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span>Transaction ID</span>
                <span className="font-extrabold text-slate-800 select-text">{selectedTxn.id}</span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">User Details</span>
                <div className="flex items-center gap-3 bg-[#FCFAF8] p-3 rounded-xl border border-slate-100/50">
                  <img src={selectedTxn.user.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{selectedTxn.user.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5 select-text">{selectedTxn.user.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[9px] text-slate-400 block uppercase">Purchased Service</span>
                  <span className="font-bold text-slate-800 block mt-1">{selectedTxn.service}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[9px] text-slate-400 block uppercase">Payment Method</span>
                  <span className="font-bold text-slate-800 block mt-1">{selectedTxn.method} {selectedTxn.methodDetail}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[9px] text-slate-400 block uppercase">Paid Amount</span>
                  <span className="font-extrabold text-slate-850 block mt-1">{selectedTxn.amount}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[9px] text-slate-400 block uppercase">Date & Time</span>
                  <span className="font-bold text-slate-800 block mt-1">{selectedTxn.dateTime.date} {selectedTxn.dateTime.time}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center">
                <span className="text-[9px] text-slate-400 block uppercase">Payment Status</span>
                <span className={`inline-flex px-2.5 py-1 rounded text-[9px] font-extrabold ${
                  selectedTxn.status === 'Completed'
                    ? 'bg-[#E6F4EA] text-[#137333]'
                    : selectedTxn.status === 'Pending'
                    ? 'bg-[#FEF3C7] text-[#D97706]'
                    : 'bg-red-50 text-red-600'
                }`}>{selectedTxn.status}</span>
              </div>
            </div>

            <div className="flex justify-end p-5 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setSelectedTxn(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
