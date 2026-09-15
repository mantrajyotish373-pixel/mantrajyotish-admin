import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Sun, Moon } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const isDarkMode = true;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Zodiac signs array
  const zodiacSigns = [
    { symbol: '♈', name: 'Aries' },
    { symbol: '♉', name: 'Taurus' },
    { symbol: '♊', name: 'Gemini' },
    { symbol: '♋', name: 'Cancer' },
    { symbol: '♌', name: 'Leo' },
    { symbol: '♍', name: 'Virgo' },
    { symbol: '♎', name: 'Libra' },
    { symbol: '♏', name: 'Scorpio' },
    { symbol: '♐', name: 'Sagittarius' },
    { symbol: '♑', name: 'Capricorn' },
    { symbol: '♒', name: 'Aquarius' },
    { symbol: '♓', name: 'Pisces' }
  ];

  const base64url = (source) => {
    const jsonStr = JSON.stringify(source);
    const bytes = new TextEncoder().encode(jsonStr);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let encoded = btoa(binary);
    encoded = encoded.replace(/=+$/, '');
    encoded = encoded.replace(/\+/g, '-');
    encoded = encoded.replace(/\//g, '_');
    return encoded;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const cleanUsername = username.trim();
      const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";
      const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: cleanUsername,
          password: password.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        // Handle both standard data.token and direct token payloads safely
        if (data.data) {
          if (data.data.token) {
            localStorage.setItem('authToken', data.data.token);
          }
          if (data.data.user) {
            localStorage.setItem('user', JSON.stringify(data.data.user));
          }
        } else {
          if (data.token) {
            localStorage.setItem('authToken', data.token);
          }
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }
        setIsLoading(false);
        if (onLogin) {
          onLogin();
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend API failed. Please try again later.');
      setIsLoading(false);
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0F19] p-4 font-sans">
      
      {/* Brand Name */}
      <div className="flex flex-col items-center mb-6 select-none">
        <h1 className="text-2xl font-extrabold text-[#ffffff] tracking-wider" style={{ fontFamily: 'Outfit' }}>
          ASTRO ADMIN
        </h1>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[420px] bg-[#111827] border border-[#1f2937] rounded-2xl p-8 shadow-2xl">
        {/* Headings */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-[#ffffff] leading-snug" style={{ fontFamily: 'Outfit' }}>
            Login to your account
          </h3>
          <p className="text-xs text-[#9ca3af] font-semibold mt-1">
            Enter your credentials to continue
          </p>
        </div>

        {/* Error Message banner */}
        {error && (
          <div className="bg-red-950/30 border border-red-900/50 text-[#fca5a5] text-xs px-4 py-3 rounded-xl font-semibold mb-6 flex items-center">
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#9ca3af] select-none block">
              Admin Email
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563] pointer-events-none">
                <User size={18} />
              </span>
              <input
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your admin email"
                disabled={isLoading}
                className="w-full bg-[#0B0F19] text-[#ffffff] placeholder-[#4b5563] text-xs pl-12 pr-4 py-3.5 rounded-xl border border-[#1f2937] outline-none focus:border-[#FA5A24] transition-colors font-medium"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#9ca3af] select-none">
                Password
              </label>
              <a 
                href="#/forgot-password" 
                onClick={(e) => { e.preventDefault(); alert("Password reset link simulation."); }}
                className="text-xs text-[#FA5A24] hover:text-[#E14614] font-bold transition-colors select-none"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563] pointer-events-none">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                className="w-full bg-[#0B0F19] text-[#ffffff] placeholder-[#4b5563] text-xs pl-12 pr-11 py-3.5 rounded-xl border border-[#1f2937] outline-none focus:border-[#FA5A24] transition-colors font-medium"
              />
              <span 
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#9ca3af] cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Remember me & submit button */}
          <div className="flex items-center justify-between pt-1 select-none">
            <label className="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-5 h-5 rounded border border-[#1f2937] bg-[#0B0F19] peer-checked:bg-[#FA5A24] peer-checked:border-[#FA5A24] transition-all flex items-center justify-center">
                {rememberMe && (
                  <svg className="w-3 h-3 text-[#ffffff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="ml-3 text-xs text-[#9ca3af] font-semibold">
                Remember me
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FA5A24] hover:bg-[#E14614] text-[#ffffff] font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 cursor-pointer mt-4"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>



        {/* Bottom: Contact Super Admin Info */}
        <p className="text-center text-xs text-[#9ca3af] font-semibold select-none mt-5 leading-relaxed">
          Don't have an account?{' '}
          <a 
            href="#/contact" 
            onClick={(e) => { e.preventDefault(); alert("Contact Admin form submission simulated."); }}
            className="text-[#FA5A24] hover:text-[#E14614] font-bold transition-colors"
          >
            Contact Super Admin
          </a>
        </p>
      </div>

      {/* Footer: Copyright */}
      <div className="text-center mt-10 select-none">
        <p className="text-[11px] text-[#4b5563] font-bold tracking-tight">
          © 2025 Astro Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}
