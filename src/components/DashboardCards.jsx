import React from 'react';
import { useNavigate } from 'react-router-dom';
import { can } from '../config/authSession';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  IndianRupee, 
  Star, 
  Wallet, 
  Phone, 
  MessageSquare 
} from 'lucide-react';

const DashboardCards = ({ data, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading && !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm flex items-center gap-4 animate-pulse"
          >
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-6 w-20 bg-slate-300 dark:bg-slate-600 rounded" />
              <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cardsData = (data || !isLoading) ? [
    {
      title: 'Total Users',
      value: Number(data?.totalUsers || 0).toLocaleString('en-IN'),
      trend: data?.trends?.users || '0%',
      isPositive: data?.trendsIsPositive?.users !== false,
      icon: Users,
      iconBg: 'bg-orange-50',
      iconColor: 'text-[#FA5A24]',
      path: '/users'
    },
    {
      title: 'Total Astrologers',
      value: Number(data?.totalAstrologers || 0).toLocaleString('en-IN'),
      trend: data?.trends?.astrologers || '0%',
      isPositive: data?.trendsIsPositive?.astrologers !== false,
      icon: UserCheck,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      path: '/astrologers/all'
    },
    {
      title: "Today's Bookings",
      value: Number(data?.todayBookings || 0).toLocaleString('en-IN'),
      trend: data?.trends?.bookings || '0%',
      isPositive: data?.trendsIsPositive?.bookings !== false,
      icon: Calendar,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-500',
      path: '/bookings'
    },
    {
      title: "Today's Revenue",
      value: `₹${Number(data?.todayRevenue || 0).toLocaleString('en-IN')}`,
      trend: data?.trends?.revenue || '0%',
      isPositive: data?.trendsIsPositive?.revenue !== false,
      icon: IndianRupee,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      path: '/payments'
    },
    {
      title: 'Pending KYC',
      value: Number(data?.pendingKyc || 0).toLocaleString('en-IN'),
      trend: data?.trends?.kyc || '0%',
      isPositive: data?.trendsIsPositive?.kyc !== false,
      icon: Star,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      path: '/kyc-verification'
    },
    {
      title: 'Withdraw Requests',
      value: Number(data?.withdrawRequests || 0).toLocaleString('en-IN'),
      trend: data?.trends?.withdraw || '0%',
      isPositive: data?.trendsIsPositive?.withdraw !== false,
      icon: Wallet,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      path: '/withdraw-requests'
    },
    {
      title: 'Active Calls',
      value: Number(data?.activeCalls || 0).toLocaleString('en-IN'),
      trend: data?.trends?.calls || '0%',
      isPositive: data?.trendsIsPositive?.calls !== false,
      icon: Phone,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      path: '/calls'
    },
    {
      title: 'Active Chats',
      value: Number(data?.activeChats || 0).toLocaleString('en-IN'),
      trend: data?.trends?.chats || '0%',
      isPositive: data?.trendsIsPositive?.chats !== false,
      icon: MessageSquare,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      path: '/chats'
    },
  ] : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none">
      {cardsData.filter((card) => card.title !== "Today's Revenue" || can('dashboard.financials')).map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={idx} 
            onClick={() => navigate(card.path)}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-orange-100 dark:hover:border-slate-600 transition-all duration-300 group cursor-pointer"
          >
            {/* Icon container */}
            <div className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
              <IconComponent size={22} className={card.iconColor} />
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold block truncate mb-0.5">
                {card.title}
              </span>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none mb-1.5" style={{ fontFamily: 'Outfit' }}>
                {card.value}
              </h3>
              
              {/* Trend direction */}
              <div className="flex items-center gap-1">
                {card.isPositive ? (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <span className="text-xs">↑</span> {card.trend}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-red-500 dark:text-red-400 flex items-center gap-0.5">
                    <span className="text-xs">↓</span> {card.trend}
                  </span>
                )}
                <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">this month</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
