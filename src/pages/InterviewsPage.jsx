import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { 
  Calendar, Clock, Video, CheckCircle, XCircle, Search, 
  User, Mail, RefreshCw, AlertCircle, Play, Check, X, Info,
  Link, ShieldCheck, ShieldX, Bell
} from 'lucide-react';

export default function InterviewsPage() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  
  // Schedule Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [meetingLinkInput, setMeetingLinkInput] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Evaluate Modal State
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [evalNotes, setEvalNotes] = useState('');

  // Confirm Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState({
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

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app";

  const fetchInterviews = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken') || '';
      const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/interview/all`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!response.ok) throw new Error('Failed to fetch interviews');
      const data = await response.json();
      if (data.success) {
        setInterviews(data.data || []);
        setLastRefreshed(new Date());
      } else {
        setError(data.message || 'Failed to fetch interviews');
      }
    } catch (err) {
      console.error(err);
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [apiBaseUrl]);

  // Initial fetch
  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // Auto-refresh every 1.5 minutes (90 seconds)
  useEffect(() => {
    const interval = setInterval(() => fetchInterviews(true), 90000);
    return () => clearInterval(interval);
  }, [fetchInterviews]);

  const handleOpenSchedule = (interview) => {
    setSelectedInterview(interview);
    setInterviewDate('');
    setMeetingLinkInput('');
    setNotes('');
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInterview || !interviewDate) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken') || '';
      const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/interview/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          interviewId: selectedInterview._id,
          interviewDate: new Date(interviewDate).toISOString(),
          meetingLink: meetingLinkInput.trim() || undefined,
          interviewerNotes: notes
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowScheduleModal(false);
        fetchInterviews();
        // Show success toast
        showToast('✅ Interview scheduled! Astrologer will see the meeting details.', 'success');
      } else {
        showToast(data.message || 'Failed to schedule interview', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error scheduling interview', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEvaluate = (interview) => {
    setSelectedInterview(interview);
    setEvalNotes(interview.interviewerNotes || interview.requestNotes || '');
    setShowEvaluateModal(true);
  };

  const handleEvaluate = async (resultType) => {
    if (!selectedInterview) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken') || '';
      const endpoint = resultType === 'pass'
        ? `${apiBaseUrl.replace(/\/$/, '')}/api/interview/pass`
        : `${apiBaseUrl.replace(/\/$/, '')}/api/interview/fail`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          interviewId: selectedInterview._id,
          interviewerNotes: evalNotes
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowEvaluateModal(false);
        fetchInterviews();
        const msg = resultType === 'pass'
          ? '✅ Astrologer APPROVED! They can now log in and start consultations.'
          : '❌ Astrologer REJECTED. Their account has been blocked.';
        showToast(msg, resultType === 'pass' ? 'success' : 'error');
      } else {
        showToast(data.message || 'Failed to evaluate interview', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error evaluating interview', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick approve/block directly from list (for already-passed/failed interviews)
  const handleQuickApprove = (interview) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Approve Astrologer',
      message: `Approve astrologer "${interview.astrologer?.name}"? They will be able to log in and start consultations.`,
      type: 'success',
      confirmText: 'Yes, Approve',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: async () => {
        setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
        const token = localStorage.getItem('authToken') || '';
        try {
          const res = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/interview/pass`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
            body: JSON.stringify({ interviewId: interview._id, interviewerNotes: 'Approved directly by admin.' })
          });
          const data = await res.json();
          if (data.success) {
            fetchInterviews();
            showToast('✅ Astrologer approved successfully!', 'success');
          }
        } catch (e) { showToast('Error approving astrologer', 'error'); }
      },
      onCancel: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  const handleQuickBlock = (interview) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Block / Reject Astrologer',
      message: `Block/Reject astrologer "${interview.astrologer?.name}"? This will prevent them from logging in.`,
      type: 'danger',
      confirmText: 'Yes, Block',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: async () => {
        setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
        const token = localStorage.getItem('authToken') || '';
        try {
          const res = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/interview/fail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
            body: JSON.stringify({ interviewId: interview._id, interviewerNotes: 'Blocked by admin.' })
          });
          const data = await res.json();
          if (data.success) {
            fetchInterviews();
            showToast('❌ Astrologer blocked.', 'error');
          }
        } catch (e) { showToast('Error blocking astrologer', 'error'); }
      },
      onCancel: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  // Simple toast helper
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredInterviews = interviews.filter(item => {
    const name = item.astrologer?.name || '';
    const email = item.astrologer?.email || '';
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
  });

  const pendingCount = interviews.filter(i => i.status === 'requested').length;

  if (loading) {
    return (
      <div className="space-y-6 select-none animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-52 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-3 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>

        {/* Search & Controls Skeleton */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4">
          <div className="h-10 w-72 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>

        {/* Table Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden p-4 space-y-3">
          <div className="h-10 bg-slate-100 dark:bg-slate-700/50 rounded-xl w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-50 dark:bg-slate-700/30 rounded-xl w-full flex items-center px-4 justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 bg-slate-200 dark:bg-slate-600 rounded" />
                  <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-600 rounded" />
                </div>
              </div>
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-600 rounded" />
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-600 rounded-full" />
              <div className="h-8 w-24 bg-slate-200 dark:bg-slate-600 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent dark:bg-slate-950">

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-2xl shadow-xl text-sm font-bold text-white transition-all animate-bounce-in max-w-sm ${
          toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              Astrologer Interviews
            </h1>
            <span className="bg-orange-50 dark:bg-orange-950/50 text-[#FA5A24] text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-100 dark:border-orange-900/50">
              Live Evaluation
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">
            Manage, schedule, and evaluate astrologer interview requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-medium hidden md:block">
            Updated {lastRefreshed.toLocaleTimeString()}
          </span>
          <button
            onClick={() => fetchInterviews()}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Pending Review', value: interviews.filter(i => i.status === 'requested').length, color: 'amber', icon: Clock },
          { label: 'Scheduled', value: interviews.filter(i => i.status === 'scheduled').length, color: 'blue', icon: Calendar },
          { label: 'Completed', value: interviews.filter(i => ['passed','failed'].includes(i.status)).length, color: 'emerald', icon: CheckCircle },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-3.5 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${stat.color}-50 dark:bg-${stat.color}-950/40 text-${stat.color}-500`}>
              <stat.icon size={16} />
            </div>
            <div>
              <div className="text-xl font-black text-slate-800 dark:text-slate-100">{stat.value}</div>
              <div className="text-[10px] text-slate-400 font-semibold">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 mb-5 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by astrologer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:outline-none transition-all"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold ml-auto">
          {filteredInterviews.length} interview{filteredInterviews.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Main Table */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden flex flex-col min-h-0">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-[#FA5A24] mb-3" />
            <span className="text-xs font-bold">Loading interviews...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <span className="text-xs font-bold text-red-500">{error}</span>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
            <Calendar className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-3" />
            <span className="text-xs font-bold">No interviews found.</span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Astrologers who request interviews will appear here.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto min-h-0">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-700/60 text-slate-400 font-bold uppercase tracking-wider select-none">
                  <th className="py-4 px-6">Astrologer</th>
                  <th className="py-4 px-6">Requested On</th>
                  <th className="py-4 px-6">Interview Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium text-slate-700 dark:text-slate-200">
                {filteredInterviews.map((item) => {
                  const astro = item.astrologer || {};
                  const isPending   = item.status === 'requested';
                  const isScheduled = item.status === 'scheduled';
                  const isCompleted = item.status === 'completed';
                  const isPassed    = item.status === 'passed';
                  const isFailed    = item.status === 'failed';

                  return (
                    <tr key={item._id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-700/40 transition-colors ${isPending ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={astro.profilePic || astro.avatar || astro.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"}
                            alt={astro.name || "Astro"}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">{astro.name || "Unknown Astrologer"}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail size={10} />
                              <span>{astro.email || "No email"}</span>
                            </div>
                            {item.interviewerNotes && (
                              <span className="text-[9.5px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono truncate max-w-[200px] block mt-1">
                                📝 {item.interviewerNotes}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        {item.interviewDate ? (
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold">
                            <Calendar size={13} className="text-[#FA5A24]" />
                            <span>
                              {new Date(item.interviewDate).toLocaleString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit', hour12: true
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not Scheduled Yet</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                            <Clock size={11} /> Requested
                          </span>
                        )}
                        {isScheduled && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                            <Calendar size={11} /> Scheduled
                          </span>
                        )}
                        {isPassed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                            <ShieldCheck size={11} /> Passed & Approved
                          </span>
                        )}
                        {isFailed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                            <ShieldX size={11} /> Failed & Rejected
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600">
                            Completed
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          
                          {/* Pending → Schedule */}
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleOpenSchedule(item)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FA5A24] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-orange-600 transition-all cursor-pointer"
                              >
                                <Calendar size={13} />
                                <span>Schedule</span>
                              </button>
                              <button
                                onClick={() => handleQuickApprove(item)}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Approve directly without interview"
                              >
                                <ShieldCheck size={10} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleQuickBlock(item)}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold text-[10px] transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Block/Reject astrologer"
                              >
                                <ShieldX size={10} />
                                Block
                              </button>
                            </>
                          )}

                          {/* Scheduled → Join + Evaluate */}
                          {isScheduled && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/interview-room/${item._id}`)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-extrabold shadow-sm hover:from-orange-600 hover:to-amber-600 transition-all cursor-pointer"
                              >
                                <Video size={13} />
                                <span>Join Room</span>
                              </button>
                              <button
                                onClick={() => handleOpenEvaluate(item)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-900 dark:hover:bg-slate-600 transition-all cursor-pointer"
                              >
                                <CheckCircle size={13} />
                                <span>Evaluate</span>
                              </button>
                            </div>
                          )}

                          {/* Completed (Interview done) → Review Notes & Evaluate */}
                          {isCompleted && (
                            <button
                              onClick={() => handleOpenEvaluate(item)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-bold text-[10.5px] transition-all cursor-pointer shadow-sm active:scale-95"
                            >
                              <span>Review Notes & Approve</span>
                            </button>
                          )}

                          {/* Passed/Failed → Status badge + Re-evaluate */}
                          {(isPassed || isFailed) && (
                            <div className="flex items-center gap-2 justify-end">
                              {item.interviewerNotes && (
                                <span className="text-[10px] text-slate-400 max-w-[120px] truncate" title={item.interviewerNotes}>
                                  "{item.interviewerNotes}"
                                </span>
                              )}
                              <button
                                onClick={() => handleOpenEvaluate(item)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                              >
                                Re-evaluate
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── SCHEDULE MODAL ─────────────────────────────────────────────────── */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700/60">
            <div className="bg-gradient-to-r from-[#FA5A24] to-orange-400 p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-[15px]">Schedule Video Interview</h3>
                {selectedInterview?.astrologer?.name && (
                  <p className="text-[11px] text-white/80 mt-0.5">for {selectedInterview.astrologer.name}</p>
                )}
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-white/80 hover:text-white p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-5 flex flex-col gap-4">
              {/* Astrologer Requested Availability Slots (Quick Auto-Fill Chips) */}
              {(() => {
                const slots = selectedInterview?.preferredSlots || selectedInterview?.astrologer?.preferredSlots || [];
                if (!slots.length) return null;
                return (
                  <div className="bg-[#FFF9F6] dark:bg-slate-900/60 border border-orange-200/80 dark:border-slate-700/60 rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[#FA5A24] uppercase tracking-wider">Astrologer's 2 Preferred Time Slots</span>
                      <span className="text-[9px] text-slate-400 font-semibold">Select slot or type custom date below</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {slots.map((slot, idx) => {
                        const targetVal = `${slot.date}T${slot.time}`;
                        const isSelected = interviewDate === targetVal || interviewDate.startsWith(slot.date);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (slot.date && slot.time) {
                                setInterviewDate(`${slot.date}T${slot.time}`);
                              }
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                              isSelected
                                ? "bg-[#FA5A24] text-white border-[#FA5A24] shadow-md"
                                : "bg-white dark:bg-slate-800 border-orange-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-orange-50 dark:hover:bg-slate-700"
                            }`}
                            title="Click to select this slot for the interview"
                          >
                            <Calendar size={12} className={isSelected ? "text-white" : "text-[#FA5A24]"} />
                            <span>Option {idx + 1}: {slot.date} @ {slot.time}</span>
                            {isSelected && <span className="ml-1 bg-white/20 px-1 rounded text-[9px]">Active</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 dark:text-slate-300 font-bold text-xs">Interview Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5">
                  <Link size={11} /> Meeting Link <span className="text-slate-400 font-normal">(Optional — Agora auto-room will be created)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xxx or https://zoom.us/j/..."
                  value={meetingLinkInput}
                  onChange={(e) => setMeetingLinkInput(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 dark:text-slate-300 font-bold text-xs">Notes for Astrologer</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Please be ready with your certificates..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-800 dark:text-blue-300 rounded-xl p-3 flex items-start gap-2.5 text-[11px] leading-relaxed">
                <Info size={14} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>
                  A secure <strong>Agora video room</strong> will be automatically provisioned.
                  If you provide a meeting link above, it will be shown to the astrologer alongside the Agora room button.
                  The astrologer will see this schedule immediately on their pending approval page.
                </span>
              </div>

              <div className="flex gap-3 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#FA5A24] text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-orange-500/20"
                >
                  {submitting ? 'Scheduling...' : '✅ Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EVALUATE MODAL ─────────────────────────────────────────────────── */}
      {showEvaluateModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-[15px]">Evaluate Interview Result</h3>
                {selectedInterview?.astrologer?.name && (
                  <p className="text-[11px] text-white/60 mt-0.5">{selectedInterview.astrologer.name}</p>
                )}
              </div>
              <button onClick={() => setShowEvaluateModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 font-bold text-xs">Interviewer Decision Notes</label>
                <textarea
                  rows="3"
                  placeholder="Provide brief feedback on the evaluation..."
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-[11px] text-emerald-800">
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    <ShieldCheck size={12} /> Pass & Approve
                  </div>
                  <p className="text-emerald-700 leading-relaxed">Astrologer status → <strong>APPROVED</strong>. They can log in and start consultations immediately.</p>
                </div>
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-[11px] text-rose-800">
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    <ShieldX size={12} /> Fail & Block
                  </div>
                  <p className="text-rose-700 leading-relaxed">Astrologer status → <strong>REJECTED</strong>. Their account will be blocked from the platform.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleEvaluate('fail')}
                  disabled={submitting}
                  className="px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-rose-500/10"
                >
                  <XCircle size={14} />
                  <span>{submitting ? 'Processing...' : 'Fail & Block'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleEvaluate('pass')}
                  disabled={submitting}
                  className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10"
                >
                  <CheckCircle size={14} />
                  <span>{submitting ? 'Processing...' : 'Pass & Approve'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal {...confirmModalConfig} />
    </div>
  );
}
