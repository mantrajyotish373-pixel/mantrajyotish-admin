import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app";

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

  // Auto-refresh every 30 seconds to catch new requests from astrologers
  useEffect(() => {
    const interval = setInterval(() => fetchInterviews(true), 30000);
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
    setEvalNotes('');
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
  const handleQuickApprove = async (interview) => {
    if (!window.confirm(`Approve astrologer "${interview.astrologer?.name}"? They will be able to log in and start consultations.`)) return;
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
  };

  const handleQuickBlock = async (interview) => {
    if (!window.confirm(`Block/Reject astrologer "${interview.astrologer?.name}"? This will prevent them from logging in.`)) return;
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

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-2xl shadow-xl text-sm font-bold text-white transition-all animate-bounce-in max-w-sm ${
          toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between select-none mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              Interviews Management
            </h1>
            {pendingCount > 0 && (
              <span className="flex items-center gap-1 bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                <Bell size={9} />
                {pendingCount} new
              </span>
            )}
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
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95 cursor-pointer shadow-sm"
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
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-500`}>
              <stat.icon size={16} />
            </div>
            <div>
              <div className="text-xl font-black text-slate-800">{stat.value}</div>
              <div className="text-[10px] text-slate-400 font-semibold">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-5 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by astrologer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold ml-auto">
          {filteredInterviews.length} interview{filteredInterviews.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Main Table */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0">
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
            <Calendar className="w-12 h-12 text-slate-200 mb-3" />
            <span className="text-xs font-bold">No interviews found.</span>
            <p className="text-[10px] text-slate-300 mt-1">Astrologers who request interviews will appear here.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto min-h-0">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider select-none">
                  <th className="py-4 px-6">Astrologer</th>
                  <th className="py-4 px-6">Requested On</th>
                  <th className="py-4 px-6">Interview Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredInterviews.map((item) => {
                  const astro = item.astrologer || {};
                  const isPending   = item.status === 'requested';
                  const isScheduled = item.status === 'scheduled';
                  const isPassed    = item.status === 'passed';
                  const isFailed    = item.status === 'failed';

                  return (
                    <tr key={item._id} className={`hover:bg-slate-50/50 transition-colors ${isPending ? 'bg-amber-50/30' : ''}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold flex-shrink-0 overflow-hidden">
                            {astro.profileImage ? (
                              <img src={astro.profileImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User size={16} />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{astro.name || 'Unnamed Astrologer'}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{astro.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-6">
                        {item.interviewDate ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-slate-900 font-bold">
                              {new Date(item.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(item.interviewDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </span>
                            {item.meetingLink && (
                              <a href={item.meetingLink} target="_blank" rel="noopener noreferrer"
                                className="text-[10px] text-blue-500 font-bold flex items-center gap-0.5 hover:underline truncate max-w-[120px]">
                                <Link size={8} /> Join Link
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not scheduled</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                          isPassed    ? 'bg-emerald-50 text-emerald-600' :
                          isFailed    ? 'bg-rose-50 text-rose-600' :
                          isScheduled ? 'bg-blue-50 text-blue-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          
                          {/* Pending → Schedule */}
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleOpenSchedule(item)}
                                className="px-3 py-1.5 bg-[#FA5A24] text-white hover:bg-orange-600 rounded-lg font-bold text-[10.5px] transition-all cursor-pointer shadow-sm active:scale-95"
                              >
                                Schedule
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
                            <>
                              <button
                                onClick={() => navigate(`/interview-room/${item._id}`)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold text-[10.5px] transition-all cursor-pointer shadow-sm active:scale-95"
                              >
                                <Play size={10} className="fill-current" />
                                <span>Join Room</span>
                              </button>
                              <button
                                onClick={() => handleOpenEvaluate(item)}
                                className="px-3 py-1.5 bg-slate-800 text-white hover:bg-slate-900 rounded-lg font-bold text-[10.5px] transition-all cursor-pointer shadow-sm active:scale-95"
                              >
                                Evaluate
                              </button>
                            </>
                          )}

                          {/* Completed (passed/failed) — re-evaluate option */}
                          {(isPassed || isFailed) && (
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-extrabold ${isPassed ? 'text-emerald-600' : 'text-rose-500'}`}>
                                {isPassed ? '✅ Approved' : '❌ Blocked'}
                              </span>
                              <button
                                onClick={() => handleOpenEvaluate(item)}
                                className="px-2 py-1 border border-slate-200 text-slate-500 text-[9px] font-bold rounded-lg hover:bg-slate-50 cursor-pointer"
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
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-100">
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
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 font-bold text-xs">Interview Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 font-bold text-xs flex items-center gap-1.5">
                  <Link size={11} /> Meeting Link <span className="text-slate-400 font-normal">(Optional — Agora auto-room will be created)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xxx or https://zoom.us/j/..."
                  value={meetingLinkInput}
                  onChange={(e) => setMeetingLinkInput(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 font-bold text-xs">Notes for Astrologer</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Please be ready with your certificates..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-xl p-3 flex items-start gap-2.5 text-[11px] leading-relaxed">
                <Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
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
                  className="px-4 py-2 border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
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
    </div>
  );
}
