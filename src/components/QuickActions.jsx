import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Users, 
  Calendar, 
  IndianRupee, 
  Percent, 
  Image as ImageIcon 
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add Astrologer',
      icon: UserPlus,
      color: 'text-[#FA5A24]',
      bg: 'bg-[#FFF3EE]',
      hoverBg: 'hover:bg-[#FFE8DE]',
      path: '/astrologers/add'
    },
    {
      label: 'Manage Users',
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      hoverBg: 'hover:bg-indigo-100/70',
      path: '/users'
    },
    {
      label: 'Bookings',
      icon: Calendar,
      color: 'text-pink-500',
      bg: 'bg-pink-50',
      hoverBg: 'hover:bg-pink-100/70',
      path: '/bookings'
    },
    {
      label: 'Payments',
      icon: IndianRupee,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      hoverBg: 'hover:bg-emerald-100/70',
      path: '/payments'
    },
    {
      label: 'Coupons',
      icon: Percent,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      hoverBg: 'hover:bg-amber-100/70',
      path: '/coupons'
    },
    {
      label: 'Banner',
      icon: ImageIcon,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      hoverBg: 'hover:bg-violet-100/70',
      path: '/banner-management'
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-orange-50/50 shadow-sm flex flex-col justify-between h-full min-w-[280px]">
      {/* Title */}
      <h3 className="text-lg font-bold text-slate-800 mb-6 select-none" style={{ fontFamily: 'Outfit' }}>
        Quick Actions
      </h3>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4 flex-1">
        {actions.map((act, index) => {
          const IconComp = act.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(act.path)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl ${act.bg} ${act.hoverBg} transition-all duration-300 group focus:outline-none`}
            >
              <div className="p-2 rounded-full bg-white/80 shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <IconComp size={20} className={act.color} />
              </div>
              <span className="text-[11px] font-bold text-slate-700 text-center mt-3 leading-snug whitespace-normal">
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
