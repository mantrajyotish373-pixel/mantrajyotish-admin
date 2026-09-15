import React from 'react';
import { 
  Check, 
  Calendar, 
  Wallet, 
  UserPlus, 
  ChevronRight 
} from 'lucide-react';

const RecentActivities = ({ data, isLoading }) => {
  if (isLoading && !data) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm select-none animate-pulse">
        <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-5" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/40">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  const activities = data && data.length > 0 ? data.map(act => {
    let Icon = Check;
    let iconBg = 'bg-[#E6F4EA]';
    let iconColor = 'text-[#137333]';

    if (act.type === 'booking') {
      Icon = Calendar;
      iconBg = 'bg-[#FEF3C7]';
      iconColor = 'text-[#D97706]';
    } else if (act.type === 'withdraw') {
      Icon = Wallet;
      iconBg = 'bg-[#FFF3EE]';
      iconColor = 'text-[#FA5A24]';
    } else if (act.type === 'user') {
      Icon = UserPlus;
      iconBg = 'bg-violet-50';
      iconColor = 'text-violet-600';
    }

    return {
      id: act.id,
      text: act.text,
      time: act.time,
      icon: Icon,
      iconBg,
      iconColor
    };
  }) : [
    {
      id: 1,
      text: 'Ravi Sharma has been approved as an Astrologer.',
      time: '10:30 AM',
      icon: Check,
      iconBg: 'bg-[#E6F4EA]',
      iconColor: 'text-[#137333]',
    },
    {
      id: 2,
      text: 'New booking #2541 by Rahul Sharma.',
      time: '09:45 AM',
      icon: Calendar,
      iconBg: 'bg-[#FEF3C7]',
      iconColor: 'text-[#D97706]',
    },
    {
      id: 3,
      text: '₹15000 withdrawal request from Pandit Amit.',
      time: '09:20 AM',
      icon: Wallet,
      iconBg: 'bg-[#FFF3EE]',
      iconColor: 'text-[#FA5A24]',
    },
    {
      id: 4,
      text: 'New user Priya Verma has registered.',
      time: '08:15 AM',
      icon: UserPlus,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm select-none">
      {/* Title */}
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5" style={{ fontFamily: 'Outfit' }}>
        Recent Activities
      </h3>

      {/* List */}
      <div className="space-y-0.5">
        {activities.map((act, index) => {
          const IconComp = act.icon;
          return (
            <div 
              key={act.id} 
              className={`flex items-center justify-between py-4 ${
                index !== activities.length - 1 ? 'border-b border-dashed border-slate-100 dark:border-slate-700/60' : ''
              }`}
            >
              {/* Left Content (Icon + Text) */}
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full ${act.iconBg} dark:bg-slate-900/60 flex items-center justify-center flex-shrink-0`}>
                  <IconComp size={16} className={act.iconColor} />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                  {act.text}
                </p>
              </div>

              {/* Right Content (Time) */}
              <span className="text-xs text-slate-400 dark:text-slate-400 font-semibold flex-shrink-0 ml-4">
                {act.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-6">
        <button className="flex items-center gap-1.5 px-6 py-2 border border-[#FA5A24] rounded-full text-xs font-bold text-[#FA5A24] hover:bg-[#FFF3EE] dark:hover:bg-orange-950/40 transition-all duration-300 group">
          <span>View All Activities</span>
          <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default RecentActivities;
