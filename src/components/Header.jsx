import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  Sun, 
  Moon, 
  CircleUserRound, 
  Settings, 
  User, 
  LogOut,
  UserCheck,
  Wallet,
  Calendar,
  ChevronRight
} from 'lucide-react';

const Header = ({ toggleSidebar, theme, setTheme }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const userStr = localStorage.getItem('user');
  let displayName = 'Admin';
  let displayRole = 'Super Admin';
  let avatarUrl = null;
  let userEmail = '';

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.name) {
        displayName = user.name;
      } else if (user.firstname) {
        displayName = user.firstname + (user.lastname ? ' ' + user.lastname : '');
      } else if (user.phone) {
        displayName = user.phone;
      }
      if (user.email) {
        userEmail = user.email;
      }
      if (user.role) {
        displayRole = user.role.charAt(0).toUpperCase() + user.role.slice(1) + ' Admin';
      }
      if (user.profileImage || user.avatar || user.image) {
        avatarUrl = user.profileImage || user.avatar || user.image;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Handle notifications (real data from localStorage or state)
  const notificationsStr = localStorage.getItem('notifications');
  let notificationsList = [];
  if (notificationsStr) {
    try {
      const parsed = JSON.parse(notificationsStr);
      if (Array.isArray(parsed)) {
        notificationsList = parsed;
      }
    } catch (e) {}
  }
  
  const unreadCount = notificationsList.filter(n => !n.read).length;

  const toggleThemeMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10 select-none">
      {/* Search Box */}
      <div className="flex items-center gap-4 flex-1 max-w-md">

        {/* Custom Search Box */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full bg-[#FAF5F2] dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400 text-xs px-5 py-2.5 pr-11 rounded-full outline-none border border-transparent focus:border-orange-200 dark:focus:border-orange-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200 font-semibold"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search size={15} />
          </div>
        </div>
      </div>

      {/* Notifications & Admin Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleThemeMode}
          className="p-2.5 text-slate-500 dark:text-slate-300 hover:text-[#FA5A24] rounded-full hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors duration-200 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center cursor-pointer"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={20} className="text-[#FA5A24]" /> : <Moon size={20} className="text-slate-600 dark:text-slate-300" />}
        </button>

        {/* Bell Icon for Quick Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2.5 text-slate-500 dark:text-slate-300 hover:text-[#FA5A24] rounded-full hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors duration-200 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm block cursor-pointer"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FA5A24] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Quick Notifications Popup */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-84 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xl p-3.5 z-50 animate-scaleIn select-none flex flex-col">
              {/* Header Title (No Settings Gear Icon) */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[9px] font-extrabold bg-orange-100 dark:bg-orange-950/50 text-[#FA5A24] rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
              </div>

              {/* Notification Body Content (Reduced Compact Height) */}
              <div className="py-2">
                {notificationsList.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {notificationsList.slice(0, 4).map((notif, idx) => (
                      <div 
                        key={notif.id || idx} 
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate('/notifications');
                        }}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors text-left"
                      >
                        <div className="w-7 h-7 rounded-full bg-orange-50 dark:bg-orange-500/10 text-[#FA5A24] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bell size={13} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{notif.title || notif.message || 'Notification'}</p>
                          {notif.desc && <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{notif.desc}</p>}
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 block">{notif.time || 'Recently'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Custom YouTube-style Empty State (Astro Admin Tailored) */
                  <div className="py-5 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-2">
                      <Bell size={28} className="stroke-[1.5]" />
                    </div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      Your notifications live here
                    </h5>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 px-3 leading-tight max-w-[240px]">
                      New updates about astrologers, bookings, KYC requests, and payments will appear here.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigate('/notifications');
                  }}
                  className="w-full py-2 px-3 bg-orange-50/80 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 text-[#FA5A24] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>See All Notifications</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Section with Interactive Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-100 dark:border-slate-800 cursor-pointer group"
          >
            <div className="hidden sm:block text-right flex-shrink-0">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-[#FA5A24] transition-colors">{displayName}</h4>
              <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold block mt-0.5">{displayRole}</span>
            </div>

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full border border-orange-100 dark:border-slate-700 shadow-sm object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-slate-800 border border-orange-100 dark:border-slate-700 flex items-center justify-center text-[#FA5A24] shadow-sm flex-shrink-0">
                <CircleUserRound size={24} />
              </div>
            )}
            
            <ChevronDown size={14} className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#FA5A24]' : ''}`} />
          </div>

          {/* Admin Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xl p-2 z-50 animate-scaleIn select-none">
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700/60 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{displayName}</p>
                {userEmail && <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{userEmail}</p>}
                <span className="inline-block mt-1.5 px-2 py-0.5 text-[9px] font-extrabold text-[#FA5A24] bg-orange-50 dark:bg-orange-500/10 rounded-md uppercase tracking-wider">
                  {displayRole}
                </span>
              </div>

              <div className="py-1 space-y-0.5 text-left">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-orange-50/60 dark:hover:bg-slate-700/50 hover:text-[#FA5A24] rounded-xl transition-colors cursor-pointer"
                >
                  <Settings size={15} className="text-slate-400" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/edit-profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-orange-50/60 dark:hover:bg-slate-700/50 hover:text-[#FA5A24] rounded-xl transition-colors cursor-pointer"
                >
                  <User size={15} className="text-slate-400" />
                  <span>Edit Profile</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-700/60 my-1"></div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/logout');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
