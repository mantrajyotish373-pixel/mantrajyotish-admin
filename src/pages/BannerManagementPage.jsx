import React, { useState, useMemo } from 'react';
import { 
  Image, 
  CheckCircle, 
  Pause, 
  Eye, 
  Search, 
  Calendar, 
  Download, 
  Pencil, 
  Trash, 
  Plus, 
  X,
  Smartphone,
  Monitor,
  Layout,
  Link,
  PlusCircle,
  Copy,
  SlidersHorizontal,
  FileText
} from 'lucide-react';

// Banners mock list matching screenshot
const initialBanners = [
  {
    id: 1,
    name: 'Chat with Expert',
    desc: 'Banner for chat service promotion',
    placement: 'Home - Top',
    device: 'Mobile + Web',
    status: 'Active',
    startDate: '01 May 2025',
    endDate: '31 May 2025',
    impressions: '45,680',
    clicks: '2,356',
    redirectLink: '/chat',
    bgGradient: 'from-violet-900 via-indigo-900 to-indigo-950',
    titleText: 'Chat with Expert',
    subtitleText: 'Astrologers',
    ctaText: 'Chat Now',
    tagline: 'Get answers to your life questions'
  },
  {
    id: 2,
    name: 'Call Now Banner',
    desc: 'Promote call consultation',
    placement: 'Home - Top',
    device: 'Mobile',
    status: 'Active',
    startDate: '01 May 2025',
    endDate: '31 May 2025',
    impressions: '32,450',
    clicks: '1,856',
    redirectLink: '/call',
    bgGradient: 'from-sky-900 via-blue-900 to-slate-900',
    titleText: 'Talk to Astrologers',
    subtitleText: 'Over a Call',
    ctaText: 'Call Now',
    tagline: 'First Call Free'
  },
  {
    id: 3,
    name: 'Daily Horoscope',
    desc: 'Horoscope feature banner',
    placement: 'Home - Middle',
    device: 'Mobile + Web',
    status: 'Active',
    startDate: '01 May 2025',
    endDate: '31 May 2025',
    impressions: '28,560',
    clicks: '1,256',
    redirectLink: '/horoscope',
    bgGradient: 'from-amber-950 via-purple-950 to-slate-950',
    titleText: 'Daily Horoscope',
    subtitleText: 'Know your stars',
    ctaText: 'Check Now',
    tagline: 'What stars have in store for you'
  },
  {
    id: 4,
    name: 'Live Astro',
    desc: 'Live session promotion',
    placement: 'Home - Middle',
    device: 'Mobile',
    status: 'Inactive',
    startDate: '15 Apr 2025',
    endDate: '30 Apr 2025',
    impressions: '12,450',
    clicks: '632',
    redirectLink: '/live',
    bgGradient: 'from-rose-950 via-[#FA5A24]/90 to-amber-950',
    titleText: 'Live Consultation',
    subtitleText: 'Join Now',
    ctaText: 'Watch Live',
    tagline: 'Connect with stars live'
  },
  {
    id: 5,
    name: 'Offer Banner',
    desc: 'Discount offer on booking',
    placement: 'Home - Bottom',
    device: 'Mobile + Web',
    status: 'Active',
    startDate: '01 May 2025',
    endDate: '31 May 2025',
    impressions: '62,780',
    clicks: '3,450',
    redirectLink: '/offers',
    bgGradient: 'from-emerald-950 via-teal-900 to-slate-900',
    titleText: 'Special Offer',
    subtitleText: 'Up to 50% Off',
    ctaText: 'Book Now',
    tagline: 'Get 50% discount on your first booking'
  },
  {
    id: 6,
    name: 'Ask Question',
    desc: 'Q&A feature promotion',
    placement: 'Home - Bottom',
    device: 'Mobile',
    status: 'Inactive',
    startDate: '10 Apr 2025',
    endDate: '25 Apr 2025',
    impressions: '8,340',
    clicks: '420',
    redirectLink: '/ask',
    bgGradient: 'from-slate-900 via-slate-800 to-zinc-950',
    titleText: 'Ask Any Question',
    subtitleText: 'Get detailed answers',
    ctaText: 'Ask Now',
    tagline: 'Ask questions to senior astrologers'
  }
];

const BannerManagementPage = () => {
  const [banners, setBanners] = useState(initialBanners);
  const [searchQuery, setSearchQuery] = useState('');
  const [placementFilter, setPlacementFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deviceFilter, setDeviceFilter] = useState('All');
  
  // Selected banner for preview drawer
  const [selectedBanner, setSelectedBanner] = useState(initialBanners[0]);

  // Form states for creating a new banner
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPlacement, setNewPlacement] = useState('Home - Top');
  const [newDevice, setNewDevice] = useState('Mobile + Web');
  const [newRedirect, setNewRedirect] = useState('/chat');
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCta, setNewCta] = useState('Explore Now');

  // Stats
  const stats = useMemo(() => {
    const total = banners.length;
    const active = banners.filter(b => b.status === 'Active').length;
    const inactive = banners.filter(b => b.status === 'Inactive').length;
    return { total, active, inactive };
  }, [banners]);

  // Filters logic
  const filteredBanners = useMemo(() => {
    return banners.filter(b => {
      const matchesSearch = 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPlacement = placementFilter === 'All' || b.placement === placementFilter;
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchesDevice = deviceFilter === 'All' || b.device === deviceFilter;

      return matchesSearch && matchesPlacement && matchesStatus && matchesDevice;
    });
  }, [banners, searchQuery, placementFilter, statusFilter, deviceFilter]);

  // Create Banner
  const handleCreateBanner = (e) => {
    e.preventDefault();
    if (!newName || !newTitle || !newSubtitle) return;

    // Pick random gradient color scheme
    const gradients = [
      'from-violet-900 via-indigo-900 to-indigo-950',
      'from-sky-900 via-blue-900 to-slate-900',
      'from-amber-950 via-purple-950 to-slate-950',
      'from-emerald-950 via-teal-900 to-slate-900'
    ];
    const pickedGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newBannerItem = {
      id: Date.now(),
      name: newName,
      desc: newDesc || 'Custom Promotion Banner',
      placement: newPlacement,
      device: newDevice,
      status: 'Active',
      startDate: '01 May 2025',
      endDate: '31 May 2025',
      impressions: '0',
      clicks: '0',
      redirectLink: newRedirect,
      bgGradient: pickedGradient,
      titleText: newTitle,
      subtitleText: newSubtitle,
      ctaText: newCta,
      tagline: newTagline
    };

    setBanners(prev => [newBannerItem, ...prev]);
    setSelectedBanner(newBannerItem);
    setIsAddOpen(false);

    // Reset fields
    setNewName('');
    setNewDesc('');
    setNewTitle('');
    setNewSubtitle('');
    setNewTagline('');
  };

  // Delete Banner
  const handleDelete = (id) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    if (selectedBanner?.id === id) {
      setSelectedBanner(null);
    }
  };

  // Toggle status (Pause / Activate)
  const handleToggleStatus = (id) => {
    setBanners(prev => prev.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'Active' ? 'Inactive' : 'Active';
        return { ...b, status: nextStatus };
      }
      return b;
    }));
    if (selectedBanner?.id === id) {
      setSelectedBanner(prev => ({
        ...prev,
        status: prev.status === 'Active' ? 'Inactive' : 'Active'
      }));
    }
  };

  // Duplicate Banner
  const handleDuplicate = (banner) => {
    const duplicated = {
      ...banner,
      id: Date.now(),
      name: `${banner.name} (Copy)`,
      impressions: '0',
      clicks: '0'
    };
    setBanners(prev => [duplicated, ...prev]);
    setSelectedBanner(duplicated);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full w-full select-none pb-8">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 flex-shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
            Banner Management <span className="text-[#FA5A24]">✨</span>
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#FA5A24]">Banner Management</span>
          </div>
        </div>

        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FA5A24] text-white rounded-xl text-xs font-bold hover:bg-orange-600 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Split Columns Grid Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch overflow-hidden w-full min-h-0">
        
        {/* Left Side: Table & Filters */}
        <div className="flex-grow flex flex-col overflow-hidden min-h-0 bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
          
          {/* Header Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 flex-shrink-0">
            {[
              { label: 'Total Banners', value: stats.total, trend: '▲ 14.6%', color: 'bg-orange-50 text-orange-500', icon: Image },
              { label: 'Active Banners', value: stats.active, trend: '▲ 18.7%', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
              { label: 'Inactive Banners', value: stats.inactive, trend: '▼ 7.3%', color: 'bg-amber-50 text-amber-500', icon: Pause },
              { label: 'Total Impressions', value: '2,45,680', trend: '▲ 22.4%', color: 'bg-rose-50 text-rose-500', icon: Eye }
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-50/50 border border-slate-100/60 rounded-xl p-3.5 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color} flex-shrink-0`}>
                  <stat.icon size={16} />
                </div>
                <div>
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-extrabold text-slate-800" style={{ fontFamily: 'Outfit' }}>{stat.value}</span>
                    <span className="text-[8px] font-extrabold text-slate-400">{stat.percent || stat.trend}</span>
                  </div>
                  <span className="text-[7px] text-slate-400 font-semibold block">this month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filtering bar */}
          <div className="flex flex-col xl:flex-row items-center gap-3 justify-between mb-5 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
              
              {/* Search input */}
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search banner name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#FCFAF8] border border-slate-200 text-xs rounded-xl outline-none focus:border-orange-200 focus:bg-white font-medium text-slate-700 transition-all duration-200"
                />
              </div>

              {/* Placement Filter */}
              <div className="relative w-full sm:w-36">
                <select
                  value={placementFilter}
                  onChange={(e) => setPlacementFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
                >
                  <option value="All">All Placement</option>
                  <option value="Home - Top">Home - Top</option>
                  <option value="Home - Middle">Home - Middle</option>
                  <option value="Home - Bottom">Home - Bottom</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
              </div>

              {/* Status Select */}
              <div className="relative w-full sm:w-32">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
              </div>

              {/* Device Select */}
              <div className="relative w-full sm:w-32">
                <select
                  value={deviceFilter}
                  onChange={(e) => setDeviceFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow"
                >
                  <option value="All">All Device</option>
                  <option value="Mobile + Web">Mobile + Web</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Web">Web</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
              </div>

              {/* Datepicker */}
              <div className="relative w-full sm:w-48">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <select className="w-full pl-8 pr-4 py-2 bg-[#FCFAF8] border border-slate-200 text-xs text-slate-600 rounded-xl outline-none appearance-none font-bold select-dropdown-arrow">
                  <option>01 May 2025 - 31 May 2025</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
              </div>

            </div>

            <button className="w-full xl:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-[#FA5A24]/40 hover:bg-[#FA5A24]/5 text-[#FA5A24] rounded-xl text-xs font-bold transition-all">
              <SlidersHorizontal size={13} />
              <span>Filters</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="flex-grow overflow-y-auto min-h-0">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[9px] font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-3">Banner</th>
                  <th className="py-3 px-3">Banner Name</th>
                  <th className="py-3 px-3">Placement</th>
                  <th className="py-3 px-3">Device</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Schedule</th>
                  <th className="py-3 px-3">Impressions</th>
                  <th className="py-3 px-3">Clicks</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70 text-xs text-slate-700 font-semibold">
                {filteredBanners.length > 0 ? (
                  filteredBanners.map((banner) => {
                    const isSelected = selectedBanner?.id === banner.id;
                    return (
                      <tr 
                        key={banner.id} 
                        onClick={() => setSelectedBanner(banner)}
                        className={`hover:bg-slate-50/40 transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#FFF5F1]/30' : ''
                        }`}
                      >
                        
                        {/* Banner graphic preview mockup inside table row */}
                        <td className="py-3 px-3">
                          <div className={`w-16 h-10 rounded bg-gradient-to-br ${banner.bgGradient} flex flex-col items-center justify-center text-[5px] text-white p-1 overflow-hidden shadow-sm relative font-bold`}>
                            <span className="leading-tight block uppercase text-center">{banner.titleText}</span>
                            <span className="scale-[0.8] leading-none text-white/70 block mt-0.5 text-center">{banner.subtitleText}</span>
                          </div>
                        </td>

                        {/* Banner Name & Info */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-slate-800 leading-tight">{banner.name}</span>
                            <span className="text-[9px] text-slate-400 font-bold mt-0.5 leading-none">{banner.desc}</span>
                          </div>
                        </td>

                        {/* Placement location */}
                        <td className="py-3 px-3 text-slate-650 font-bold">{banner.placement}</td>

                        {/* Device type */}
                        <td className="py-3 px-3 text-slate-500 font-bold">{banner.device}</td>

                        {/* Status badges */}
                        <td className="py-3 px-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider ${
                            banner.status === 'Active'
                              ? 'bg-[#E6F4EA] text-[#137333]'
                              : 'bg-red-50 text-red-650'
                          }`}>
                            {banner.status}
                          </span>
                        </td>

                        {/* Schedule Timing */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 leading-none">{banner.startDate}</span>
                            <span className="text-[9px] text-slate-400 font-bold mt-1 leading-none">{banner.endDate}</span>
                          </div>
                        </td>

                        {/* Impressions */}
                        <td className="py-3 px-3 text-slate-800 font-extrabold">{banner.impressions}</td>

                        {/* Clicks */}
                        <td className="py-3 px-3 text-slate-800 font-extrabold">{banner.clicks}</td>

                        {/* Action buttons */}
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => setSelectedBanner(banner)}
                              className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                            >
                              <Pencil size={11} />
                            </button>
                            <button 
                              onClick={() => handleDelete(banner.id)}
                              className="p-1.5 border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-650 rounded-lg transition-colors"
                            >
                              <Trash size={11} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400 font-bold">
                      No banners found matching your selected query parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table pagination footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 mt-4 border-t border-slate-100 flex-shrink-0">
            <span className="text-[10px] text-slate-400 font-bold">
              Showing 1 to {filteredBanners.length} of {banners.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-extrabold hover:bg-slate-50">&lt;</button>
              <button className="px-3 py-1 bg-[#FA5A24] text-white rounded-lg text-[10px] font-extrabold">1</button>
              <button className="px-3 py-1 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-extrabold hover:bg-slate-50">2</button>
              <span className="px-0.5 text-slate-450 text-[10px]">...</span>
              <button className="px-3 py-1 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-extrabold hover:bg-slate-50">4</button>
              <button className="px-2 py-1 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-extrabold hover:bg-slate-50">&gt;</button>
            </div>
          </div>

        </div>

        {/* Right Side: Sticky Preview & Details Drawer Card */}
        {selectedBanner && (
          <div className="w-full lg:w-[320px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-shrink-0 flex flex-col h-full animate-in slide-in-from-right-4 duration-200">
            
            {/* Title */}
            <div className="flex items-center justify-between p-4.5 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider" style={{ fontFamily: 'Outfit' }}>Banner Preview</h3>
              <button 
                onClick={() => setSelectedBanner(null)}
                className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Details and Preview graphic */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* Graphic Advertisement Container Mockup */}
              <div className="space-y-2">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Visual Live Preview</span>
                <div className={`w-full aspect-[16/10] bg-gradient-to-br ${selectedBanner.bgGradient} rounded-xl shadow-md p-4.5 flex flex-col justify-between text-white relative overflow-hidden select-none border border-black/10`}>
                  
                  {/* Decorative circular backgrounds */}
                  <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-white/5 pointer-events-none"></div>
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/5 pointer-events-none"></div>

                  <div className="space-y-1 z-10 relative">
                    <span className="inline-block px-1.5 py-0.5 bg-white/10 rounded text-[7px] font-extrabold uppercase tracking-wider mb-1 text-orange-200">
                      Promoted
                    </span>
                    <h3 className="text-sm font-extrabold leading-tight tracking-tight uppercase" style={{ fontFamily: 'Outfit' }}>
                      {selectedBanner.titleText}
                    </h3>
                    <h4 className="text-xs text-white/80 font-bold leading-none">
                      {selectedBanner.subtitleText}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between mt-4 z-10 relative">
                    <p className="text-[8px] text-white/60 font-medium max-w-[130px] leading-tight">
                      {selectedBanner.tagline || 'Special Promo details'}
                    </p>
                    <button className="px-2.5 py-1.5 bg-white text-slate-900 rounded-lg text-[9px] font-extrabold shadow-sm flex items-center hover:bg-slate-50 transition-colors whitespace-nowrap">
                      {selectedBanner.ctaText}
                    </button>
                  </div>

                </div>
              </div>

              {/* Specs metadata */}
              <div className="space-y-3 bg-[#FCFAF8] p-4 rounded-xl border border-slate-100/60 text-[10px] font-bold text-slate-650">
                
                <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                  <span className="text-slate-400 font-medium flex items-center gap-1"><FileText size={12} /> Banner Name</span>
                  <span className="font-extrabold text-slate-800 truncate max-w-[130px]">{selectedBanner.name}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                  <span className="text-slate-400 font-medium flex items-center gap-1"><Layout size={12} /> Placement</span>
                  <span className="font-extrabold text-slate-800">{selectedBanner.placement}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    {selectedBanner.device.includes('Mobile') ? <Smartphone size={12} /> : <Monitor size={12} />} 
                    <span> Device</span>
                  </span>
                  <span className="font-extrabold text-slate-800">{selectedBanner.device}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                  <span className="text-slate-400 font-medium flex items-center gap-1">Status</span>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    selectedBanner.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                  }`}>{selectedBanner.status}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100/40 pb-2">
                  <span className="text-slate-400 font-medium flex items-center gap-1"><Calendar size={12} /> Schedule</span>
                  <span className="font-bold text-slate-700 text-[9px]">{selectedBanner.startDate} - {selectedBanner.endDate}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1"><Link size={12} /> Redirect Link</span>
                  <span className="text-indigo-600 font-bold hover:underline cursor-pointer">{selectedBanner.redirectLink}</span>
                </div>

              </div>

            </div>

            {/* Actions button */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex-shrink-0 space-y-2">
              <button 
                onClick={() => handleToggleStatus(selectedBanner.id)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-[#FA5A24]/40 hover:bg-[#FA5A24]/5 text-[#FA5A24] bg-white rounded-xl text-[10px] font-bold transition-all"
              >
                <Pause size={12} />
                <span>{selectedBanner.status === 'Active' ? 'Pause Banner' : 'Activate Banner'}</span>
              </button>

              <button 
                onClick={() => handleDuplicate(selectedBanner)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-indigo-500/40 hover:bg-indigo-50/20 text-indigo-650 bg-white rounded-xl text-[10px] font-bold transition-all"
              >
                <Copy size={12} />
                <span>Duplicate Banner</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Create New Banner Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateBanner} className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <PlusCircle size={16} className="text-[#FA5A24]" />
                <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Outfit' }}>Add New Promotion Banner</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Input elements scroll container */}
            <div className="p-5 overflow-y-auto space-y-4 max-h-[60vh] text-xs font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Banner Name (Internal)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chat promo, First call free"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Description</label>
                <input
                  type="text"
                  placeholder="Brief summary notes"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Placement Slot</label>
                  <select
                    value={newPlacement}
                    onChange={(e) => setNewPlacement(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-850 font-bold"
                  >
                    <option value="Home - Top">Home - Top</option>
                    <option value="Home - Middle">Home - Middle</option>
                    <option value="Home - Bottom">Home - Bottom</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Target Devices</label>
                  <select
                    value={newDevice}
                    onChange={(e) => setNewDevice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-850 font-bold"
                  >
                    <option value="Mobile + Web">Mobile + Web</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Web">Web</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Action Redirect Link</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /chat, /offers"
                  value={newRedirect}
                  onChange={(e) => setNewRedirect(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl outline-none text-slate-800 font-bold"
                />
              </div>

              {/* Graphic Mockup Title values */}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Graphic Customization</span>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 block font-bold">Headline (Graphic Title)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Talk to Astrologers, Special Offer"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl outline-none text-slate-800 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 block font-bold">Sub-headline</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Over a Call, Up to 50% Off"
                      value={newSubtitle}
                      onChange={(e) => setNewSubtitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl outline-none text-slate-800 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 block font-bold">Button Text</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Call Now, Book Now"
                      value={newCta}
                      onChange={(e) => setNewCta(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl outline-none text-slate-800 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 block font-bold">Tagline (Small details text)</label>
                  <input
                    type="text"
                    placeholder="e.g. First call free, What stars have in store..."
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl outline-none text-slate-800 font-bold"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
              <button 
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-xl text-[11px] font-bold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 bg-[#FA5A24] hover:bg-orange-600 text-white rounded-xl text-[11px] font-bold shadow-md transition-colors"
              >
                Add Banner
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default BannerManagementPage;
