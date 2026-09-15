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

const mapTransactions = (data) => {
  return data.map((item, idx) => {
    const u = item.user || {};
    const firstName = u.firstname || u.name || '';
    const lastName = u.lastname || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'User';
    
    const mode = item.appointment?.consultationMode || item.service || 'Consultation';
    const serviceName = mode.charAt(0).toUpperCase() + mode.slice(1);
    
    const dateRaw = item.createdAt ? new Date(item.createdAt) : new Date();
    const formattedDate = dateRaw.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = dateRaw.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const method = item.paymentGateway || item.paymentMethod || item.method || 'UPI';
    const statusVal = (item.paymentStatus || item.status || '').toLowerCase() === 'success' || (item.paymentStatus || item.status || '').toLowerCase() === 'paid' || (item.paymentStatus || item.status || '').toLowerCase() === 'completed'
      ? 'Completed' 
      : ((item.paymentStatus || item.status || '').toLowerCase() === 'failed' ? 'Failed' : ((item.paymentStatus || item.status || '').toLowerCase() === 'refunded' ? 'Refunded' : 'Pending'));

    return {
      id: item._id || item.id || ('#TXN' + (1000 + idx)),
      user: {
        name: fullName,
        email: u.email || 'N/A',
        avatar: u.avatar || u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=FA5A24&color=fff`
      },
      service: serviceName.includes('Session') ? serviceName : serviceName + ' Session',
      dateTime: {
        date: formattedDate,
        time: formattedTime
      },
      method: method,
      methodDetail: item.transactionId ? 'ID: ' + item.transactionId : '',
      amount: '₹' + (item.amount || item.totalAmount || 0),
      amountRaw: Number(item.amount || item.totalAmount || 0),
      status: statusVal
    };
  });
};

const PaymentsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
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
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app";
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/payment/all`, { headers })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch payment transactions');
        }
        return res.json();
      })
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          const mapped = mapTransactions(json.data);
          setTransactions(mapped);
        } else if (Array.isArray(json)) {
          setTransactions(mapTransactions(json));
        } else {
          setTransactions([]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
        setTransactions([]);
      });
  }, []);

  // Reset page index on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeSubTab, methodFilter, statusFilter]);

  // Handle search bar ID lookup dynamically
  useEffect(() => {
    const trimmed = searchQuery.trim();
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app";
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    if (/^[0-9a-fA-F]{24}$/.test(trimmed)) {
      setIsLoading(true);
      setError(null);
      fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/payment/${trimmed}`, { headers })
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
    } else if (trimmed === '' && !isLoading) {
      fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/payment/all`, { headers })
        .then(res => res.json())
        .then(json => {
          if (json.success && Array.isArray(json.data)) {
            setTransactions(mapTransactions(json.data));
          }
        })
        .catch(() => {});
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

    const total = completed + pending + refunded + failed || 1;

    return [
      { name: 'Completed', value: completed, color: '#10B981', formatted: '₹' + completed.toLocaleString('en-IN') },
      { name: 'Pending', value: pending, color: '#F59E0B', formatted: '₹' + pending.toLocaleString('en-IN') },
      { name: 'Refunded', value: refunded, color: '#3B82F6', formatted: '₹' + refunded.toLocaleString('en-IN') },
      { name: 'Failed', value: failed, color: '#EF4444', formatted: '₹' + failed.toLocaleString('en-IN') }
    ];
  }, [transactions]);

  // Dynamic payment methods distribution
  const dynamicPaymentMethods = useMemo(() => {
    const counts = {};
    const amounts = {};
    let totalAmt = 0;

    transactions.forEach(t => {
      const m = t.method || 'UPI';
      const amt = t.amountRaw || 0;
      counts[m] = (counts[m] || 0) + 1;
      amounts[m] = (amounts[m] || 0) + amt;
      totalAmt += amt;
    });

    const colors = {
      UPI: 'bg-emerald-500',
      Razorpay: 'bg-indigo-500',
      Paytm: 'bg-blue-500',
      'Credit Card': 'bg-amber-500',
      'Debit Card': 'bg-rose-500',
      Netbanking: 'bg-purple-500'
    };

    const keys = Object.keys(amounts);
    if (keys.length === 0) return [];

    return keys.map(m => {
      const amt = amounts[m] || 0;
      const count = counts[m] || 0;
      const pct = totalAmt > 0 ? Math.min(100, Math.max(5, Math.round((amt / totalAmt) * 100))) : 0;
      return {
        name: m,
        count: `${count.toLocaleString('en-IN')} Transaction${count === 1 ? '' : 's'}`,
        amount: `₹${amt.toLocaleString('en-IN')}`,
        pct: `${pct}%`,
        color: colors[m] || 'bg-slate-500'
      };
    });
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

  // Professional Pagination Buttons Generator (e.g. 1, 2, ..., 5, 6, ..., 9, 10)
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
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

  if (isLoading) {
    return (
      <div className="space-y-6 select-none pb-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        </div>

        {/* 5 Cards Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-1.5 flex-1">
                <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Content & Filters Skeleton */}
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
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
            Payments <span className="text-[#FA5A24]">✨</span>
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">Payments</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-all">
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
          { label: 'Total Revenue', value: dynamicStats.totalRevenue, trend: '▲ 18.7%', isUp: true, color: 'text-orange-500 bg-orange-50/70 dark:bg-orange-950/40', icon: IndianRupee },
          { label: 'Completed Payments', value: dynamicStats.completedPayments, trend: '▲ 16.3%', isUp: true, color: 'text-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40', icon: Wallet },
          { label: 'Pending Payments', value: dynamicStats.pendingPayments, trend: '▲ 8.6%', isUp: true, color: 'text-purple-500 bg-purple-50/70 dark:bg-purple-950/40', icon: Clock },
          { label: 'Refunded Amount', value: dynamicStats.refundedAmount, trend: '▼ 3.2%', isUp: false, color: 'text-blue-500 bg-blue-50/70 dark:bg-blue-950/40', icon: RotateCcw },
          { label: 'Total Transactions', value: dynamicStats.totalTxns, trend: '▲ 12.5%', isUp: true, color: 'text-amber-500 bg-amber-50/70 dark:bg-amber-950/40', icon: CreditCard }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-100/80 dark:border-slate-700/60 rounded-2xl p-4.5 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} flex-shrink-0`}>
              <item.icon size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block truncate">{item.label}</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-base font-extrabold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>{item.value}</span>
                <span className={`text-[8px] font-bold ${item.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {item.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Content Split Section */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
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
                className="w-full pl-10 pr-4 py-2 bg-[#FCFAF8] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl outline-none focus:border-orange-200 dark:focus:border-orange-500/50 font-medium text-slate-700 dark:text-slate-200 transition-all duration-200"
              />
            </div>

            {/* Date Picker mock */}
            <div className="relative w-full sm:w-48">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <select className="w-full pl-8 pr-4 py-2 bg-[#FCFAF8] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow">
                <option className="dark:bg-slate-900">01 May 2025 - 31 May 2025</option>
                <option className="dark:bg-slate-900">Today</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Payment Method Select */}
            <div className="relative w-full sm:w-44">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
              >
                <option value="All" className="dark:bg-slate-900">All Payment Methods</option>
                <option value="UPI" className="dark:bg-slate-900">UPI</option>
                <option value="Razorpay" className="dark:bg-slate-900">Razorpay</option>
                <option value="Paytm" className="dark:bg-slate-900">Paytm</option>
                <option value="Credit Card" className="dark:bg-slate-900">Credit Card</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Status Select */}
            <div className="relative w-full sm:w-36">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
              >
                <option value="All" className="dark:bg-slate-900">All Status</option>
                <option value="Completed" className="dark:bg-slate-900">Completed</option>
                <option value="Pending" className="dark:bg-slate-900">Pending</option>
                <option value="Failed" className="dark:bg-slate-900">Failed</option>
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
        <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-700/60 pb-1.5 flex-shrink-0 overflow-x-auto scrollbar-none">
          {['All Transactions', 'Completed', 'Pending', 'Refunded', 'Failed'].map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`pb-1 text-xs font-bold border-b-2 transition-all outline-none whitespace-nowrap ${
                  isActive ? 'border-[#FA5A24] text-[#FA5A24]' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
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
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/60 text-slate-400 text-[9px] font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-3 w-40">Transaction ID</th>
                    <th className="py-3 px-3 w-48">User</th>
                    <th className="py-3 px-3 w-36">Service</th>
                    <th className="py-3 px-3 w-28">Date & Time</th>
                    <th className="py-3 px-3 min-w-[160px]">Payment Method</th>
                    <th className="py-3 px-3 w-24">Amount</th>
                    <th className="py-3 px-3 w-24">Status</th>
                    <th className="py-3 px-3 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 dark:divide-slate-700/60 text-xs text-slate-700 dark:text-slate-200 font-semibold">
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
                      <td colSpan="8" className="text-center py-8 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/40 rounded-xl font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <AlertCircle size={15} />
                          <span>Could not load live transactions ({error}). Showing offline cache.</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedTxns.length > 0 ? (
                    paginatedTxns.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/40 transition-colors">
                        {/* Transaction ID */}
                        <td className="py-3.5 px-3 font-bold text-slate-600 dark:text-slate-300 select-text max-w-[150px] truncate" title={txn.id}>
                          {txn.id}
                        </td>
                        
                        {/* User Column */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={txn.user.avatar} className="w-7 h-7 rounded-full object-cover shadow-sm border border-slate-100 dark:border-slate-700 flex-shrink-0" alt="" />
                            <div className="flex flex-col min-w-0">
                              <span className="font-extrabold text-slate-800 dark:text-slate-100 leading-tight truncate">{txn.user.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold mt-0.5 select-text truncate">{txn.user.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Service mode */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-50 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                              {renderServiceIcon(txn.service)}
                            </span>
                            <span className="text-slate-500 dark:text-slate-300 font-bold text-[11px] truncate">{txn.service}</span>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-col whitespace-nowrap">
                            <span className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{txn.dateTime.date}</span>
                            <span className="text-[9px] text-slate-400 font-extrabold mt-0.5 uppercase">{txn.dateTime.time}</span>
                          </div>
                        </td>

                        {/* Payment Method */}
                        <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 font-bold text-[11px]">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-4 h-4 bg-slate-100/80 dark:bg-slate-700 rounded flex items-center justify-center text-[8px] font-extrabold border border-slate-200/50 dark:border-slate-600 text-[#FA5A24] flex-shrink-0">
                              {txn.method.charAt(0)}
                            </span>
                            <span className="truncate" title={`${txn.method} ${txn.methodDetail}`}>
                              {txn.method} {txn.methodDetail}
                            </span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-3 font-extrabold text-slate-800 dark:text-slate-100 whitespace-nowrap">{txn.amount}</td>

                        {/* Status badges */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wider ${
                            txn.status === 'Completed'
                              ? 'bg-[#E6F4EA] dark:bg-emerald-950/50 text-[#137333] dark:text-emerald-400'
                              : txn.status === 'Pending'
                              ? 'bg-[#FEF3C7] dark:bg-amber-950/50 text-[#D97706] dark:text-amber-400'
                              : 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                          }`}>
                            {txn.status}
                          </span>
                        </td>

                        {/* Actions view */}
                        <td className="py-3.5 px-3 text-center">
                          <button 
                            onClick={() => setSelectedTxn(txn)}
                            className="p-1.5 border border-slate-200 dark:border-slate-700 hover:bg-[#FA5A24]/5 dark:hover:bg-slate-700 hover:border-[#FA5A24]/30 text-slate-400 hover:text-[#FA5A24] dark:hover:text-[#FA5A24] rounded-lg transition-all cursor-pointer"
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
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 font-bold">
                Showing {filteredTxns.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredTxns.length)} of {filteredTxns.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 text-[10px] font-extrabold disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
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
                          : 'border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-orange-50/50 dark:hover:bg-slate-700 hover:text-[#FA5A24] dark:hover:text-[#FA5A24]'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 text-[10px] font-extrabold disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Right Side Widgets Column */}
          <div className="space-y-6">
            
            {/* Widget 1: Payment Summary Donut Chart */}
            <div className="bg-[#FCFAF8] dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">Payment Summary</h4>
              <div className="flex items-center gap-5 justify-between">
                <div className="w-28 h-28 flex-shrink-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dynamicSummaryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={48}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {dynamicSummaryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Central Text inside donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase leading-none block">Total</span>
                    <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 leading-none block truncate w-full" style={{ fontFamily: 'Outfit' }}>
                      {dynamicStats.totalRevenue}
                    </span>
                  </div>
                </div>

                {/* Donut Legend lists */}
                <div className="flex-1 space-y-2 text-[10px] font-bold">
                  {dynamicSummaryData.map((legend, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: legend.color }}></span>
                        <span className="text-slate-400 truncate">{legend.name}</span>
                      </div>
                      <span className="text-slate-700 dark:text-slate-200">{legend.formatted}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Widget 2: Payment Methods list */}
            <div className="bg-[#FCFAF8] dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Payment Methods</h4>
              <div className="space-y-3.5">
                {dynamicPaymentMethods.length > 0 ? (
                  dynamicPaymentMethods.map((item, idx) => (
                    <div key={idx} className="space-y-1.5 text-[10px] font-bold">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 bg-slate-200/50 dark:bg-slate-700 rounded flex items-center justify-center text-[7px] text-slate-500 dark:text-slate-300">{item.name.charAt(0)}</span>
                          <div>
                            <span className="text-slate-700 dark:text-slate-200 block leading-none">{item.name}</span>
                            <span className="text-[8px] text-slate-400 font-semibold block mt-0.5 leading-none">{item.count}</span>
                          </div>
                        </div>
                        <span className="text-slate-800 dark:text-slate-100">{item.amount}</span>
                      </div>
                      {/* Visual Progress Bar matching the shares */}
                      <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: item.pct }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-slate-400 text-[10px] font-semibold">
                    No payment method data available
                  </div>
                )}
              </div>
            </div>

            {/* Widget 3: Recent Refund Requests */}
            <div className="bg-[#FCFAF8] dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Recent Refund Requests</h4>
                <button className="text-[9px] font-extrabold text-[#FA5A24] hover:underline flex items-center">View All <ChevronRight size={10} /></button>
              </div>
              <div className="divide-y divide-slate-100/60">
                {refundRequests && refundRequests.length > 0 ? (
                  refundRequests.map((refund) => (
                    <div key={refund.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-[10px] font-bold">
                      <div className="flex items-center gap-2">
                        <img src={refund.avatar} className="w-7 h-7 rounded-full object-cover border border-slate-100" alt="" />
                        <div>
                          <span className="text-slate-700 dark:text-slate-200 block leading-none">{refund.user}</span>
                          <span className="text-[8px] text-slate-400 font-semibold block mt-0.5 leading-none">{refund.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-800 dark:text-slate-100 block leading-none">{refund.amount}</span>
                        <span className={`inline-block text-[8px] mt-0.5 leading-none ${
                          refund.status === 'Pending'
                            ? 'text-amber-500'
                            : refund.status === 'Approved'
                            ? 'text-emerald-500'
                            : 'text-rose-500'
                        }`}>{refund.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-slate-400 text-[10px] font-semibold">
                    No pending refund requests
                  </div>
                )}
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
