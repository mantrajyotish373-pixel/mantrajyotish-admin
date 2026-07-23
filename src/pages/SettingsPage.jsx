import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  IndianRupee, 
  ShieldCheck, 
  Monitor, 
  Cloud, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  Info, 
  CheckCircle,
  Laptop
} from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const settingsList = [
    {
      title: 'Profile Settings',
      description: 'Update your profile information, email address and contact details.',
      icon: User,
      iconBg: 'bg-orange-50',
      iconColor: 'text-[#FA5A24]',
    },
    {
      title: 'Account Settings',
      description: 'Manage your account preferences and administrator information.',
      icon: Lock,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Notification Settings',
      description: 'Configure email, SMS and in-app notification preferences.',
      icon: Bell,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Website Settings',
      description: 'Update website name, logo, favicon and maintenance mode.',
      icon: Globe,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Payment Settings',
      description: 'Manage payment methods, gateway configuration and related preferences.',
      icon: IndianRupee,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Security Settings',
      description: 'Manage passwords, two-factor authentication and login security.',
      icon: ShieldCheck,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
    {
      title: 'System Settings',
      description: 'Manage system preferences, language, timezone and other configurations.',
      icon: Monitor,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Backup & Restore',
      description: 'Backup your data and restore it when needed.',
      icon: Cloud,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
  ];

  const securityItems = [
    {
      title: 'Password',
      subtext: 'Last changed on 10 May 2025',
      badge: 'Updated',
      badgeClass: 'bg-[#E6F4EA] text-[#137333]',
      icon: Lock,
    },
    {
      title: 'Two-Factor Authentication',
      subtext: 'Added extra security to your account',
      badge: 'Enabled',
      badgeClass: 'bg-[#E6F4EA] text-[#137333]',
      icon: ShieldCheck,
    },
    {
      title: 'Login Sessions',
      subtext: 'Manage your active sessions',
      badge: '3 Active',
      badgeClass: 'bg-blue-50 text-blue-600',
      icon: Laptop,
    },
    {
      title: 'Account Status',
      subtext: 'Your account is active and secure',
      badge: 'Active',
      badgeClass: 'bg-[#E6F4EA] text-[#137333]',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full select-none pb-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              Settings
            </h1>
            <Sparkles size={18} className="text-[#FA5A24] animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">Settings</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Settings List (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {settingsList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                onClick={() => {
                  if (item.title === 'Profile Settings') {
                    navigate('/edit-profile');
                  }
                }}
                className="bg-white p-4.5 rounded-2xl border border-orange-50/50 shadow-sm flex items-center justify-between hover:border-orange-100 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-11 h-11 rounded-full ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-850 tracking-tight group-hover:text-[#FA5A24] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5 max-w-[280px] sm:max-w-md md:max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            );
          })}
        </div>

        {/* Right Side: Admin Profile & Security Overview Widgets (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Admin Profile Widget */}
          <div className="bg-white p-5 rounded-2xl border border-orange-50/50 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>
                Admin Profile
              </h3>
              <button 
                onClick={() => navigate('/view-profile')}
                className="text-[10px] font-bold text-[#FA5A24] border border-[#FA5A24] px-2.5 py-1 rounded-xl hover:bg-[#FFF5F1]/30 transition-all cursor-pointer"
              >
                View Profile
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5 border-b border-slate-100 pb-5">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
                alt="Admin Avatar" 
                className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm flex-shrink-0"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug">Admin</h4>
                <span className="inline-block bg-[#FFF5F1] text-[#FA5A24] text-[9px] font-extrabold px-2 py-0.5 rounded-md mt-1 shadow-sm">
                  Super Admin
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-xs">
                <Mail size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 truncate">admin@astroadmin.com</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Phone size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-500">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-500">Jaipur, Rajasthan, India</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-500">Joined on 15 Mar 2024, 10:30 AM</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/edit-profile')}
              className="w-full text-center border border-[#FA5A24] text-[#FA5A24] text-xs font-bold py-2.5 rounded-xl hover:bg-[#FFF5F1]/30 transition-all mt-5 cursor-pointer"
            >
              Edit Profile
            </button>
          </div>

          {/* Security Overview Widget */}
          <div className="bg-white p-5 rounded-2xl border border-orange-50/50 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4" style={{ fontFamily: 'Outfit' }}>
              Security Overview
            </h3>

            <div className="divide-y divide-slate-100">
              {securityItems.map((item, idx) => {
                const SecIcon = item.icon;
                return (
                  <div key={idx} className="flex items-center justify-between py-3.5 hover:bg-slate-50/30 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0">
                        <SecIcon size={14} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-slate-750 leading-snug group-hover:text-[#FA5A24] transition-colors">{item.title}</h4>
                        <span className="text-[9px] text-slate-400 font-semibold block truncate leading-none mt-0.5">{item.subtext}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${item.badgeClass}`}>
                        {item.badge}
                      </span>
                      <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="w-full text-center border border-[#FA5A24] text-[#FA5A24] text-xs font-bold py-2.5 rounded-xl hover:bg-[#FFF5F1]/30 transition-all mt-4 cursor-pointer">
              Manage Security
            </button>
          </div>

        </div>

      </div>

      {/* Bottom Alert bar */}
      <div className="bg-[#FFF5F1]/80 border border-orange-100/50 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm select-none">
        <Info size={16} className="text-[#FA5A24] flex-shrink-0" />
        <span className="text-[11px] md:text-xs text-slate-600 font-medium leading-normal">
          Settings are applied across the entire system.
        </span>
      </div>

    </div>
  );
}
