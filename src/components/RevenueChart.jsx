import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';

const mockData = [
  { day: 'Mon', revenue: 140000 },
  { day: 'Tue', revenue: 260000 },
  { day: 'Wed', revenue: 420000 },
  { day: 'Thu', revenue: 290000 },
  { day: 'Fri', revenue: 350000 },
  { day: 'Sat', revenue: 410000 },
  { day: 'Sun', revenue: 270000 },
];

// Custom Reference Label to draw the speech bubble dynamically
const CustomReferenceLabel = (props) => {
  const { cx, cy, labelText } = props;
  if (cx === undefined || cy === undefined) return null;
  
  return (
    <g className="select-none">
      {/* Speech bubble shadow wrapper (simulated via SVG path) */}
      <path
        d={`M ${cx - 42} ${cy - 30} 
            h 34 l 8 6 l 8 -6 h 34 
            a 6 6 0 0 0 6 -6 
            v -18 
            a 6 6 0 0 0 -6 -6 
            h -84 
            a 6 6 0 0 0 -6 6 
            v 18 
            a 6 6 0 0 0 6 6 Z`}
        fill="var(--color-white)"
        stroke="var(--color-slate-200)"
        strokeWidth="1"
        style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.15))' }}
      />
      {/* Text inside the callout bubble */}
      <text 
        x={cx} 
        y={cy - 32 + 16} 
        fill="var(--color-slate-800)" 
        fontSize="11px" 
        fontWeight="700" 
        textAnchor="middle"
        fontFamily="Outfit"
      >
        {labelText || '₹4,20,000'}
      </text>
    </g>
  );
};

const RevenueChart = ({ chartData, isLoading }) => {
  const [filter, setFilter] = useState('Weekly');

  if (isLoading && !chartData) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm flex-1 min-w-[300px] select-none animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 rounded-md" />
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="w-full h-[280px] bg-slate-100 dark:bg-slate-700/50 rounded-xl flex items-end p-4 gap-4">
          <div className="w-full h-1/3 bg-slate-200 dark:bg-slate-600/50 rounded" />
          <div className="w-full h-2/3 bg-slate-200 dark:bg-slate-600/50 rounded" />
          <div className="w-full h-full bg-slate-200 dark:bg-slate-600/50 rounded" />
          <div className="w-full h-1/2 bg-slate-200 dark:bg-slate-600/50 rounded" />
          <div className="w-full h-3/4 bg-slate-200 dark:bg-slate-600/50 rounded" />
          <div className="w-full h-4/5 bg-slate-200 dark:bg-slate-600/50 rounded" />
          <div className="w-full h-2/5 bg-slate-200 dark:bg-slate-600/50 rounded" />
        </div>
      </div>
    );
  }

  // Decide which dataset to use (Weekly, Daily, Monthly)
  const activeData = (chartData && chartData[filter] && chartData[filter].length > 0)
    ? chartData[filter]
    : mockData;

  // Find max data point to draw the reference dot and speech bubble dynamically
  const maxPoint = activeData.reduce(
    (max, item) => (item.revenue > max.revenue) ? item : max,
    activeData[0] || { day: 'Wed', revenue: 0 }
  );

  // Calculate dynamic scale domain and ticks
  const maxRevenue = activeData.reduce((max, item) => item.revenue > max ? item.revenue : max, 100000);
  const maxDomain = Math.max(10000, Math.ceil(maxRevenue / 50000) * 50000);
  const step = maxDomain / 5;
  const ticks = [0, step, step * 2, step * 3, step * 4, step * 5];

  const formatYAxis = (value) => {
    if (value === 0) return '₹0';
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}k`;
    }
    return `₹${value}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm flex-1 min-w-[300px]">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6 select-none">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>
          Revenue Analytics
        </h3>
        
        {/* Toggle Filters */}
        <div className="flex items-center bg-[#FBF9F8] dark:bg-slate-900 p-1 rounded-full border border-orange-50 dark:border-slate-700">
          {['Daily', 'Weekly', 'Monthly'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                filter === item
                  ? 'bg-[#FA5A24] text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#FA5A24] dark:hover:text-[#FA5A24]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={activeData}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FA5A24" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#FA5A24" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="4 4" 
              vertical={false} 
              stroke="var(--color-slate-200)" 
            />

            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
              dy={10}
            />

            <YAxis 
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
              domain={[0, maxDomain]}
              ticks={ticks}
              dx={-5}
            />

            <Tooltip 
              cursor={{ stroke: '#FFDCD0', strokeWidth: 1, strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: 'var(--color-white)', 
                borderColor: 'var(--color-slate-200)', 
                borderRadius: '8px',
                color: 'var(--color-slate-800)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' 
              }}
              labelStyle={{ fontWeight: 'bold', color: '#94A3B8', fontSize: '11px' }}
              itemStyle={{ color: '#FA5A24', fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
            />

            {/* Main Area & Spline Line */}
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#FA5A24" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              activeDot={{ r: 6, fill: '#FA5A24', stroke: '#FFF', strokeWidth: 2 }}
            />

            {/* Permanent Callout marker on highest value point */}
            {maxPoint && maxPoint.revenue > 0 && (
              <ReferenceDot 
                x={maxPoint.day} 
                y={maxPoint.revenue} 
                r={5} 
                fill="#FA5A24" 
                stroke="white" 
                strokeWidth={2}
                isFront={true}
              >
                <CustomReferenceLabel labelText={`₹${maxPoint.revenue.toLocaleString('en-IN')}`} />
              </ReferenceDot>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
