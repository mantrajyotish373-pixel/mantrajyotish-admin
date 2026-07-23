import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Sparkles, 
  Calendar, 
  IndianRupee, 
  Star, 
  Wallet, 
  Phone, 
  MessageSquare 
} from 'lucide-react';

const DashboardCards = () => {
  const navigate = useNavigate();

  const cardsData = [
    {
      title: 'Total Users',
      value: '15,420',
      trend: '12.5%',
      isPositive: true,
      icon: Users,
      iconBg: 'bg-orange-50',
      iconColor: 'text-[#FA5A24]',
      path: '/users'
    },
    {
      title: 'Total Astrologers',
      value: '358',
      trend: '8.4%',
      isPositive: true,
      icon: Sparkles,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      path: '/astrologers/all'
    },
    {
      title: "Today's Bookings",
      value: '1,245',
      trend: '15.3%',
      isPositive: true,
      icon: Calendar,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-500',
      path: '/bookings'
    },
    {
      title: "Today's Revenue",
      value: '₹3,45,600',
      trend: '18.7%',
      isPositive: true,
      icon: IndianRupee,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      path: '/payments'
    },
    {
      title: 'Pending KYC',
      value: '18',
      trend: '3.6%',
      isPositive: false,
      icon: Star,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      path: '/kyc-verification'
    },
    {
      title: 'Withdraw Requests',
      value: '12',
      trend: '2.1%',
      isPositive: false,
      icon: Wallet,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      path: '/withdraw-requests'
    },
    {
      title: 'Active Calls',
      value: '450',
      trend: '10.2%',
      isPositive: true,
      icon: Phone,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      path: '/calls'
    },
    {
      title: 'Active Chats',
      value: '980',
      trend: '14.6%',
      isPositive: true,
      icon: MessageSquare,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      path: '/chats'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none">
      {cardsData.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={idx} 
            onClick={() => navigate(card.path)}
            className="bg-white p-5 rounded-2xl border border-orange-50/50 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-orange-100 transition-all duration-300 group cursor-pointer"
          >
            {/* Icon container */}
            <div className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
              <IconComponent size={22} className={card.iconColor} />
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0">
              <span className="text-slate-500 text-xs font-semibold block truncate mb-0.5">
                {card.title}
              </span>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight leading-none mb-1.5" style={{ fontFamily: 'Outfit' }}>
                {card.value}
              </h3>
              
              {/* Trend direction */}
              <div className="flex items-center gap-1">
                {card.isPositive ? (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <span className="text-xs">↑</span> {card.trend}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-red-500 flex items-center gap-0.5">
                    <span className="text-xs">↓</span> {card.trend}
                  </span>
                )}
                <span className="text-[11px] text-slate-400 font-medium">this month</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
