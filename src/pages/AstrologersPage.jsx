import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Eye, 
  Pencil, 
  MoreVertical, 
  Check, 
  X, 
  ChevronLeft, 
  Calendar, 
  Languages, 
  Star, 
  Compass, 
  Clock, 
  Award, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  TrendingUp, 
  Trash2, 
  Download, 
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Building,
  Globe,
  Map as MapIcon,
  Camera,
  Save,
  Lock,
  EyeOff,
  Hash,
  Crown,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  UserPlus,
  FileText,
  Video,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Astrologers mock data representing both verified and pending members
const mockAstrologersList = [
  {
    id: 1,
    name: 'Pandit Ravi Sharma',
    skill: 'Vedic, Kundli',
    experience: '12 Years',
    rateMin: '₹30/Call',
    chatRateMin: '₹20/Chat',
    rateRaw: 30,
    chatRateRaw: 20,
    status: 'Online',
    rating: 4.9,
    reviewsCount: 1250,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    details: {
      memberSince: '10 May 2023',
      languages: 'Hindi, English',
      positiveRating: '98%',
      totalClients: 1256,
      about: 'Experienced Vedic Astrologer specializing in Kundli, Marriage, Career, Business and Vastu.',
      expertise: ['Vedic Astrology', 'Kundli', 'Numerology', 'Vastu', 'KP Astrology', 'Marriage Match', 'Tarot Card', 'Palmistry'],
      services: [
        { id: 1, name: 'Kundli Reading', price: 500, duration: '30 Min', isActive: true },
        { id: 2, name: 'Career Guidance', price: 600, duration: '30 Min', isActive: true },
        { id: 3, name: 'Marriage Prediction', price: 700, duration: '30 Min', isActive: true },
        { id: 4, name: 'Vastu Consultation', price: 800, duration: '30 Min', isActive: true },
        { id: 5, name: 'Palm Reading', price: 400, duration: '20 Min', isActive: true }
      ],
      earnings: {
        total: '₹48,560',
        thisMonth: '₹12,450',
        totalCalls: 856,
        totalChats: 1542,
        chartData: [
          { date: '1 May', earn: 2800 },
          { date: '6 May', earn: 3500 },
          { date: '11 May', earn: 2100 },
          { date: '16 May', earn: 4800 },
          { date: '21 May', earn: 3900 },
          { date: '26 May', earn: 5400 },
          { date: '30 May', earn: 4500 }
        ],
        breakdown: [
          { label: 'From Calls', value: '₹28,650' },
          { label: 'From Chats', value: '₹15,420' },
          { label: 'Pooja Bookings', value: '₹3,250' },
          { label: 'Other Services', value: '₹1,240' }
        ]
      },
      reviews: [
        { id: 1, user: 'Priya Sharma', rating: 5, comment: 'Very good guidance. My confusion is cleared. Thank you so much!', date: '12 May 2025', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
        { id: 2, user: 'Rahul Verma', rating: 5, comment: 'Accurate prediction and polite behavior. Highly recommended.', date: '10 May 2025', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
        { id: 3, user: 'Anjali Patel', rating: 4, comment: 'Helped me a lot in career decision. Really great experience.', date: '08 May 2025', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' }
      ],
      documents: [
        { id: 1, name: 'Aadhaar Card', status: 'Verified', date: '10 May 2023' },
        { id: 2, name: 'PAN Card', status: 'Verified', date: '10 May 2023' },
        { id: 3, name: 'Experience Certificate', status: 'Verified', date: '10 May 2023' },
        { id: 4, name: 'Photo', status: 'Verified', date: '10 May 2023' },
        { id: 5, name: 'Bank Details', status: 'Verified', date: '10 May 2023' }
      ],
      availability: [
        { day: 'Monday', isActive: true, start: '10:00 AM', end: '10:00 PM' },
        { day: 'Tuesday', isActive: true, start: '10:00 AM', end: '10:00 PM' },
        { day: 'Wednesday', isActive: true, start: '10:00 AM', end: '10:00 PM' },
        { day: 'Thursday', isActive: false, start: 'Day Off', end: 'Day Off' },
        { day: 'Friday', isActive: true, start: '10:00 AM', end: '10:00 PM' },
        { day: 'Saturday', isActive: true, start: '10:00 AM', end: '10:00 PM' },
        { day: 'Sunday', isActive: true, start: '10:00 AM', end: '10:00 PM' }
      ]
    }
  },
  {
    id: 2,
    name: 'Astro Neha Joshi',
    skill: 'Tarot, KP',
    experience: '8 Years',
    rateMin: '₹25/Call',
    chatRateMin: '₹15/Chat',
    rateRaw: 25,
    chatRateRaw: 15,
    status: 'Busy',
    rating: 4.8,
    reviewsCount: 857,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
  },
  {
    id: 3,
    name: 'Astro Mohit Verma',
    skill: 'Vedic, Vastu',
    experience: '10 Years',
    rateMin: '₹35/Call',
    chatRateMin: '₹25/Chat',
    rateRaw: 35,
    chatRateRaw: 25,
    status: 'Offline',
    rating: 4.7,
    reviewsCount: 754,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  },
  {
    id: 4,
    name: 'Dr. Priya Iyer',
    skill: 'Astrology, Tarot',
    experience: '15 Years',
    rateMin: '₹35/Call',
    chatRateMin: '₹25/Chat',
    rateRaw: 35,
    chatRateRaw: 25,
    status: 'Online',
    rating: 4.9,
    reviewsCount: 645,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
  },
  {
    id: 5,
    name: 'Pandit Suresh Tiwari',
    skill: 'Vedic, KP',
    experience: '20 Years',
    rateMin: '₹40/Call',
    chatRateMin: '₹30/Chat',
    rateRaw: 40,
    chatRateRaw: 30,
    status: 'Offline',
    rating: 4.8,
    reviewsCount: 980,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop'
  },
  {
    id: 6,
    name: 'Astro Pooja Sharma',
    skill: 'Numerology, Tarot',
    experience: '7 Years',
    rateMin: '₹22/Call',
    chatRateMin: '₹16/Chat',
    rateRaw: 22,
    chatRateRaw: 16,
    status: 'Online',
    rating: 4.6,
    reviewsCount: 420,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
  }
];

const pendingAstrologersMock = [
  {
    id: 11,
    name: 'Astro Raj Verma',
    skill: 'Vedic Astrology',
    experience: '6 Years',
    rateMin: '₹20/Call, ₹15/Chat',
    appliedOn: '12 May 2025',
    docsVerified: '3/5',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop'
  },
  {
    id: 12,
    name: 'Neha Astrology',
    skill: 'Tarot Reading',
    experience: '5 Years',
    rateMin: '₹18/Call, ₹12/Chat',
    appliedOn: '11 May 2025',
    docsVerified: '2/5',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
  },
  {
    id: 13,
    name: 'Pandit Kailash',
    skill: 'Vedic, Vastu',
    experience: '9 Years',
    rateMin: '₹25/Call, ₹18/Chat',
    appliedOn: '10 May 2025',
    docsVerified: '4/5',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  {
    id: 14,
    name: 'Astro Simran Kaur',
    skill: 'Numerology',
    experience: '7 Years',
    rateMin: '₹22/Call, ₹14/Chat',
    appliedOn: '09 May 2025',
    docsVerified: '3/5',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop'
  }
];

// Reusable Tabs mapper

const formatSkills = (skillsArray, altArray) => {
  if (Array.isArray(skillsArray) && skillsArray.length > 0) return skillsArray.join(', ');
  if (Array.isArray(altArray) && altArray.length > 0) return altArray.join(', ');
  return 'Vedic';
};

const formatJoinedDate = (dateString) => {
  if (!dateString) return '10 May 2023';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '10 May 2023';
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-US', options).replace(/,/g, '');
};

const AstrologersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [astrologers, setAstrologers] = useState([]);
  const [pendingAstrologers, setPendingAstrologers] = useState([]);
  const [selectedAstro, setSelectedAstro] = useState(null);
  const [isInterviewDrawerOpen, setIsInterviewDrawerOpen] = useState(false);
  const [detailTab, setDetailTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aboutText, setAboutText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [interviewStatuses, setInterviewStatuses] = useState({});

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
    showCancel: true
  });

  const showAlert = (message, title = 'Notification', type = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type,
      confirmText: 'OK',
      showCancel: false,
      onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  const showConfirm = (message, onConfirmCallback, title = 'Confirm Action', type = 'warning', confirmText = 'Confirm') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        if (onConfirmCallback) onConfirmCallback();
      },
      onCancel: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, location.pathname, itemsPerPage]);

  const getSubTabs = () => [
    { id: 'all', label: 'All Astrologers', badge: astrologers.length + pendingAstrologers.length, path: '/astrologers/all' },
    { id: 'online', label: 'Online Now', badge: astrologers.filter(astro => astro.status === 'Online').length, path: '/astrologers/online' },
    { id: 'verified', label: 'Verified', badge: astrologers.filter(astro => astro.isVerified).length, path: '/astrologers/verified' },
    { id: 'pending', label: 'Pending', badge: pendingAstrologers.length, path: '/astrologers/pending' },
    { id: 'blocked', label: 'Blocked', badge: astrologers.filter(astro => astro.status === 'Blocked').length, path: '/astrologers/blocked' }
  ];

  const getInterviewStatus = (astroId) => {
    if (interviewStatuses[astroId]) return interviewStatuses[astroId];
    const astro = [...astrologers, ...pendingAstrologers].find(a => a.id === astroId);
    if (astro && astro.interview) {
      if (astro.interview.result === 'pass' || astro.interview.status === 'passed') return 'cleared';
      if (astro.interview.result === 'fail' || astro.interview.status === 'failed') return 'failed';
      return astro.interview.status; // 'requested', 'scheduled', etc.
    }
    return localStorage.getItem('interview_status_' + astroId) || 'pending';
  };

  const updateInterviewStatus = (astroId, status, notesVal = '') => {
    if (status === 'pending') {
      localStorage.setItem('interview_status_' + astroId, 'pending');
      setInterviewStatuses(prev => ({ ...prev, [astroId]: 'pending' }));
      return;
    }
    
    const token = localStorage.getItem('authToken');
    setIsLoading(true);
    
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";
    const endpoint = status === 'cleared'
      ? `${apiBaseUrl.replace(/\/$/, '')}/api/interview/pass/${astroId}`
      : `${apiBaseUrl.replace(/\/$/, '')}/api/interview/fail/${astroId}`;
      
    fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        interviewerNotes: notesVal
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to mark interview as ${status}`);
      }
      return res.json();
    })
    .then(json => {
      setIsLoading(false);
      if (json.success) {
        localStorage.setItem('interview_status_' + astroId, status);
        setInterviewStatuses(prev => ({ ...prev, [astroId]: status }));
        alert(`Interview status updated to ${status === 'cleared' ? 'Passed' : 'Failed'} successfully!`);
      } else {
        alert(json.message || 'Failed to update interview status.');
      }
    })
    .catch(err => {
      setIsLoading(false);
      console.error(err);
      alert(err.message || 'Error occurred while saving status.');
    });
  };

  const executeStatusChange = (astro, statusVal) => {
    const token = localStorage.getItem('authToken');
    setIsLoading(true);
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";

    const interviewEndpoint = statusVal === 'approved'
      ? `${apiBaseUrl.replace(/\/$/, '')}/api/interview/pass`
      : `${apiBaseUrl.replace(/\/$/, '')}/api/interview/fail`;

    fetch(interviewEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        astrologerId: astro.id || astro._id,
        email: astro.email,
        interviewerNotes: statusVal === 'approved' ? 'Approved by admin from Astrologers page.' : 'Blocked by admin from Astrologers page.'
      })
    })
      .then(res => res.json().catch(() => ({})))
      .then(json => {
        setIsLoading(false);
        if (json.success) {
          showAlert(`Astrologer successfully ${statusVal === 'approved' ? 'Approved' : 'Blocked'}!`, 'Success', 'success');
          fetchAstrologers();
          if (selectedAstro && selectedAstro.id === astro.id) {
            setSelectedAstro(prev => ({
              ...prev,
              isVerified: statusVal === 'approved',
              status: statusVal
            }));
          }
        } else {
          // Fallback to direct approve/reject API if interview endpoint fails
          const fallbackEndpoint = statusVal === 'approved'
            ? `${apiBaseUrl.replace(/\/$/, '')}/api/astro/approve/${astro.id}`
            : `${apiBaseUrl.replace(/\/$/, '')}/api/astro/reject/${astro.id}`;
          return fetch(fallbackEndpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ email: astro.email })
          })
            .then(r => r.json().catch(() => ({})))
            .then(j => {
              if (j.success) {
                showAlert(`Astrologer successfully ${statusVal === 'approved' ? 'Approved' : 'Blocked'}!`, 'Success', 'success');
                fetchAstrologers();
              } else {
                showAlert(j.message || json.message || `${statusVal} action failed.`, 'Action Failed', 'danger');
              }
            });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.error(err);
        showAlert(err.message || `Error occurred while trying to ${statusVal} astrologer.`, 'Error', 'danger');
      });
  };

  const handleVerifyStatusChange = (astro, statusVal) => {
    const identifier = astro?.email || astro?._id || astro?.id;
    if (!astro || !identifier) {
      showAlert('Astrologer details are missing. Cannot change status.', 'Error', 'danger');
      return;
    }

    const isApprove = statusVal === 'approved';
    const confirmMsg = isApprove
      ? `Approve "${astro.name || astro.email}"? They will be able to log in and start consultations.`
      : `Block/Reject "${astro.name || astro.email}"? This will prevent them from accessing the platform.`;

    showConfirm(
      confirmMsg,
      () => executeStatusChange(astro, statusVal),
      isApprove ? 'Approve Astrologer' : 'Block / Reject Astrologer',
      isApprove ? 'success' : 'danger',
      isApprove ? 'Yes, Approve' : 'Yes, Block'
    );
  };

  const defaultAstroDetails = {
    memberSince: '10 May 2023',
    languages: 'Hindi, English',
    positiveRating: '100%',
    totalClients: 0,
    about: '',
    expertise: [],
    services: [],
    earnings: {
      total: '₹0',
      thisMonth: '₹0',
      totalCalls: 0,
      totalChats: 0,
      chartData: []
    }
  };

  const fetchAstrologers = (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";
    const fetchAll = fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/astro/all?status=all`, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch astrologer profiles');
        return res.json();
      })
      .catch(err => ({ success: false, data: [] }));

    const fetchPending = fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/astro/pending`, { headers })
      .then(res => {
        if (!res.ok) return { success: false, data: [] };
        return res.json();
      })
      .catch(() => ({ success: false, data: [] }));

    const fetchInterviews = fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/interview/all`, { headers })
      .then(res => {
        if (!res.ok) return { success: false, data: [] };
        return res.json();
      })
      .catch(() => ({ success: false, data: [] }));

    Promise.all([fetchAll, fetchPending, fetchInterviews])
      .then(([allJson, pendingJson, interviewsJson]) => {
        let verified = [];
        let pending = [];

        const interviewMapByAstroId = new Map();
        const interviewMapByEmail = new Map();
        if (interviewsJson && interviewsJson.success && Array.isArray(interviewsJson.data)) {
          interviewsJson.data.forEach((iv) => {
            const astroObj = iv.astrologer || {};
            const astroIdStr = String(astroObj._id || astroObj.id || iv.astrologer);
            if (astroIdStr) interviewMapByAstroId.set(astroIdStr, iv);
            if (astroObj.email) interviewMapByEmail.set(String(astroObj.email).toLowerCase(), iv);
          });
        }

        const mapAstro = (item, idx, isVerif) => {
          const capStatus = item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Offline';
          const formattedJoined = item.createdAt ? formatJoinedDate(item.createdAt) : '10 May 2023';
          let astroAvatar = item.avatar;
          if (!astroAvatar) {
            astroAvatar = item.gender === 'female'
              ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop';
          }
          const detailsObj = item.details || defaultAstroDetails;

          const astroIdStr = String(item._id || idx);
          const astroEmailStr = String(item.email || '').toLowerCase();
          const ivRecord = item.interview || interviewMapByAstroId.get(astroIdStr) || interviewMapByEmail.get(astroEmailStr) || null;
          const slots = item.preferredSlots || (ivRecord && ivRecord.preferredSlots) || [];

          return {
            id: item._id || idx,
            _id: item._id,
            email: item.email || (item.astrologerLogin ? item.astrologerLogin.email : ''),
            name: item.name || 'Unnamed Astrologer',
            skill: formatSkills(item.skills, item.specialization || item.strengths),
            experience: (item.experience ?? 5) + ' Years',
            rateMin: '₹' + (item.callRate ?? 20) + '/Call',
            chatRateMin: '₹' + (item.chatRate ?? 15) + '/Chat',
            rateRaw: item.callRate ?? 20,
            chatRateRaw: item.chatRate ?? 15,
            status: capStatus,
            rating: item.rating ?? 4.8,
            reviewsCount: item.reviewsCount ?? 120,
            avatar: astroAvatar,
            isVerified: isVerif,
            interview: ivRecord ? { ...ivRecord, preferredSlots: slots } : null,
            preferredSlots: slots,
            appliedOn: formattedJoined,
            docsVerified: '3/5',
            raw: item,
            details: {
              ...detailsObj,
              memberSince: formattedJoined,
              languages: Array.isArray(item.languages) && item.languages.length > 0 ? item.languages.join(', ') : 'Hindi, English',
              about: item.about || item.introduction || ('Professional Astrologer specializing in ' + formatSkills(item.skills, item.specialization || item.strengths) + '.'),
              expertise: (item.skills && item.skills.length > 0) ? item.skills : (item.specialization || ['Vedic Astrology']),
              earnings: {
                ...detailsObj.earnings,
                total: '₹' + (item.totalEarnings ?? 0).toFixed(2),
                totalCalls: item.totalCalls ?? 0,
                totalChats: item.totalChats ?? 0,
                breakdown: [
                  { label: 'From Calls', value: '₹' + (item.callEarnings ?? 0).toFixed(2) },
                  { label: 'From Chats', value: '₹' + (item.chatEarnings ?? 0).toFixed(2) },
                  { label: 'Pooja Bookings', value: '₹0' },
                  { label: 'Other Services', value: '₹0' }
                ]
              }
            }
          };
        };

        if (allJson.success && Array.isArray(allJson.data)) {
          verified = allJson.data
            .filter(item => item.isVerified === true || item.status === 'approved')
            .map((item, idx) => mapAstro(item, idx, true));
          setAstrologers(verified);
        }

        const pendingMap = new Map();
        if (pendingJson.success && Array.isArray(pendingJson.data)) {
          pendingJson.data.forEach((item, idx) => {
            const mapped = mapAstro(item, idx, false);
            pendingMap.set(String(mapped.id), mapped);
          });
        }
        if (allJson.success && Array.isArray(allJson.data)) {
          allJson.data
            .filter(item => item.status === 'pending' || item.status === 'requested' || !item.isVerified)
            .forEach((item, idx) => {
              const mapped = mapAstro(item, idx, false);
              if (!pendingMap.has(String(mapped.id))) {
                pendingMap.set(String(mapped.id), mapped);
              }
            });
        }
        pending = Array.from(pendingMap.values());
        setPendingAstrologers(pending);

        const totalAstros = [...verified, ...pending];
        setSelectedAstro(prev => prev || verified[0] || totalAstros[0] || null);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
        setAstrologers([]);
        setPendingAstrologers([]);
        setSelectedAstro(null);
      });
  };

  useEffect(() => {
    fetchAstrologers(true);
    // Auto-refresh every 90 minutes (5400000 ms)
    const intervalId = setInterval(() => {
      fetchAstrologers(false);
    }, 5400000);
    return () => clearInterval(intervalId);
  }, []);

  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    gender: 'Select Gender',
    dob: '',
    languages: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    experience: '',
    chatRate: '',
    callRate: '',
    status: 'Select status'
  });

  const triggerEdit = (astro) => {
    // Use real data from the raw API response stored on the astrologer object
    const raw = astro.raw || {};

    // Helper to safely join arrays
    const joinArr = (arr) => Array.isArray(arr) && arr.length > 0 ? arr.join(', ') : '';

    // Parse experience — stored as string like "1 - 3 Years" or just "5"
    const expRaw = raw.experience || astro.experience || '';
    const expClean = String(expRaw).replace(' Years', '').trim();

    setFormData({
      fullName:   raw.name        || astro.name  || '',
      mobile:     raw.phone       || raw.mobile   || raw.mobileNumber || '',
      email:      raw.email       || astro.email  || '',
      gender:     raw.gender      || '',
      dob:        raw.dob         || raw.dateOfBirth || '',
      languages:  joinArr(raw.languages)  || '',
      address:    raw.address     || raw.location || '',
      city:       raw.city        || '',
      state:      raw.state       || '',
      pincode:    raw.pincode     || raw.pin || '',
      experience: expClean,
      chatRate:   String(raw.chatRate ?? astro.chatRateRaw ?? ''),
      callRate:   String(raw.callRate ?? astro.rateRaw ?? ''),
      status:     raw.isOnline ? 'Online' : (raw.status === 'approved' ? 'Online' : 'Offline'),
    });
    navigate('/astrologers/edit');
  };

  const handleUpdateSubmit = async () => {
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";
    const token = localStorage.getItem('authToken');
    
    const payload = {
      name: formData.fullName,
      phone: formData.mobile,
      email: formData.email,
      experience: formData.experience,
      chatPrice: Number(formData.chatRate),
      audioCallPrice: Number(formData.callRate),
      videoCallPrice: Number(formData.callRate),
      status: formData.status === 'Online' ? 'approved' : 'pending'
    };

    try {
      const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/admin/astrologers/${selectedAstro.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showAlert("Astrologer profile updated successfully!", "Success", "success");
        fetchAstrologers();
        navigate(-1);
      } else {
        showAlert(data.message || "Failed to update astrologer details.", "Error", "danger");
      }
    } catch (err) {
      showAlert(err.message || "Network error.", "Error", "danger");
    }
  };

  const handleDeleteAstrologer = async (astroId) => {
    showConfirm(
      "Are you sure you want to permanently delete this astrologer profile? This action cannot be undone.",
      async () => {
        const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";
        const token = localStorage.getItem('authToken');

        try {
          const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/admin/astrologers/${astroId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok && data.success) {
            showAlert("Astrologer profile deleted successfully!", "Success", "success");
            fetchAstrologers();
            setSelectedAstro(null);
            navigate(-1);
          } else {
            showAlert(data.message || "Failed to delete profile.", "Error", "danger");
          }
        } catch (err) {
          showAlert(err.message || "Network error.", "Error", "danger");
        }
      },
      "Delete Profile",
      "warning",
      "Delete"
    );
  };

  const triggerAdd = () => {
    setFormData({
      fullName: '',
      mobile: '',
      email: '',
      gender: 'Select Gender',
      dob: '',
      languages: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      experience: '',
      chatRate: '',
      callRate: '',
      status: 'Select status'
    });
    navigate('/astrologers/add');
  };

  const triggerDetails = (astro, source = 'list') => {
    const baseAstro = astrologers.find(x => x.id === astro.id) || pendingAstrologers.find(x => x.id === astro.id) || astro;
    setSelectedAstro({ ...baseAstro, name: astro.name, avatar: astro.avatar });
    setDetailTab('Overview');
    navigate('/astrologers/details');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    
    setIsRegistering(true);
    setRegisterError(null);

    if (data.get('password') !== data.get('confirmPassword')) {
      setRegisterError('Passwords do not match.');
      setIsRegistering(false);
      return;
    }

    const expVal = data.get('experience');
    const displayExp = expVal && expVal !== 'Select experience' && expVal !== 'Experience' ? expVal : '5';
    const experienceNumber = parseInt(displayExp) || 5;

    const payload = {
      name: data.get('fullName') || 'New Astrologer',
      email: data.get('email'),
      password: data.get('password'),
      phoneNumber: data.get('mobile'),
      gender: 'male',
      experience: experienceNumber,
      languages: [data.get('languages') || 'Hindi'],
      skills: ['Vedic Astrology'],
      qualification: data.get('qualification') || 'Graduate',
      about: data.get('about') || ''
    };

    const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";
    fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/astrologer/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        return res.json()
          .catch(() => {
            throw new Error('Failed to register new astrologer. Server returned status ' + res.status);
          })
          .then(json => {
            if (!res.ok) {
              throw new Error(json.message || json.error || 'Failed to register new astrologer. Phone or Email may already exist.');
            }
            return json;
          });
      })
      .then(json => {
        setIsRegistering(false);
        if (json.success) {
          setAboutText('');
          fetchAstrologers();
          navigate('/astrologers/all');
        } else {
          setRegisterError(json.message || 'Registration failed.');
        }
      })
      .catch(err => {
        setIsRegistering(false);
        setRegisterError(err.message || 'An error occurred during registration.');
      });
  };

  // Render list view based on active tab
  const renderListView = (activeSubTab) => {
    const targetList = activeSubTab === 'Pending Approval' 
      ? pendingAstrologers 
      : (activeSubTab === 'All Astrologers' 
         ? [...astrologers, ...pendingAstrologers] 
         : astrologers);

    // Filter list
    const filteredList = targetList.filter(astro => {
      if (activeSubTab === 'Online Now' && astro.status !== 'Online') return false;
      if (activeSubTab === 'Verified Astrologers' && !astro.isVerified) return false;
      if (activeSubTab === 'Blocked Astrologers' && astro.status === 'Blocked') return true;
      if (activeSubTab === 'Blocked Astrologers') return false;
      const q = searchQuery.toLowerCase();
      return astro.name.toLowerCase().includes(q) || astro.skill.toLowerCase().includes(q);
    });

    const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
    const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getPageNumbers = () => {
      if (totalPages <= 7) {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
      }

      const pages = [1];

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
      return pages;
    };

    return (
      <>
        {/* Header Title */}
        <div className="flex flex-col flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Astrologers
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span>Astrologers</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">{activeSubTab}</span>
          </div>
        </div>

        {/* Table Card wrapper */}
        <div className="flex-1 bg-white p-5 md:p-6 rounded-2xl border border-orange-50/50 shadow-sm flex flex-col overflow-hidden h-full w-full">
          
          {error && (
            <div className="bg-amber-50 border border-amber-100 text-amber-700 text-[11px] px-4 py-2.5 rounded-xl font-medium mb-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-500" />
                <span>Could not fetch live profiles ({error}).</span>
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

          {/* Subtabs header */}
          <div className="flex items-center gap-6 border-b border-slate-100 pb-1 mb-5 overflow-x-auto scrollbar-none flex-shrink-0">
            {getSubTabs().map((tab) => {
              const isSelected = location.pathname === tab.path;
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`pb-3 text-xs md:text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap outline-none flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-[#FA5A24] text-[#FA5A24]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                      isSelected ? 'bg-orange-50 text-[#FA5A24]' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search, filters, add */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-5 flex-shrink-0">
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search astrologers by name, skill or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-700 placeholder-slate-400 text-xs px-4 py-2.5 pr-10 rounded-xl outline-none border border-slate-200 focus:border-orange-200 transition-all duration-200"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Search size={15} />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end font-semibold">
              <button 
                onClick={() => fetchAstrologers(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-orange-50/50 hover:border-orange-200 hover:text-[#FA5A24] transition-all duration-200 cursor-pointer"
                title="Refresh Astrologer Data"
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin text-[#FA5A24]" : ""} />
                <span>Refresh</span>
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition-all duration-200">
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>
              <button 
                onClick={triggerAdd}
                className="flex items-center gap-1 bg-[#FA5A24] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-orange-600 transition-all duration-200"
              >
                <Plus size={14} />
                <span>Add Astrologer</span>
              </button>
            </div>
          </div>

          {/* Scrollable table container */}
          <div className="flex-1 overflow-y-auto min-h-0 w-full pr-1">
            {activeSubTab === 'Pending Approval' ? (
              /* PENDING APPROVAL LIST */
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white">
                    <th className="pb-3 pl-2 font-bold bg-white">Astrologer</th>
                    <th className="pb-3 font-bold bg-white">Experience</th>
                    <th className="pb-3 font-bold bg-white">Rate/Min</th>
                    <th className="pb-3 font-bold bg-white">Applied On</th>
                    <th className="pb-3 font-bold bg-white">Documents</th>
                    <th className="pb-3 font-bold bg-white">Interview</th>
                    <th className="pb-3 pr-2 text-right font-bold bg-white">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 font-medium">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 rounded-full border-2 border-t-[#FA5A24] border-orange-100 animate-spin" />
                          <span>Loading pending profiles...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedList.map((astro) => (
                    <tr key={astro.id} className="hover:bg-orange-50/20 transition-colors duration-150">
                      <td 
                        onClick={() => triggerDetails(astro)}
                        className="py-3.5 pl-2 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        title="Click to view full astrologer profile"
                      >
                        <img src={astro.avatar} alt={astro.name} className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-xs" />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 hover:text-[#FA5A24] transition-colors">{astro.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{astro.skill}</span>
                        </div>
                      </td>
                      <td className="py-3.5 font-semibold text-slate-500">{astro.experience}</td>
                      <td className="py-3.5 font-bold text-slate-800">{astro.rateMin}</td>
                      <td className="py-3.5 font-medium text-slate-400">{astro.appliedOn}</td>
                      <td className="py-3.5 font-bold text-slate-800">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">{astro.docsVerified}</span>
                      </td>
                      <td className="py-3.5">
                        {(() => {
                          const status = getInterviewStatus(astro.id);
                          
                          let displayDate = "";
                          if (astro.interview && astro.interview.interviewDate) {
                            displayDate = formatJoinedDate(astro.interview.interviewDate);
                          } else {
                            const scheduledData = localStorage.getItem('interview_schedule_' + astro.id);
                            if (scheduledData) {
                              const parsed = JSON.parse(scheduledData);
                              displayDate = parsed.date;
                            }
                          }
                          
                          if (status === 'cleared' || status === 'passed') {
                            return (
                              <button 
                                onClick={() => {
                                  setSelectedAstro(astro);
                                  setIsInterviewDrawerOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-bold border border-emerald-100 flex items-center gap-1 w-fit hover:bg-emerald-100/60 transition-colors cursor-pointer select-none"
                              >
                                <Check size={10} className="stroke-[3]" /> Passed (View)
                              </button>
                            );
                          }
                          if (status === 'failed') {
                            return (
                              <button 
                                onClick={() => {
                                  setSelectedAstro(astro);
                                  setIsInterviewDrawerOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[9px] font-bold border border-rose-100 hover:bg-rose-100/60 transition-colors cursor-pointer select-none"
                              >
                                Failed (View)
                              </button>
                            );
                          }
                          if (status === 'scheduled' || displayDate) {
                            return (
                              <button 
                                onClick={() => {
                                  setSelectedAstro(astro);
                                  setIsInterviewDrawerOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[9px] font-bold border border-blue-100 hover:bg-blue-100/60 transition-colors cursor-pointer select-none"
                              >
                                Scheduled ({displayDate || "Pending Date"})
                              </button>
                            );
                          }
                          if (status === 'requested') {
                            return (
                              <button 
                                onClick={() => {
                                  setSelectedAstro(astro);
                                  setIsInterviewDrawerOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-orange-100 animate-pulse hover:bg-orange-200 text-orange-700 text-[9px] font-extrabold transition-all duration-200 border border-orange-200 cursor-pointer"
                              >
                                Review Request ⚡
                              </button>
                            );
                          }
                          return (
                            <button 
                              onClick={() => {
                                setSelectedAstro(astro);
                                setIsInterviewDrawerOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100/60 text-[#FA5A24] text-[9px] font-extrabold transition-all duration-200 border border-orange-100 cursor-pointer"
                            >
                              Schedule Interview
                            </button>
                          );
                        })()}
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button 
                            onClick={() => handleVerifyStatusChange(astro, 'approved')}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                              getInterviewStatus(astro.id) === 'cleared'
                                ? "bg-[#E6F4EA] text-[#137333] hover:bg-[#d8eddcf0]"
                                : "bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed"
                            }`}
                            title={getInterviewStatus(astro.id) === 'cleared' ? 'Approve Astrologer' : 'Clear interview first to approve'}
                          >
                            <Check size={12} className="stroke-[3]" />
                          </button>
                          <button 
                            onClick={() => handleVerifyStatusChange(astro, 'rejected')}
                            className="w-6 h-6 rounded bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100/70 transition-colors"
                          >
                            <X size={12} className="stroke-[3]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* VERIFIED/ALL LIST */
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white">
                    <th className="pb-3 pl-2 font-bold bg-white">Astrologer</th>
                    <th className="pb-3 font-bold bg-white">Expertise</th>
                    <th className="pb-3 font-bold bg-white">Experience</th>
                    <th className="pb-3 font-bold bg-white">Rate/Min</th>
                    <th className="pb-3 font-bold bg-white">Status</th>
                    <th className="pb-3 font-bold bg-white">Rating</th>
                    <th className="pb-3 pr-2 text-right font-bold bg-white">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 font-medium">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 rounded-full border-2 border-t-[#FA5A24] border-orange-100 animate-spin" />
                          <span>Loading astrologer profiles...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedList.map((astro) => (
                    <tr key={astro.id} className="hover:bg-orange-50/20 transition-colors duration-150">
                      <td 
                        onClick={() => triggerDetails(astro)}
                        className="py-3.5 pl-2 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        title="Click to view full astrologer profile"
                      >
                        <img src={astro.avatar} alt={astro.name} className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-xs" />
                        <span className="font-bold text-slate-800 hover:text-[#FA5A24] transition-colors">{astro.name}</span>
                      </td>
                      <td className="py-3.5 font-bold"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">{astro.skill}</span></td>
                      <td className="py-3.5 font-semibold text-slate-500">{astro.experience}</td>
                      <td className="py-3.5 font-bold text-slate-500">
                        <div className="flex flex-col text-[11px] leading-tight">
                          <span className="text-slate-800">{astro.rateMin}</span>
                          <span className="text-slate-400 font-semibold">{astro.chatRateMin}</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          astro.status === 'Online' 
                            ? 'bg-[#E6F4EA] text-[#137333]' 
                            : astro.status === 'Busy'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}>{astro.status}</span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1 font-bold text-slate-800">
                          <Star size={13} className="text-amber-500 fill-amber-500" />
                          <span>{astro.rating}</span>
                          <span className="text-[10px] text-slate-400 font-medium">({astro.reviewsCount})</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button onClick={() => triggerEdit(astro)} className="p-1 text-slate-400 hover:text-indigo-600 rounded" title="Edit Profile"><Pencil size={14} /></button>
                          <button className="p-1 text-slate-400 hover:text-slate-600 rounded"><MoreVertical size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mt-5 border-t border-slate-100 pt-4 flex-shrink-0">
            {/* Showing status & Page size selector */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500 font-semibold">
                Showing {filteredList.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredList.length)} of {filteredList.length} astrologers
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 border-l border-slate-200 pl-3">
                <span>Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg px-2 py-1 outline-none focus:border-orange-200 cursor-pointer"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>
              </div>
            </div>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {/* Jump to First Page << */}
              <button 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold hover:bg-orange-50 hover:text-[#FA5A24] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all"
                title="First Page"
              >
                &laquo;
              </button>
              {/* Prev Page < */}
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold hover:bg-orange-50 hover:text-[#FA5A24] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all"
                title="Previous Page"
              >
                &lt;
              </button>

              {getPageNumbers().map((p, idx) => {
                if (p === '...') {
                  return <span key={`dots-${idx}`} className="text-slate-400 text-xs px-1 select-none font-bold">...</span>;
                }
                const isActive = p === currentPage;
                return (
                  <button
                    key={`page-${p}`}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-150 ${
                      isActive 
                        ? 'bg-[#FA5A24] text-white shadow-sm' 
                        : 'border border-slate-200 text-slate-600 hover:bg-orange-50/60 hover:text-[#FA5A24]'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              {/* Next Page > */}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold hover:bg-orange-50 hover:text-[#FA5A24] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all"
                title="Next Page"
              >
                &gt;
              </button>
              {/* Jump to Last Page >> */}
              <button 
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold hover:bg-orange-50 hover:text-[#FA5A24] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all"
                title="Last Page"
              >
                &raquo;
              </button>
            </div>
          </div>
        </div>

        {/* Popup Modal (65-70% screen size) for Interview Scheduling */}
        {isInterviewDrawerOpen && selectedAstro && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setIsInterviewDrawerOpen(false)} />
            
            {/* Centered Popup Modal Card (~65-70% screen size, no-scroll single page fit) */}
            <div className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-[#FCFAF8] rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
              <InterviewScheduleScreen 
                isDrawer={true} 
                onClose={() => setIsInterviewDrawerOpen(false)} 
              />
            </div>
          </div>
        )}
      </>
    );
  };

  // Interview schedule screen / drawer component
  const InterviewScheduleScreen = ({ isDrawer = false, onClose }) => {
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [platform, setPlatform] = useState('Agora Video/Audio Call');
    const [meetingLink, setMeetingLink] = useState('Agora Room (Auto-generated)');
    const [notes, setNotes] = useState('');

    const isJoinTimeAvailable = () => {
      const interview = selectedAstro?.interview;
      if (!interview || !interview.interviewDate) return false;
      try {
        const scheduledDateTime = new Date(interview.interviewDate);
        const now = new Date();
        const diffInMinutes = (scheduledDateTime.getTime() - now.getTime()) / (1000 * 60);
        return diffInMinutes <= 15 && diffInMinutes >= -120;
      } catch (e) {
        return false;
      }
    };

    useEffect(() => {
      if (!selectedAstro) {
        if (!isDrawer) navigate('/astrologers/pending');
        return;
      }
      
      const interview = selectedAstro.interview;
      if (interview) {
        if (interview.interviewDate) {
          const d = new Date(interview.interviewDate);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          setDate(`${yyyy}-${mm}-${dd}`);
          
          const hh = String(d.getHours()).padStart(2, '0');
          const min = String(d.getMinutes()).padStart(2, '0');
          setTime(`${hh}:${min}`);
        }
        setNotes(interview.interviewerNotes || interview.requestNotes || '');
        setPlatform(interview.meetingPlatform || 'Agora Video/Audio Call');
        setMeetingLink(interview.meetingLink || 'Agora Room (Auto-generated)');
      } else {
        const existing = localStorage.getItem('interview_schedule_' + selectedAstro.id);
        if (existing) {
          const parsed = JSON.parse(existing);
          setDate(parsed.date || '');
          setTime(parsed.time || '');
          setPlatform(parsed.platform || 'Agora Video/Audio Call');
          setMeetingLink(parsed.meetingLink || 'Agora Room (Auto-generated)');
          setNotes(parsed.notes || '');
        }
      }
    }, [selectedAstro, navigate, isDrawer]);

    if (!selectedAstro) return null;

    const handleSaveSchedule = (e) => {
      e.preventDefault();
      if (!date || !time) {
        alert('Please fill in all scheduling fields.');
        return;
      }

      const isAgora = platform === 'Agora Video/Audio Call';
      if (!isAgora && !meetingLink.trim()) {
        alert('Please fill in the meeting invite link.');
        return;
      }
      
      const token = localStorage.getItem('authToken');
      setIsLoading(true);
      
      const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app/";
      
      const combinedDate = new Date(`${date} ${time}`);

      fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/interview/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          astrologerId: selectedAstro.id,
          interviewDate: combinedDate.toISOString(),
          meetingLink: isAgora ? '' : meetingLink.trim(),
          meetingPlatform: platform,
          interviewerNotes: notes.trim()
        })
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to update live schedule details on backend');
        }
        return res.json();
      })
      .then(json => {
        setIsLoading(false);
        if (json.success) {
          const payload = { date, time, platform, meetingLink: meetingLink.trim(), notes: notes.trim() };
          localStorage.setItem('interview_schedule_' + selectedAstro.id, JSON.stringify(payload));
          showAlert('Interview scheduled successfully!', 'Schedule Saved', 'success');
          fetchAstrologers();
          if (onClose) onClose();
        } else {
          showAlert(json.message || 'Failed to update schedule.', 'Schedule Failed', 'danger');
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.error(err);
        showAlert(err.message || 'Error occurred while saving schedule.', 'Error', 'danger');
      });
    };

    const status = getInterviewStatus(selectedAstro.id);

    return (
      <div className="w-full h-full flex flex-col overflow-y-auto bg-[#FCFAF8] p-4 md:p-5 space-y-3.5">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFF9F6] via-[#FFF3EC] to-[#FFE8DC] border border-orange-100/50 rounded-2xl p-3.5 md:p-4 flex items-center justify-between relative overflow-hidden flex-shrink-0 shadow-xs">
          <div className="flex items-center justify-between w-full z-10">
            <div className="flex flex-col text-left">
              <h2 className="text-base md:text-lg font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>Schedule Astrologer Interview</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Set date, time and video link for {selectedAstro.name}.</p>
            </div>
            <button 
              onClick={onClose || (() => navigate('/astrologers/pending'))} 
              className="w-8 h-8 rounded-full bg-white/90 border border-orange-100 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-xs cursor-pointer flex-shrink-0"
              title="Close Popup"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Astrologer Summary Card */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-xs text-center flex flex-col items-center">
            <img src={selectedAstro.avatar} alt={selectedAstro.name} className="w-14 h-14 rounded-full object-cover border border-slate-100 shadow mb-2" />
            <h3 className="text-sm font-extrabold text-slate-800" style={{ fontFamily: 'Outfit' }}>{selectedAstro.name}</h3>
            <span className="text-[9px] text-slate-400 font-bold block mt-0.5 tracking-wider uppercase">{selectedAstro.skill}</span>
            <div className="w-full border-t border-slate-100 my-3 pt-2.5 text-[11px] font-semibold text-slate-600 text-left space-y-2">
              <div className="flex justify-between"><span className="text-slate-400">Experience</span><span>{selectedAstro.experience}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="truncate max-w-[150px]">{selectedAstro.email || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Charges</span><span>{selectedAstro.rateMin}</span></div>
            </div>

            {selectedAstro.interview && selectedAstro.interview.status === 'scheduled' && (
              <div className="w-full border-t border-slate-100 pt-2.5 flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-left">Video Interview Room</span>
                {isJoinTimeAvailable() ? (
                  <button
                    onClick={() => navigate(`/interview-room/${selectedAstro.interview._id}`)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Video size={13} />
                    <span>Join Agora Meeting</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-xs font-bold cursor-not-allowed select-none opacity-60"
                  >
                    <Video size={13} />
                    <span>Join (Unlocks 15m Prior)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Scheduling Form & Actions */}
          <div className="lg:col-span-2 space-y-3.5">
            <form onSubmit={handleSaveSchedule} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
              <h4 className="text-[11px] font-extrabold text-[#FA5A24] uppercase tracking-wider">Interview Session Details</h4>

              {/* Astrologer's Requested Availability Slots (Quick Auto-Fill Chips) */}
              {(() => {
                const slots = selectedAstro?.interview?.preferredSlots || selectedAstro?.preferredSlots || [];
                if (!slots.length) return null;
                return (
                  <div className="bg-[#FFF9F6] border border-orange-200/80 rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[#FA5A24] uppercase tracking-wider">Astrologer's 2 Preferred Time Slots</span>
                      <span className="text-[9px] text-slate-400 font-semibold">Select slot or type custom time below</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {slots.map((slot, idx) => {
                        const isSelected = date === slot.date && time === slot.time;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (slot.date) setDate(slot.date);
                              if (slot.time) setTime(slot.time);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                              isSelected
                                ? "bg-[#FA5A24] text-white border-[#FA5A24] shadow-md"
                                : "bg-white border-orange-200 text-slate-800 hover:bg-orange-50 hover:border-orange-300"
                            }`}
                            title="Click to select this slot for the interview"
                          >
                            <Calendar size={12} className={isSelected ? "text-white" : "text-[#FA5A24]"} />
                            <span>Option {idx + 1}: {slot.date} at {slot.time}</span>
                            {isSelected && <span className="ml-1 bg-white/20 px-1 rounded text-[9px]">Active</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Interview Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-2.5 py-1.5 rounded-xl outline-none focus:border-orange-200 cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Interview Time *</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-2.5 py-1.5 rounded-xl outline-none focus:border-orange-200 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Meeting Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPlatform(val);
                      if (val === 'Agora Video/Audio Call') {
                        setMeetingLink('Agora Room (Auto-generated)');
                      } else if (meetingLink === 'Agora Room (Auto-generated)') {
                        setMeetingLink('');
                      }
                    }}
                    className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-2.5 py-1.5 rounded-xl outline-none"
                  >
                    <option>Agora Video/Audio Call</option>
                    <option>Google Meet</option>
                    <option>Zoom</option>
                    <option>Microsoft Teams</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Meeting Invite Link *</label>
                  <input
                    type="text"
                    required={platform !== 'Agora Video/Audio Call'}
                    disabled={platform === 'Agora Video/Audio Call'}
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder={platform === 'Agora Video/Audio Call' ? 'Agora Token-based room link' : 'e.g. https://meet.google.com/abc-defg-hij'}
                    className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-2.5 py-1.5 rounded-xl outline-none focus:border-orange-200 disabled:opacity-75 disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Interviewer Notes</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter details, requirements or instructions for the interview..."
                  className="w-full text-xs font-bold text-slate-700 bg-[#FCFAF8] border border-slate-200 px-2.5 py-1.5 rounded-xl outline-none focus:border-orange-200 resize-none font-medium"
                />
              </div>

              <div className="flex justify-end pt-0.5">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#FA5A24] text-white rounded-xl text-xs font-bold hover:bg-orange-600 shadow-sm transition-all cursor-pointer"
                >
                  <Save size={13} />
                  <span>Save & Generate Invite</span>
                </button>
              </div>
            </form>

            {/* Verification Status Actions Panel */}
            <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs space-y-2.5">
              <div>
                <h4 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">Interview Status Action</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Mark if candidate cleared or failed the interview</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                {status === 'cleared' ? (
                  <div className="flex items-center gap-3 w-full justify-between">
                    <div className="px-3.5 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-bold flex items-center gap-2 select-none">
                      <CheckCircle size={14} />
                      <span>Interview Status: Passed / Cleared</span>
                    </div>
                    <button 
                      onClick={() => updateInterviewStatus(selectedAstro.id, 'pending')}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Reset Selection
                    </button>
                  </div>
                ) : status === 'failed' ? (
                  <div className="flex items-center gap-3 w-full justify-between">
                    <div className="px-3.5 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold flex items-center gap-2 select-none">
                      <AlertCircle size={14} />
                      <span>Interview Status: Failed</span>
                    </div>
                    <button 
                      onClick={() => updateInterviewStatus(selectedAstro.id, 'pending')}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Reset Selection
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 w-full">
                    <button
                      onClick={() => updateInterviewStatus(selectedAstro.id, 'cleared', notes)}
                      className="flex-1 py-2.5 bg-[#E6F4EA] hover:bg-emerald-100 text-[#137333] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 border border-emerald-100 cursor-pointer"
                    >
                      <Check size={14} className="stroke-[3]" />
                      <span>Mark Interview Cleared</span>
                    </button>
                    <button
                      onClick={() => updateInterviewStatus(selectedAstro.id, 'failed', notes)}
                      className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 border border-rose-100 cursor-pointer"
                    >
                      <X size={14} className="stroke-[3]" />
                      <span>Mark Interview Failed</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Routes>
      {/* List routes */}
      <Route path="all" element={renderListView('All Astrologers')} />
      <Route path="online" element={renderListView('Online Now')} />
      <Route path="verified" element={renderListView('Verified Astrologers')} />
      <Route path="pending" element={renderListView('Pending Approval')} />
      <Route path="interview" element={<InterviewScheduleScreen />} />
      <Route path="blocked" element={renderListView('Blocked Astrologers')} />
      <Route path="categories" element={
        <div className="bg-white p-8 rounded-2xl border border-orange-50/50 shadow-sm text-center py-16 h-full flex flex-col justify-center">
          <h2 className="text-xl font-bold text-slate-700 mb-2" style={{ fontFamily: 'Outfit' }}>Categories Management</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">This categories view is currently under development.</p>
        </div>
      } />

      {/* Add route */}
      <Route path="add" element={
        <div className="flex-1 flex flex-col overflow-y-auto h-full w-full bg-[#FCFAF8] p-4 md:p-6 lg:p-8 space-y-6">
          {/* Celestial Header Banner */}
          <div className="bg-gradient-to-r from-[#FFF9F6] via-[#FFF3EC] to-[#FFE8DC] border border-orange-100/50 rounded-3xl p-6 md:p-8 flex items-center justify-between relative overflow-hidden flex-shrink-0 shadow-sm">
            <div className="flex items-start gap-4 z-10">
              <button 
                onClick={() => navigate(-1)} 
                className="w-10 h-10 rounded-full bg-white/90 border border-orange-100 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-sm cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex flex-col text-left">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>Add New Astrologer</h2>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Create a complete profile and start helping people.</p>
              </div>
            </div>
            {/* Meditating Figure Celestial SVG */}
            <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 opacity-90">
              <svg className="w-24 h-24 text-orange-500/90 drop-shadow-md select-none" viewBox="0 0 200 200" fill="none">
                {/* Outer rotating zodiac rings */}
                <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="animate-[spin_40s_linear_infinite]" />
                <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="1" className="opacity-60" />
                <circle cx="100" cy="100" r="64" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 4" className="animate-[spin_25s_linear_infinite_reverse]" />
                
                {/* Zodiac symbols or dots around the circle */}
                <g className="animate-[spin_60s_linear_infinite]">
                  <circle cx="100" cy="28" r="3" fill="currentColor" />
                  <circle cx="100" cy="172" r="3" fill="currentColor" />
                  <circle cx="28" cy="100" r="3" fill="currentColor" />
                  <circle cx="172" cy="100" r="3" fill="currentColor" />
                  <circle cx="150" cy="50" r="2.5" fill="currentColor" />
                  <circle cx="50" cy="150" r="2.5" fill="currentColor" />
                  <circle cx="50" cy="50" r="2.5" fill="currentColor" />
                  <circle cx="150" cy="150" r="2.5" fill="currentColor" />
                </g>

                {/* Meditating human figure in the center */}
                <path 
                  d="M100 65 C103 65 106 62 106 59 C106 56 103 53 100 53 C97 53 94 56 94 59 C94 62 97 65 100 65 Z 
                     M100 69 C93 69 88 74 87 81 C86 86 89 91 93 94 L93 115 C85 118 78 122 75 128 C74 130 75 132 77 133 C84 135 116 135 123 133 C125 132 126 130 125 128 C122 122 115 118 107 115 L107 94 C111 91 114 86 113 81 C112 74 107 69 100 69 Z" 
                  fill="#7C2D12" 
                />
                
                {/* Decorative aura glow around meditator */}
                <circle cx="100" cy="59" r="16" stroke="currentColor" strokeWidth="0.5" className="opacity-40 animate-pulse" />
                <path d="M78 98 C72 105 70 115 76 122" stroke="currentColor" strokeWidth="1" className="opacity-50" />
                <path d="M122 98 C128 105 130 115 124 122" stroke="currentColor" strokeWidth="1" className="opacity-50" />
              </svg>
            </div>
          </div>

          {/* Form Container Card */}
          <form onSubmit={handleFormSubmit} className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-8">
            
            {registerError && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-xs px-4 py-3 rounded-2xl font-semibold flex items-center gap-2 text-left">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                <span>{registerError}</span>
              </div>
            )}

            {/* Profile Photo Uploader */}
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-100 pb-6 gap-6">
              <div className="text-left w-full md:w-auto">
                <h4 className="text-sm font-bold text-slate-800">Profile Photo</h4>
                <p className="text-xs text-slate-400 font-semibold mt-1">Upload a clear photo to build trust</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative cursor-pointer group">
                  <div className="w-20 h-20 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shadow-sm group-hover:bg-orange-100/50 transition-colors">
                    <Camera size={22} className="text-[#FA5A24]" />
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-[#FA5A24] border border-white flex items-center justify-center text-white text-xs font-bold shadow-md">
                    +
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold text-[#FA5A24] hover:underline cursor-pointer block">Upload Photo</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">JPG, PNG or GIF. Max size 2MB</span>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#FA5A24] shadow-sm">
                  <User size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Basic Information</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5 text-left">
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <User size={15} />
                    </div>
                    <input 
                      type="text" 
                      name="fullName"
                      placeholder="Full Name *" 
                      className="w-full bg-white border border-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-800 font-semibold"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col gap-1.5 text-left">
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone size={15} />
                    </div>
                    <input 
                      type="text" 
                      name="mobile"
                      placeholder="Mobile Number *" 
                      className="w-full bg-white border border-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-800 font-semibold"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5 text-left">
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={15} />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Email Address *" 
                      className="w-full bg-white border border-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-800 font-semibold"
                      required
                    />
                  </div>
                </div>

                {/* Location (City, Country) */}
                <div className="flex flex-col gap-1.5 sm:col-span-2 text-left">
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <MapPin size={15} />
                    </div>
                    <input 
                      type="text" 
                      name="location"
                      placeholder="Location (City, Country) *" 
                      className="w-full bg-white border border-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-800 font-semibold"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5 text-left">
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={15} />
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      name="password"
                      placeholder="Password *" 
                      className="w-full bg-white border border-slate-200 text-xs pl-10 pr-10 py-3 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-800 font-semibold"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5 text-left">
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={15} />
                    </div>
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      name="confirmPassword"
                      placeholder="Confirm Password *" 
                      className="w-full bg-white border border-slate-200 text-xs pl-10 pr-10 py-3 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-800 font-semibold"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* About You */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#FA5A24] shadow-sm">
                  <FileText size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-800">About You</h4>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <div className="relative">
                  <textarea 
                    name="about"
                    placeholder="Write a short introduction about yourself, your experience and your approach..." 
                    maxLength={300}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-800 font-semibold h-32 resize-none pr-12 pb-6"
                  />
                  <div className="absolute right-3.5 bottom-3.5 text-[10px] font-bold text-slate-400">
                    {aboutText.length}/300
                  </div>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#FA5A24] shadow-sm">
                  <Star size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Experience</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Experience Select */}
                <div className="relative text-left">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Briefcase size={15} />
                  </div>
                  <select 
                    name="experience"
                    className="w-full bg-white border border-slate-200 text-xs pl-10 pr-10 py-3 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-500 font-semibold appearance-none cursor-pointer"
                  >
                    <option>Experience</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                    <option>5 Years</option>
                    <option>8 Years</option>
                    <option>10+ Years</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronLeft size={14} className="-rotate-90" />
                  </div>
                </div>

                {/* Languages Known Select */}
                <div className="relative text-left">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Award size={15} />
                  </div>
                  <select 
                    name="languages"
                    className="w-full bg-white border border-slate-200 text-xs pl-10 pr-10 py-3 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-500 font-semibold appearance-none cursor-pointer"
                  >
                    <option>Languages Known</option>
                    <option>Hindi</option>
                    <option>English</option>
                    <option>Hindi, English</option>
                    <option>Sanskrit</option>
                    <option>Bengali</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronLeft size={14} className="-rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Qualification */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#FA5A24] shadow-sm">
                  <GraduationCap size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Qualification</h4>
              </div>

              {/* Highest Qualification Select */}
              <div className="relative text-left">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <GraduationCap size={15} />
                </div>
                <select 
                  name="qualification"
                  className="w-full bg-white border border-slate-200 text-xs pl-10 pr-10 py-3 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-500 font-semibold appearance-none cursor-pointer"
                >
                  <option>Highest Qualification</option>
                  <option>High School</option>
                  <option>Bachelor's Degree</option>
                  <option>Master's Degree</option>
                  <option>Doctorate</option>
                  <option>Diploma in Astrology</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronLeft size={14} className="-rotate-90" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => navigate(-1)} 
                disabled={isRegistering}
                className="w-full sm:flex-1 py-3 px-6 rounded-xl border border-[#FA5A24] text-xs font-bold text-[#FA5A24] hover:bg-orange-50/50 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isRegistering}
                className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-[#FA5A24] hover:bg-orange-600 text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-80 disabled:pointer-events-none"
              >
                {isRegistering ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Registering...</span>
                  </span>
                ) : (
                  <>
                    <UserPlus size={15} />
                    <span>Save Astrologer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      } />

      {/* Edit route */}
      <Route path="edit" element={
        <div className="flex-1 flex flex-col overflow-hidden h-full w-full">
          <div className="flex items-center gap-3 mb-4 flex-shrink-0 select-none">
            <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500"><ChevronLeft size={16} /></button>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Outfit' }}>Edit Astrologer</h2>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mt-0.5">
                <span>Dashboard</span><span>&gt;</span><span>Astrologers</span><span>&gt;</span><span className="text-[#FA5A24]">Edit Astrologer</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm pr-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-xs font-extrabold text-[#FA5A24] uppercase tracking-wider mb-2">Basic Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-slate-600">Full Name *</label><input type="text" value={formData.fullName} onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700" /></div>
                  <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-slate-600">Mobile Number *</label><input type="text" value={formData.mobile} onChange={e => setFormData(prev => ({ ...prev, mobile: e.target.value }))} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700" /></div>
                  <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-slate-600">Email Address *</label><input type="email" value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700" /></div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-600">Gender *</label>
                    <select defaultValue={formData.gender} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700">
                      <option>Male</option><option>Female</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-slate-600">Date of Birth *</label><input type="text" defaultValue={formData.dob} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700" /></div>
                  <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-slate-600">Languages Known *</label><input type="text" defaultValue={formData.languages} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700" /></div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2"><label className="text-[11px] font-bold text-slate-600">Address *</label><input type="text" defaultValue={formData.address} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700" /></div>
                  <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-slate-600">City *</label><input type="text" defaultValue={formData.city} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700" /></div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-600">State *</label>
                    <select defaultValue={formData.state} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700">
                      <option>Delhi</option><option>Uttar Pradesh</option><option>Maharashtra</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-slate-600">Pincode *</label><input type="text" defaultValue={formData.pincode} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700" /></div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-4">
                <h4 className="text-xs font-extrabold text-[#FA5A24] uppercase tracking-wider mb-2">Profile & Charges</h4>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-600">Profile Photo *</label>
                  <div className="flex items-center gap-4">
                    {(selectedAstro?.raw?.profileImage || selectedAstro?.avatar) ? (
                      <img 
                        src={selectedAstro?.raw?.profileImage || selectedAstro?.avatar} 
                        alt="Astro Avatar" 
                        className="w-16 h-16 rounded-full object-cover border border-slate-100 shadow" 
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-orange-100 border border-slate-100 shadow flex items-center justify-center text-[#FA5A24] font-extrabold text-lg">
                        {(selectedAstro?.name || 'A').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600 transition-colors">Change Photo</button>
                  </div>

                </div>
                <div className="flex flex-col gap-1.5 mt-3"><label className="text-[11px] font-bold text-slate-600">Experience (Years) *</label><input type="text" value={formData.experience} onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-slate-600">Chat Rate *</label><input type="text" value={formData.chatRate} onChange={e => setFormData(prev => ({ ...prev, chatRate: e.target.value }))} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700" /></div>
                  <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-slate-600">Call Rate *</label><input type="text" value={formData.callRate} onChange={e => setFormData(prev => ({ ...prev, callRate: e.target.value }))} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700" /></div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-600">Status *</label>
                  <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-orange-200 font-semibold text-slate-700">
                    <option>Online</option><option>Offline</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 border-t border-slate-100 pt-5">
              <button onClick={() => navigate(-1)} className="px-6 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleUpdateSubmit} className="px-6 py-2.5 bg-[#FA5A24] text-white rounded-xl text-xs font-bold hover:bg-orange-600 shadow-sm">Update Changes</button>
            </div>
          </div>
        </div>
      } />

      {/* Details route */}
      <Route path="details" element={selectedAstro && (
        <div className="flex-1 flex flex-col overflow-hidden h-full w-full">
          <div className="flex items-center gap-3 mb-4 flex-shrink-0 select-none">
            <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500"><ChevronLeft size={16} /></button>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Outfit' }}>Astrologer Details</h2>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mt-0.5">
                <span>Dashboard</span><span>&gt;</span><span>Astrologers</span><span>&gt;</span><span className="text-[#FA5A24]">{selectedAstro.name}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col xl:flex-row gap-6 items-stretch overflow-hidden w-full min-h-0">
            {/* Left Column: Profile Card + Vertical Menu */}
            <div className="w-full xl:w-64 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex-shrink-0 flex flex-col items-center text-center">
              <img src={selectedAstro.avatar} alt={selectedAstro.name} className="w-20 h-20 rounded-full object-cover border border-slate-100 shadow-md mb-3" />
              <h3 className="text-base font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Outfit' }}>{selectedAstro.name}</h3>
              <span className="text-[10px] text-slate-400 font-bold block mt-1">{selectedAstro.experience} Experience</span>
              
              {/* Vertical Tabs List */}
              <div className="w-full mt-6 space-y-1.5 text-left text-xs font-bold border-t border-slate-100 pt-5">
                {['Overview', 'Services', 'Earnings', 'Reviews', 'Documents', 'Availability'].map((tab) => {
                  const isActive = detailTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'text-[#FA5A24] bg-[#FFF5F1]'
                          : 'text-slate-500 hover:text-[#FA5A24] hover:bg-slate-50/50'
                      }`}
                    >
                      <span>{tab}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FA5A24]"></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Tab Content */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-6">
            {detailTab === 'Overview' && (
              <div className="space-y-6">
                {/* 4 Metrics Header Card */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-5 justify-between">
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>{selectedAstro.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] text-[9px] font-bold">Online</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">✓ Verified</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-semibold mt-2">
                      <span className="flex items-center gap-1"><Languages size={13} /> {selectedAstro.details.languages}</span>
                      <span className="flex items-center gap-1"><Calendar size={13} /> Member Since {selectedAstro.details.memberSince}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 w-full sm:w-auto mt-4 sm:mt-0 max-w-lg">
                    {[
                      { label: 'Call Rate', value: `${selectedAstro.rateMin.split('/')[0]}/min`, bg: 'bg-[#FFF3EE]', text: 'text-[#FA5A24]' },
                      { label: 'Chat Rate', value: `${selectedAstro.chatRateMin.split('/')[0]}/min`, bg: 'bg-[#FFF3EE]', text: 'text-[#FA5A24]' },
                      { label: 'Total Clients', value: selectedAstro.details.totalClients, bg: 'bg-purple-50/50', text: 'text-purple-600' },
                      { label: 'Positive Rating', value: selectedAstro.details.positiveRating, bg: 'bg-amber-50/50', text: 'text-amber-600' }
                    ].map((box, index) => (
                      <div key={index} className={`rounded-xl p-3 flex flex-col items-center justify-center text-center ${box.bg} min-w-[85px]`}>
                        <span className={`text-[13px] font-extrabold ${box.text}`} style={{ fontFamily: 'Outfit' }}>{box.value}</span>
                        <span className="text-[8px] text-slate-400 font-extrabold mt-1 tracking-wider uppercase">{box.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About & Expertise Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">About</h4>
                      <p className="text-xs font-semibold text-slate-600 leading-relaxed">{selectedAstro.details.about}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAstro.details.expertise.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-xl bg-orange-50/60 text-[#FA5A24] text-[10px] font-bold">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Actions</h4>
                    <div className="flex flex-col gap-2.5 text-xs font-bold text-left">
                      {!selectedAstro.isVerified ? (
                        <>
                          <button 
                            onClick={() => handleVerifyStatusChange(selectedAstro, 'approved')} 
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-100 hover:bg-emerald-50 text-emerald-600 justify-start transition-colors"
                          >
                            <CheckCircle size={14} />
                            <span>Approve & Verify</span>
                          </button>
                          <button 
                            onClick={() => handleVerifyStatusChange(selectedAstro, 'rejected')} 
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-rose-100 hover:bg-rose-50 text-rose-600 justify-start transition-colors"
                          >
                            <X size={14} className="stroke-[2.5]" />
                            <span>Reject Profile</span>
                          </button>
                        </>
                      ) : (
                        <div className="px-4 py-2 bg-emerald-50 rounded-xl text-[10px] font-bold text-emerald-700 flex items-center gap-1.5 justify-center">
                          <CheckCircle size={12} />
                          <span>Status: Approved (Verified)</span>
                        </div>
                      )}

                      {selectedAstro.status === 'rejected' && (
                        <div className="px-4 py-2 bg-rose-50 rounded-xl text-[10px] font-bold text-rose-700 flex items-center gap-1.5 justify-center">
                          <X size={12} />
                          <span>Status: Rejected</span>
                        </div>
                      )}

                      <button onClick={() => triggerEdit(selectedAstro)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-700 justify-start transition-colors"><Pencil size={14} className="text-slate-400" /><span>Edit Astrologer</span></button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-700 justify-start transition-colors"><User size={14} className="text-slate-400" /><span>View Profile (User View)</span></button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-700 justify-start transition-colors"><MessageSquare size={14} className="text-slate-400" /><span>Chat History</span></button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-700 justify-start transition-colors"><Phone size={14} className="text-slate-400" /><span>Call History</span></button>
                      <button onClick={() => handleDeleteAstrologer(selectedAstro.id)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-50 hover:bg-red-50 text-red-500 justify-start mt-2 transition-colors"><X size={14} className="stroke-[3]" /><span>Delete Astrologer Profile</span></button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'Services' && (
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Services Offered</h4>
                  <button className="flex items-center gap-1 bg-[#FA5A24] text-white px-3.5 py-2 rounded-xl text-[10px] font-bold hover:bg-orange-600"><Plus size={12} /><span>Add New Service</span></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 pl-2">Service</th><th className="pb-3">Price</th><th className="pb-3">Duration</th><th className="pb-3 pr-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {selectedAstro.details.services.map((srv) => (
                        <tr key={srv.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 pl-2 font-bold text-slate-800">{srv.name}</td>
                          <td className="py-3.5 font-bold text-slate-500">₹{srv.price}</td>
                          <td className="py-3.5 font-semibold text-slate-400">{srv.duration}</td>
                          <td className="py-3.5 pr-2 text-right">
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input type="checkbox" defaultChecked={srv.isActive} className="sr-only peer" />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 peer-checked:bg-emerald-600"></div>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {detailTab === 'Earnings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Total Earnings', value: selectedAstro.details.earnings.total, bg: 'bg-[#E6F4EA]/40', color: 'text-emerald-600', icon: TrendingUp },
                    { label: 'This Month', value: selectedAstro.details.earnings.thisMonth, bg: 'bg-blue-50/50', color: 'text-blue-600', icon: Calendar },
                    { label: 'Total Calls', value: selectedAstro.details.earnings.totalCalls, bg: 'bg-[#FFF3EE]', color: 'text-[#FA5A24]', icon: Phone },
                    { label: 'Total Chats', value: selectedAstro.details.earnings.totalChats, bg: 'bg-purple-50/50', color: 'text-purple-600', icon: MessageSquare }
                  ].map((stat, idx) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 bg-white">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg}`}><StatIcon size={16} className={stat.color} /></div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-extrabold text-slate-800" style={{ fontFamily: 'Outfit' }}>{stat.value}</span>
                          <span className="text-[8px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">{stat.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                  <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Earnings Overview</h4>
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2.5 py-1 rounded-full">This Month</span>
                    </div>
                    <div className="w-full h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedAstro.details.earnings.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs><linearGradient id="astroEarn" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FA5A24" stopOpacity={0.2} /><stop offset="95%" stopColor="#FA5A24" stopOpacity={0} /></linearGradient></defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 9 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 9 }} />
                          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #FFF1EC' }} />
                          <Area type="monotone" dataKey="earn" stroke="#FA5A24" strokeWidth={2} fillOpacity={1} fill="url(#astroEarn)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-4">Earnings Summary</h4>
                    <div className="space-y-3.5 flex-1 justify-center flex flex-col">
                      {selectedAstro.details.earnings.breakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b border-dashed border-slate-100 pb-2.5">
                          <span className="text-[11px] font-semibold text-slate-500">{item.label}</span>
                          <span className="text-[12px] font-bold text-slate-800">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'Reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center text-center items-center">
                  <h4 className="text-2xl font-extrabold text-slate-800" style={{ fontFamily: 'Outfit' }}>4.9</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Out of 5</span>
                  <div className="flex items-center gap-0.5 my-3 text-amber-500">{Array(5).fill(0).map((_, i) => <Star key={i} size={15} className="fill-current" />)}</div>
                  <span className="text-[10px] text-slate-400 font-bold mb-5">(1250 Reviews)</span>
                  <div className="w-full space-y-2.5">
                    {[
                      { star: 5, pct: 84 }, { star: 4, pct: 12 }, { star: 3, pct: 3 }, { star: 2, pct: 1 }, { star: 1, pct: 0 }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                        <span className="w-8 text-left">{item.star} Star</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${item.pct}%` }}></div></div>
                        <span className="w-8 text-right">{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-4">Recent Reviews</h4>
                  <div className="space-y-4">
                    {selectedAstro.details.reviews.map((rev) => (
                      <div key={rev.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0">
                        <img src={rev.avatar} alt={rev.user} className="w-8 h-8 rounded-full object-cover shadow-sm flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <h5 className="text-[11px] font-bold text-slate-800">{rev.user}</h5>
                            <span className="text-[9px] text-slate-400 font-semibold">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-500 my-1">{Array(5).fill(0).map((_, i) => <Star key={i} size={11} className={i < rev.rating ? 'fill-current' : 'text-slate-200'} />)}</div>
                          <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">{rev.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'Documents' && (
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-5">Uploaded Documents</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 pl-2">Document</th><th className="pb-3">Status</th><th className="pb-3">Uploaded On</th><th className="pb-3 pr-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {selectedAstro.details.documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 pl-2 font-bold text-slate-800">{doc.name}</td>
                          <td className="py-3.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>{doc.status}
                            </span>
                          </td>
                          <td className="py-3.5 font-semibold text-slate-400">{doc.date}</td>
                          <td className="py-3.5 pr-2 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded bg-slate-50"><Eye size={13} /></button>
                              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded bg-slate-50"><Download size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {detailTab === 'Availability' && (
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-5 flex-shrink-0">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Set Weekly Availability</h4>
                  <button className="flex items-center gap-1 border border-slate-200 hover:bg-slate-50 px-3.5 py-2 rounded-xl text-[10px] font-bold text-slate-600"><Plus size={12} /><span>Add Time Slot</span></button>
                </div>
                <div className="space-y-4">
                  {selectedAstro.details.availability.map((dayObj, index) => (
                    <div key={index} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border ${dayObj.isActive ? 'border-orange-50 bg-[#FFFDFB]/40' : 'border-slate-100 bg-slate-50/40 opacity-70'}`}>
                      <div className="flex items-center gap-4 w-40 flex-shrink-0">
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input type="checkbox" defaultChecked={dayObj.isActive} className="sr-only peer" />
                          <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 peer-checked:bg-emerald-600"></div>
                        </label>
                        <span className="text-xs font-bold text-slate-700">{dayObj.day}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        {dayObj.isActive ? (
                          <>
                            <input type="text" defaultValue={dayObj.start} className="bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 px-3 py-1.5 w-24 text-center" />
                            <span className="text-slate-400 text-[11px]">to</span>
                            <input type="text" defaultValue={dayObj.end} className="bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 px-3 py-1.5 w-24 text-center" />
                            <button className="p-1.5 text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                          </>
                        ) : <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded">Day Off</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6"><button className="bg-[#FA5A24] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-orange-600">Save Availability</button></div>
              </div>
            )}
            </div>
          </div>
        </div>
      )} />
    </Routes>
    <ConfirmModal {...modalConfig} />
  </>
  );
};

export default AstrologersPage;
