import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, Sun, Moon } from 'lucide-react';

const Header = ({ toggleSidebar, theme, setTheme }) => {
  const userStr = localStorage.getItem('user');
  let displayName = 'Admin';
  let displayRole = 'Super Admin';
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.firstname) {
        displayName = user.firstname + (user.lastname ? ' ' + user.lastname : '');
      } else if (user.phone) {
        displayName = user.phone;
      }
      if (user.role) {
        displayRole = user.role.charAt(0).toUpperCase() + user.role.slice(1) + ' Admin';
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 select-none">
      {/* Search & Collapse Menu Panel */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button 
          onClick={toggleSidebar} 
          className="text-slate-500 hover:text-[#FA5A24] p-1.5 rounded-lg hover:bg-orange-50 transition-colors duration-200"
        >
          <Menu size={20} />
        </button>

        {/* Custom Search Box */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full bg-[#FAF5F2] text-slate-700 placeholder-slate-400 text-xs px-5 py-2.5 pr-11 rounded-full outline-none border border-transparent focus:border-orange-200 focus:bg-white transition-all duration-200 font-semibold"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search size={15} />
          </div>
        </div>
      </div>

      {/* Notifications & Admin Profile */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle Button */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 text-slate-500 hover:text-[#FA5A24] rounded-full hover:bg-orange-50 transition-colors duration-200 bg-white border border-slate-100 shadow-sm"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Bell Icon with Badge */}
        <button className="relative p-2.5 text-slate-500 hover:text-[#FA5A24] rounded-full hover:bg-orange-50 transition-colors duration-200 bg-white border border-slate-100 shadow-sm">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FA5A24] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            5
          </span>
        </button>

        {/* Admin Profile */}
        <Link to="/edit-profile" className="flex items-center gap-3 pl-2 border-l border-slate-100 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="hidden sm:block text-right flex-shrink-0">
            <h4 className="text-sm font-bold text-slate-800 leading-tight">{displayName}</h4>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{displayRole}</span>
          </div>
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full border border-orange-100 shadow-sm object-cover flex-shrink-0"
          />
          <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
