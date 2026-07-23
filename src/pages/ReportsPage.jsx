import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  ChevronRight, 
  Calendar, 
  SlidersHorizontal, 
  ChevronDown, 
  MessageSquare, 
  Phone, 
  Radio, 
  Video, 
  Info, 
  Receipt, 
  CheckCircle, 
  AlertCircle, 
  IndianRupee, 
  Users, 
  FileText 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceDot,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock Data for Revenue Overview Chart
const revenueData = [
  { date: '01 May', revenue: 1000000 },
  { date: '03 May', revenue: 1400000 },
  { date: '06 May', revenue: 2000000 },
  { date: '08 May', revenue: 2500000 },
  { date: '11 May', revenue: 4200000 }, // Highlighted Peak
  { date: '13 May', revenue: 2900000 },
  { date: '16 May', revenue: 2400000 },
  { date: '18 May', revenue: 3200000 },
  { date: '21 May', revenue: 3900000 },
  { date: '23 May', revenue: 2800000 },
  { date: '26 May', revenue: 3400000 },
  { date: '28 May', revenue: 4100000 },
  { date: '31 May', revenue: 3000000 },
];

// Mock Data for Bookings Overview Chart
const bookingsData = [
  { date: '01 May', bookings: 420 },
  { date: '03 May', bookings: 680 },
  { date: '06 May', bookings: 920 },
  { date: '08 May', bookings: 800 },
  { date: '11 May', bookings: 1100 },
  { date: '13 May', bookings: 980 },
  { date: '16 May', bookings: 1250 },
  { date: '18 May', bookings: 1650 },
  { date: '21 May', bookings: 1120 },
  { date: '23 May', bookings: 1050 },
  { date: '26 May', bookings: 1300 },
  { date: '28 May', bookings: 1480 },
  { date: '31 May', bookings: 1780 },
];

// Donut Chart Data (Revenue by Payment Method)
const paymentMethodData = [
  { name: 'UPI', value: 145600, percentage: '42.1%', color: '#10B981' },
  { name: 'Razorpay', value: 110400, percentage: '31.9%', color: '#FA5A24' },
  { name: 'Paytm', value: 45200, percentage: '13.1%', color: '#8B5CF6' },
  { name: 'Credit Card', value: 30400, percentage: '8.8%', color: '#EC4899' },
  { name: 'Other Wallets', value: 14000, percentage: '4.1%', color: '#3B82F6' },
];

const formatYAxisRevenue = (value) => {
  if (value === 0) return '₹0';
  return `₹${value / 100000}L`;
};

const formatYAxisBookings = (value) => {
  if (value === 0) return '0';
  if (value >= 1000) return `${value / 1000}K`;
  return value;
};

// Custom Tooltip Bubble for Revenue Peak
const CustomRevenueReferenceLabel = (props) => {
  const { cx, cy } = props;
  if (cx === undefined || cy === undefined) return null;
  
  return (
    <g>
      <path
        d={`M ${cx - 45} ${cy - 35} 
            h 40 l 5 6 l 5 -6 h 40 
            a 6 6 0 0 0 6 -6 
            v -20 
            a 6 6 0 0 0 -6 -6 
            h -90 
            a 6 6 0 0 0 -6 6 
            v 20 
            a 6 6 0 0 0 6 6 Z`}
        fill="#1E293B"
        stroke="#1E293B"
        strokeWidth="1"
        style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.15))' }}
      />
      <text 
        x={cx} 
        y={cy - 44} 
        fill="#FFFFFF" 
        fontSize="11px" 
        fontWeight="700" 
        textAnchor="middle"
        fontFamily="Outfit"
      >
        ₹42,000
      </text>
      <text 
        x={cx} 
        y={cy - 33} 
        fill="#94A3B8" 
        fontSize="9px" 
        fontWeight="500" 
        textAnchor="middle"
        fontFamily="Outfit"
      >
        11 May 2025
      </text>
    </g>
  );
};

export default function ReportsPage() {
  const [revenueToggle, setRevenueToggle] = useState('Weekly');
  const [bookingsToggle, setBookingsToggle] = useState('Weekly');

  const metricCards = [
    {
      title: 'Total Users',
      value: '15,420',
      trend: '12.5%',
      isPositive: true,
      icon: Users,
      iconBg: 'bg-orange-50',
      iconColor: 'text-[#FA5A24]',
    },
    {
      title: 'Total Astrologers',
      value: '358',
      trend: '8.4%',
      isPositive: true,
      icon: Sparkles,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Total Bookings',
      value: '1,245',
      trend: '15.3%',
      isPositive: true,
      icon: Calendar,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-500',
    },
    {
      title: 'Total Revenue',
      value: '₹3,45,600',
      trend: '18.7%',
      isPositive: true,
      icon: IndianRupee,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  const services = [
    {
      name: 'Chat Consultation',
      bookings: '625',
      revenue: '₹1,25,000',
      users: '520',
      growth: '18.6%',
      icon: MessageSquare,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      name: 'Call Consultation',
      bookings: '432',
      revenue: '₹95,400',
      users: '380',
      growth: '14.2%',
      icon: Phone,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      name: 'Live Astro',
      isLive: true,
      bookings: '128',
      revenue: '₹55,600',
      users: '110',
      growth: '22.8%',
      icon: Radio,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
    },
    {
      name: 'Video Call',
      bookings: '60',
      revenue: '₹30,200',
      users: '48',
      growth: '16.9%',
      icon: Video,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-500',
    },
  ];

  const recentReports = [
    {
      name: 'Revenue Report (May 2025)',
      date: '31 May 2025, 11:30 AM',
      icon: FileText,
      iconBg: 'bg-orange-50',
      iconColor: 'text-[#FA5A24]',
    },
    {
      name: 'Bookings Report (May 2025)',
      date: '31 May 2025, 11:30 AM',
      icon: Calendar,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-500',
    },
    {
      name: 'Users Report (May 2025)',
      date: '31 May 2025, 11:30 AM',
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      name: 'Payment Report (May 2025)',
      date: '31 May 2025, 11:30 AM',
      icon: IndianRupee,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full select-none pb-8">
      
      {/* Top Header & Export button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              Reports
            </h1>
            <Sparkles size={18} className="text-[#FA5A24] animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">Reports</span>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#FA5A24] rounded-xl text-xs font-bold text-[#FA5A24] bg-white hover:bg-[#FFF5F1]/30 transition-all duration-200 shadow-sm self-start sm:self-auto cursor-pointer">
          <Download size={14} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div 
              key={idx}
              className="bg-white p-5 rounded-2xl border border-orange-50/50 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-orange-100 transition-all duration-300 group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                <IconComponent size={22} className={card.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-slate-500 text-xs font-semibold block truncate mb-0.5">
                  {card.title}
                </span>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight leading-none mb-1.5" style={{ fontFamily: 'Outfit' }}>
                  {card.value}
                </h3>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <span>↑</span> {card.trend}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">this month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Options Row */}
      <div className="bg-white p-4 rounded-2xl border border-orange-50/50 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
          
          {/* Date Selector */}
          <div className="relative">
            <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-bold text-slate-700 outline-none focus:border-orange-200 transition-all duration-200 cursor-pointer">
              <option>01 May 2025 - 31 May 2025</option>
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Module Selector */}
          <div className="relative">
            <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-bold text-slate-700 outline-none focus:border-orange-200 transition-all duration-200 cursor-pointer">
              <option>All Modules</option>
              <option>Chat Consultation</option>
              <option>Call Consultation</option>
              <option>Live Astro</option>
              <option>Video Call</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Selector */}
          <div className="relative">
            <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-bold text-slate-700 outline-none focus:border-orange-200 transition-all duration-200 cursor-pointer">
              <option>All Status</option>
              <option>Successful</option>
              <option>Pending</option>
              <option>Failed</option>
              <option>Refunded</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Payment Method Selector */}
          <div className="relative">
            <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-bold text-slate-700 outline-none focus:border-orange-200 transition-all duration-200 cursor-pointer">
              <option>All Payment Methods</option>
              <option>UPI</option>
              <option>Razorpay</option>
              <option>Paytm</option>
              <option>Credit Card</option>
              <option>Wallets</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Filters Action Button */}
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all duration-200 cursor-pointer w-full xl:w-auto">
          <SlidersHorizontal size={14} className="text-[#FA5A24]" />
          <span>Filters</span>
        </button>
      </div>

      {/* Main Charts & Summary Section (3 Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Revenue Overview Line Chart (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-orange-50/50 shadow-sm flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>
              Revenue Overview
            </h3>
            <div className="flex items-center bg-[#FBF9F8] p-1 rounded-full border border-orange-50">
              {['Daily', 'Weekly'].map((item) => (
                <button
                  key={item}
                  onClick={() => setRevenueToggle(item)}
                  className={`px-3.5 py-1 rounded-full text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                    revenueToggle === item
                      ? 'bg-[#FA5A24] text-white shadow-sm'
                      : 'text-slate-500 hover:text-[#FA5A24]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full h-[240px] mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 25, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenueGraph" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FA5A24" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FA5A24" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={formatYAxisRevenue}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 500 }}
                  domain={[0, 5000000]}
                  ticks={[0, 1000000, 2000000, 3000000, 4000000, 5000000]}
                  dx={-5}
                />
                <Tooltip 
                  cursor={{ stroke: '#FFDCD0', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #FFF1EC', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(250, 90, 36, 0.08)' 
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#64748B', fontSize: '10px' }}
                  itemStyle={{ color: '#FA5A24', fontSize: '11px', fontWeight: 'bold' }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#FA5A24" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenueGraph)" 
                  activeDot={{ r: 5, fill: '#FA5A24', stroke: '#FFF', strokeWidth: 1.5 }}
                />
                <ReferenceDot 
                  x="11 May" 
                  y={4200000} 
                  r={5} 
                  fill="#FA5A24" 
                  stroke="white" 
                  strokeWidth={2}
                  isFront={true}
                >
                  <CustomRevenueReferenceLabel />
                </ReferenceDot>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Overview Chart (4 Columns) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-orange-50/50 shadow-sm flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>
              Bookings Overview
            </h3>
            <div className="flex items-center bg-[#FBF9F8] p-1 rounded-full border border-orange-50">
              {['Daily', 'Weekly'].map((item) => (
                <button
                  key={item}
                  onClick={() => setBookingsToggle(item)}
                  className={`px-3.5 py-1 rounded-full text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                    bookingsToggle === item
                      ? 'bg-[#8B5CF6] text-white shadow-sm'
                      : 'text-slate-500 hover:text-[#8B5CF6]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-[240px] mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookingsGraph" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={formatYAxisBookings}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 500 }}
                  domain={[0, 2000]}
                  ticks={[0, 400, 800, 1200, 1600, 2000]}
                  dx={-5}
                />
                <Tooltip 
                  cursor={{ stroke: '#E8DFFA', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #F5EEFF', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.08)' 
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#64748B', fontSize: '10px' }}
                  itemStyle={{ color: '#8B5CF6', fontSize: '11px', fontWeight: 'bold' }}
                  formatter={(value) => [`${value.toLocaleString('en-IN')}`, 'Bookings']}
                />
                <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorBookingsGraph)" 
                  activeDot={{ r: 5, fill: '#8B5CF6', stroke: '#FFF', strokeWidth: 1.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports Summary (3 Columns) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-orange-50/50 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 mb-1" style={{ fontFamily: 'Outfit' }}>
              Reports Summary
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold">Overall transactional log breakdown</p>
          </div>

          <div className="flex flex-col gap-3 flex-1 justify-center">
            
            {/* Total Transactions */}
            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-2xl border border-slate-105 border-slate-100 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-655 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Receipt size={16} />
                </div>
                <span className="text-[11px] font-bold text-slate-600">Total Transactions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">2,450</span>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Successful Transactions */}
            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-2xl border border-slate-100 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <CheckCircle size={16} />
                </div>
                <span className="text-[11px] font-bold text-slate-600">Successful Transactions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">2,120</span>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Failed Transactions */}
            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-2xl border border-slate-100 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <AlertCircle size={16} />
                </div>
                <span className="text-[11px] font-bold text-slate-600">Failed Transactions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">330</span>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Refunded Amount */}
            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-2xl border border-slate-100 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <IndianRupee size={16} />
                </div>
                <span className="text-[11px] font-bold text-slate-600">Refunded Amount</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">₹10,600</span>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Layout section (Top Performing Services, Donut, Recent Reports) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Top Performing Services (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-orange-50/50 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>
              Top Performing Services
            </h3>
          </div>

          <div className="flex-1 overflow-x-auto scrollbar-none">
            <table className="w-full text-left border-collapse min-w-[450px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-1 font-bold">Service Name</th>
                  <th className="pb-3 text-center font-bold">Total Bookings</th>
                  <th className="pb-3 text-center font-bold">Total Revenue</th>
                  <th className="pb-3 text-center font-bold">Total Users</th>
                  <th className="pb-3 pr-1 text-right font-bold">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700 font-medium">
                {services.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <tr key={idx} className="hover:bg-slate-55/20 hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="py-3 pl-1 flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg ${service.iconBg} ${service.iconColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={14} />
                        </div>
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          {service.name}
                          {service.isLive && (
                            <span className="bg-red-500 text-white text-[7px] font-extrabold px-1 rounded-sm tracking-wider uppercase animate-pulse">
                              LIVE
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-3 text-center text-slate-500 font-bold">{service.bookings}</td>
                      <td className="py-3 text-center text-slate-800 font-bold">{service.revenue}</td>
                      <td className="py-3 text-center text-slate-500 font-bold">{service.users}</td>
                      <td className="py-3 pr-1 text-right text-emerald-600 font-bold">
                        <span className="text-[10px] mr-0.5">↑</span> {service.growth}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center border-t border-slate-100 pt-4 mt-4">
            <button className="flex items-center gap-1 text-[11px] font-bold text-[#FA5A24] hover:text-orange-600 transition-colors cursor-pointer">
              <span>View All Services</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Revenue by Payment Method (4 Columns) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-orange-50/50 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>
              Revenue by Payment Method
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 flex-1">
            {/* Donut Chart */}
            <div className="relative w-[130px] h-[130px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={56}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Overlay inside Pie */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
                <span className="text-[13px] font-bold text-slate-800 tracking-tight leading-none" style={{ fontFamily: 'Outfit' }}>
                  ₹3,45,600
                </span>
                <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Total Revenue
                </span>
              </div>
            </div>

            {/* Legends list */}
            <div className="flex-1 w-full space-y-2">
              {paymentMethodData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-500 font-semibold">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-slate-800">₹{item.value.toLocaleString('en-IN')}</span>
                    <span className="text-slate-450 text-slate-400 font-medium">({item.percentage})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center border-t border-slate-100 pt-4 mt-4">
            <button className="flex items-center gap-1 text-[11px] font-bold text-[#FA5A24] hover:text-orange-600 transition-colors cursor-pointer">
              <span>View Full Report</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Recent Reports (3 Columns) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-orange-50/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>
              Recent Reports
            </h3>
            <button className="text-[10px] font-extrabold text-[#FA5A24] hover:text-orange-600 cursor-pointer">
              View All
            </button>
          </div>

          <div className="flex flex-col gap-3 flex-1 justify-center">
            {recentReports.map((report, idx) => {
              const ReportIcon = report.icon;
              return (
                <div key={idx} className="flex items-center justify-between p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg ${report.iconBg} ${report.iconColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <ReportIcon size={15} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-slate-705 text-slate-700 truncate leading-snug">
                        {report.name}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-semibold block leading-none mt-0.5">
                        {report.date}
                      </span>
                    </div>
                  </div>
                  <button className="p-1.5 text-slate-450 text-slate-400 hover:text-[#FA5A24] hover:bg-orange-50/50 rounded-lg transition-colors flex-shrink-0 cursor-pointer">
                    <Download size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Alert bar */}
      <div className="bg-[#FFF5F1]/80 border border-orange-100/50 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm select-none">
        <Info size={16} className="text-[#FA5A24] flex-shrink-0" />
        <span className="text-[11px] md:text-xs text-slate-600 font-medium leading-normal">
          All reports are automatically generated based on the selected filters and date range.
        </span>
      </div>

    </div>
  );
}
