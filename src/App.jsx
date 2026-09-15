import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardCards from './components/DashboardCards';
import RevenueChart from './components/RevenueChart';
import QuickActions from './components/QuickActions';
import RecentActivities from './components/RecentActivities';
import UsersPage from './pages/UsersPage';
import AstrologersPage from './pages/AstrologersPage';
import BookingsPage from './pages/BookingsPage';
import ChatsPage from './pages/ChatsPage';
import CallsPage from './pages/CallsPage';
import PaymentsPage from './pages/PaymentsPage';
import WithdrawRequestsPage from './pages/WithdrawRequestsPage';
import KycVerificationPage from './pages/KycVerificationPage';
import CouponsPage from './pages/CouponsPage';
import BannerManagementPage from './pages/BannerManagementPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';
import LogoutModal from './components/LogoutModal';
import LoginPage from './pages/LoginPage';
import EditProfilePage from './pages/EditProfilePage';
import ViewProfilePage from './pages/ViewProfilePage';
import InterviewsPage from './pages/InterviewsPage';
import AdminInterviewRoom from './pages/AdminInterviewRoom';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Dashboard statistics state
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const fetchDashboardStats = async (showLoading = true) => {
    try {
      if (showLoading && !dashboardStats) {
        setStatsLoading(true);
      }
      const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app";
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      
      const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/admin/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      const resData = await response.json();
      if (resData.success && resData.data) {
        setDashboardStats(resData.data);
      } else {
        throw new Error(resData.message || 'Invalid stats payload');
      }
      setStatsError(null);
    } catch (err) {
      console.warn("Dashboard stats error, showing offline mock fallback:", err);
      setStatsError(err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const location = useLocation();
  const currentPath = location.pathname;

  // Resolve current active main tab from location pathname
  let activeTab = 'Dashboard';
  if (currentPath.startsWith('/dashboard')) {
    activeTab = 'Dashboard';
  } else if (currentPath.startsWith('/users')) {
    activeTab = 'Users';
  } else if (currentPath.startsWith('/astrologers/add')) {
    activeTab = 'Add New Astrologer';
  } else if (currentPath.startsWith('/astrologers')) {
    activeTab = 'Astrologers';
  } else if (currentPath.startsWith('/bookings')) {
    activeTab = 'Bookings';
  } else if (currentPath.startsWith('/chats')) {
    activeTab = 'Chats';
  } else if (currentPath.startsWith('/calls')) {
    activeTab = 'Calls';
  } else if (currentPath.startsWith('/payments')) {
    activeTab = 'Payments';
  } else if (currentPath.startsWith('/withdraw-requests')) {
    activeTab = 'Withdraw Requests';
  } else if (currentPath.startsWith('/kyc-verification')) {
    activeTab = 'KYC Verification';
  } else if (currentPath.startsWith('/interviews')) {
    activeTab = 'Interviews';
  } else if (currentPath.startsWith('/interview-room')) {
    activeTab = 'Interviews';
  } else if (currentPath.startsWith('/coupons')) {
    activeTab = 'Coupons';
  } else if (currentPath.startsWith('/banner-management')) {
    activeTab = 'Banner Management';
  } else if (currentPath.startsWith('/reports')) {
    activeTab = 'Reports';
  } else if (currentPath.startsWith('/reviews')) {
    activeTab = 'Reviews';
  } else if (currentPath.startsWith('/notifications')) {
    activeTab = 'Notifications';
  } else if (currentPath.startsWith('/settings')) {
    activeTab = 'Settings';
  } else if (currentPath.startsWith('/edit-profile')) {
    activeTab = 'Settings';
  } else if (currentPath.startsWith('/view-profile')) {
    activeTab = 'Settings';
  } else if (currentPath.startsWith('/logout')) {
    activeTab = 'Logout';
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'Dashboard') {
      fetchDashboardStats(true);
      // Auto-refresh Dashboard metrics silently every 60 seconds
      const intervalId = setInterval(() => {
        fetchDashboardStats(false);
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, activeTab]);

  // Determine main panel container CSS classes
  // For both Users and Astrologers pages, lock height to screen viewport to enable inner scrolling
  const mainClass = (activeTab === 'Users' || activeTab === 'Astrologers' || activeTab === 'KYC Verification' || activeTab === 'Reports' || activeTab === 'Bookings' || activeTab === 'Interviews' || activeTab === 'Payments' || activeTab === 'Withdraw Requests')
    ? "flex-1 p-4 md:p-6 lg:p-8 flex flex-col overflow-hidden min-h-0"
    : "flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto";

  // Dashboard component rendering view
  const DashboardView = () => (
    <>
      {/* Header Title section */}
      <div className="flex items-center justify-between select-none">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-400 dark:text-slate-400 font-medium flex items-center gap-2">
            Welcome back to your Astro Admin control center.
            {statsLoading && (
              <span className="text-[10px] bg-orange-100 dark:bg-orange-950/50 text-[#FA5A24] px-2 py-0.5 rounded-full font-bold animate-pulse">
                Syncing live data...
              </span>
            )}
            {statsError && (
              <span className="text-[10px] bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">
                Offline Mode (Demo Data)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* 8 Metric Cards Grid */}
      <DashboardCards data={dashboardStats} isLoading={statsLoading} />

      {/* Analytics Chart & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col">
          <RevenueChart chartData={dashboardStats?.revenueChart} isLoading={statsLoading} />
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <QuickActions isLoading={statsLoading} />
        </div>
      </div>

      {/* Recent Activities Panel */}
      <RecentActivities data={dashboardStats?.recentActivities} isLoading={statsLoading} />
    </>
  );

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onLogin={() => setIsAuthenticated(true)} />
          )
        } 
      />
      <Route 
        path="/*" 
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : (
            <div className={`flex h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 relative font-sans overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
              {/* Sidebar overlay for mobile drawer */}
              {isSidebarOpen && (
                <div
                  onClick={toggleSidebar}
                  className="fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity duration-300"
                />
              )}

              {/* Sidebar - fixed on large screens, drawer on mobile */}
              <div className={`
                fixed inset-y-0 left-0 z-30 lg:z-10 lg:static transform 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 transition-transform duration-300 ease-in-out h-full
              `}>
                <Sidebar theme="dark" />
              </div>

              {/* Main content wrapper */}
              <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Header */}
                <Header toggleSidebar={toggleSidebar} theme={theme} setTheme={setTheme} />

                {/* Dashboard/Users/Astrologers routing content panel */}
                <main className={mainClass}>
                  <Routes>
                    {/* Core pages */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardView />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                    <Route path="/chats" element={<ChatsPage />} />
                    <Route path="/calls" element={<CallsPage />} />
                    <Route path="/payments" element={<PaymentsPage />} />
                    <Route path="/withdraw-requests" element={<WithdrawRequestsPage />} />
                    <Route path="/kyc-verification" element={<KycVerificationPage />} />
                    <Route path="/interviews" element={<InterviewsPage />} />
                    <Route path="/interview-room/:id" element={<AdminInterviewRoom />} />
                    <Route path="/coupons" element={<CouponsPage />} />
                    <Route path="/banner-management" element={<BannerManagementPage />} />
                    <Route path="/astrologers/*" element={<AstrologersPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/reviews" element={
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm text-center py-16 h-full flex flex-col justify-center">
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2" style={{ fontFamily: 'Outfit' }}>Reviews Management</h2>
                        <p className="text-sm text-slate-400 dark:text-slate-400 max-w-sm mx-auto">This reviews view is currently under development.</p>
                      </div>
                    } />
                    <Route path="/notifications" element={
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-orange-50/50 dark:border-slate-700/60 shadow-sm text-center py-16 h-full flex flex-col justify-center">
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2" style={{ fontFamily: 'Outfit' }}>Notifications Center</h2>
                        <p className="text-sm text-slate-400 dark:text-slate-400 max-w-sm mx-auto">This notifications center is currently under development.</p>
                      </div>
                    } />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/edit-profile" element={<EditProfilePage />} />
                    <Route path="/view-profile" element={<ViewProfilePage />} />
                    <Route
                      path="/logout"
                      element={
                        <>
                          <DashboardView />
                          <LogoutModal onLogout={() => setIsAuthenticated(false)} />
                        </>
                      }
                    />

                    {/* Catch-all fallback redirect */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          )
        }
      />
    </Routes>
  );
}

export default App;
