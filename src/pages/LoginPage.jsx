import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
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
      const response = await fetch("https://kalpjoytish-backend.onrender.com/api/admin/login", {
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
        navigate('/dashboard');
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // For Google login simulation, let's use a dummy sub corresponding to Google auth
      const dummyGoogleSub = "1234567890"; // Use the existing working user
      const header = base64url({ alg: "HS256", typ: "JWT" });
      const payload = base64url({ 
        sub: dummyGoogleSub, 
        name: "Google Astro Admin"
      });
      const signature = "dummy_signature";
      const jwt = `${header}.${payload}.${signature}`;

      const response = await fetch("https://kalpjoytish-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: dummyGoogleSub,
          mobile: dummyGoogleSub,
          tuloToken: jwt
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        if (data.data) {
          if (data.data.token) {
            localStorage.setItem('authToken', data.data.token);
          }
          if (data.data.user) {
            localStorage.setItem('user', JSON.stringify(data.data.user));
          }
        }
        setIsLoading(false);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Google Login failed.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Google Login backend connection failed.');
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen w-full flex transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#FCFAF8] text-slate-800'}`}>
      
      {/* LEFT SIDE: Welcome & Zodiac Banner (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[45%] bg-[#FFF2EC] dark:bg-slate-900 relative flex-col items-center justify-between p-12 overflow-hidden select-none border-r border-[#FFE3D5] dark:border-slate-800">
        
        {/* Decorative Celestial Stars Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-10 left-12 w-2 h-2 bg-[#FA5A24] rounded-full animate-ping" />
          <div className="absolute top-20 right-24 w-1.5 h-1.5 bg-[#FA5A24] rounded-full animate-pulse" />
          <div className="absolute bottom-28 left-20 w-1.5 h-1.5 bg-[#FA5A24] rounded-full animate-pulse" />
          <div className="absolute bottom-40 right-16 w-2 h-2 bg-[#FA5A24] rounded-full animate-ping" />
          
          {/* Subtle star clusters */}
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="10%" y1="15%" x2="20%" y2="25%" stroke="#FA5A24" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="80%" y1="10%" x2="70%" y2="28%" stroke="#FA5A24" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="15%" y1="75%" x2="30%" y2="85%" stroke="#FA5A24" strokeWidth="0.5" strokeDasharray="3,3" />
            <circle cx="20%" cy="25%" r="2" fill="#FA5A24" />
            <circle cx="70%" cy="28%" r="2" fill="#FA5A24" />
            <circle cx="30%" cy="85%" r="2" fill="#FA5A24" />
          </svg>
        </div>

        {/* Top Section: Astro Admin Brand */}
        <div className="flex flex-col items-center z-10">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-md border border-[#FFE3D5] dark:border-slate-700 mb-4 transition-transform duration-300 hover:scale-105">
            <span className="text-3xl text-[#FA5A24] font-bold">🕉️</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-wider" style={{ fontFamily: 'Outfit' }}>
            ASTRO ADMIN
          </h1>
          <div className="flex items-center gap-3 w-32 mt-2">
            <div className="h-[1px] bg-gradient-to-r from-transparent to-[#FA5A24] flex-1" />
            <span className="text-[#FA5A24] text-[10px]">✦</span>
            <div className="h-[1px] bg-gradient-to-l from-transparent to-[#FA5A24] flex-1" />
          </div>
        </div>

        {/* Mid Section: Welcome Messages */}
        <div className="text-center z-10 max-w-sm mt-8">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2 leading-tight" style={{ fontFamily: 'Outfit' }}>
            Welcome Back!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Login to access your Astro Admin dashboard
          </p>
        </div>

        {/* Bottom Section: Giant Animated Zodiac Wheel */}
        <div className="relative w-80 h-80 flex items-center justify-center mt-10 z-10">
          <div className="absolute inset-0 rounded-full border border-[#FFE3D5] dark:border-slate-800/80 animate-[spin_180s_linear_infinite]" />
          
          {/* Main Rotating Wheel */}
          <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_240s_linear_infinite] transform-gpu">
            {/* Concentric Design Rings */}
            <circle cx="100" cy="100" r="95" fill="none" stroke="#FA5A24" strokeWidth="0.4" strokeOpacity="0.4" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="#FA5A24" strokeWidth="0.5" strokeOpacity="0.6" strokeDasharray="2,2" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="#FA5A24" strokeWidth="0.4" strokeOpacity="0.4" />
            
            {/* Dividing Sector Rays */}
            {zodiacSigns.map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x2 = 100 + 95 * Math.cos(angle);
              const y2 = 100 + 95 * Math.sin(angle);
              return (
                <line 
                  key={i} 
                  x1="100" 
                  y1="100" 
                  x2={x2} 
                  y2={y2} 
                  stroke="#FA5A24" 
                  strokeWidth="0.3" 
                  strokeOpacity="0.3" 
                />
              );
            })}

            {/* Zodiac Symbols Text Nodes */}
            {zodiacSigns.map((z, i) => {
              // Position them in the middle of each 30-degree sector (offset by 15deg)
              const angle = ((i * 30 + 15) * Math.PI) / 180;
              const x = 100 + 85 * Math.cos(angle);
              const y = 100 + 85 * Math.sin(angle);
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-[#FA5A24] dark:fill-orange-400 font-semibold select-none text-[10px]"
                  style={{ transformOrigin: `${x}px ${y}px`, transform: `rotate(${i * 30 + 105}deg)` }}
                >
                  {z.symbol}
                </text>
              );
            })}

            {/* Glowing Center Sun Face Vector Graphic */}
            <g transform="translate(75, 75) scale(0.5)">
              {/* Sun Rays */}
              {[...Array(12)].map((_, i) => (
                <path
                  key={i}
                  d="M 50 10 L 53 30 L 47 30 Z"
                  fill="#FA5A24"
                  opacity="0.85"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
              <circle cx="50" cy="50" r="18" fill="#FFF2EC" stroke="#FA5A24" strokeWidth="1.5" />
              {/* Face Details */}
              <circle cx="44" cy="46" r="1.5" fill="#FA5A24" />
              <circle cx="56" cy="46" r="1.5" fill="#FA5A24" />
              <path d="M 43 42 Q 44 41 45 42" stroke="#FA5A24" strokeWidth="0.8" fill="none" />
              <path d="M 55 42 Q 56 41 57 42" stroke="#FA5A24" strokeWidth="0.8" fill="none" />
              {/* Smiling mouth */}
              <path d="M 45 52 Q 50 56 55 52" stroke="#FA5A24" strokeWidth="1" fill="none" strokeLinecap="round" />
              {/* Cheek dots */}
              <circle cx="41" cy="51" r="0.8" fill="#FA5A24" opacity="0.6" />
              <circle cx="59" cy="51" r="0.8" fill="#FA5A24" opacity="0.6" />
            </g>
          </svg>
          
          {/* Subtle Outer Glowing Ring */}
          <div className="absolute inset-4 rounded-full border border-orange-200/20 dark:border-orange-500/10 pointer-events-none shadow-[0_0_20px_rgba(250,90,36,0.06)]" />
        </div>

      </div>

      {/* RIGHT SIDE: Theme Switcher & Credentials Form Container */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-12 relative">
        
        {/* Header: Theme toggle switcher */}
        <div className="flex justify-end items-center w-full z-10">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1.5 select-none transition-colors">
            <button 
              onClick={() => setIsDarkMode(false)} 
              className={`p-1.5 rounded-full transition-all ${!isDarkMode ? 'bg-white dark:bg-slate-800 text-[#FA5A24] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Light Mode"
            >
              <Sun size={16} />
            </button>
            
            {/* Sliding Pill toggle switch visual */}
            <div 
              onClick={toggleDarkMode}
              className="w-10 h-5 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer transition-colors"
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-[#FA5A24] rounded-full transition-all duration-300 ${isDarkMode ? 'left-[22px]' : 'left-0.5'}`} />
            </div>

            <button 
              onClick={() => setIsDarkMode(true)} 
              className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-white dark:bg-slate-800 text-orange-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Dark Mode"
            >
              <Moon size={16} />
            </button>
          </div>
        </div>

        {/* Center: Main Form Card */}
        <div className="flex-1 flex items-center justify-center py-10 z-10">
          <div className="w-full max-w-[480px] bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-100/50 dark:shadow-none transition-colors">
            
            {/* Brand Logo visible on mobile only */}
            <div className="flex lg:hidden flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFF2EC] dark:bg-slate-800 flex items-center justify-center border border-orange-100 dark:border-slate-700 mb-2">
                <span className="text-2xl text-[#FA5A24]">🕉️</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-800 dark:text-white tracking-wider" style={{ fontFamily: 'Outfit' }}>
                ASTRO ADMIN
              </h2>
            </div>

            {/* Headings */}
            <div className="text-center md:text-left mb-8">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white leading-snug" style={{ fontFamily: 'Outfit' }}>
                Login to your account
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
                Enter your credentials to continue
              </p>
            </div>

            {/* Error Message banner */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs px-4 py-3 rounded-xl font-semibold mb-6 flex items-center">
                <span>{error}</span>
              </div>
            )}

            {/* Credentials Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
                <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 select-none">
                  Admin Email
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                    <User size={18} />
                  </span>
                  <input
                    type="email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your admin email"
                    disabled={isLoading}
                    className="w-full bg-[#FCFAF8] dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-xs pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-[#FA5A24] dark:focus:border-orange-500 transition-colors font-medium"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 select-none">
                    Password
                  </label>
                  <a 
                    href="#/forgot-password" 
                    onClick={(e) => { e.preventDefault(); alert("Password reset link request simulated."); }}
                    className="text-xs text-[#FA5A24] hover:text-[#E14614] dark:text-orange-400 font-bold transition-colors select-none"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="w-full bg-[#FCFAF8] dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-xs pl-12 pr-11 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-[#FA5A24] dark:focus:border-orange-500 transition-colors font-medium"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center select-none pt-1">
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="sr-only peer"
                  />
                  <div className="w-4.5 h-4.5 rounded border border-slate-200 dark:border-slate-800 bg-[#FCFAF8] dark:bg-slate-950 peer-checked:bg-[#FA5A24] peer-checked:border-[#FA5A24] transition-all flex items-center justify-center" />
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white absolute left-0.5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  <span className="ml-2.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Login CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FA5A24] hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 cursor-pointer transition-all disabled:opacity-75 disabled:cursor-not-allowed select-none mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-t-white border-white/20 animate-spin" />
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight size={14} className="translate-y-px" />
                  </>
                )}
              </button>

            </form>

            {/* Separator */}
            <div className="flex items-center gap-3 my-6 select-none">
              <div className="h-[1px] bg-slate-100 dark:bg-slate-800/80 flex-1" />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">or</span>
              <div className="h-[1px] bg-slate-100 dark:bg-slate-800/80 flex-1" />
            </div>

            {/* Google OAuth simulation button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 active:bg-slate-100/80 transition-colors shadow-sm cursor-pointer select-none"
            >
              {/* Google Colored Logo Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Login with Google</span>
            </button>

            {/* Bottom: Contact Super Admin Info */}
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 font-semibold select-none mt-6 leading-relaxed">
              Don't have an account?{' '}
              <a 
                href="#/contact" 
                onClick={(e) => { e.preventDefault(); alert("Contact Admin form submission simulated."); }}
                className="text-[#FA5A24] hover:text-[#E14614] dark:text-orange-400 font-bold transition-colors"
              >
                Contact Super Admin
              </a>
            </p>

          </div>
        </div>

        {/* Footer: Copyright */}
        <div className="w-full text-center z-10 select-none">
          <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold tracking-tight">
            © 2025 Astro Admin. All rights reserved.
          </p>
        </div>

      </div>

    </div>
  );
}
