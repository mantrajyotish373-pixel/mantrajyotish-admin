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

const data = [
  { day: 'Mon', revenue: 140000 },
  { day: 'Tue', revenue: 260000 },
  { day: 'Wed', revenue: 420000 },
  { day: 'Thu', revenue: 290000 },
  { day: 'Fri', revenue: 350000 },
  { day: 'Sat', revenue: 410000 },
  { day: 'Sun', revenue: 270000 },
];

const formatYAxis = (value) => {
  if (value === 0) return '₹0';
  return `₹${value / 100000}L`;
};

// Custom Reference Label to draw the Wednesday "₹4,20,000" speech bubble
const CustomReferenceLabel = (props) => {
  const { cx, cy } = props;
  if (cx === undefined || cy === undefined) return null;
  
  return (
    <g>
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
        fill="white"
        stroke="#F1F5F9"
        strokeWidth="1"
        style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.04))' }}
      />
      {/* Text inside the callout bubble */}
      <text 
        x={cx} 
        y={cy - 32 + 16} 
        fill="#1E293B" 
        fontSize="11px" 
        fontWeight="700" 
        textAnchor="middle"
        fontFamily="Outfit"
      >
        ₹4,20,000
      </text>
    </g>
  );
};

const RevenueChart = () => {
  const [filter, setFilter] = useState('Weekly');

  return (
    <div className="bg-white p-6 rounded-2xl border border-orange-50/50 shadow-sm flex-1 min-w-[300px]">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6 select-none">
        <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>
          Revenue Analytics
        </h3>
        
        {/* Toggle Filters */}
        <div className="flex items-center bg-[#FBF9F8] p-1 rounded-full border border-orange-50">
          {['Daily', 'Weekly', 'Monthly'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                filter === item
                  ? 'bg-[#FA5A24] text-white shadow-sm'
                  : 'text-slate-500 hover:text-[#FA5A24]'
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
            data={data}
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
              stroke="#F1F5F9" 
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
              domain={[0, 500000]}
              ticks={[0, 100000, 200000, 300000, 400000, 500000]}
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
              labelStyle={{ fontWeight: 'bold', color: '#64748B', fontSize: '11px' }}
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

            {/* Permanent Callout marker on Wednesday */}
            <ReferenceDot 
              x="Wed" 
              y={420000} 
              r={5} 
              fill="#FA5A24" 
              stroke="white" 
              strokeWidth={2}
              isFront={true}
            >
              <CustomReferenceLabel />
            </ReferenceDot>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
