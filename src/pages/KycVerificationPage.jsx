import React, { useState, useMemo } from 'react';
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

// KYC list mock data matching your screenshot details
const initialKycApps = [
  {
    id: 1,
    user: {
      name: 'Rohit Sharma',
      email: 'rohit@gmail.com',
      phone: '+91 98765 43210',
      location: 'Jaipur, Rajasthan',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    },
    docType: 'Aadhaar Card',
    docNo: 'XXXX XXXX 1234',
    issueDate: '12/05/2020',
    expiryDate: '—',
    submittedOn: {
      date: '25 May 2025',
      time: '10:30 AM'
    },
    status: 'Pending',
    frontImage: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&h=250&fit=crop',
    backImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop'
  },
  {
    id: 2,
    user: {
      name: 'Priya Singh',
      email: 'priya.singh@gmail.com',
      phone: '+91 87654 32109',
      location: 'Lucknow, Uttar Pradesh',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    docType: 'PAN Card',
    docNo: 'ABCDE1234F',
    issueDate: '08/11/2019',
    expiryDate: '—',
    submittedOn: {
      date: '25 May 2025',
      time: '09:15 AM'
    },
    status: 'Pending',
    frontImage: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&h=250&fit=crop',
    backImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    user: {
      name: 'Amit Kumar',
      email: 'amit.kumar@gmail.com',
      phone: '+91 76543 21098',
      location: 'Patna, Bihar',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    docType: 'Aadhaar Card',
    docNo: 'XXXX XXXX 5678',
    issueDate: '20/02/2021',
    expiryDate: '—',
    submittedOn: {
      date: '24 May 2025',
      time: '07:45 PM'
    },
    status: 'Approved',
    frontImage: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&h=250&fit=crop',
    backImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop'
  },
  {
    id: 4,
    user: {
      name: 'Sneha Patel',
      email: 'sneha.patel@gmail.com',
      phone: '+91 65432 10987',
      location: 'Ahmedabad, Gujarat',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    },
    docType: 'PAN Card',
    docNo: 'PQRTY6789L',
    issueDate: '15/06/2018',
    expiryDate: '—',
    submittedOn: {
      date: '24 May 2025',
      time: '06:20 PM'
    },
    status: 'Rejected',
    frontImage: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&h=250&fit=crop',
    backImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop'
  },
  {
    id: 5,
    user: {
      name: 'Vikash Yadav',
      email: 'vikash.yadav@gmail.com',
      phone: '+91 54321 09876',
      location: 'Ranchi, Jharkhand',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    docType: 'Aadhaar Card',
    docNo: 'XXXX XXXX 9012',
    issueDate: '01/09/2022',
    expiryDate: '—',
    submittedOn: {
      date: '24 May 2025',
      time: '04:10 PM'
    },
    status: 'Pending',
    frontImage: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&h=250&fit=crop',
    backImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop'
  },
  {
    id: 6,
    user: {
      name: 'Neha Joshi',
      email: 'neha.joshi@gmail.com',
      phone: '+91 43210 98765',
      location: 'Pune, Maharashtra',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
    },
    docType: 'PAN Card',
    docNo: 'XYZAB1234C',
    issueDate: '10/10/2020',
    expiryDate: '—',
    submittedOn: {
      date: '23 May 2025',
      time: '08:30 PM'
    },
    status: 'Approved',
    frontImage: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&h=250&fit=crop',
    backImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop'
  }
];

const KycVerificationPage = () => {
  const [kycApps, setKycApps] = useState(initialKycApps);
  const [searchQuery, setSearchQuery] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeSubTab, setActiveSubTab] = useState('All');
  const [selectedApp, setSelectedApp] = useState(initialKycApps[0]);
  const [viewFullImage, setViewFullImage] = useState(null);

  // Dynamic counts for tabs
  const stats = useMemo(() => {
    const total = kycApps.length;
    const pending = kycApps.filter(k => k.status === 'Pending').length;
    const approved = kycApps.filter(k => k.status === 'Approved').length;
    const rejected = kycApps.filter(k => k.status === 'Rejected').length;
    return { total, pending, approved, rejected };
  }, [kycApps]);

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

  // Filter
  const filteredApps = useMemo(() => {
    return kycApps.filter(app => {
      const matchesSearch = 
        app.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.user.phone.includes(searchQuery);

      const matchesDoc = docTypeFilter === 'All' || app.docType === docTypeFilter;
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

      let matchesTab = true;
      if (activeSubTab === 'Pending') matchesTab = app.status === 'Pending';
      else if (activeSubTab === 'Approved') matchesTab = app.status === 'Approved';
      else if (activeSubTab === 'Rejected') matchesTab = app.status === 'Rejected';

      return matchesSearch && matchesDoc && matchesStatus && matchesTab;
    });
  }, [kycApps, searchQuery, docTypeFilter, statusFilter, activeSubTab]);

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
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
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
        <div className="flex-grow flex flex-col overflow-hidden min-h-0 bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
          
          {/* Header Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 flex-shrink-0">
            {[
              { label: 'Total Applications', value: '256', trend: '▲ 16.8%', color: 'bg-orange-50 text-orange-500', icon: ShieldAlert },
              { label: 'Pending Verification', value: '38', trend: '▲ 8.6%', color: 'bg-amber-50 text-amber-500', icon: Clock },
              { label: 'Approved', value: '186', trend: '▲ 19.4%', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
              { label: 'Rejected', value: '32', trend: '▼ 6.3%', color: 'bg-rose-50 text-rose-500', icon: XCircle }
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-50/50 border border-slate-100/60 rounded-xl p-3.5 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color} flex-shrink-0`}>
                  <stat.icon size={16} />
                </div>
                <div>
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-extrabold text-slate-800" style={{ fontFamily: 'Outfit' }}>{stat.value}</span>
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
                  className="w-full pl-9 pr-4 py-2 bg-[#FCFAF8] border border-slate-200 text-xs rounded-xl outline-none focus:border-orange-200 focus:bg-white font-medium text-slate-700 transition-all duration-200"
                />
              </div>

              {/* Doc Type Selector */}
              <div className="relative w-full sm:w-44">
                <select
                  value={docTypeFilter}
                  onChange={(e) => setDocTypeFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
                >
                  <option value="All">All Document Types</option>
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="PAN Card">PAN Card</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
              </div>

              {/* Status Select */}
              <div className="relative w-full sm:w-36">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
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
          <div className="flex items-center gap-6 border-b border-slate-100 pb-1.5 mb-4 flex-shrink-0 overflow-x-auto scrollbar-none">
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
                    isActive ? 'border-[#FA5A24] text-[#FA5A24]' : 'border-transparent text-slate-400 hover:text-slate-600'
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
                <tr className="border-b border-slate-100 text-slate-400 text-[9px] font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Document Type</th>
                  <th className="py-3 px-3">Submitted On</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70 text-xs text-slate-700 font-semibold">
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => {
                    const isSelected = selectedApp?.id === app.id;
                    return (
                      <tr 
                        key={app.id} 
                        onClick={() => setSelectedApp(app)}
                        className={`hover:bg-slate-50/40 transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#FFF5F1]/30' : ''
                        }`}
                      >
                        {/* User Profile Info */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img src={app.user.avatar} className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-100" alt="" />
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-800 leading-tight">{app.user.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold mt-0.5 select-text">{app.user.email}</span>
                              <span className="text-[9px] text-slate-400 font-bold leading-none select-text">{app.user.phone}</span>
                            </div>
                          </div>
                        </td>

                        {/* Document type cell */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-50 border border-slate-100/60 flex items-center justify-center flex-shrink-0 text-[#FA5A24]">
                              <FileText size={12} />
                            </span>
                            <div className="flex flex-col">
                              <span className="text-slate-800 font-bold text-[11px] leading-tight">{app.docType}</span>
                              <span className="text-[9px] text-slate-400 font-bold mt-0.5 select-text uppercase">{app.docNo}</span>
                            </div>
                          </div>
                        </td>

                        {/* Submitted On Date */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{app.submittedOn.date}</span>
                            <span className="text-[9px] text-slate-400 font-extrabold mt-0.5 uppercase">{app.submittedOn.time}</span>
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="py-3.5 px-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider ${
                            app.status === 'Approved'
                              ? 'bg-[#E6F4EA] text-[#137333]'
                              : app.status === 'Pending'
                              ? 'bg-[#FEF3C7] text-[#D97706]'
                              : 'bg-red-50 text-red-600'
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
                                  className="p-1 border border-emerald-200 hover:bg-emerald-50 text-emerald-600 rounded-md transition-colors"
                                >
                                  <Check size={11} />
                                </button>
                                <button 
                                  onClick={() => handleReject(app.id)}
                                  className="p-1 border border-rose-200 hover:bg-rose-50 text-rose-500 rounded-md transition-colors"
                                >
                                  <X size={11} />
                                </button>
                              </>
                            ) : (
                              <span className="text-slate-300 font-bold">—</span>
                            )}
                            <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 mt-4 border-t border-slate-100 flex-shrink-0">
            <span className="text-[10px] text-slate-400 font-bold">
              Showing 1 to {filteredApps.length} of {kycApps.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-extrabold hover:bg-slate-50">&lt;</button>
              <button className="px-3 py-1 bg-[#FA5A24] text-white rounded-lg text-[10px] font-extrabold">1</button>
              <button className="px-3 py-1 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-extrabold hover:bg-slate-50">2</button>
              <button className="px-2 py-1 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-extrabold hover:bg-slate-50">&gt;</button>
            </div>
          </div>

        </div>

        {/* Right Side Column: KYC Details sticky drawer */}
        {selectedApp && (
          <div className="w-full lg:w-[320px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-shrink-0 flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4.5 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider" style={{ fontFamily: 'Outfit' }}>KYC Details</h3>
              <button 
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* User Profile summary */}
              <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 rounded-xl p-3">
                <img src={selectedApp.user.avatar} className="w-11 h-11 rounded-full object-cover border border-white shadow shadow-slate-200" alt="" />
                <div className="min-w-0">
                  <span className="font-extrabold text-slate-800 text-xs leading-none block">{selectedApp.user.name}</span>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[7px] font-bold mt-1 ${
                    selectedApp.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-600'
                      : selectedApp.status === 'Pending'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-rose-50 text-rose-500'
                  }`}>{selectedApp.status}</span>
                  <span className="text-[8px] text-slate-400 font-semibold block mt-1 select-text truncate">{selectedApp.user.email}</span>
                </div>
              </div>

              {/* Document details sheet metadata */}
              <div className="space-y-3 bg-[#FCFAF8] p-4 rounded-xl border border-slate-100/60 text-[10px] font-bold text-slate-600">
                <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                  <span className="text-slate-400 font-medium">Document Type</span>
                  <span className="font-bold text-slate-850">{selectedApp.docType}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                  <span className="text-slate-400 font-medium">Document Number</span>
                  <span className="font-bold text-slate-850 select-text uppercase">{selectedApp.docNo}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                  <span className="text-slate-400 font-medium">Issue Date</span>
                  <span className="font-bold text-slate-800">{selectedApp.issueDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Expiry Date</span>
                  <span className="font-bold text-slate-800">{selectedApp.expiryDate}</span>
                </div>
              </div>

              {/* Uploaded attachment slots */}
              <div className="space-y-2.5">
                <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Uploaded Documents</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Card front slot */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col relative group">
                    <img src={selectedApp.frontImage} className="w-full h-20 object-cover" alt="" />
                    <div className="p-2 text-[8px] font-bold text-slate-500">
                      <span className="block text-slate-700 truncate">Doc Front Page</span>
                      <span className="block text-[7px] text-slate-400 mt-0.5 leading-none">25 May 2025</span>
                    </div>
                    <button 
                      onClick={() => setViewFullImage(selectedApp.frontImage)}
                      className="absolute right-2 top-2 p-1.5 bg-black/60 hover:bg-black/85 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Eye size={10} />
                    </button>
                  </div>

                  {/* Card back slot */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col relative group">
                    <img src={selectedApp.backImage} className="w-full h-20 object-cover" alt="" />
                    <div className="p-2 text-[8px] font-bold text-slate-500">
                      <span className="block text-slate-700 truncate">Doc Back Page</span>
                      <span className="block text-[7px] text-slate-400 mt-0.5 leading-none">25 May 2025</span>
                    </div>
                    <button 
                      onClick={() => setViewFullImage(selectedApp.backImage)}
                      className="absolute right-2 top-2 p-1.5 bg-black/60 hover:bg-black/85 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Eye size={10} />
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Sticky Actions */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex-shrink-0 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <button 
                  onClick={() => handleApprove(selectedApp.id)}
                  disabled={selectedApp.status === 'Approved'}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-emerald-500 hover:bg-emerald-50/20 text-emerald-600 rounded-xl disabled:opacity-55 disabled:cursor-not-allowed transition-all"
                >
                  <Check size={12} />
                  <span>Approve</span>
                </button>
                <button 
                  onClick={() => handleReject(selectedApp.id)}
                  disabled={selectedApp.status === 'Rejected'}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-rose-500 hover:bg-rose-50/20 text-rose-500 rounded-xl disabled:opacity-55 disabled:cursor-not-allowed transition-all"
                >
                  <X size={12} />
                  <span>Reject</span>
                </button>
              </div>

              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-[#FA5A24]/40 hover:bg-[#FA5A24]/5 text-[#FA5A24] bg-white rounded-xl text-[10px] font-bold transition-all">
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
              className="absolute -top-12 right-0 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors flex items-center justify-center"
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
