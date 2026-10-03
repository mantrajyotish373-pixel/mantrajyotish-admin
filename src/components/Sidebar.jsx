import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
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
  ChevronLeft,
  UserPlus,
  Bell,
  Star,
  Shield,
  KeyRound,
  ScrollText,
  ShoppingBag,
  Orbit,
  WalletCards,
  ReceiptText,
  LifeBuoy,
  Image as ImageIcon
} from 'lucide-react';
import { can, isSuperAdmin } from '../config/authSession';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [pendingCount, setPendingCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!can('astrologers.view')) return;
    const token = localStorage.getItem('authToken');
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.mantrajyotish.com";
    fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/astro/pending`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setPendingCount(json.data.length);
        }
      })
      .catch(err => console.error(err));
  }, []);

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
  } else if (currentPath.startsWith('/interviews') || currentPath.startsWith('/interview-room')) {
    activeTab = 'Interviews';
  } else if (currentPath.startsWith('/promotions') || currentPath.startsWith('/coupons')) {
    activeTab = 'Offers';
  } else if (currentPath.startsWith('/promo-payouts')) {
    activeTab = 'Promo Payouts';
  } else if (currentPath.startsWith('/support')) {
    activeTab = 'Support';
  } else if (currentPath.startsWith('/payment-logs')) {
    activeTab = 'Payment Logs';
  } else if (currentPath.startsWith('/add-money-settings')) {
    activeTab = 'Add Money Settings';
  } else if (currentPath.startsWith('/store')) {
    activeTab = 'Astro Store';
  } else if (currentPath.startsWith('/planet-insights')) {
    activeTab = 'Planetary Insights';
  } else if (currentPath.startsWith('/reports')) {
    activeTab = 'Reports';
  } else if (currentPath.startsWith('/reviews')) {
    activeTab = 'Reviews';
  } else if (currentPath.startsWith('/notifications')) {
    activeTab = 'Notifications';
  } else if (currentPath.startsWith('/settings')) {
    activeTab = 'Settings';
  } else if (currentPath.startsWith('/team')) {
    activeTab = 'Team';
  } else if (currentPath.startsWith('/roles')) {
    activeTab = 'Roles';
  } else if (currentPath.startsWith('/audit-log')) {
    activeTab = 'Audit Log';
  } else if (currentPath.startsWith('/logout')) {
    activeTab = 'Logout';
  }

  const groups = [
    {
      title: 'MAIN',
      items: [
        { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', perm: 'dashboard.view' }
      ]
    },
    {
      title: 'ADMIN PANEL',
      items: [
        { id: 'Users', label: 'Users', icon: Users, path: '/users', perm: 'users.view' },
        { 
          id: 'Astrologers', 
          label: 'Astrologers', 
          icon: UserCheck,
          path: '/astrologers/all',
          perm: 'astrologers.view',
          hasSubmenu: true,
          subItems: [
            { id: 'All Astrologers', label: 'All Astrologers', path: '/astrologers/all' },
            { id: 'Pending Approval', label: 'Pending Approval', path: '/astrologers/pending', badge: pendingCount },
            { id: 'Verified Astrologers', label: 'Verified Astrologers', path: '/astrologers/verified' },
            { id: 'Blocked Astrologers', label: 'Blocked Astrologers', path: '/astrologers/blocked' }
          ]
        },
        { id: 'Add New Astrologer', label: 'Add New Astrologer', icon: UserPlus, path: '/astrologers/add', perm: 'astrologers.edit' },
        { id: 'KYC Verification', label: 'KYC Verification', icon: ShieldCheck, path: '/kyc-verification', perm: 'kyc.view' },
        { id: 'Interviews', label: 'Interviews', icon: Calendar, path: '/interviews', perm: 'interviews.view' },
        { id: 'Appointments', label: 'Appointments', icon: Calendar, path: '/bookings', perm: 'bookings.view' },
        { id: 'Payments', label: 'Payments', icon: IndianRupee, path: '/payments', perm: 'payments.view' },
        { id: 'Support', label: 'Complaints', icon: LifeBuoy, path: '/support', perm: 'support.view' },
        { id: 'Payment Logs', label: 'Payment Logs', icon: ReceiptText, path: '/payment-logs', perm: 'payments.view' },
        { id: 'Reports', label: 'Reports', icon: BarChart3, path: '/reports', perm: 'reports.view' },
        { id: 'Reviews', label: 'Reviews', icon: Star, path: '/reviews', perm: 'reviews.view' },
        { id: 'Offers', label: 'Offers & Bonus', icon: Ticket, path: '/promotions', perm: 'promotions.view' },
        { id: 'Promo Payouts', label: 'Promo Payouts', icon: IndianRupee, path: '/promo-payouts', perm: 'promopayouts.view' },
        { id: 'Banner Management', label: 'Banners', icon: ImageIcon, path: '/banner-management', perm: 'banners.view' },
        { id: 'Add Money Settings', label: 'Add Money Settings', icon: WalletCards, path: '/add-money-settings', perm: 'addmoney.view' },
        { id: 'Astro Store', label: 'Astro Store', icon: ShoppingBag, path: '/store', perm: 'store.view' },
        { id: 'Planetary Insights', label: 'Planetary Insights', icon: Orbit, path: '/planet-insights', perm: 'planets.view' },
        { id: 'Notifications', label: 'Notifications', icon: Bell, path: '/notifications', perm: 'notifications.view' }
      ]
    },
    {
      title: 'TEAM & SECURITY',
      superOnly: true,
      items: [
        { id: 'Team', label: 'Team Members', icon: Shield, path: '/team' },
        { id: 'Roles', label: 'Roles & Permissions', icon: KeyRound, path: '/roles' },
        { id: 'Audit Log', label: 'Audit Log', icon: ScrollText, path: '/audit-log' }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { id: 'Settings', label: 'Settings', icon: Settings, path: '/settings' },
        { id: 'Logout', label: 'Logout', icon: LogOut, path: '/logout' }
      ]
    }
  ]
    .filter((g) => !g.superOnly || isSuperAdmin())
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.perm || can(i.perm)) }))
    .filter((g) => g.items.length > 0);

  // State for collapsible submenus
  const [isAstrologersOpen, setIsAstrologersOpen] = useState(currentPath.startsWith('/astrologers'));

  // Sync open state when path changes to an astrologer sub-route
  React.useEffect(() => {
    if (currentPath.startsWith('/astrologers')) {
      setIsAstrologersOpen(true);
    }
  }, [currentPath]);

  return (
    <div className="relative h-full flex-shrink-0">
      <aside 
        className={`
          ${isCollapsed ? 'w-20' : 'w-64'} 
          bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 
          flex flex-col h-screen sticky top-0 
          overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] 
          justify-between select-none transition-all duration-300
        `}
      >
        <div>
          {/* Brand Logo Header (Clickable to /dashboard) */}
          <Link 
            to="/dashboard" 
            className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-6'} py-[17px] border-b border-slate-100 dark:border-slate-800 hover:opacity-90 transition-opacity cursor-pointer block`}
            title="Go to Dashboard"
          >
            <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-[#FA5A24] font-bold text-xl select-none" style={{ fontFamily: 'Outfit' }}>ॐ</span>
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-lg text-slate-800 dark:text-white tracking-wider font-sans truncate">
                <span className="text-[#FA5A24]">Astro</span> Admin
              </span>
            )}
          </Link>

          {/* Grouped Navigation Items */}
          <div className={`${isCollapsed ? 'px-2 py-4' : 'px-4 py-4'} space-y-5`}>
            {groups.map((group) => (
              <div key={group.title} className="space-y-2">
                {/* Group Title Header */}
                {!isCollapsed ? (
                  <span className="text-slate-400 text-[10px] font-bold tracking-wider px-4 block text-left">
                    {group.title}
                  </span>
                ) : (
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2" />
                )}
                
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isTabActive = activeTab === item.id;
                    const isOpen = item.hasSubmenu ? isAstrologersOpen : false;
                    
                    return (
                      <div key={item.id} className="space-y-1">
                        {item.hasSubmenu ? (
                          <div>
                            {!isCollapsed ? (
                              <div
                                onClick={() => setIsAstrologersOpen(prev => !prev)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group cursor-pointer ${
                                  isTabActive
                                    ? 'bg-[#FFF5F1] dark:bg-[#FA5A24]/15 text-[#FA5A24] dark:text-[#FA5A24] font-bold shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon 
                                    size={16} 
                                    className={
                                      isTabActive 
                                        ? 'text-[#FA5A24]' 
                                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors'
                                    } 
                                  />
                                  <span>{item.label}</span>
                                </div>
                                <ChevronDown 
                                  size={12} 
                                  className={`transition-transform duration-200 ${
                                    isOpen 
                                      ? 'rotate-180 text-[#FA5A24]' 
                                      : 'rotate-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                                  }`} 
                                />
                              </div>
                            ) : (
                              <Link
                                to={item.path}
                                title={item.label}
                                className={`w-full flex items-center justify-center p-2.5 rounded-xl text-xs transition-all duration-200 group ${
                                  isTabActive
                                    ? 'bg-[#FFF5F1] dark:bg-[#FA5A24]/15 text-[#FA5A24] font-bold shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                              >
                                <Icon 
                                  size={18} 
                                  className={isTabActive ? 'text-[#FA5A24]' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} 
                                />
                              </Link>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={item.path}
                            title={isCollapsed ? item.label : undefined}
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-4 py-2.5'} rounded-xl text-xs font-semibold transition-all duration-200 group ${
                              isTabActive
                                ? 'bg-[#FFF5F1] dark:bg-[#FA5A24]/15 text-[#FA5A24] dark:text-[#FA5A24] font-bold shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100'
                            }`}
                          >
                            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                              <Icon 
                                size={isCollapsed ? 18 : 16} 
                                className={
                                  isTabActive 
                                    ? 'text-[#FA5A24]' 
                                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors'
                                } 
                              />
                              {!isCollapsed && <span>{item.label}</span>}
                            </div>
                          </Link>
                        )}

                        {/* Submenu rendering (Only when expanded) */}
                        {!isCollapsed && item.hasSubmenu && isOpen && (
                          <div className="pl-9 pr-2 py-0.5 space-y-0.5 border-l border-slate-100 dark:border-slate-800 ml-6 mt-1">
                            {item.subItems.map((sub) => {
                              const isSubActive = activeSubTab === sub.id;
                              return (
                                <Link
                                  key={sub.id}
                                  to={sub.path}
                                  className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                                    isSubActive
                                      ? 'text-[#FA5A24] bg-[#FFF5F1]/60 dark:bg-[#FA5A24]/15 font-bold'
                                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
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

      {/* Middle Edge Collapse/Expand Toggle Button (Centered Vertically & Unclipped) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-[#FA5A24] dark:hover:text-[#FA5A24] flex items-center justify-center shadow-lg z-50 transition-all duration-300 cursor-pointer hover:scale-110"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <ChevronLeft size={14} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180 text-[#FA5A24]' : ''}`} />
      </button>
    </div>
  );
};

export default Sidebar;
