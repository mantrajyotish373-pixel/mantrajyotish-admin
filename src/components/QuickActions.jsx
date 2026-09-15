import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Users, 
  Calendar, 
  IndianRupee, 
  Percent, 
  Image as ImageIcon,
  ShieldCheck,
  BarChart3,
  Star
} from 'lucide-react';

const QuickActions = ({ isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm flex flex-col justify-between h-full min-w-[280px] animate-pulse">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
        <div className="grid grid-cols-3 gap-3 flex-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-100 dark:bg-slate-700/40 space-y-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600" />
              <div className="h-2 w-12 bg-slate-200 dark:bg-slate-600 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const actions = [
    {
      label: 'Add Astrologer',
      icon: UserPlus,
      color: 'text-[#FA5A24]',
      bg: 'bg-[#FFF3EE] dark:bg-orange-950/40',
      hoverBg: 'hover:bg-[#FFE8DE] dark:hover:bg-orange-950/60',
      path: '/astrologers/add'
    },
    {
      label: 'Manage Users',
      icon: Users,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      hoverBg: 'hover:bg-indigo-100/70 dark:hover:bg-indigo-950/60',
      path: '/users'
    },
    {
      label: 'Bookings',
      icon: Calendar,
      color: 'text-pink-500 dark:text-pink-400',
      bg: 'bg-pink-50 dark:bg-pink-950/40',
      hoverBg: 'hover:bg-pink-100/70 dark:hover:bg-pink-950/60',
      path: '/bookings'
    },
    {
      label: 'KYC Verify',
      icon: ShieldCheck,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      hoverBg: 'hover:bg-cyan-100/70 dark:hover:bg-cyan-950/60',
      path: '/kyc-verification'
    },
    {
      label: 'Payments',
      icon: IndianRupee,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      hoverBg: 'hover:bg-emerald-100/70 dark:hover:bg-emerald-950/60',
      path: '/payments'
    },
    {
      label: 'Coupons',
      icon: Percent,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      hoverBg: 'hover:bg-amber-100/70 dark:hover:bg-amber-950/60',
      path: '/coupons'
    },
    {
      label: 'Reports',
      icon: BarChart3,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      hoverBg: 'hover:bg-blue-100/70 dark:hover:bg-blue-950/60',
      path: '/reports'
    },
    {
      label: 'Reviews',
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-950/40',
      hoverBg: 'hover:bg-yellow-100/70 dark:hover:bg-yellow-950/60',
      path: '/reviews'
    },
    {
      label: 'Banner',
      icon: ImageIcon,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/40',
      hoverBg: 'hover:bg-violet-100/70 dark:hover:bg-violet-950/60',
      path: '/banner-management'
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm flex flex-col justify-between h-full min-w-[280px]">
      {/* Title */}
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5 select-none" style={{ fontFamily: 'Outfit' }}>
        Quick Actions
      </h3>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3.5 flex-1">
        {actions.map((act, index) => {
          const IconComp = act.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(act.path)}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl ${act.bg} ${act.hoverBg} transition-all duration-300 group focus:outline-none cursor-pointer`}
            >
              <div className="p-2.5 rounded-full bg-white/80 dark:bg-slate-800/90 shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <IconComp size={20} className={act.color} />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 text-center mt-2.5 leading-tight">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
