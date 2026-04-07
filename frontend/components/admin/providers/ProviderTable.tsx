"use client";

import React, { useState, useEffect } from 'react';
import {
  Search, Filter, RefreshCcw, UserPlus, Briefcase, ChevronLeft, ChevronRight,
  MapPin, Star, ShieldCheck, Eye, Trash2, Ban, UserCheck, UserX, FileWarning,
  Power, Award, FileSearch, RotateCcw, ShieldAlert, CheckCircle2, MoreHorizontal
} from 'lucide-react';
import { Provider } from '../types';
import ApprovalModal from './ApprovalModal';
import Table from '../common/Table';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const DUMMY_PROVIDERS: Provider[] = [
  {
    id: 1, providerId: 'SP-1023', name: 'Ravi Kumar', email: 'ravi@example.com', phone: '+91 98765 43210',
    service: 'Electrician', location: 'Mumbai', experience: 5, rating: 4.8, status: 'Approved', joinedDate: '10 Jan 2025',
    idVerified: true, expVerified: true, docsRequested: false, active: true
  },
  {
    id: 2, providerId: 'SP-1024', name: 'Sunita Sharma', email: 'sunita@example.com', phone: '+91 98765 43211',
    service: 'Cleaning', location: 'Delhi', experience: 3, rating: 4.5, status: 'Pending', joinedDate: '14 Feb 2025',
    idVerified: false, expVerified: false, docsRequested: true, active: false
  },
  {
    id: 3, providerId: 'SP-1025', name: 'Arjun Mehta', email: 'arjun@example.com', phone: '+91 98765 43212',
    service: 'Plumbing', location: 'Bangalore', experience: 7, rating: 4.2, status: 'Pending', joinedDate: '20 Mar 2025',
    idVerified: true, expVerified: false, docsRequested: false, active: false
  },
  {
    id: 4, providerId: 'SP-1026', name: 'Priya Nair', email: 'priya@example.com', phone: '+91 98765 43213',
    service: 'Carpentry', location: 'Chennai', experience: 4, rating: 4.9, status: 'Approved', joinedDate: '02 Apr 2025',
    idVerified: true, expVerified: true, docsRequested: false, active: true
  },
  {
    id: 5, providerId: 'SP-1027', name: 'Deepak Rao', email: 'deepak@example.com', phone: '+91 98765 43214',
    service: 'Painting', location: 'Hyderabad', experience: 6, rating: 3.8, status: 'Rejected', joinedDate: '05 Apr 2025',
    idVerified: false, expVerified: false, docsRequested: false, active: false
  },
  {
    id: 6, providerId: 'SP-1028', name: 'Kavya Iyer', email: 'kavya@example.com', phone: '+91 98765 43215',
    service: 'AC Repair', location: 'Pune', experience: 5, rating: 4.6, status: 'Pending', joinedDate: '06 Apr 2025',
    idVerified: false, expVerified: true, docsRequested: false, active: false
  },
  {
    id: 7, providerId: 'SP-1029', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98765 43216',
    service: 'Electrician', location: 'Mumbai', experience: 8, rating: 4.7, status: 'Approved', joinedDate: '08 Apr 2025',
    idVerified: true, expVerified: true, docsRequested: false, active: true
  },
];

const ProviderTable: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const filtered = DUMMY_PROVIDERS.filter(p => {
    const matchStatus = activeTab === 'All' || p.status === activeTab;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.providerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);
    const matchLocation = locationFilter === 'All' || p.location === locationFilter;
    const matchService = serviceFilter === 'All' || p.service === serviceFilter;
    return matchStatus && matchSearch && matchLocation && matchService;
  });

  // Stats
  const totalProviders = DUMMY_PROVIDERS.length;
  const pendingCount = DUMMY_PROVIDERS.filter(p => p.status === 'Pending').length;
  const approvedCount = DUMMY_PROVIDERS.filter(p => p.status === 'Approved').length;

  // Calculate slices
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentProviders = filtered.slice(indexOfFirstRow, indexOfLastRow);

  // Dynamic Column Logic
  const headers = activeTab === 'Pending'
    ? ['Name', 'Service', 'Location', 'Tenure', 'Compliance', 'Status']
    : (activeTab === 'Approved' || activeTab === 'Rejected')
      ? ['Name', 'Service', 'Location', 'Tenure', 'Status', 'Operations']
      : ['Name', 'Service', 'Location', 'Tenure', 'Compliance', 'Status', 'Operations'];

  const showCompliance = headers.includes('Compliance');
  const showOperations = headers.includes('Operations');

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, locationFilter, serviceFilter]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Simplified Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Provider<span className="text-blue-600">s</span></h1>
      </div>

      {/* Control Rail - High Precision Filters */}
      <div className="space-y-6">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search experts (Name, ID, Phone)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 focus:border-blue-200 focus:ring-4 focus:ring-blue-100/50 rounded-2xl text-[11px] font-bold text-gray-800 transition-all duration-300 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <select
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 appearance-none focus:outline-none focus:border-blue-200 shadow-sm cursor-pointer w-full"
              >
                <option value="All">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <select
                onChange={(e) => setServiceFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 appearance-none focus:outline-none focus:border-blue-200 shadow-sm cursor-pointer w-full"
              >
                <option value="All">All Services</option>
                <option value="Electrician">Electrician</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Plumbing">Plumbing</option>
              </select>
            </div>
            <Button variant="primary" size="sm" icon={UserPlus} className="shadow-lg bg-blue-600 text-[10px] py-3 rounded-2xl hidden md:flex">Invite Expert</Button>
          </div>
        </div>

        {/* Workflow Tabs */}
        <div className="flex border-b border-gray-100 items-end gap-1 px-1">
          {(['Pending', 'Approved', 'Rejected', 'All'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab === 'Pending' && <span className="mr-2 px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded-md text-[8px]">{pendingCount}</span>}
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Partner Registry Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[460px] flex flex-col">
        <div className="flex-1">
          <Table
            headers={headers}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {currentProviders.map((provider) => (
                <motion.tr
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={provider.id}
                  className="hover:bg-blue-50/20 transition-all group/row border-b border-gray-50 last:border-0 text-[11px]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={provider.avatar || `https://ui-avatars.com/api/?name=${provider.name}&background=EFF6FF&color=2563EB&bold=true`}
                          alt={provider.name}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover/row:ring-blue-100 transition-all"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${provider.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 group-hover/row:text-blue-600 transition-colors uppercase tracking-tight">{provider.name}</span>
                        <span className="text-[8px] font-black text-gray-400 tracking-[0.1em]">{provider.providerId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="scale-90 origin-left">
                      <Badge variant="neutral">
                        {provider.service}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-bold uppercase text-[9px] tracking-widest">{provider.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-900 font-black">
                      <Award size={14} className="text-blue-600" />
                      <span>{provider.experience} Yrs</span>
                    </div>
                  </td>
                  {showCompliance && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedProvider(provider)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-300 group/verify shadow-sm active:scale-95"
                      >
                        <ShieldCheck size={14} className="group-hover/verify:rotate-12 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verify Docs</span>
                      </button>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <Badge variant={provider.status === 'Approved' ? 'success' : provider.status === 'Pending' ? 'warning' : provider.status === 'Blocked' ? 'neutral' : 'danger'}>
                      {provider.status}
                    </Badge>
                  </td>
                  {showOperations && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {provider.status !== 'Pending' && (
                          <>
                            {provider.status === 'Approved' ? (
                              <>
                                <button onClick={() => setSelectedProvider(provider)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View"><Eye size={14} /></button>
                                <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-all" title="Deactivate"><Power size={14} /></button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => setSelectedProvider(provider)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View"><Eye size={14} /></button>
                                <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Reconsider"><RotateCcw size={14} /></button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </Table>
        </div>

        {/* Global Pagination Rail - Centered */}
        <div className="p-5 border-t border-gray-50 flex flex-col items-center gap-6 bg-gray-50/30">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-blue-600 disabled:opacity-30 shadow-sm transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm border ${currentPage === page
                      ? "bg-blue-600 text-white border-blue-600 shadow-blue-600/20"
                      : "bg-white text-gray-400 border-gray-100 hover:border-blue-200"
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-blue-600 disabled:opacity-30 shadow-sm transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              </div>

            </div>
          </div>
        </div>
      </div>

      <ApprovalModal provider={selectedProvider} onClose={() => setSelectedProvider(null)} />
    </div>
  );
};

export default ProviderTable;
