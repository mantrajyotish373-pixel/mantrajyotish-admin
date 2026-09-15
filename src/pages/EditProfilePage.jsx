import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  UploadCloud, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  Info
} from 'lucide-react';

export default function EditProfilePage() {
  const navigate = useNavigate();

  // Form states initialized dynamically from localStorage
  const [fullName, setFullName] = useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.firstname) return u.firstname + (u.lastname ? ' ' + u.lastname : '');
        if (u.phone) return u.phone;
      } catch(e) {}
    }
    return 'Admin';
  });
  const [email, setEmail] = useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.email) return u.email;
      } catch(e) {}
    }
    return 'admin@astroadmin.com';
  });
  const [phone, setPhone] = useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.phone) {
          return u.phone.replace(/^\+91\s?/, '');
        }
      } catch(e) {}
    }
    return '98765 43210';
  });
  const [countryCode, setCountryCode] = useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.phone && u.phone.startsWith('+')) {
          const match = u.phone.match(/^(\+\d+)/);
          if (match) return match[1];
        }
      } catch(e) {}
    }
    return '+91';
  });
  const [role, setRole] = useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role) return u.role.charAt(0).toUpperCase() + u.role.slice(1) + ' Admin';
      } catch(e) {}
    }
    return 'Super Admin';
  });
  const [username, setUsername] = useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.tuloId) return u.tuloId;
        if (u.phone) return u.phone;
      } catch(e) {}
    }
    return 'admin';
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('Super Admin of Astro Admin Dashboard.');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle avatar upload simulation
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMessage('');

    // Save updated profile data to localStorage so it persists across refreshes
    try {
      const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
      const nameParts = fullName.trim().split(' ');
      const firstname = nameParts[0] || 'Admin';
      const lastname = nameParts.slice(1).join(' ') || '';
      
      const updatedUser = {
        ...existingUser,
        firstname,
        lastname,
        email,
        phone: `${countryCode} ${phone}`,
        role: role.toLowerCase().replace(' admin', ''),
        tuloId: username,
        bio,
        avatar
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to update user profile in localStorage:', err);
    }

    // Simulate update API response delay
    setTimeout(() => {
      setIsUpdating(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Auto clear alert
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 w-full select-none pb-12">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              Edit Profile
            </h1>
            <Sparkles size={18} className="text-[#FA5A24] animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span>Profile</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">Edit Profile</span>
          </div>
        </div>
      </div>

      {/* Success alert banner */}
      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 text-xs px-4 py-3.5 rounded-2xl font-semibold flex items-center gap-2 animate-slideDown shadow-sm">
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Profile Information Form (8 columns) */}
        <form onSubmit={handleUpdateProfile} className="lg:col-span-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
          
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>
              Profile Information
            </h2>
          </div>

          {/* Profile Picture Uploader */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Profile Picture</label>
            <div className="flex items-center gap-5 mt-1">
              <img 
                src={avatar} 
                alt="Profile Avatar" 
                className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0"
              />
              <div className="flex flex-col gap-1.5">
                <div className="relative">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="avatar-upload"
                    className="flex items-center gap-2 border border-slate-200 dark:border-slate-600 hover:border-[#FA5A24] dark:hover:border-[#FA5A24] text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-slate-700"
                  >
                    <UploadCloud size={14} />
                    <span>Change Photo</span>
                  </label>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold leading-none mt-1">
                  JPG, PNG or WEBP (Max. 2MB)
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Full Name field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-[#FCFAF8] dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:border-[#FA5A24] dark:focus:border-[#FA5A24] transition-all font-semibold"
              />
            </div>

            {/* Email Address field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-[#FCFAF8] dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:border-[#FA5A24] dark:focus:border-[#FA5A24] transition-all font-semibold"
              />
            </div>

            {/* Phone Number field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {/* Custom prefix container */}
                <div className="flex items-center gap-1.5 bg-[#FCFAF8] dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <span>🇮🇳</span>
                  <select 
                    value={countryCode} 
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="outline-none bg-transparent font-bold cursor-pointer text-slate-800 dark:text-slate-100"
                  >
                    <option value="+91" className="dark:bg-slate-800"> +91</option>
                    <option value="+1" className="dark:bg-slate-800"> +1</option>
                    <option value="+44" className="dark:bg-slate-800"> +44</option>
                  </select>
                </div>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="flex-1 bg-[#FCFAF8] dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:border-[#FA5A24] dark:focus:border-[#FA5A24] transition-all font-semibold"
                />
              </div>
            </div>

            {/* Role dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#FCFAF8] dark:bg-slate-700 text-slate-850 dark:text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:border-[#FA5A24] dark:focus:border-[#FA5A24] transition-all font-semibold cursor-pointer"
              >
                <option value="Super Admin" className="dark:bg-slate-800">Super Admin</option>
                <option value="Admin" className="dark:bg-slate-800">Admin</option>
                <option value="Support" className="dark:bg-slate-800">Support</option>
              </select>
            </div>

            {/* Username input */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <User size={15} />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-[#FCFAF8] dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:border-[#FA5A24] dark:focus:border-[#FA5A24] transition-all font-semibold"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full bg-[#FCFAF8] dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs px-4 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:border-[#FA5A24] dark:focus:border-[#FA5A24] transition-all font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-500 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-[#FCFAF8] dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs px-4 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:border-[#FA5A24] dark:focus:border-[#FA5A24] transition-all font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-500 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Bio textarea */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Bio</label>
                <span className="text-[10px] text-slate-400 font-bold">{bio.length}/160</span>
              </div>
              <textarea
                value={bio}
                maxLength={160}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a brief bio..."
                rows={4}
                className="w-full bg-[#FCFAF8] dark:bg-slate-700 text-slate-850 dark:text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:border-[#FA5A24] dark:focus:border-[#FA5A24] transition-all font-semibold resize-none"
              />
            </div>

          </div>

          {/* Form Action buttons */}
          <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-700/60 pt-6">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="px-6 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#FA5A24] hover:bg-orange-600 active:bg-orange-700 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <div className="w-3.5 h-3.5 border-2 border-t-white border-white/20 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Update Profile</span>
                  <ArrowRight size={13} className="translate-y-px" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* Right Column: Profile Preview Widget (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden flex flex-col">
            
            {/* Card Header title */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-700/60 flex items-center">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>
                Profile Preview
              </h3>
            </div>

            {/* Profile Graphic & Details */}
            <div className="relative flex flex-col items-center">
              
              {/* Peach Gradient Top Arch */}
              <div className="w-full h-24 bg-[#FFF2EC] dark:bg-slate-700 relative overflow-hidden" />
              
              {/* Profile Avatar overlaying the top arch */}
              <div className="absolute top-10 w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden shadow-md">
                <img 
                  src={avatar} 
                  alt="Admin Avatar Preview" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Details */}
              <div className="flex flex-col items-center mt-12.5 px-6 pb-6 text-center w-full">
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {fullName || 'Admin'}
                </h4>
                <span className="inline-block bg-[#FFF5F1] dark:bg-[#FA5A24]/15 text-[#FA5A24] text-[10px] font-extrabold px-3 py-1 rounded-full mt-1.5 shadow-sm">
                  {role || 'Super Admin'}
                </span>

                {/* Details List */}
                <div className="w-full space-y-4 mt-6 border-t border-slate-100 dark:border-slate-700/60 pt-5 text-left">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Mail size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate">
                      {email || 'admin@astroadmin.com'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <Phone size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      {countryCode} {phone || '98765 43210'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Jaipur, Rajasthan, India
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Joined on 15 Mar 2024, 10:30 AM
                    </span>
                  </div>
                </div>

                {/* View Profile CTA */}
                <button 
                  type="button"
                  onClick={() => navigate('/view-profile')}
                  className="w-full border border-[#FA5A24] hover:bg-[#FFF5F1]/30 text-[#FA5A24] text-xs font-bold py-2.5 rounded-xl transition-all mt-6 cursor-pointer"
                >
                  View Profile
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Alert bar */}
      <div className="bg-[#FFF5F1]/80 dark:bg-slate-800 border border-orange-100/50 dark:border-slate-700/60 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
        <Info size={16} className="text-[#FA5A24] flex-shrink-0" />
        <span className="text-[11px] md:text-xs text-slate-600 dark:text-slate-300 font-medium leading-normal">
          Changes will take effect instantly across all components.
        </span>
      </div>

    </div>
  );
}
