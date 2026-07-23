import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Pencil, 
  Sparkles 
} from 'lucide-react';

export default function ViewProfilePage() {
  const navigate = useNavigate();

  // Dynamic profile data from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const profileData = {
    fullName: user && user.firstname ? user.firstname + (user.lastname ? ' ' + user.lastname : '') : 'Admin',
    role: user && user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) + ' Admin' : 'Super Admin',
    email: user && user.email ? user.email : 'admin@astroadmin.com',
    phone: user && user.phone ? user.phone : '+91 98765 43210',
    location: 'Jaipur, Rajasthan, India',
    joinedOn: user && user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '15 Mar 2024, 10:30 AM',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face'
  };

  return (
    <div className="flex flex-col gap-6 w-full select-none pb-12">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              View Profile
            </h1>
            <Sparkles size={18} className="text-[#FA5A24] animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span>Profile</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">View Profile</span>
          </div>
        </div>
      </div>

      {/* Profile Details Centered Card */}
      <div className="max-w-4xl mx-auto w-full mt-4">
        
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          
          {/* Peach Gradient Top Arch */}
          <div className="w-full h-36 bg-[#FFF2EC] relative" />
          
          {/* Profile Details Content */}
          <div className="relative flex flex-col items-center px-6 pb-8 md:px-12">
            
            {/* Center Circle Avatar overlaying header */}
            <div className="absolute -top-16 w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
              <img 
                src={profileData.avatar} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Info Details Header */}
            <div className="flex flex-col items-center mt-20 text-center w-full">
              <h2 className="text-xl font-bold text-slate-850 tracking-tight" style={{ fontFamily: 'Outfit' }}>
                {profileData.fullName}
              </h2>
              <span className="inline-block bg-[#FFF5F1] text-[#FA5A24] text-xs font-extrabold px-3 py-1 rounded-full mt-2 shadow-sm">
                {profileData.role}
              </span>
            </div>

            {/* Information Grid Section */}
            <div className="w-full max-w-2xl mt-10 border-t border-slate-100 pt-8 space-y-6">
              
              {/* Email Address row */}
              <div className="flex items-center gap-4 hover:bg-slate-50/50 p-2 rounded-2xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-100">
                  <Mail size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                    Email Address
                  </span>
                  <span className="text-sm font-semibold text-slate-700 mt-0.5 block truncate">
                    {profileData.email}
                  </span>
                </div>
              </div>

              {/* Phone Number row */}
              <div className="flex items-center gap-4 hover:bg-slate-50/50 p-2 rounded-2xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-100">
                  <Phone size={16} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                    Phone Number
                  </span>
                  <span className="text-sm font-semibold text-slate-700 mt-0.5 block">
                    {profileData.phone}
                  </span>
                </div>
              </div>

              {/* Location row */}
              <div className="flex items-center gap-4 hover:bg-slate-50/50 p-2 rounded-2xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-100">
                  <MapPin size={16} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                    Location
                  </span>
                  <span className="text-sm font-semibold text-slate-700 mt-0.5 block">
                    {profileData.location}
                  </span>
                </div>
              </div>

              {/* Joined On row */}
              <div className="flex items-center gap-4 hover:bg-slate-50/50 p-2 rounded-2xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-100">
                  <Calendar size={16} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                    Joined On
                  </span>
                  <span className="text-sm font-semibold text-slate-700 mt-0.5 block">
                    {profileData.joinedOn}
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Edit Action Button */}
            <div className="w-full max-w-2xl mt-8 pt-6 border-t border-slate-100 flex justify-center">
              <button 
                type="button"
                onClick={() => navigate('/edit-profile')}
                className="w-full border border-[#FA5A24] hover:bg-[#FFF5F1]/30 text-[#FA5A24] text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
              >
                <Pencil size={13} />
                <span>Edit Profile</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
