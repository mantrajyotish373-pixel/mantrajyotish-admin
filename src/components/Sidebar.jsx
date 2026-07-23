import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  Calendar, 
  MessageSquare, 
  Phone, 
  IndianRupee, 
  ShieldCheck, 
  Ticket, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronDown,
  UserPlus,
  Bell,
  Star
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Resolve active main tab and sub tab from the URL path
  let activeTab = 'Dashboard';
  let activeSubTab = '';

  if (currentPath.startsWith('/dashboard')) {
    activeTab = 'Dashboard';
  } else if (currentPath.startsWith('/users')) {
    activeTab = 'Users';
  } else if (currentPath.startsWith('/astrologers/add')) {
    activeTab = 'Add New Astrologer';
  } else if (currentPath.startsWith('/astrologers')) {
    activeTab = 'Astrologers';
    if (currentPath.includes('/all')) activeSubTab = 'All Astrologers';
    else if (currentPath.includes('/pending')) activeSubTab = 'Pending Approval';
    else if (currentPath.includes('/verified')) activeSubTab = 'Verified Astrologers';
    else if (currentPath.includes('/blocked')) activeSubTab = 'Blocked Astrologers';
    else if (currentPath.includes('/categories')) activeSubTab = 'Categories';
  } else if (currentPath.startsWith('/bookings')) {
    activeTab = 'Bookings';
  } else if (currentPath.startsWith('/chats')) {
    activeTab = 'Chats';
  } else if (currentPath.startsWith('/calls')) {
    activeTab = 'Calls';
  } else if (currentPath.startsWith('/payments')) {
    activeTab = 'Payments';
  } else if (currentPath.startsWith('/kyc-verification')) {
    activeTab = 'KYC Verification';
  } else if (currentPath.startsWith('/coupons')) {
    activeTab = 'Coupons';
  } else if (currentPath.startsWith('/reports')) {
    activeTab = 'Reports';
  } else if (currentPath.startsWith('/reviews')) {
    activeTab = 'Reviews';
  } else if (currentPath.startsWith('/notifications')) {
    activeTab = 'Notifications';
  } else if (currentPath.startsWith('/settings')) {
    activeTab = 'Settings';
  } else if (currentPath.startsWith('/logout')) {
    activeTab = 'Logout';
  }

  const groups = [
    {
      title: 'MAIN',
      items: [
        { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }
      ]
    },
    {
      title: 'ADMIN PANEL',
      items: [
        { id: 'Users', label: 'Users', icon: Users, path: '/users' },
        { 
          id: 'Astrologers', 
          label: 'Astrologers', 
          icon: Sparkles,
          path: '/astrologers/all',
          hasSubmenu: true,
          subItems: [
            { id: 'All Astrologers', label: 'All Astrologers', path: '/astrologers/all' },
            { id: 'Pending Approval', label: 'Pending Approval', path: '/astrologers/pending', badge: 12 },
            { id: 'Verified Astrologers', label: 'Verified Astrologers', path: '/astrologers/verified' },
            { id: 'Blocked Astrologers', label: 'Blocked Astrologers', path: '/astrologers/blocked' },
            { id: 'Categories', label: 'Categories', path: '/astrologers/categories' }
          ]
        },
        { id: 'Add New Astrologer', label: 'Add New Astrologer', icon: UserPlus, path: '/astrologers/add' },
        { id: 'KYC Verification', label: 'KYC Verification', icon: ShieldCheck, path: '/kyc-verification' },
        { id: 'Appointments', label: 'Appointments', icon: Calendar, path: '/bookings' },
        { id: 'Payments', label: 'Payments', icon: IndianRupee, path: '/payments' },
        { id: 'Reports', label: 'Reports', icon: BarChart3, path: '/reports' },
        { id: 'Reviews', label: 'Reviews', icon: Star, path: '/reviews' },
        { id: 'Coupons', label: 'Coupons', icon: Ticket, path: '/coupons' },
        { id: 'Notifications', label: 'Notifications', icon: Bell, path: '/notifications' }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { id: 'Settings', label: 'Settings', icon: Settings, path: '/settings' },
        { id: 'Logout', label: 'Logout', icon: LogOut, path: '/logout' }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 overflow-y-auto justify-between select-none">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100/60">
          <div className="w-10 h-10 rounded-full border border-slate-200 bg-orange-50 flex items-center justify-center shadow-sm">
            <span className="text-[#FA5A24] font-bold text-xl select-none" style={{ fontFamily: 'Outfit' }}>ॐ</span>
          </div>
          <span className="font-extrabold text-lg text-slate-800 tracking-wider font-sans">
            <span className="text-[#FA5A24]">Astro</span> Admin
          </span>
        </div>

        {/* Grouped Navigation Items */}
        <div className="px-4 py-4 space-y-6">
          {groups.map((group) => (
            <div key={group.title} className="space-y-2">
              {/* Group Title Header */}
              <span className="text-slate-400 text-[10px] font-bold tracking-wider px-4 block text-left">
                {group.title}
              </span>
              
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isTabActive = activeTab === item.id;
                  
                  return (
                    <div key={item.id} className="space-y-1">
                      <Link
                        to={item.path}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                          isTabActive
                            ? 'bg-[#FFF5F1] text-[#FA5A24] font-bold shadow-sm'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon 
                            size={16} 
                            className={
                              isTabActive 
                                ? 'text-[#FA5A24]' 
                                : 'text-slate-400 group-hover:text-slate-600 transition-colors'
                            } 
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.hasSubmenu && (
                          <ChevronDown 
                            size={12} 
                            className={`transition-transform duration-200 ${
                              isTabActive 
                                ? 'rotate-0 text-[#FA5A24]' 
                                : '-rotate-90 text-slate-400 group-hover:text-slate-600'
                            }`} 
                          />
                        )}
                      </Link>

                      {/* Submenu rendering */}
                      {item.hasSubmenu && isTabActive && (
                        <div className="pl-9 pr-2 py-0.5 space-y-0.5 border-l border-slate-100 ml-6 mt-1">
                          {item.subItems.map((sub) => {
                            const isSubActive = activeSubTab === sub.id;
                            return (
                              <Link
                                key={sub.id}
                                to={sub.path}
                                className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                                  isSubActive
                                    ? 'text-[#FA5A24] bg-[#FFF5F1]/60 font-bold'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                                }`}
                              >
                                <span>{sub.label}</span>
                                {sub.badge && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[8px] font-bold">
                                    {sub.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
