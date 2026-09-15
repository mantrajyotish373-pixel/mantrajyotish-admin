import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Calendar, 
  Download, 
  Check, 
  X, 
  SlidersHorizontal,
  MoreVertical,
  Eye,
  FileText,
  MapPin,
  Mail,
  Phone,
  Info
} from 'lucide-react';

const mapKycData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.filter(Boolean).map((item, idx) => {
    const name = String(item.name || item.firstname || item.displayName || 'Astrologer');
    const email = String(item.email || 'N/A');
    const phone = String(item.phone || item.mobileNumber || item.mobile || 'N/A');
    const docType = String(item.idProofType || item.docType || 'Aadhaar Card');
    const docNo = String(item.idProofNumber || item.docNo || 'XXXX XXXX 1234');
    const statusVal = item.status !== undefined ? item.status : (item.isApproved !== undefined ? item.isApproved : item.kycStatus);
    
    let formattedStatus = 'Pending';
    if (typeof statusVal === 'string') {
      const s = statusVal.toLowerCase();
      if (s === 'approved' || s === 'verified' || s === 'true') formattedStatus = 'Approved';
      else if (s === 'rejected' || s === 'declined' || s === 'failed') formattedStatus = 'Rejected';
      else formattedStatus = 'Pending';
    } else if (typeof statusVal === 'boolean') {
      formattedStatus = statusVal ? 'Approved' : 'Pending';
    }

    const dateRaw = item.createdAt ? new Date(item.createdAt) : new Date();
    const isValidDate = !isNaN(dateRaw.getTime());
    const finalDate = isValidDate ? dateRaw : new Date();
    const formattedDate = finalDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = finalDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      id: item._id || item.id || idx + 1,
      user: {
        name,
        email,
        phone,
        location: String(item.location || item.city || 'India'),
        avatar: item.profileImage || item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FA5A24&color=fff`
      },
      docType,
      docNo,
      issueDate: item.issueDate || '12/05/2020',
      expiryDate: item.expiryDate || '—',
      submittedOn: {
        date: formattedDate,
        time: formattedTime
      },
      status: formattedStatus,
      frontImage: item.idProofFront || item.idProof || item.kycFront || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&h=250&fit=crop',
      backImage: item.idProofBack || item.kycBack || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop'
    };
  });
};

const KycVerificationPage = () => {
  const [kycApps, setKycApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeSubTab, setActiveSubTab] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [viewFullImage, setViewFullImage] = useState(null);

  useEffect(() => {
    const fetchKycData = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app";
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      try {
        const res = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/astro/all?status=all`, { headers });
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
          setKycApps(mapKycData(list));
        } else {
          setKycApps([]);
        }
      } catch (err) {
        console.error('Error fetching KYC records:', err);
        setKycApps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKycData();
  }, []);

  // Dynamic counts for tabs
  const stats = useMemo(() => {
    const total = kycApps.length;
    const pending = kycApps.filter(k => k.status === 'Pending').length;
    const approved = kycApps.filter(k => k.status === 'Approved').length;
    const rejected = kycApps.filter(k => k.status === 'Rejected').length;
    return { total, pending, approved, rejected };
  }, [kycApps]);

  // Filter
  const filteredApps = useMemo(() => {
    return kycApps.filter(app => {
      const matchesSearch = 
        String(app.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(app.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(app.user?.phone || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDoc = docTypeFilter === 'All' || app.docType === docTypeFilter;
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

      let matchesTab = true;
      if (activeSubTab === 'Pending') matchesTab = app.status === 'Pending';
      else if (activeSubTab === 'Approved') matchesTab = app.status === 'Approved';
      else if (activeSubTab === 'Rejected') matchesTab = app.status === 'Rejected';

      return matchesSearch && matchesDoc && matchesStatus && matchesTab;
    });
  }, [kycApps, searchQuery, docTypeFilter, statusFilter, activeSubTab]);

  // Actions
  const handleApprove = (id) => {
    setKycApps(prev => prev.map(k => k.id === id ? { ...k, status: 'Approved' } : k));
    if (selectedApp?.id === id) {
      setSelectedApp(prev => ({ ...prev, status: 'Approved' }));
    }
  };

  const handleReject = (id) => {
    setKycApps(prev => prev.map(k => k.id === id ? { ...k, status: 'Rejected' } : k));
    if (selectedApp?.id === id) {
      setSelectedApp(prev => ({ ...prev, status: 'Rejected' }));
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden h-full w-full select-none pb-8 animate-pulse space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-1.5 flex-1">
                <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="h-10 w-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-10 w-44 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
          <div className="space-y-3 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700/40 rounded-xl w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // CSV export
  const handleExportCSV = () => {
    const headers = ['ID,User Name,User Email,User Phone,Document Type,Document No,Issue Date,Submitted On Date,Status\n'];
    const rows = filteredApps.map(k => 
      `${k.id},"${k.user.name}",${k.user.email},${k.user.phone},"${k.docType}","${k.docNo}",${k.issueDate},${k.submittedOn.date},${k.status}`
    );
    const blob = new Blob([...headers, ...rows.map(r => r + '\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `KYC_Report_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full w-full select-none pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 flex-shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
            KYC Verification <span className="text-[#FA5A24]">✨</span>
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">KYC Verification</span>
          </div>
        </div>

        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#FA5A24]/40 hover:bg-[#FA5A24]/5 text-[#FA5A24] rounded-xl text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Split Columns Grid Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch overflow-hidden w-full min-h-0">
        
        {/* Left Side: Table & Filters */}
        <div className="flex-grow flex flex-col overflow-hidden min-h-0 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl shadow-sm p-5">
          
          {/* Header Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 flex-shrink-0">
            {[
              { label: 'Total Applications', value: stats.total.toLocaleString('en-IN'), trend: '▲ 16.8%', color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-500', icon: ShieldAlert },
              { label: 'Pending Verification', value: stats.pending.toLocaleString('en-IN'), trend: '▲ 8.6%', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-500', icon: Clock },
              { label: 'Approved', value: stats.approved.toLocaleString('en-IN'), trend: '▲ 19.4%', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400', icon: CheckCircle },
              { label: 'Rejected', value: stats.rejected.toLocaleString('en-IN'), trend: '▼ 6.3%', color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-500', icon: XCircle }
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-50/50 dark:bg-slate-700/40 border border-slate-100/60 dark:border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color} flex-shrink-0`}>
                  <stat.icon size={16} />
                </div>
                <div>
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>{stat.value}</span>
                    <span className="text-[8px] font-extrabold text-slate-400">{stat.trend}</span>
                  </div>
                  <span className="text-[7px] text-slate-400 font-semibold block">this month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filtering bar */}
          <div className="flex flex-col md:flex-row items-center gap-3 justify-between mb-5 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search by name, email, or mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#FCFAF8] dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs rounded-xl outline-none focus:border-orange-200 dark:focus:border-slate-500 focus:bg-white dark:focus:bg-slate-700 font-medium text-slate-700 dark:text-slate-200 transition-all duration-200"
                />
              </div>

              {/* Doc Type Selector */}
              <div className="relative w-full sm:w-44">
                <select
                  value={docTypeFilter}
                  onChange={(e) => setDocTypeFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-600 dark:text-slate-200 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
                >
                  <option value="All" className="dark:bg-slate-800">All Document Types</option>
                  <option value="Aadhaar Card" className="dark:bg-slate-800">Aadhaar Card</option>
                  <option value="PAN Card" className="dark:bg-slate-800">PAN Card</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
              </div>

              {/* Status Select */}
              <div className="relative w-full sm:w-36">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-600 dark:text-slate-200 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
                >
                  <option value="All" className="dark:bg-slate-800">All Status</option>
                  <option value="Pending" className="dark:bg-slate-800">Pending</option>
                  <option value="Approved" className="dark:bg-slate-800">Approved</option>
                  <option value="Rejected" className="dark:bg-slate-800">Rejected</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
              </div>
            </div>

            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-[#FA5A24]/40 hover:bg-[#FA5A24]/5 text-[#FA5A24] rounded-xl text-xs font-bold transition-all">
              <SlidersHorizontal size={13} />
              <span>Filters</span>
            </button>
          </div>

          {/* Sub-tabs Row with dynamic numbers */}
          <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-700/60 pb-1.5 mb-4 flex-shrink-0 overflow-x-auto scrollbar-none">
            {[
              { id: 'All', label: `All (${stats.total})` },
              { id: 'Pending', label: `Pending (${stats.pending})` },
              { id: 'Approved', label: `Approved (${stats.approved})` },
              { id: 'Rejected', label: `Rejected (${stats.rejected})` }
            ].map((tab) => {
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`pb-1 text-xs font-extrabold border-b-2 transition-all outline-none whitespace-nowrap ${
                    isActive ? 'border-[#FA5A24] text-[#FA5A24]' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Data Table */}
          <div className="flex-grow overflow-y-auto min-h-0">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/60 text-slate-400 text-[9px] font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Document Type</th>
                  <th className="py-3 px-3">Submitted On</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70 dark:divide-slate-700/60 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => {
                    const isSelected = selectedApp?.id === app.id;
                    return (
                      <tr 
                        key={app.id} 
                        onClick={() => setSelectedApp(app)}
                        className={`hover:bg-slate-50/40 dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#FFF5F1]/30 dark:bg-[#FA5A24]/10' : ''
                        }`}
                      >
                        {/* User Profile Info */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img src={app.user.avatar} className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-100 dark:border-slate-700" alt="" />
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-800 dark:text-slate-100 leading-tight">{app.user.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold mt-0.5 select-text">{app.user.email}</span>
                              <span className="text-[9px] text-slate-400 font-bold leading-none select-text">{app.user.phone}</span>
                            </div>
                          </div>
                        </td>

                        {/* Document type cell */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-50 dark:bg-slate-700 border border-slate-100/60 dark:border-slate-600 flex items-center justify-center flex-shrink-0 text-[#FA5A24]">
                              <FileText size={12} />
                            </span>
                            <div className="flex flex-col">
                              <span className="text-slate-800 dark:text-slate-100 font-bold text-[11px] leading-tight">{app.docType}</span>
                              <span className="text-[9px] text-slate-400 font-bold mt-0.5 select-text uppercase">{app.docNo}</span>
                            </div>
                          </div>
                        </td>

                        {/* Submitted On Date */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{app.submittedOn.date}</span>
                            <span className="text-[9px] text-slate-400 font-extrabold mt-0.5 uppercase">{app.submittedOn.time}</span>
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="py-3.5 px-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider ${
                            app.status === 'Approved'
                              ? 'bg-[#E6F4EA] dark:bg-emerald-950/50 text-[#137333] dark:text-emerald-400'
                              : app.status === 'Pending'
                              ? 'bg-[#FEF3C7] dark:bg-amber-950/50 text-[#D97706] dark:text-amber-400'
                              : 'bg-red-50 dark:bg-rose-950/50 text-red-600 dark:text-rose-400'
                          }`}>
                            {app.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            {app.status === 'Pending' ? (
                              <>
                                <button 
                                  onClick={() => handleApprove(app.id)}
                                  className="p-1 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-md transition-colors"
                                >
                                  <Check size={11} />
                                </button>
                                <button 
                                  onClick={() => handleReject(app.id)}
                                  className="p-1 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/50 text-rose-500 dark:text-rose-400 rounded-md transition-colors"
                                >
                                  <X size={11} />
                                </button>
                              </>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 font-bold">—</span>
                            )}
                            <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded">
                              <MoreVertical size={13} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400 font-bold">
                      No applications found matching your select filter parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex-shrink-0">
            <span className="text-[10px] text-slate-400 font-bold">
              Showing 1 to {filteredApps.length} of {kycApps.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 text-[10px] font-extrabold hover:bg-slate-50 dark:hover:bg-slate-700">&lt;</button>
              <button className="px-3 py-1 bg-[#FA5A24] text-white rounded-lg text-[10px] font-extrabold">1</button>
              <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 rounded-lg text-[10px] font-extrabold hover:bg-slate-50 dark:hover:bg-slate-700">2</button>
              <button className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 text-[10px] font-extrabold hover:bg-slate-50 dark:hover:bg-slate-700">&gt;</button>
            </div>
          </div>

        </div>

        {/* Right Side Column: KYC Details sticky drawer */}
        {selectedApp && (
          <div className="w-full lg:w-[320px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden flex-shrink-0 flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4.5 border-b border-slate-100 dark:border-slate-700/60 flex-shrink-0">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider" style={{ fontFamily: 'Outfit' }}>KYC Details</h3>
              <button 
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* User Profile summary */}
              <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 rounded-xl p-3">
                <img src={selectedApp.user.avatar} className="w-11 h-11 rounded-full object-cover border border-white dark:border-slate-600 shadow shadow-slate-200 dark:shadow-none" alt="" />
                <div className="min-w-0">
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 text-xs leading-none block">{selectedApp.user.name}</span>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[7px] font-bold mt-1 ${
                    selectedApp.status === 'Approved'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                      : selectedApp.status === 'Pending'
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-500 dark:text-rose-400'
                  }`}>{selectedApp.status}</span>
                  <span className="text-[8px] text-slate-400 font-semibold block mt-1 select-text truncate">{selectedApp.user.email}</span>
                </div>
              </div>

              {/* Document details sheet metadata */}
              <div className="space-y-3 bg-[#FCFAF8] dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100/60 dark:border-slate-600/50 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-100/40 dark:border-slate-600/50 pb-2">
                  <span className="text-slate-400 font-medium">Document Type</span>
                  <span className="font-bold text-slate-850 dark:text-slate-100">{selectedApp.docType}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100/40 dark:border-slate-600/50 pb-2">
                  <span className="text-slate-400 font-medium">Document Number</span>
                  <span className="font-bold text-slate-850 dark:text-slate-100 select-text uppercase">{selectedApp.docNo}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100/40 dark:border-slate-600/50 pb-2">
                  <span className="text-slate-400 font-medium">Issue Date</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{selectedApp.issueDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Expiry Date</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{selectedApp.expiryDate}</span>
                </div>
              </div>

              {/* Uploaded attachment slots */}
              <div className="space-y-2.5">
                <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Uploaded Documents</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Card front slot */}
                  <div className="border border-slate-100 dark:border-slate-700/60 rounded-xl overflow-hidden bg-white dark:bg-slate-700 shadow-sm flex flex-col relative group">
                    <img src={selectedApp.frontImage} className="w-full h-20 object-cover" alt="" />
                    <div className="p-2 text-[8px] font-bold text-slate-500 dark:text-slate-300">
                      <span className="block text-slate-700 dark:text-slate-200 truncate">Doc Front Page</span>
                      <span className="block text-[7px] text-slate-400 mt-0.5 leading-none">25 May 2025</span>
                    </div>
                    <button 
                      onClick={() => setViewFullImage(selectedApp.frontImage)}
                      className="absolute right-2 top-2 p-1.5 bg-black/60 hover:bg-black/85 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      <Eye size={10} />
                    </button>
                  </div>

                  {/* Card back slot */}
                  <div className="border border-slate-100 dark:border-slate-700/60 rounded-xl overflow-hidden bg-white dark:bg-slate-700 shadow-sm flex flex-col relative group">
                    <img src={selectedApp.backImage} className="w-full h-20 object-cover" alt="" />
                    <div className="p-2 text-[8px] font-bold text-slate-500 dark:text-slate-300">
                      <span className="block text-slate-700 dark:text-slate-200 truncate">Doc Back Page</span>
                      <span className="block text-[7px] text-slate-400 mt-0.5 leading-none">25 May 2025</span>
                    </div>
                    <button 
                      onClick={() => setViewFullImage(selectedApp.backImage)}
                      className="absolute right-2 top-2 p-1.5 bg-black/60 hover:bg-black/85 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      <Eye size={10} />
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Sticky Actions */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/60 flex-shrink-0 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <button 
                  onClick={() => handleApprove(selectedApp.id)}
                  disabled={selectedApp.status === 'Approved'}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-white dark:bg-slate-700 border border-emerald-500 hover:bg-emerald-50/20 text-emerald-600 dark:text-emerald-400 rounded-xl disabled:opacity-55 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <Check size={12} />
                  <span>Approve</span>
                </button>
                <button 
                  onClick={() => handleReject(selectedApp.id)}
                  disabled={selectedApp.status === 'Rejected'}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-white dark:bg-slate-700 border border-rose-500 hover:bg-rose-50/20 text-rose-500 dark:text-rose-400 rounded-xl disabled:opacity-55 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <X size={12} />
                  <span>Reject</span>
                </button>
              </div>

              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-[#FA5A24]/40 hover:bg-[#FA5A24]/5 text-[#FA5A24] bg-white dark:bg-slate-700 rounded-xl text-[10px] font-bold transition-all cursor-pointer">
                <Info size={12} />
                <span>Request More Info</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Full Document attachment image viewer modal */}
      {viewFullImage && (
        <div 
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={() => setViewFullImage(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <img src={viewFullImage} className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10" alt="Full size upload preview" />
            <button 
              onClick={() => setViewFullImage(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default KycVerificationPage;
