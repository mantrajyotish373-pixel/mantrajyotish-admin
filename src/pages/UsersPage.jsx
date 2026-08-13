import React, { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Eye, 
  Pencil, 
  MoreVertical, 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Compass, 
  Wallet, 
  MessageSquare, 
  Star, 
  UserMinus, 
  Key,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const mockUsers = [
  {
    id: 1,
    name: 'Ravi Sharma',
    mobile: '9876543210',
    email: 'ravi@gmail.com',
    wallet: '₹520.00',
    walletRaw: 520,
    status: 'Active',
    joinedDate: '10 Jul 2025',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    details: {
      location: 'Mumbai, Maharashtra',
      zodiac: 'Aries',
      gender: 'Male',
      dob: '12 Apr 1995',
      referralCode: 'RAVI123',
      totalReferrals: 12,
      totalSpent: '₹4,250.00',
      chats: 48,
      calls: 26,
      rating: 4.8,
      activities: [
        { id: 1, type: 'chat', text: 'Chat with Pandit Ravi', cost: '₹45.00', date: '12 Jul 2025, 10:30 AM' },
        { id: 2, type: 'call', text: 'Call with Astro Neha', cost: '₹60.00', date: '11 Jul 2025, 09:15 PM' }
      ]
    }
  },
  {
    id: 2,
    name: 'Priya Verma',
    mobile: '9123456780',
    email: 'priya@gmail.com',
    wallet: '₹1,250.00',
    walletRaw: 1250,
    status: 'Active',
    joinedDate: '09 Jul 2025',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    details: {
      location: 'Delhi, India',
      zodiac: 'Leo',
      gender: 'Female',
      dob: '18 Aug 1998',
      referralCode: 'PRIYA780',
      totalReferrals: 8,
      totalSpent: '₹6,800.00',
      chats: 72,
      calls: 40,
      rating: 4.9,
      activities: [
        { id: 1, type: 'chat', text: 'Chat with Pandit Deepak', cost: '₹120.00', date: '10 Jul 2025, 11:20 AM' },
        { id: 2, type: 'call', text: 'Call with Astro Simran', cost: '₹80.00', date: '09 Jul 2025, 04:30 PM' }
      ]
    }
  },
  {
    id: 3,
    name: 'Amit Kumar',
    mobile: '9988776655',
    email: 'amit@gmail.com',
    wallet: '₹0.00',
    walletRaw: 0,
    status: 'Inactive',
    joinedDate: '08 Jul 2025',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    details: {
      location: 'Bangalore, Karnataka',
      zodiac: 'Gemini',
      gender: 'Male',
      dob: '05 Jun 1992',
      referralCode: 'AMIT655',
      totalReferrals: 2,
      totalSpent: '₹950.00',
      chats: 12,
      calls: 5,
      rating: 4.2,
      activities: [
        { id: 1, type: 'call', text: 'Call with Pandit Ramesh', cost: '₹50.00', date: '08 Jul 2025, 02:15 PM' }
      ]
    }
  },
  {
    id: 4,
    name: 'Neha Joshi',
    mobile: '9001122334',
    email: 'neha@gmail.com',
    wallet: '₹305.00',
    walletRaw: 305,
    status: 'Active',
    joinedDate: '07 Jul 2025',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    details: {
      location: 'Pune, Maharashtra',
      zodiac: 'Virgo',
      gender: 'Female',
      dob: '22 Sep 1996',
      referralCode: 'NEHA334',
      totalReferrals: 5,
      totalSpent: '₹2,900.00',
      chats: 35,
      calls: 15,
      rating: 4.7,
      activities: [
        { id: 1, type: 'chat', text: 'Chat with Astro Priya', cost: '₹35.00', date: '07 Jul 2025, 08:45 AM' }
      ]
    }
  },
  {
    id: 5,
    name: 'Vikram Singh',
    mobile: '8787878787',
    email: 'vikram@gmail.com',
    wallet: '₹720.00',
    walletRaw: 720,
    status: 'Active',
    joinedDate: '07 Jul 2025',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    details: {
      location: 'Jaipur, Rajasthan',
      zodiac: 'Scorpio',
      gender: 'Male',
      dob: '14 Nov 1994',
      referralCode: 'VIK8787',
      totalReferrals: 11,
      totalSpent: '₹5,100.00',
      chats: 50,
      calls: 30,
      rating: 4.5,
      activities: [
        { id: 1, type: 'call', text: 'Call with Astro Vijay', cost: '₹100.00', date: '07 Jul 2025, 07:30 PM' }
      ]
    }
  },
  {
    id: 6,
    name: 'Anjali Patel',
    mobile: '8600011111',
    email: 'anjali@gmail.com',
    wallet: '₹180.00',
    walletRaw: 180,
    status: 'Active',
    joinedDate: '06 Jul 2025',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    details: {
      location: 'Ahmedabad, Gujarat',
      zodiac: 'Taurus',
      gender: 'Female',
      dob: '03 May 1997',
      referralCode: 'ANJ111',
      totalReferrals: 4,
      totalSpent: '₹1,850.00',
      chats: 22,
      calls: 8,
      rating: 4.6,
      activities: [
        { id: 1, type: 'chat', text: 'Chat with Pandit Harish', cost: '₹30.00', date: '06 Jul 2025, 12:10 PM' }
      ]
    }
  },
  {
    id: 7,
    name: 'Rahul Mehta',
    mobile: '8955663322',
    email: 'rahul@gmail.com',
    wallet: '₹0.00',
    walletRaw: 0,
    status: 'Blocked',
    joinedDate: '05 Jul 2025',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop',
    details: {
      location: 'Kolkata, West Bengal',
      zodiac: 'Capricorn',
      gender: 'Male',
      dob: '30 Dec 1990',
      referralCode: 'RAHUL322',
      totalReferrals: 0,
      totalSpent: '₹450.00',
      chats: 8,
      calls: 2,
      rating: 3.8,
      activities: [
        { id: 1, type: 'chat', text: 'Chat with Astro Ajay', cost: '₹20.00', date: '05 Jul 2025, 09:00 AM' }
      ]
    }
  },
  {
    id: 8,
    name: 'Simran Kaur',
    mobile: '9112233445',
    email: 'simran@gmail.com',
    wallet: '₹950.00',
    walletRaw: 950,
    status: 'Active',
    joinedDate: '05 Jul 2025',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    details: {
      location: 'Chandigarh, Punjab',
      zodiac: 'Libra',
      gender: 'Female',
      dob: '11 Oct 1999',
      referralCode: 'SIM950',
      totalReferrals: 9,
      totalSpent: '₹4,750.00',
      chats: 64,
      calls: 38,
      rating: 4.8,
      activities: [
        { id: 1, type: 'call', text: 'Call with Pandit Gagan', cost: '₹75.00', date: '05 Jul 2025, 05:40 PM' }
      ]
    }
  },
  {
    id: 9,
    name: 'Deepak Yadav',
    mobile: '9334455667',
    email: 'deepak@gmail.com',
    wallet: '₹130.00',
    walletRaw: 130,
    status: 'Inactive',
    joinedDate: '04 Jul 2025',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop',
    details: {
      location: 'Lucknow, Uttar Pradesh',
      zodiac: 'Sagittarius',
      gender: 'Male',
      dob: '25 Nov 1993',
      referralCode: 'DEEP667',
      totalReferrals: 3,
      totalSpent: '₹1,200.00',
      chats: 18,
      calls: 9,
      rating: 4.1,
      activities: [
        { id: 1, type: 'chat', text: 'Chat with Astro Raj', cost: '₹40.00', date: '04 Jul 2025, 02:50 PM' }
      ]
    }
  },
  {
    id: 10,
    name: 'Kavya Shah',
    mobile: '9122334455',
    email: 'kavya@gmail.com',
    wallet: '₹610.00',
    walletRaw: 610,
    status: 'Active',
    joinedDate: '04 Jul 2025',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    details: {
      location: 'Surat, Gujarat',
      zodiac: 'Cancer',
      gender: 'Female',
      dob: '08 Jul 2000',
      referralCode: 'KAVYA455',
      totalReferrals: 7,
      totalSpent: '₹3,600.00',
      chats: 45,
      calls: 20,
      rating: 4.7,
      activities: [
        { id: 1, type: 'call', text: 'Call with Pandit Dev', cost: '₹60.00', date: '04 Jul 2025, 10:15 AM' }
      ]
    }
  }
];

const getZodiacSign = (dateString) => {
  if (!dateString) return 'Aries';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Aries';
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
};

const formatJoinedDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-US', options).replace(/,/g, '');
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [subTab, setSubTab] = useState('All Users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailTab, setDetailTab] = useState('Overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addForm, setAddForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    email: '',
    gender: 'Select Gender',
    dob: '',
    tob: '',
    birthPlace: '',
    city: '',
    state: '',
    country: '',
    address: ''
  });

  const fetchUsers = (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";
    const token = localStorage.getItem('authToken');
    fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/user/all`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch user profiles');
        }
        return res.json();
      })
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          const mappedUsers = json.data.map((user, idx) => {
            const capStatus = user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active';
            const formattedDob = user.dateofbirth ? formatJoinedDate(user.dateofbirth) : '12 Apr 1995';
            const formattedJoined = user.createdAt ? formatJoinedDate(user.createdAt) : '10 Jul 2025';
            
            // Gender avatar placeholder if avatar empty
            let userAvatar = user.avatar;
            if (!userAvatar) {
              userAvatar = user.gender === 'female' 
                ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
                : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop';
            }

            return {
              id: user._id || idx,
              name: user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Unnamed User',
              uniqueId: user.uniqueId || 'N/A',
              mobile: user.phone || 'N/A',
              email: user.email || 'N/A',
              wallet: '₹' + (user.walletBalance ?? 0).toFixed(2),
              walletRaw: user.walletBalance ?? 0,
              status: capStatus,
              joinedDate: formattedJoined,
              avatar: userAvatar,
              details: {
                location: user.placeofbirth || user.city || 'India',
                zodiac: getZodiacSign(user.dateofbirth),
                gender: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Male',
                dob: formattedDob,
                referralCode: 'REF' + (user.phone ? user.phone.slice(-4) : '0000'),
                totalReferrals: 0,
                totalSpent: '₹0.00',
                chats: 0,
                calls: 0,
                rating: 5.0,
                activities: []
              }
            };
          });
          
          setUsers(mappedUsers);
        } else {
          throw new Error('Invalid API response format');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers(true);
    // Auto-refresh every 1.5 minutes (90 seconds)
    const intervalId = setInterval(() => {
      fetchUsers(false);
    }, 90000);
    return () => clearInterval(intervalId);
  }, []);

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!addForm.firstName.trim()) {
      alert("Please enter first name");
      return;
    }
    if (!addForm.lastName.trim()) {
      alert("Please enter last name");
      return;
    }
    if (!addForm.phone.trim()) {
      alert("Please enter phone number");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";
    fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: (() => {
        let formattedDob = "";
        if (addForm.dob) {
          const parts = addForm.dob.split(" / ");
          if (parts.length === 3) {
            formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
          } else {
            formattedDob = addForm.dob;
          }
        }
        const fallbackEmail = addForm.email.trim() || `${addForm.phone.trim().replace(/\D/g, "")}@kalpjoytish.com`;
        return JSON.stringify({
          firstname: addForm.firstName,
          middlename: addForm.middleName,
          lastname: addForm.lastName,
          gender: addForm.gender === "Select Gender" ? "" : addForm.gender.toLowerCase(),
          dateofbirth: formattedDob,
          timeofbirth: addForm.tob,
          placeofbirth: addForm.birthPlace,
          city: addForm.city,
          state: addForm.state,
          country: addForm.country,
          address: addForm.address,
          phone: addForm.phone,
          email: fallbackEmail
        });
      })()
    })
    .then(res => res.json())
    .then(data => {
      setIsSubmitting(false);
      if (data.success) {
        alert("User Profile created successfully!");
        setIsAddUserOpen(false);
        window.location.reload();
      } else {
        alert(data.message || "Failed to create user profile");
      }
    })
    .catch(err => {
      console.error("Create User Error:", err);
      alert(`User profile creation failed: ${err.message}`);
      setIsSubmitting(false);
    });
  };

  // Filter users based on sub-tab and search query
  const filteredUsers = users.filter(user => {
    if (subTab === 'Active Users' && user.status !== 'Active') return false;
    if (subTab === 'Blocked Users' && user.status !== 'Blocked') return false;
    if (subTab === 'New Registrations' && !user.joinedDate.toLowerCase().includes('2025') && !user.joinedDate.toLowerCase().includes('2026')) return false;

    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.mobile.includes(query) ||
      (user.uniqueId && user.uniqueId.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden select-none">
      {/* Breadcrumb Header */}
      <div className="flex flex-col flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Users
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
          <span>Dashboard</span>
          <span>&gt;</span>
          <span className="text-[#FA5A24]">Users</span>
        </div>
      </div>

      {/* Main Split Panel layout */}
      <div className="flex-1 min-h-0 flex flex-col xl:flex-row gap-6 items-stretch overflow-hidden w-full">
        {/* Left Side: Users List and Table Controls */}
        <div className="flex-1 bg-white p-5 md:p-6 rounded-2xl border border-orange-50/50 shadow-sm flex flex-col overflow-hidden h-full w-full">
          
          {error && (
            <div className="bg-amber-50 border border-amber-100 text-amber-700 text-[11px] px-4 py-2.5 rounded-xl font-medium mb-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-500" />
                <span>Could not fetch live profiles ({error}). Showing offline demo data.</span>
              </div>
              <button 
                onClick={() => {
                  window.location.reload();
                }}
                className="underline font-bold text-amber-800 hover:text-amber-900 ml-2"
              >
                Retry
              </button>
            </div>
          )}

          {/* Tabs header */}
          <div className="flex items-center gap-6 border-b border-slate-100 pb-1 mb-5 overflow-x-auto scrollbar-none flex-shrink-0">
            {['All Users', 'Active Users', 'Blocked Users', 'New Registrations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`pb-3 text-xs md:text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap outline-none ${
                  subTab === tab
                    ? 'border-[#FA5A24] text-[#FA5A24]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-5 flex-shrink-0">
            {/* Search Box */}
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name, email or mobile..."
                className="w-full bg-white text-slate-700 placeholder-slate-400 text-xs px-4 py-2.5 pr-10 rounded-xl outline-none border border-slate-200 focus:border-orange-200 transition-all duration-200"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Search size={15} />
              </div>
            </div>

            {/* Buttons Group */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-200">
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>
              <button 
                onClick={() => setIsAddUserOpen(true)}
                className="flex items-center gap-1 bg-[#FA5A24] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-orange-600/10 hover:bg-orange-600 transition-all duration-200"
              >
                <Plus size={14} />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Users Table scroll wrapper */}
          <div className="flex-1 overflow-y-auto min-h-0 w-full pr-1">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white">
                  <th className="pb-3 pl-2 font-bold bg-white">User</th>
                  <th className="pb-3 font-bold bg-white">Mobile Number</th>
                  <th className="pb-3 font-bold bg-white">Email</th>
                  <th className="pb-3 font-bold bg-white">Wallet Balance</th>
                  <th className="pb-3 font-bold bg-white">Status</th>
                  <th className="pb-3 font-bold bg-white">Joined Date</th>
                  <th className="pb-3 pr-2 text-right font-bold bg-white">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 rounded-full border-2 border-t-[#FA5A24] border-orange-100 animate-spin" />
                        <span>Loading registered users...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.map((user) => {
                  const isSelected = selectedUser?.id === user.id;
                  return (
                    <tr 
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`hover:bg-orange-50/20 cursor-pointer transition-colors duration-150 ${
                        isSelected ? 'bg-orange-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 pl-2 flex items-center gap-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-100"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 leading-tight">{user.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold tracking-wider mt-0.5">{user.uniqueId}</span>
                        </div>
                      </td>
                      <td className="py-3.5 font-medium text-slate-500">{user.mobile}</td>
                      <td className="py-3.5 font-medium text-slate-500">{user.email}</td>
                      <td className="py-3.5 font-bold text-slate-800">{user.wallet}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'Active' 
                            ? 'bg-[#E6F4EA] text-[#137333]' 
                            : user.status === 'Blocked'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-orange-50 text-[#FA5A24]'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3.5 font-medium text-slate-400">{user.joinedDate}</td>
                      <td className="py-3.5 pr-2 text-right">
                        <div 
                          className="inline-flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className="p-1 text-slate-400 hover:text-[#FA5A24] rounded hover:bg-slate-50 transition-colors">
                            <Eye size={14} />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-50 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-50 transition-colors">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 font-medium">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mt-5 border-t border-slate-100 pt-5 flex-shrink-0">
            <span className="text-[11px] text-slate-400 font-semibold">
              Showing 1 to {Math.min(10, filteredUsers.length)} of {filteredUsers.length} users
            </span>
            
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors text-xs font-bold">
                &lt;
              </button>
              <button className="w-7 h-7 rounded-lg bg-[#FA5A24] text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-orange-600/10">
                1
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center text-xs font-bold">
                2
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center text-xs font-bold">
                3
              </button>
              <span className="text-slate-400 text-xs px-1">...</span>
              <button className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center text-xs font-bold">
                25
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors text-xs font-bold">
                &gt;
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: User Details sticky panel */}
        {selectedUser && (
          <div className="w-full xl:w-[460px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-shrink-0 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>
                User Details
              </h3>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 pr-4">
              
              {/* Profile Card Summary */}
              <div className="bg-[#FFF8F5]/80 border border-orange-50 rounded-2xl p-5 flex flex-row items-center gap-5 relative overflow-hidden text-left">
                <img 
                  src={selectedUser.avatar} 
                  alt={selectedUser.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h4 className="font-extrabold text-slate-800 text-base leading-tight">{selectedUser.name}</h4>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                      selectedUser.status === 'Active' 
                        ? 'bg-[#E6F4EA]/80 text-[#137333]' 
                        : selectedUser.status === 'Blocked'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-orange-50 text-[#FA5A24]'
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  
                  <div className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold w-max mb-3 tracking-wider">
                    ID: {selectedUser.uniqueId}
                  </div>

                  {/* Details list */}
                  <div className="space-y-1.5 text-[11px] text-slate-500 font-semibold pl-0.5">
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-slate-400 flex-shrink-0" />
                      <span>{selectedUser.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-slate-400 flex-shrink-0" />
                      <span>{selectedUser.joinedDate} (Joined)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{selectedUser.details.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Compass size={13} className="text-slate-400 flex-shrink-0" />
                      <span>{selectedUser.details.zodiac}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Box Grid */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-[#E6F4EA]/40 border border-[#E6F4EA]/80 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm">
                    <Wallet size={13} className="text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">
                    {selectedUser.wallet}
                  </span>
                  <span className="text-[8px] text-slate-400 font-bold mt-1">Wallet</span>
                </div>

                <div className="bg-purple-50/50 border border-purple-100/80 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm">
                    <MessageSquare size={13} className="text-purple-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">
                    {selectedUser.details.chats}
                  </span>
                  <span className="text-[8px] text-slate-400 font-bold mt-1">Total Chats</span>
                </div>

                <div className="bg-blue-50/50 border border-blue-100/80 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm">
                    <Phone size={13} className="text-blue-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">
                    {selectedUser.details.calls}
                  </span>
                  <span className="text-[8px] text-slate-400 font-bold mt-1">Total Calls</span>
                </div>

                <div className="bg-amber-50/50 border border-amber-100/80 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm">
                    <Star size={13} className="text-amber-500 fill-amber-500/20" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">
                    {selectedUser.details.rating}
                  </span>
                  <span className="text-[8px] text-slate-400 font-bold mt-1">Avg Rating</span>
                </div>
              </div>

              {/* Sub tabs */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-1 overflow-x-auto scrollbar-none flex-shrink-0">
                {['Overview', 'History', 'Wallet', 'Bookings', 'Reviews', 'Support'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    className={`pb-2 text-[11px] font-bold border-b-2 whitespace-nowrap transition-colors outline-none ${
                      detailTab === tab
                        ? 'border-[#FA5A24] text-[#FA5A24]'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Panels */}
              {detailTab === 'Overview' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                    {/* About User Section */}
                    <div className="space-y-3 bg-[#FCFAF8] p-4 rounded-xl border border-slate-100/60 h-full">
                      <h5 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                        About User
                      </h5>
                      <div className="grid grid-cols-1 gap-y-3 text-[11px]">
                        <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                          <span className="text-slate-400 font-medium">Gender</span>
                          <span className="font-bold text-slate-700">{selectedUser.details.gender}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                          <span className="text-slate-400 font-medium">Date of Birth</span>
                          <span className="font-bold text-slate-700">{selectedUser.details.dob}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                          <span className="text-slate-400 font-medium">Email</span>
                          <span className="font-bold text-slate-700 break-all">{selectedUser.email}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                          <span className="text-slate-400 font-medium">Referral Code</span>
                          <span className="font-bold text-slate-700">{selectedUser.details.referralCode}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                          <span className="text-slate-400 font-medium">Total Referrals</span>
                          <span className="font-bold text-slate-700">{selectedUser.details.totalReferrals}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-400 font-medium">Total Spent</span>
                          <span className="font-extrabold text-slate-800 text-xs">{selectedUser.details.totalSpent}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions buttons */}
                    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100/60 h-full">
                      <h5 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                        Actions
                      </h5>
                      <div className="flex flex-col gap-2 text-[11px] font-bold text-left">
                        <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-750 justify-start transition-colors">
                          <Pencil size={13} className="text-slate-400" />
                          <span>Edit User</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-750 justify-start transition-colors">
                          <Plus size={13} className="text-emerald-600" />
                          <span>Add Wallet Balance</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-750 justify-start transition-colors">
                          <Wallet size={13} className="text-amber-500" />
                          <span>Deduct Wallet Balance</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 border border-red-100 rounded-lg hover:bg-red-50 text-red-500 justify-start transition-colors">
                          <UserMinus size={13} />
                          <span>Block User</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-750 justify-start transition-colors">
                          <Key size={13} className="text-slate-400" />
                          <span>Reset Password</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <h5 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                        Recent Activity
                      </h5>
                      <button className="text-[10px] font-bold text-[#FA5A24] hover:underline">
                        View All
                      </button>
                    </div>

                    <div className="space-y-2">
                      {selectedUser.details.activities.map((act) => (
                        <div key={act.id} className="flex items-center justify-between p-3 bg-[#FCFAF8] rounded-xl border border-slate-100/50">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              act.type === 'chat' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              <MessageSquare size={12} />
                            </div>
                            <div className="flex flex-col leading-tight min-w-0">
                              <span className="text-[10px] font-bold text-slate-700 truncate">{act.text}</span>
                              <span className="text-[8px] text-slate-400 font-medium mt-0.5">{act.date}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-800 pl-3">
                            {act.cost}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {detailTab !== 'Overview' && (
                <div className="text-center py-8 text-slate-400 text-[11px] font-medium bg-[#FCFAF8] rounded-xl border border-slate-100/60">
                  No {detailTab} data available.
                </div>
              )}

            </div>
          </div>
        )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-orange-50/50 to-amber-50/30">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>
                  Create User Profile <span className="text-[#FA5A24]">✨</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Register new client user details</p>
              </div>
              <button 
                onClick={() => setIsAddUserOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleAddUserSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Group 1: Basic Info */}
              <div>
                <h4 className="text-[10px] font-extrabold text-[#FA5A24] uppercase tracking-wider mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={addForm.firstName}
                      onChange={(e) => setAddForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="e.g. Sanjeev"
                      className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-orange-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Middle Name</label>
                    <input
                      type="text"
                      value={addForm.middleName}
                      onChange={(e) => setAddForm(prev => ({ ...prev, middleName: e.target.value }))}
                      placeholder="Optional"
                      className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-orange-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={addForm.lastName}
                      onChange={(e) => setAddForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="e.g. Pandey"
                      className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-orange-200"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Contact Details */}
              <div>
                <h4 className="text-[10px] font-extrabold text-[#FA5A24] uppercase tracking-wider mb-3">Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={addForm.phone}
                      onChange={(e) => setAddForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g. 9876543210"
                      className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-orange-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Email Address</label>
                    <input
                      type="email"
                      value={addForm.email}
                      onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. sanjeev@example.com"
                      className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-orange-200"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Personal & Birth Info */}
              <div>
                <h4 className="text-[10px] font-extrabold text-[#FA5A24] uppercase tracking-wider mb-3">Personal & Birth Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Gender</label>
                    <select
                      value={addForm.gender}
                      onChange={(e) => setAddForm(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full text-xs font-bold text-slate-650 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                    >
                      <option>Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Date of Birth</label>
                    <input
                      type="text"
                      value={addForm.dob}
                      onChange={(e) => setAddForm(prev => ({ ...prev, dob: e.target.value }))}
                      placeholder="DD / MM / YYYY"
                      className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-orange-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Time of Birth</label>
                    <input
                      type="text"
                      value={addForm.tob}
                      onChange={(e) => setAddForm(prev => ({ ...prev, tob: e.target.value }))}
                      placeholder="HH:MM AM/PM"
                      className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-orange-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Birth Place</label>
                    <input
                      type="text"
                      value={addForm.birthPlace}
                      onChange={(e) => setAddForm(prev => ({ ...prev, birthPlace: e.target.value }))}
                      placeholder="e.g. Dehradun"
                      className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-orange-200"
                    />
                  </div>
                </div>
              </div>

              {/* Group 4: Address Info */}
              <div>
                <h4 className="text-[10px] font-extrabold text-[#FA5A24] uppercase tracking-wider mb-3">Location Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">City</label>
                    <input
                      type="text"
                      value={addForm.city}
                      onChange={(e) => setAddForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="e.g. Roorkee"
                      className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-orange-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">State</label>
                    <input
                      type="text"
                      value={addForm.state}
                      onChange={(e) => setAddForm(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="e.g. Uttarakhand"
                      className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-orange-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Country</label>
                    <input
                      type="text"
                      value={addForm.country}
                      onChange={(e) => setAddForm(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="e.g. India"
                      className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-orange-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Full Address</label>
                  <textarea
                    rows="2"
                    value={addForm.address}
                    onChange={(e) => setAddForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter street, house number, etc."
                    className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-orange-200 resize-none animate-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-[#FA5A24] text-white rounded-xl text-xs font-bold hover:bg-orange-600 shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                      <span>Creating User...</span>
                    </>
                  ) : (
                    <span>Create User Profile</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default UsersPage;
