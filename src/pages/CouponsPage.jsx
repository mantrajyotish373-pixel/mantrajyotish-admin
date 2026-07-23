import React, { useState, useMemo } from 'react';
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
  Plus, 
  Settings, 
  User, 
  HelpCircle,
  X,
  PlusCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Initial coupons mock data matching screenshot
const initialCoupons = [
  {
    id: 1,
    name: 'WELCOME20',
    desc: 'Welcome Coupon',
    code: 'WELCOME20',
    discount: '20% OFF',
    discountVal: 20,
    type: 'Percentage',
    minOrder: '₹499',
    validTill: '31 May 2025',
    status: 'Active',
    used: '2,350',
    iconType: 'settings'
  },
  {
    id: 2,
    name: 'FLAT100',
    desc: 'Flat 100 OFF',
    code: 'FLAT100',
    discount: '₹100 OFF',
    discountVal: 100,
    type: 'Flat',
    minOrder: '₹399',
    validTill: '15 Jun 2025',
    status: 'Active',
    used: '1,245',
    iconType: 'tag'
  },
  {
    id: 3,
    name: 'ASTRO50',
    desc: 'Astro Special',
    code: 'ASTRO50',
    discount: '50% OFF',
    discountVal: 50,
    type: 'Percentage',
    minOrder: '₹999',
    validTill: '30 Jun 2025',
    status: 'Active',
    used: '856',
    iconType: 'gift'
  },
  {
    id: 4,
    name: 'NEWUSER10',
    desc: 'New User Offer',
    code: 'NEWUSER10',
    discount: '10% OFF',
    discountVal: 10,
    type: 'Percentage',
    minOrder: '₹299',
    validTill: '10 Jun 2025',
    status: 'Inactive',
    used: '0',
    iconType: 'user'
  },
  {
    id: 5,
    name: 'SUMMER30',
    desc: 'Summer Offer',
    code: 'SUMMER30',
    discount: '30% OFF',
    discountVal: 30,
    type: 'Percentage',
    minOrder: '₹799',
    validTill: '01 May 2025',
    status: 'Expired',
    used: '3,125',
    iconType: 'tag'
  },
  {
    id: 6,
    name: 'FESTIVE200',
    desc: 'Festive Special',
    code: 'FESTIVE200',
    discount: '₹200 OFF',
    discountVal: 200,
    type: 'Flat',
    minOrder: '₹999',
    validTill: '20 Apr 2025',
    status: 'Expired',
    used: '2,874',
    iconType: 'gift'
  }
];

// Recharts donut configuration
const initialSummaryData = [
  { name: 'Active', value: 32, color: '#10B981' },
  { name: 'Inactive', value: 12, color: '#F59E0B' },
  { name: 'Expired', value: 12, color: '#94A3B8' }
];

const CouponsPage = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [discountTypeFilter, setDiscountTypeFilter] = useState('All');
  const [copiedCode, setCopiedCode] = useState(null);

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

  // Stats calculation
  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter(c => c.status === 'Active').length;
    const inactive = coupons.filter(c => c.status === 'Inactive').length;
    const usedSum = coupons.reduce((acc, curr) => acc + parseInt(curr.used.replace(/,/g, '') || 0), 0);
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
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesType = discountTypeFilter === 'All' || c.type === discountTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, searchQuery, statusFilter, discountTypeFilter]);

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
      `"${c.name}","${c.desc}",${c.code},"${c.discount}",${c.type},"${c.minOrder}","${c.validTill}",${c.status},${c.used.replace(/,/g, '')}`
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

  return (
    <div className="space-y-6 select-none pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
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
          { label: 'Total Coupons', value: stats.total, trend: '▲ 12.5%', isUp: true, color: 'text-orange-500 bg-orange-50/70', icon: Tag },
          { label: 'Active Coupons', value: stats.active, trend: '▲ 18.6%', isUp: true, color: 'text-emerald-500 bg-emerald-50/70', icon: CheckCircle },
          { label: 'Inactive Coupons', value: stats.inactive, trend: '▼ 4.3%', isUp: false, color: 'text-amber-500 bg-amber-50/70', icon: Pause },
          { label: 'Total Used', value: stats.usedSum.toLocaleString(), trend: '▲ 16.8%', isUp: true, color: 'text-rose-500 bg-rose-50/70', icon: Gift }
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
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search coupon name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FCFAF8] border border-slate-200 text-xs rounded-xl outline-none focus:border-orange-200 focus:bg-white font-medium text-slate-700 transition-all duration-200"
              />
            </div>

            {/* Status Selector */}
            <div className="relative w-full sm:w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Expired">Expired</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Discount Type Select */}
            <div className="relative w-full sm:w-44">
              <select
                value={discountTypeFilter}
                onChange={(e) => setDiscountTypeFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
              >
                <option value="All">All Discount Types</option>
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
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
          </div>
        </div>

        {/* Grid Splits: Left Side Table vs Right Side Widgets */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* Table Container Column */}
          <div className="xl:col-span-2 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[9px] font-extrabold uppercase tracking-wider">
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
                <tbody className="divide-y divide-slate-100/70 text-xs text-slate-700 font-semibold">
                  {filteredCoupons.length > 0 ? (
                    filteredCoupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Coupon Name & icon details */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 bg-orange-50 border border-orange-100/60 rounded-full flex items-center justify-center flex-shrink-0">
                              {renderCouponIcon(coupon.iconType)}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-800 leading-tight select-text">{coupon.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold mt-0.5 leading-none">{coupon.desc}</span>
                            </div>
                          </div>
                        </td>

                        {/* Code click copy */}
                        <td className="py-4 px-3">
                          <button 
                            onClick={() => handleCopyCode(coupon.code)}
                            className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200/60 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-600 transition-colors"
                          >
                            <span>{coupon.code}</span>
                            <Copy size={9} className="text-slate-400" />
                          </button>
                        </td>

                        {/* Discount */}
                        <td className="py-4 px-3 font-extrabold text-[#FA5A24]">{coupon.discount}</td>

                        {/* Discount type */}
                        <td className="py-4 px-3 text-slate-500 font-bold">{coupon.type}</td>

                        {/* Min Order */}
                        <td className="py-4 px-3 text-slate-800 font-extrabold">{coupon.minOrder}</td>

                        {/* Valid till */}
                        <td className="py-4 px-3 text-slate-500 font-bold">{coupon.validTill}</td>

                        {/* Status badges */}
                        <td className="py-4 px-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider ${
                            coupon.status === 'Active'
                              ? 'bg-[#E6F4EA] text-[#137333]'
                              : coupon.status === 'Inactive'
                              ? 'bg-[#FEF3C7] text-[#D97706]'
                              : 'bg-slate-100 text-slate-400'
                          }`}>
                            {coupon.status}
                          </span>
                        </td>

                        {/* Used count */}
                        <td className="py-4 px-3 font-extrabold text-slate-800">{coupon.used}</td>

                        {/* Actions */}
                        <td className="py-4 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => setEditCoupon(coupon)}
                              className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                            >
                              <Pencil size={11} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="p-1.5 border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-lg transition-colors"
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
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold">Showing 1 to {filteredCoupons.length} of {coupons.length} entries</span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-extrabold hover:bg-slate-50">&lt;</button>
                <button className="px-3 py-1 bg-[#FA5A24] text-white rounded-lg text-[10px] font-extrabold">1</button>
                <button className="px-3 py-1 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-extrabold">2</button>
                <button className="px-3 py-1 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-extrabold">3</button>
                <span className="px-0.5 text-slate-450 text-[10px]">...</span>
                <button className="px-3 py-1 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-extrabold">10</button>
                <button className="px-2 py-1 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-extrabold">&gt;</button>
              </div>
            </div>
          </div>

          {/* Right Side Column Widgets */}
          <div className="space-y-6">
            
            {/* Widget 1: Coupons Summary Pie Chart */}
            <div className="bg-[#FCFAF8] border border-slate-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Coupons Summary</h4>
                <button 
                  onClick={handleExportCSV}
                  className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-lg text-[9px] font-extrabold transition-all"
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
                    <span className="text-[10px] font-bold text-slate-800 leading-none" style={{ fontFamily: 'Outfit' }}>{coupons.length}</span>
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
                      <span className="text-slate-700">{legend.value} ({legend.percent}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Widget 2: Create New Coupon Form */}
            <form onSubmit={handleCreateCoupon} className="bg-[#FCFAF8] border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 text-xs font-semibold text-slate-650">
              <h4 className="text-xs font-extrabold text-slate-850 uppercase tracking-wider pb-1 border-b border-slate-100">Create New Coupon</h4>
              
              {/* Coupon Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Coupon Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter coupon name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-200 text-xs font-medium text-slate-700"
                />
              </div>

              {/* Coupon Code & Generate Button */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider font-bold">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter coupon code"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="flex-grow px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-200 text-xs font-bold text-slate-700 uppercase"
                  />
                  <button 
                    type="button"
                    onClick={handleGenerateCode}
                    className="px-3.5 py-2 border border-orange-200 text-[#FA5A24] bg-orange-50 hover:bg-orange-100 rounded-xl text-[10px] font-bold tracking-tight transition-all"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Discount Type Select */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider font-bold">Discount Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-200 text-xs font-bold text-slate-700"
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Flat">Flat</option>
                </select>
              </div>

              {/* Discount Value */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider font-bold">Discount Value</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="Enter discount value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-200 text-xs font-bold text-slate-700"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-xs">
                    {newType === 'Percentage' ? '%' : '₹'}
                  </span>
                </div>
              </div>

              {/* Minimum Order */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider font-bold">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter minimum order amount"
                  value={newMinOrder}
                  onChange={(e) => setNewMinOrder(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-200 text-xs font-bold text-slate-700"
                />
              </div>

              {/* Valid Till date picker */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider font-bold">Valid Till</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-200 text-xs font-bold text-slate-700 pr-10"
                  />
                </div>
              </div>

              {/* Active Inactive switch */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider font-bold">Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newStatus} 
                    onChange={(e) => setNewStatus(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FA5A24]"></div>
                  <span className="ml-2 text-[10px] font-bold text-slate-600">{newStatus ? 'Active' : 'Inactive'}</span>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-[#FA5A24] hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md transition-all pt-3.5"
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
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-sm w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Pencil size={15} className="text-[#FA5A24]" />
                <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>Edit Coupon</h3>
              </div>
              <button 
                type="button"
                onClick={() => setEditCoupon(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Description</label>
                <input
                  type="text"
                  required
                  value={editCoupon.desc}
                  onChange={(e) => setEditCoupon({ ...editCoupon, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl outline-none text-slate-800 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Minimum Order Amount</label>
                <input
                  type="text"
                  required
                  value={editCoupon.minOrder}
                  onChange={(e) => setEditCoupon({ ...editCoupon, minOrder: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl outline-none text-slate-800 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Valid Till</label>
                <input
                  type="text"
                  required
                  value={editCoupon.validTill}
                  onChange={(e) => setEditCoupon({ ...editCoupon, validTill: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl outline-none text-slate-850 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Status</label>
                <select
                  value={editCoupon.status}
                  onChange={(e) => setEditCoupon({ ...editCoupon, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl outline-none text-slate-800 font-bold"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-slate-100 bg-slate-50/50">
              <button 
                type="button"
                onClick={() => setEditCoupon(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-xl text-[11px] font-bold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-[#FA5A24] hover:bg-orange-600 text-white rounded-xl text-[11px] font-bold shadow-sm"
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
