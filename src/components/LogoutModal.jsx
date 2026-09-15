import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, CheckCircle } from 'lucide-react';

export default function LogoutModal({ onLogout }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('confirm'); // 'confirm' | 'processing' | 'success'

  const handleCancel = () => {
    navigate('/dashboard'); // Go back to dashboard on cancel
  };

  const handleLogout = () => {
    setStep('processing');
    setTimeout(() => {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      if (onLogout) {
        onLogout();
      }
    }, 600);
  };

  const handleLoginBack = () => {
    if (onLogout) {
      onLogout();
    }
  };

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[6px] p-4 transition-all duration-300">
        <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700/60 flex flex-col items-center text-center animate-scaleIn">
          <div className="w-16 h-16 rounded-full border-4 border-t-[#D93025] border-red-50 dark:border-red-950/40 flex items-center justify-center mb-6 animate-spin" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Logging Out...
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold mt-1">
            Safely closing your active session.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[6px] p-4 transition-all duration-300">
        <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700/60 flex flex-col items-center text-center animate-scaleIn">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-6 shadow-inner animate-bounce">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Logged Out Successfully
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1 mb-6">
            Your session has been terminated securely.
          </p>
          <button 
            onClick={handleLoginBack}
            className="w-full py-3 text-sm font-bold text-white bg-[#FA5A24] hover:bg-orange-600 active:bg-orange-700 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
          >
            Log In Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[6px] p-4 transition-all duration-300">
      <div 
        className="bg-white dark:bg-slate-800 w-full max-w-[420px] rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700/60 flex flex-col items-center text-center animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Logout Icon Circle */}
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-[#D93025] flex items-center justify-center mb-5 mt-2 shadow-inner">
          <LogOut size={26} className="translate-x-0.5" />
        </div>

        {/* Headings */}
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Logout
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs leading-normal mt-1.5 mb-5 max-w-[280px]">
          Are you sure you want to logout from your account?
        </p>

        {/* Warning Alert Banner */}
        <div className="w-full bg-[#FFF5F1]/80 dark:bg-slate-700/50 border border-orange-100/50 dark:border-slate-600/50 p-3.5 rounded-2xl flex items-center gap-3 mb-6 select-none text-left">
          <ShieldCheck size={18} className="text-[#FA5A24] flex-shrink-0" />
          <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-normal">
            For your security, please logout when you are done.
          </span>
        </div>

        {/* Actions Button Group */}
        <div className="flex items-center gap-3 w-full">
          <button 
            onClick={handleCancel}
            className="flex-1 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 active:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer text-center"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-[#D93025] hover:bg-[#C5221F] active:bg-[#B01A16] rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-500/10 transition-all duration-200 cursor-pointer"
          >
            <LogOut size={13} />
            <span>Yes, Logout</span>
          </button>
        </div>

      </div>
    </div>
  );
}
