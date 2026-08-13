import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export default function AdminInterviewRoom() {
  const { id } = useParams(); // interviewId
  const navigate = useNavigate();

  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [micMuted, setMicMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  
  // Agora parameters fetched from server
  const [loading, setLoading] = useState(true);
  const [appId, setAppId] = useState("");
  const [channelName, setChannelName] = useState("");
  const [token, setToken] = useState("");
  const [uid, setUid] = useState(1);

  const localVideoRef = useRef(null);
  const clientRef = useRef(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app";

  useEffect(() => {
    // 1. Fetch token and details for admin role
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
          setAppId(data.appId || "MOCK_AGORA_APP_ID");
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

  useEffect(() => {
    if (loading || !channelName) return;

    // 2. Initialize Agora Client
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    const joinVideoChannel = async () => {
      try {
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

        await client.join(appId, channelName, token || null, Number(uid));

        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);

        await client.publish([audioTrack, videoTrack]);

        if (localVideoRef.current) {
          videoTrack.play(localVideoRef.current);
        }

      } catch (err) {
        console.error("Agora join failed:", err);
      }
    };

    joinVideoChannel();

    return () => {
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (clientRef.current) {
        clientRef.current.leave();
      }
    };
  }, [loading, channelName]);

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
        alert(`Evaluation set to: ${type.toUpperCase()}`);
        handleLeaveCall();
      } else {
        alert(data.message || "Failed to update interview evaluation");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting quick evaluation");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-10 h-10 animate-spin text-orange-500 mb-3" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Securing Agora Session...</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col z-50 text-white font-sans">
      {/* Top Header */}
      <div className="bg-slate-900/80 px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button onClick={handleLeaveCall} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-all text-slate-350 cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[12px] uppercase tracking-wider font-extrabold text-orange-500 block">Admin Interview Panel</span>
            <span className="text-[15px] font-bold block mt-0.5">Channel Room: {channelName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleQuickEvaluate('fail')}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-650 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold cursor-pointer active:scale-95 transition-all shadow-md shadow-rose-600/10"
          >
            <XCircle size={14} />
            <span>Fail</span>
          </button>
          <button
            onClick={() => handleQuickEvaluate('pass')}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold cursor-pointer active:scale-95 transition-all shadow-md shadow-emerald-500/10"
          >
            <CheckCircle size={14} />
            <span>Pass & Approve</span>
          </button>
        </div>
      </div>

      {/* Grid Streams */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 min-h-0 bg-slate-950">
        {/* Local Stream (Admin) */}
        <div className="relative bg-slate-900 rounded-[24px] overflow-hidden border border-slate-800 flex items-center justify-center">
          <div ref={localVideoRef} className="absolute inset-0 w-full h-full object-cover" />
          
          {videoMuted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                <VideoOff size={24} />
              </div>
              <span className="text-slate-400 text-xs font-bold">Your camera is off</span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-extrabold flex items-center gap-1.5 z-20">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            <span>You (Admin)</span>
          </div>
        </div>

        {/* Remote Stream (Astrologer) */}
        <div className="relative bg-slate-900 rounded-[24px] overflow-hidden border border-slate-800 flex items-center justify-center">
          {remoteUsers.length > 0 ? (
            remoteUsers.map((user) => (
              <RemoteVideoPlayer key={user.uid} user={user} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-full bg-slate-850 flex items-center justify-center text-slate-400 mb-3 animate-pulse">
                <Users size={24} />
              </div>
              <h4 className="font-bold text-slate-300 text-sm">Waiting for Astrologer</h4>
              <p className="text-[11.5px] text-slate-500 max-w-[220px] mt-1 leading-relaxed">
                The astrologer applicant will join the video room shortly.
              </p>
            </div>
          )}

          {remoteUsers.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-extrabold flex items-center gap-1.5 z-20">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
              <span>Astrologer Applicant</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="bg-slate-900 px-6 py-4 flex justify-center items-center gap-4 border-t border-slate-800 flex-shrink-0">
        <button
          onClick={handleToggleMic}
          className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
            micMuted 
              ? "bg-rose-500/10 border-rose-500 text-rose-500 hover:bg-rose-500/20" 
              : "bg-slate-800 border-slate-700 text-white hover:bg-slate-750"
          }`}
        >
          {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <button
          onClick={handleToggleVideo}
          className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
            videoMuted 
              ? "bg-rose-500/10 border-rose-500 text-rose-500 hover:bg-rose-500/20" 
              : "bg-slate-800 border-slate-700 text-white hover:bg-slate-750"
          }`}
        >
          {videoMuted ? <VideoOff size={18} /> : <Video size={18} />}
        </button>

        <button
          onClick={handleLeaveCall}
          className="w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-rose-600/30"
        >
          <PhoneOff size={18} />
        </button>
      </div>
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

// Simple internal loader icon mapping
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
