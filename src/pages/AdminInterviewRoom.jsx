import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, ArrowLeft, CheckCircle, XCircle, Volume2, ShieldCheck, Lock, FileText, CheckSquare, Save, X } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminInterviewRoom() {
  const { id } = useParams(); // interviewId
  const navigate = useNavigate();

  const [hasJoined, setHasJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [micMuted, setMicMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [isJoiningChannel, setIsJoiningChannel] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  
  // In-call Notes state
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [interviewNotesText, setInterviewNotesText] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Agora parameters fetched from server
  const [loading, setLoading] = useState(true);
  const [appId, setAppId] = useState("");
  const [channelName, setChannelName] = useState("");
  const [token, setToken] = useState("");
  const [uid, setUid] = useState(1);

  // Custom Modal State
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

  const showAlert = (message, title = 'Notification', type = 'info', onOk = null) => {
    setConfirmModalConfig({
      isOpen: true,
      title,
      message,
      type,
      confirmText: 'OK',
      showCancel: false,
      onConfirm: () => {
        setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
        if (onOk) onOk();
      }
    });
  };

  const showConfirm = (message, onConfirmCallback, title = 'Confirm Action', type = 'warning', confirmText = 'Confirm') => {
    setConfirmModalConfig({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => {
        setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
        if (onConfirmCallback) onConfirmCallback();
      },
      onCancel: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  const previewVideoRef = useRef(null);
  const pipVideoRef = useRef(null);
  const clientRef = useRef(null);
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app";

  // 1. Fetch Agora Token and Channel info on mount
  useEffect(() => {
    const getAgoraCredentials = async () => {
      try {
        const tokenVal = localStorage.getItem('authToken') || '';
        const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/interview/token/${id}?role=admin`, {
          headers: {
            'Content-Type': 'application/json',
            ...(tokenVal ? { 'Authorization': `Bearer ${tokenVal}` } : {})
          }
        });
        const data = await response.json();
        if (data.success) {
          setAppId(data.appId);
          setChannelName(data.channelName);
          setToken(data.token);
          setUid(data.uid || 1);
          setLoading(false);
        } else {
          alert("Error fetching agora token: " + data.message);
          navigate("/interviews");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server");
        navigate("/interviews");
      }
    };

    getAgoraCredentials();
  }, [id]);

  const handleSaveNotes = async (silent = false) => {
    setSavingNotes(true);
    try {
      const tokenVal = localStorage.getItem('authToken') || '';
      const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/interview/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(tokenVal ? { 'Authorization': `Bearer ${tokenVal}` } : {})
        },
        body: JSON.stringify({
          interviewId: id,
          interviewerNotes: interviewNotesText
        })
      });
      const data = await response.json();
      if (data.success && !silent) {
        alert("✅ Interview notes saved successfully!");
      }
    } catch (err) {
      console.error(err);
      if (!silent) alert("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleMarkCompleted = async () => {
    showConfirm(
      "Mark this interview as COMPLETED? You can review notes and evaluate (Pass/Fail) the astrologer anytime later from the dashboard.",
      async () => {
        try {
          const tokenVal = localStorage.getItem('authToken') || '';
          const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/interview/complete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(tokenVal ? { 'Authorization': `Bearer ${tokenVal}` } : {})
            },
            body: JSON.stringify({
              interviewId: id,
              interviewerNotes: interviewNotesText
            })
          });

          const data = await response.json();
          if (data.success) {
            showAlert("Interview marked as COMPLETED! Returning to dashboard.", "Completed", "success", () => handleLeaveCall());
          } else {
            showAlert(data.message || "Failed to mark interview as completed.", "Error", "danger");
          }
        } catch (err) {
          console.error(err);
          showAlert("Error marking interview completed.", "Error", "danger");
        }
      },
      "Complete Interview",
      "warning",
      "Yes, Complete"
    );
  };

  // 2. Initialize Camera and Microphone Pre-Join Preview
  useEffect(() => {
    let active = true;

    const initMediaTracks = async () => {
      try {
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        if (!active) {
          audioTrack.close();
          videoTrack.close();
          return;
        }
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
      } catch (err) {
        console.error("Camera/Microphone permission error:", err);
      }
    };

    if (!loading) {
      initMediaTracks();
    }

    return () => {
      active = false;
    };
  }, [loading]);

  // Play pre-join preview when localVideoTrack and ref are available
  useEffect(() => {
    if (!hasJoined && localVideoTrack && previewVideoRef.current) {
      localVideoTrack.play(previewVideoRef.current);
    }
  }, [localVideoTrack, hasJoined]);

  // Play PIP video when joined
  useEffect(() => {
    if (hasJoined && localVideoTrack && pipVideoRef.current && !videoMuted) {
      localVideoTrack.play(pipVideoRef.current);
    }
  }, [hasJoined, localVideoTrack, videoMuted]);

  // 3. Join Channel Action
  const handleJoinCall = async () => {
    if (!channelName) return;
    setIsJoiningChannel(true);

    const validAppId = appId;
    
    const validToken = (token && !token.startsWith("mock_")) ? token : null;

    try {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setRemoteUsers((prev) => {
            if (prev.find((u) => u.uid === user.uid)) return prev;
            return [...prev, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "video") {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        }
      });

      client.on("user-left", (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      await client.join(validAppId, channelName, validToken, Number(uid) || 1);

      if (localAudioTrack && localVideoTrack) {
        await client.publish([localAudioTrack, localVideoTrack]);
      }

      setIsJoiningChannel(false);
      setHasJoined(true);
    } catch (err) {
      console.warn("Agora RTC network join error, entering local session mode:", err);
      setIsJoiningChannel(false);
      setHasJoined(true);
    }
  };

  const handleToggleMic = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(micMuted);
      setMicMuted(!micMuted);
    }
  };

  const handleToggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(videoMuted);
      setVideoMuted(!videoMuted);
    }
  };

  const promptLeaveCall = () => {
    setShowLeaveModal(true);
  };

  const handleLeaveCall = async () => {
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (clientRef.current) {
      await clientRef.current.leave();
    }
    navigate("/interviews");
  };

  const handleQuickEvaluate = async (type) => {
    if (remoteUsers.length === 0) {
      showAlert("Evaluation buttons are locked until the astrologer joins the interview room.", "Locked", "info");
      return;
    }
    try {
      const tokenVal = localStorage.getItem('authToken') || '';
      const endpoint = type === 'pass' 
        ? `${apiBaseUrl.replace(/\/$/, '')}/api/interview/pass`
        : `${apiBaseUrl.replace(/\/$/, '')}/api/interview/fail`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(tokenVal ? { 'Authorization': `Bearer ${tokenVal}` } : {})
        },
        body: JSON.stringify({
          interviewId: id,
          interviewerNotes: "Evaluated during video call session."
        })
      });

      const data = await response.json();
      if (data.success) {
        showAlert(`Evaluation set to: ${type.toUpperCase()}`, "Success", "success", () => handleLeaveCall());
      } else {
        showAlert(data.message || "Failed to update interview evaluation", "Error", "danger");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error submitting quick evaluation", "Error", "danger");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-white z-50">
        <RefreshCw className="w-10 h-10 animate-spin text-orange-500 mb-3" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Securing Agora Session...</span>
      </div>
    );
  }

  // ==========================================
  // PRE-JOIN SCREEN (Google Meet Pre-Join Lobby)
  // ==========================================
  if (!hasJoined) {
    return (
      <div className="fixed inset-0 bg-[#0B0F17] flex flex-col items-center justify-center p-4 md:p-8 z-50 text-white font-sans overflow-y-auto">
        {/* Top bar */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/interviews')} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer">
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={18} />
              <span className="text-xs font-bold text-slate-300">Admin Interview Lobby</span>
            </div>
          </div>
        </div>

        {/* Center Lobby Box */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 gap-8 items-center mt-12 md:mt-0">
          {/* Camera & Mic Preview Box (Left 3 cols) */}
          <div className="md:col-span-3 flex flex-col items-center">
            <div className="relative w-full aspect-video bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl flex items-center justify-center">
              <div ref={previewVideoRef} className="absolute inset-0 w-full h-full object-cover" />
              
              {videoMuted && (
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center z-10">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                    <VideoOff size={28} />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Camera is off</span>
                </div>
              )}

              {/* Bottom Preview Overlay Controls */}
              <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-3 z-20">
                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                    micMuted ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-slate-950/80 backdrop-blur-md text-white hover:bg-slate-900 border border-slate-700/60"
                  }`}
                  title={micMuted ? "Unmute Mic" : "Mute Mic"}
                >
                  {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button
                  type="button"
                  onClick={handleToggleVideo}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                    videoMuted ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-slate-950/80 backdrop-blur-md text-white hover:bg-slate-900 border border-slate-700/60"
                  }`}
                  title={videoMuted ? "Turn Camera On" : "Turn Camera Off"}
                >
                  {videoMuted ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
              </div>
            </div>

            {/* Audio Indicator */}
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 font-medium">
              <Volume2 size={14} className={micMuted ? "text-rose-400" : "text-emerald-400"} />
              <span>{micMuted ? "Microphone is muted" : "Microphone is active"}</span>
            </div>
          </div>

          {/* Join Info & Action Box (Right 2 cols) */}
          <div className="md:col-span-2 flex flex-col items-start space-y-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Ready to join?</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Check your camera and microphone preview before joining the astrologer applicant.</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 w-full space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Meeting Room</div>
              <div className="text-xs font-bold text-slate-200 truncate">{channelName}</div>
            </div>

            <div className="w-full space-y-3 pt-2">
              <button
                type="button"
                disabled={isJoiningChannel}
                onClick={handleJoinCall}
                className="w-full py-3.5 bg-[#FA5A24] hover:bg-orange-600 disabled:opacity-50 text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-orange-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isJoiningChannel ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>Join Now</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/interviews')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-2xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAstroConnected = remoteUsers.length > 0;

  // ==========================================
  // ACTIVE MEETING ROOM (Google Meet Layout)
  // Remote = Full Main Screen
  // Admin (Self) = Floating PIP Box
  // ==========================================
  return (
    <div className="fixed inset-0 bg-[#0B0F17] flex flex-col z-50 text-white font-sans overflow-hidden">
      {/* Top Header */}
      <div className="bg-slate-900/90 px-6 py-3.5 flex items-center justify-between border-b border-slate-800 flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={promptLeaveCall} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-all text-slate-300 cursor-pointer" title="Leave Interview Room">
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-orange-500 block">Admin Live Interview</span>
            <span className="text-xs font-bold block text-slate-200">Room: {channelName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Notes Toggle Button */}
          <button
            type="button"
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all border ${
              showNotesDrawer
                ? "bg-orange-500 border-orange-600 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750"
            }`}
            title="Toggle Live Notes"
          >
            <FileText size={14} />
            <span>Notes</span>
          </button>

          {/* Mark Completed Button */}
          <button
            type="button"
            onClick={handleMarkCompleted}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold cursor-pointer active:scale-95 transition-all shadow-md"
            title="Mark Interview Completed"
          >
            <CheckSquare size={14} />
            <span>Mark Completed</span>
          </button>

          <button
            disabled={!isAstroConnected}
            onClick={() => handleQuickEvaluate('fail')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md ${
              isAstroConnected 
                ? "bg-rose-600 hover:bg-rose-700 text-white cursor-pointer active:scale-95" 
                : "bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-60"
            }`}
            title={isAstroConnected ? "Mark Candidate Failed" : "Unlocked when astrologer joins room"}
          >
            {!isAstroConnected && <Lock size={13} />}
            <XCircle size={14} />
            <span>Fail</span>
          </button>

          <button
            disabled={!isAstroConnected}
            onClick={() => handleQuickEvaluate('pass')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md ${
              isAstroConnected 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95" 
                : "bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-60"
            }`}
            title={isAstroConnected ? "Pass & Approve Candidate" : "Unlocked when astrologer joins room"}
          >
            {!isAstroConnected && <Lock size={13} />}
            <CheckCircle size={14} />
            <span>Pass & Approve</span>
          </button>
        </div>
      </div>

      {/* Main Full View Container */}
      <div className="flex-1 relative w-full h-full bg-[#070A0F] p-4 flex items-center justify-center overflow-hidden">
        
        {/* Live Notes Side Panel Overlay */}
        {showNotesDrawer && (
          <div className="absolute top-4 right-4 z-40 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-orange-400 font-extrabold text-xs uppercase tracking-wider">
                <FileText size={15} />
                <span>Interviewer Live Notes</span>
              </div>
              <button 
                onClick={() => setShowNotesDrawer(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
            
            <textarea
              rows={6}
              value={interviewNotesText}
              onChange={(e) => setInterviewNotesText(e.target.value)}
              placeholder="Type candidate evaluation notes here (knowledge, communication, experience, recommendations)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-orange-500 outline-none resize-none leading-relaxed font-sans"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500 font-medium">Notes can be reviewed after interview</span>
              <button
                type="button"
                disabled={savingNotes}
                onClick={() => handleSaveNotes(false)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
              >
                <Save size={13} />
                <span>{savingNotes ? "Saving..." : "Save Notes"}</span>
              </button>
            </div>
          </div>
        )}

        {/* MAIN VIEW: Remote Participant (Astrologer) */}
        <div className="relative w-full h-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 flex items-center justify-center">
          {remoteUsers.length > 0 ? (
            remoteUsers.map((user) => (
              <RemoteVideoPlayer key={user.uid} user={user} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 select-none">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-4 animate-pulse">
                <Users size={28} />
              </div>
              <h4 className="font-extrabold text-slate-200 text-base">Waiting for Astrologer to join...</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed font-medium">
                The applicant will appear here in full screen as soon as they connect to the room.
              </p>
            </div>
          )}

          {remoteUsers.length > 0 && (
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-[11px] font-extrabold flex items-center gap-2 z-20">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
              <span>Astrologer Applicant</span>
            </div>
          )}
        </div>

        {/* FLOATING PIP BOX: Local Video (Admin Self-View) */}
        <div className="absolute bottom-6 right-6 w-48 sm:w-56 md:w-64 aspect-video rounded-2xl overflow-hidden border-2 border-slate-700/80 bg-slate-900 shadow-2xl z-30 transition-all hover:scale-105">
          <div ref={pipVideoRef} className="w-full h-full object-cover" />

          {videoMuted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
                <VideoOff size={18} />
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Camera off</span>
            </div>
          )}

          <div className="absolute bottom-2 left-2.5 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-bold flex items-center gap-1.5 z-20">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span>You (Admin)</span>
          </div>
        </div>

        {/* Google Meet Floating Rounded Control Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-40 transition-all hover:border-slate-700">
          <button
            type="button"
            onClick={handleToggleMic}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-md ${
              micMuted 
                ? "bg-rose-500 border-rose-600 text-white hover:bg-rose-600" 
                : "bg-slate-800/90 border-slate-700/80 text-white hover:bg-slate-750 hover:border-slate-600"
            }`}
            title={micMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            {micMuted ? <MicOff size={19} /> : <Mic size={19} />}
          </button>

          <button
            type="button"
            onClick={handleToggleVideo}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-md ${
              videoMuted 
                ? "bg-rose-500 border-rose-600 text-white hover:bg-rose-600" 
                : "bg-slate-800/90 border-slate-700/80 text-white hover:bg-slate-750 hover:border-slate-600"
            }`}
            title={videoMuted ? "Turn Camera On" : "Turn Camera Off"}
          >
            {videoMuted ? <VideoOff size={19} /> : <Video size={19} />}
          </button>

          <button
            type="button"
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-md ${
              showNotesDrawer 
                ? "bg-orange-500 border-orange-600 text-white" 
                : "bg-slate-800/90 border-slate-700/80 text-white hover:bg-slate-750 hover:border-slate-600"
            }`}
            title="In-Call Notes"
          >
            <FileText size={19} />
          </button>

          <button
            type="button"
            onClick={promptLeaveCall}
            className="w-14 h-11 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-rose-600/30"
            title="End Call & Leave"
          >
            <PhoneOff size={19} />
          </button>
        </div>

      </div>

      {/* Google Meet Leave Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-5 text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center">
              <PhoneOff size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">Leave interview call?</h3>
              <p className="text-xs text-slate-400 font-medium">Are you sure you want to exit? You can evaluate the candidate later from the dashboard.</p>
            </div>
            <div className="flex items-center gap-3 w-full pt-1">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLeaveCall}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md"
              >
                Leave Call
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal {...confirmModalConfig} />
    </div>
  );
}

// Subcomponent to render Remote User Video Player
function RemoteVideoPlayer({ user }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && user.videoTrack) {
      user.videoTrack.play(containerRef.current);
    }
  }, [user]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full object-cover" />;
}

// Simple loader icon
function RefreshCw(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
