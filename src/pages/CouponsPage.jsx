import React, { useState, useMemo, useEffect } from 'react';
import { 
  Tag, 
  CheckCircle, 
  Pause, 
  Gift, 
  Search, 
  Calendar, 
  Download, 
  Copy, 
  Pencil, 
  Trash, 
  Settings, 
  User, 
  X,
  PlusCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const mapCouponData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item, idx) => {
    const name = item.name || item.title || item.code || 'COUPON';
    const code = item.code || item.couponCode || 'CODE';
    const desc = item.desc || item.description || 'Special Discount';
    const discountVal = item.discount || item.discountValue || 0;
    const type = item.type || item.discountType || 'Percentage';
    const formattedDiscount = type === 'Percentage' ? `${discountVal}% OFF` : `₹${discountVal} OFF`;
    const minOrder = item.minOrder || item.minAmount ? `₹${item.minOrder || item.minAmount}` : '₹0';
    const validTill = item.validTill || item.expiryDate ? new Date(item.validTill || item.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const status = item.status || (item.isActive ? 'Active' : 'Inactive');
    const used = String(item.used || item.timesUsed || 0);

    return {
      id: item._id || item.id || idx + 1,
      name,
      desc,
      code,
      discount: formattedDiscount,
      discountVal,
      type,
      minOrder,
      validTill,
      status,
      used,
      iconType: type === 'Percentage' ? 'gift' : 'tag'
    };
  });
};

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [discountTypeFilter, setDiscountTypeFilter] = useState('All');
  const [copiedCode, setCopiedCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // New coupon form state
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState('Percentage');
  const [newValue, setNewValue] = useState('');
  const [newMinOrder, setNewMinOrder] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newStatus, setNewStatus] = useState(true);

  // Edit coupon modal state
  const [editCoupon, setEditCoupon] = useState(null);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app";
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/coupon/all`, { headers })
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json?.success && Array.isArray(json.data)) {
          setCoupons(mapCouponData(json.data));
        } else if (Array.isArray(json)) {
          setCoupons(mapCouponData(json));
        } else {
          setCoupons([]);
        }
      })
      .catch(() => {
        setCoupons([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter(c => c.status === 'Active').length;
    const inactive = coupons.filter(c => c.status === 'Inactive').length;
    const usedSum = coupons.reduce((acc, curr) => acc + parseInt(String(curr.used || 0).replace(/,/g, '') || 0), 0);
    return { total, active, inactive, usedSum };
  }, [coupons]);

  // Donut chart dynamic data mapping based on state list
  const summaryData = useMemo(() => {
    const active = coupons.filter(c => c.status === 'Active').length;
    const inactive = coupons.filter(c => c.status === 'Inactive').length;
    const expired = coupons.filter(c => c.status === 'Expired').length;
    const total = active + inactive + expired || 1;
    return [
      { name: 'Active', value: active, percent: ((active / total) * 100).toFixed(1), color: '#10B981' },
      { name: 'Inactive', value: inactive, percent: ((inactive / total) * 100).toFixed(1), color: '#F59E0B' },
      { name: 'Expired', value: expired, percent: ((expired / total) * 100).toFixed(1), color: '#94A3B8' }
    ];
  }, [coupons]);

  // Filters logic
  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => {
      const matchesSearch = 
        String(c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(c.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(c.desc || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesType = discountTypeFilter === 'All' || c.type === discountTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, searchQuery, statusFilter, discountTypeFilter]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage) || 1;
  const paginatedCoupons = filteredCoupons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Generate code button
  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCode(code);
  };

  // Copy coupon code to clipboard
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Create Coupon handler
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newName || !newCode || !newValue) return;

    const formattedVal = newType === 'Percentage' ? `${newValue}% OFF` : `₹${newValue} OFF`;
    const newCouponItem = {
      id: Date.now(),
      name: newCode.toUpperCase(),
      desc: newName,
      code: newCode.toUpperCase(),
      discount: formattedVal,
      discountVal: parseInt(newValue),
      type: newType,
      minOrder: newMinOrder ? `₹${newMinOrder}` : '₹0',
      validTill: newDate ? new Date(newDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '31 Dec 2025',
      status: newStatus ? 'Active' : 'Inactive',
      used: '0',
      iconType: newType === 'Percentage' ? 'gift' : 'tag'
    };

    setCoupons(prev => [newCouponItem, ...prev]);
    // Reset Form
    setNewName('');
    setNewCode('');
    setNewValue('');
    setNewMinOrder('');
    setNewDate('');
    setNewStatus(true);
  };

  // Delete Coupon
  const handleDeleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  // Save Edit Coupon
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setCoupons(prev => prev.map(c => c.id === editCoupon.id ? editCoupon : c));
    setEditCoupon(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Coupon Name,Description,Coupon Code,Discount,Type,Min Order,Valid Till,Status,Times Used\n'];
    const rows = filteredCoupons.map(c => 
      `"${c.name}","${c.desc}",${c.code},"${c.discount}",${c.type},"${c.minOrder}","${c.validTill}",${c.status},${String(c.used).replace(/,/g, '')}`
    );
    const blob = new Blob([...headers, ...rows.map(r => r + '\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Coupons_Export_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  // Icon type picker helper
  const renderCouponIcon = (type) => {
    const classes = "w-4 h-4 text-orange-500";
    if (type === 'settings') return <Settings className={classes} />;
    if (type === 'user') return <User className={classes} />;
    if (type === 'gift') return <Gift className={classes} />;
    return <Tag className={classes} />;
  };

  if (loading) {
    return (
      <div className="space-y-6 select-none pb-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-36 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
            Coupons <span className="text-[#FA5A24]">✨</span>
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">Coupons</span>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Coupons', value: stats.total, trend: '▲ 12.5%', isUp: true, color: 'text-orange-500 bg-orange-50/70 dark:bg-orange-950/40', icon: Tag },
          { label: 'Active Coupons', value: stats.active, trend: '▲ 18.6%', isUp: true, color: 'text-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40', icon: CheckCircle },
          { label: 'Inactive Coupons', value: stats.inactive, trend: '▼ 4.3%', isUp: false, color: 'text-amber-500 bg-amber-50/70 dark:bg-amber-950/40', icon: Pause },
          { label: 'Total Used', value: stats.usedSum.toLocaleString(), trend: '▲ 16.8%', isUp: true, color: 'text-rose-500 bg-rose-50/70 dark:bg-rose-950/40', icon: Gift }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-100/80 dark:border-slate-700/60 rounded-2xl p-4.5 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} flex-shrink-0`}>
              <item.icon size={18} />
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block truncate">{item.label}</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-base font-extrabold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>{item.value}</span>
                <span className={`text-[8px] font-bold ${item.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {item.trend}
                </span>
              </div>
              <span className="text-[8px] text-slate-400 font-semibold mt-0.5 block">this month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Content Split Section */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Filters Toolbar */}
        <div className="flex flex-col lg:flex-row items-center gap-3 justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Input bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search coupon name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FCFAF8] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl outline-none focus:border-orange-200 dark:focus:border-slate-600 font-medium text-slate-700 dark:text-slate-200 transition-all duration-200"
              />
            </div>

            {/* Status Selector */}
            <div className="relative w-full sm:w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-200 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
              >
                <option value="All" className="dark:bg-slate-900">All Status</option>
                <option value="Active" className="dark:bg-slate-900">Active</option>
                <option value="Inactive" className="dark:bg-slate-900">Inactive</option>
                <option value="Expired" className="dark:bg-slate-900">Expired</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Discount Type Select */}
            <div className="relative w-full sm:w-44">
              <select
                value={discountTypeFilter}
                onChange={(e) => setDiscountTypeFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-200 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
              >
                <option value="All" className="dark:bg-slate-900">All Discount Types</option>
                <option value="Percentage" className="dark:bg-slate-900">Percentage</option>
                <option value="Flat" className="dark:bg-slate-900">Flat</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Date Picker mock */}
            <div className="relative w-full sm:w-48">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <select className="w-full pl-8 pr-4 py-2 bg-[#FCFAF8] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-200 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow">
                <option className="dark:bg-slate-900">01 May 2025 - 31 May 2025</option>
                <option className="dark:bg-slate-900">Today</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>
          </div>
        </div>

        {/* Grid Splits: Left Side Table vs Right Side Widgets */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* Table Container Column */}
          <div className="xl:col-span-2 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/60 text-slate-400 text-[9px] font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-3">Coupon Name</th>
                    <th className="py-3 px-3">Coupon Code</th>
                    <th className="py-3 px-3">Discount</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Min. Order</th>
                    <th className="py-3 px-3">Valid Till</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Used</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 dark:divide-slate-700/60 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                  {paginatedCoupons.length > 0 ? (
                    paginatedCoupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/40 transition-colors">
                        
                        {/* Coupon Name & icon details */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 bg-orange-50 dark:bg-orange-950/40 border border-orange-100/60 dark:border-orange-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                              {renderCouponIcon(coupon.iconType)}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-800 dark:text-slate-100 leading-tight select-text">{coupon.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold mt-0.5 leading-none">{coupon.desc}</span>
                            </div>
                          </div>
                        </td>

                        {/* Code click copy */}
                        <td className="py-4 px-3">
                          <button 
                            onClick={() => handleCopyCode(coupon.code)}
                            className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-200/60 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                          >
                            <span>{coupon.code}</span>
                            <Copy size={9} className="text-slate-400" />
                          </button>
                        </td>

                        {/* Discount */}
                        <td className="py-4 px-3 font-extrabold text-[#FA5A24]">{coupon.discount}</td>

                        {/* Discount type */}
                        <td className="py-4 px-3 text-slate-500 dark:text-slate-400 font-bold">{coupon.type}</td>

                        {/* Min Order */}
                        <td className="py-4 px-3 text-slate-800 dark:text-slate-100 font-extrabold">{coupon.minOrder}</td>

                        {/* Valid till */}
                        <td className="py-4 px-3 text-slate-500 dark:text-slate-400 font-bold">{coupon.validTill}</td>

                        {/* Status badges */}
                        <td className="py-4 px-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider ${
                            coupon.status === 'Active'
                              ? 'bg-[#E6F4EA] dark:bg-emerald-950/50 text-[#137333] dark:text-emerald-400'
                              : coupon.status === 'Inactive'
                              ? 'bg-[#FEF3C7] dark:bg-amber-950/50 text-[#D97706] dark:text-amber-400'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-400'
                          }`}>
                            {coupon.status}
                          </span>
                        </td>

                        {/* Used count */}
                        <td className="py-4 px-3 font-extrabold text-slate-800 dark:text-slate-100">{coupon.used}</td>

                        {/* Actions */}
                        <td className="py-4 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => setEditCoupon(coupon)}
                              className="p-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <Pencil size={11} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="p-1.5 border border-red-100 dark:border-rose-900/50 hover:bg-red-50 dark:hover:bg-rose-950/50 text-red-500 hover:text-red-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash size={11} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-12 text-center text-slate-400 font-bold">
                        No coupon records match your filter queries.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table pagination footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 font-bold">
                Showing {filteredCoupons.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredCoupons.length)} of {filteredCoupons.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 text-[10px] font-extrabold disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const p = idx + 1;
                  const isActive = p === currentPage;
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1 text-[10px] font-extrabold rounded-lg cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-[#FA5A24] text-white shadow-sm' 
                          : 'border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-orange-50/50 dark:hover:bg-slate-700'
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

          {/* Right Side Column Widgets */}
          <div className="space-y-6">
            
            {/* Widget 1: Coupons Summary Pie Chart */}
            <div className="bg-[#FCFAF8] dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Coupons Summary</h4>
                <button 
                  onClick={handleExportCSV}
                  className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 rounded-lg text-[9px] font-extrabold transition-all cursor-pointer"
                >
                  <Download size={10} />
                  <span>Export</span>
                </button>
              </div>
              
              <div className="flex items-center gap-5 justify-between">
                <div className="w-24 h-24 flex-shrink-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summaryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={28}
                        outerRadius={40}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {summaryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 leading-none" style={{ fontFamily: 'Outfit' }}>{coupons.length}</span>
                    <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5 leading-none">Total</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="flex-grow space-y-1.5 text-[9px] font-bold">
                  {summaryData.map((legend, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: legend.color }}></span>
                        <span className="text-slate-400 truncate">{legend.name}</span>
                      </div>
                      <span className="text-slate-700 dark:text-slate-200">{legend.value} ({legend.percent}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Widget 2: Create New Coupon Form */}
            <form onSubmit={handleCreateCoupon} className="bg-[#FCFAF8] dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4 text-xs font-semibold text-slate-650 dark:text-slate-300">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider pb-1 border-b border-slate-100 dark:border-slate-700/60">Create New Coupon</h4>
              
              {/* Coupon Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Coupon Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter coupon name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-orange-200 dark:focus:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-200"
                />
              </div>

              {/* Coupon Code & Generate Button */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter coupon code"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="flex-grow px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-orange-200 dark:focus:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase"
                  />
                  <button 
                    type="button"
                    onClick={handleGenerateCode}
                    className="px-3.5 py-2 border border-orange-200 dark:border-orange-900/50 text-[#FA5A24] bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 rounded-xl text-[10px] font-bold tracking-tight transition-all cursor-pointer"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Discount Type Select */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Discount Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-orange-200 dark:focus:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  <option value="Percentage" className="dark:bg-slate-800">Percentage</option>
                  <option value="Flat" className="dark:bg-slate-800">Flat</option>
                </select>
              </div>

              {/* Discount Value */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Discount Value</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="Enter discount value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-orange-200 dark:focus:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-xs">
                    {newType === 'Percentage' ? '%' : '₹'}
                  </span>
                </div>
              </div>

              {/* Minimum Order */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter minimum order amount"
                  value={newMinOrder}
                  onChange={(e) => setNewMinOrder(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-orange-200 dark:focus:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200"
                />
              </div>

              {/* Valid Till date picker */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Valid Till</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-orange-200 dark:focus:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 pr-10"
                  />
                </div>
              </div>

              {/* Active Inactive switch */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newStatus} 
                    onChange={(e) => setNewStatus(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FA5A24]"></div>
                  <span className="ml-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">{newStatus ? 'Active' : 'Inactive'}</span>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-[#FA5A24] hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md transition-all pt-3.5 cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>Create Coupon</span>
              </button>

            </form>

          </div>

        </div>

      </div>

      {/* Copy Alert Popup toast banner */}
      {copiedCode && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200 z-50">
          <span>Copied code <span className="text-[#FA5A24] select-text">{copiedCode}</span> to clipboard!</span>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {editCoupon && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl max-w-sm w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Pencil size={15} className="text-[#FA5A24]" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>Edit Coupon</h3>
              </div>
              <button 
                type="button"
                onClick={() => setEditCoupon(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Description</label>
                <input
                  type="text"
                  required
                  value={editCoupon.desc}
                  onChange={(e) => setEditCoupon({ ...editCoupon, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-slate-100 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Minimum Order Amount</label>
                <input
                  type="text"
                  required
                  value={editCoupon.minOrder}
                  onChange={(e) => setEditCoupon({ ...editCoupon, minOrder: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-slate-100 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Valid Till</label>
                <input
                  type="text"
                  required
                  value={editCoupon.validTill}
                  onChange={(e) => setEditCoupon({ ...editCoupon, validTill: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-slate-100 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Status</label>
                <select
                  value={editCoupon.status}
                  onChange={(e) => setEditCoupon({ ...editCoupon, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-slate-100 font-bold"
                >
                  <option value="Active" className="dark:bg-slate-800">Active</option>
                  <option value="Inactive" className="dark:bg-slate-800">Inactive</option>
                  <option value="Expired" className="dark:bg-slate-800">Expired</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800">
              <button 
                type="button"
                onClick={() => setEditCoupon(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl text-[11px] font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-[#FA5A24] hover:bg-orange-600 text-white rounded-xl text-[11px] font-bold shadow-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default CouponsPage;
