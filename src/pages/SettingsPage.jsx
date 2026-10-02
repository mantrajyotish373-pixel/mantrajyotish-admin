import React, { useState } from 'react';
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

  // Modal state for active setting section being edited
  const [activeModal, setActiveModal] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Local state initialized from localStorage for system settings
  const [settingsData, setSettingsData] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      siteName: 'Astro Admin',
      maintenanceMode: false,
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      currency: 'INR (₹)',
      language: 'English',
      timezone: 'Asia/Kolkata (GMT+05:30)',
      twoFactorAuth: true,
      autoBackup: true
    };
  });

  // Admin profile from localStorage
  const adminUser = React.useMemo(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        return {
          name: u.firstname ? `${u.firstname} ${u.lastname || ''}`.trim() : (u.phone || 'Admin'),
          email: u.email || 'admin@astroadmin.com',
          phone: u.phone || '+91 98765 43210',
          role: u.roleName || (u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) + ' Admin' : 'Admin'),
          avatar: u.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
        };
      } catch (e) {}
    }
    return {
      name: 'Admin',
      email: 'admin@astroadmin.com',
      phone: '+91 98765 43210',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    };
  }, []);

  const handleSaveSetting = (newSettings) => {
    const updated = { ...settingsData, ...newSettings };
    setSettingsData(updated);
    localStorage.setItem('appSettings', JSON.stringify(updated));
    setActiveModal(null);
    setSaveSuccess('Setting updated successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  return (
    <div className="flex flex-col gap-6 w-full select-none pb-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight" style={{ fontFamily: 'Outfit' }}>
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

      {/* Success banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 text-xs px-4 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle size={16} />
          <span>{saveSuccess}</span>
        </div>
      )}

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
                  } else {
                    setActiveModal(item.title);
                  }
                }}
                className="bg-white dark:bg-slate-800 p-4.5 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm flex items-center justify-between hover:border-orange-100 dark:hover:border-slate-600 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-11 h-11 rounded-full ${item.iconBg} dark:bg-slate-700 ${item.iconColor} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-850 dark:text-slate-100 tracking-tight group-hover:text-[#FA5A24] dark:group-hover:text-[#FA5A24] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium truncate mt-0.5 max-w-[280px] sm:max-w-md md:max-w-xl">
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
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>
                Admin Profile
              </h3>
              <button 
                onClick={() => navigate('/view-profile')}
                className="text-[10px] font-bold text-[#FA5A24] border border-[#FA5A24] px-2.5 py-1 rounded-xl hover:bg-[#FFF5F1]/30 transition-all cursor-pointer"
              >
                View Profile
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5 border-b border-slate-100 dark:border-slate-700/60 pb-5">
              <img 
                src={adminUser.avatar} 
                alt="Admin Avatar" 
                className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{adminUser.name}</h4>
                <span className="inline-block bg-[#FFF5F1] dark:bg-[#FA5A24]/15 text-[#FA5A24] text-[9px] font-extrabold px-2 py-0.5 rounded-md mt-1 shadow-sm">
                  {adminUser.role}
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-xs">
                <Mail size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-300 truncate">{adminUser.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Phone size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-300">{adminUser.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-300">Jaipur, Rajasthan, India</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-300">Joined on 15 Mar 2024, 10:30 AM</span>
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
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4" style={{ fontFamily: 'Outfit' }}>
              Security Overview
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {securityItems.map((item, idx) => {
                const SecIcon = item.icon;
                return (
                  <div key={idx} className="flex items-center justify-between py-3.5 hover:bg-slate-50/30 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                        <SecIcon size={14} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-slate-750 dark:text-slate-200 leading-snug group-hover:text-[#FA5A24] transition-colors">{item.title}</h4>
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

            <button 
              onClick={() => setActiveModal('Security Settings')}
              className="w-full text-center border border-[#FA5A24] text-[#FA5A24] text-xs font-bold py-2.5 rounded-xl hover:bg-[#FFF5F1]/30 transition-all mt-4 cursor-pointer"
            >
              Manage Security
            </button>
          </div>

        </div>

      </div>

      {/* Settings Edit Modal Drawer */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[6px] p-4 transition-all duration-300 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700/60 flex flex-col gap-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>
                {activeModal}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Dynamic Modal Content by Section */}
            {activeModal === 'Website Settings' && (
              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="text-slate-600 dark:text-slate-300 block mb-1">Website Title / Brand</label>
                  <input 
                    type="text" 
                    defaultValue={settingsData.siteName}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full bg-[#FCFAF8] dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-600 outline-none"
                  />
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-700">
                  <div>
                    <span className="text-slate-700 dark:text-slate-200 block">Maintenance Mode</span>
                    <span className="text-[10px] text-slate-400 font-normal">Temporarily disable customer web access</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settingsData.maintenanceMode}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    className="w-5 h-5 accent-[#FA5A24] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeModal === 'Notification Settings' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-200">Email Notifications</span>
                  <input 
                    type="checkbox"
                    checked={settingsData.emailNotifications}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="w-5 h-5 accent-[#FA5A24] cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-200">SMS Alerts</span>
                  <input 
                    type="checkbox"
                    checked={settingsData.smsNotifications}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                    className="w-5 h-5 accent-[#FA5A24] cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-700 dark:text-slate-200">Push Notifications</span>
                  <input 
                    type="checkbox"
                    checked={settingsData.pushNotifications}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                    className="w-5 h-5 accent-[#FA5A24] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeModal === 'Security Settings' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <span className="text-slate-700 dark:text-slate-200 block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Require SMS/Authenticator code on login</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settingsData.twoFactorAuth}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                    className="w-5 h-5 accent-[#FA5A24] cursor-pointer"
                  />
                </div>
                <div className="pt-2">
                  <span className="text-slate-600 dark:text-slate-300 block mb-1">Session Timeout</span>
                  <select className="w-full bg-[#FCFAF8] dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-600 outline-none">
                    <option>15 Minutes</option>
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                  </select>
                </div>
              </div>
            )}

            {(activeModal !== 'Website Settings' && activeModal !== 'Notification Settings' && activeModal !== 'Security Settings') && (
              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="text-slate-600 dark:text-slate-300 block mb-1">Preferences</label>
                  <input 
                    type="text" 
                    defaultValue="Default Configuration"
                    className="w-full bg-[#FCFAF8] dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-600 outline-none"
                  />
                </div>
                <div className="bg-[#FFF5F1] dark:bg-slate-700/50 p-3.5 rounded-xl border border-orange-100 dark:border-slate-600 text-[11px] text-slate-600 dark:text-slate-300">
                  Update settings configuration for {activeModal}.
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSaveSetting({})}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#FA5A24] hover:bg-orange-600 rounded-xl shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Alert bar */}
      <div className="bg-[#FFF5F1]/80 dark:bg-slate-800 border border-orange-100/50 dark:border-slate-700/60 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm select-none">
        <Info size={16} className="text-[#FA5A24] flex-shrink-0" />
        <span className="text-[11px] md:text-xs text-slate-600 dark:text-slate-300 font-medium leading-normal">
          Settings are applied across the entire system.
        </span>
      </div>

    </div>
  );
}
