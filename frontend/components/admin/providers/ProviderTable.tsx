"use client";

import React, { useState, useEffect } from 'react';
import {
  Search, Filter, RefreshCcw, UserPlus, Briefcase, ChevronLeft, ChevronRight, ChevronDown,
  MapPin, Star, ShieldCheck, Eye, Trash2, Ban, UserCheck, UserX, FileWarning,
  Power, Award, FileSearch, RotateCcw, ShieldAlert, CheckCircle2, MoreHorizontal
} from 'lucide-react';
import { Provider } from '../types';
import ApprovalModal from './ApprovalModal';
import InviteExpertModal from './InviteExpertModal';
import ProviderDetailsModal from './ProviderDetailsModal';
import Table from '../common/Table';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '@/config/api';

// ... Removed DUMMY_PROVIDERS ...

const ProviderTable: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isServiceFilterOpen, setIsServiceFilterOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      console.log('ProviderTable: Initiating data fetch...');
      await fetchCategories();
      await fetchProviders();
    };
    loadData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      console.log('Fetched Categories Raw:', response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setCategories(response.data);
      } else {
        console.warn('Categories API returned empty or invalid data');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/providers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched Providers:', response.data);
      setProviders(response.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const filtered = providers.filter(p => {
    const matchStatus = activeTab === 'All' || p.status === activeTab;
    const matchSearch = (p.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (p.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (p.user_id?.phone?.includes(searchTerm) ?? false);
    const matchLocation = locationFilter === 'All' || p.location === locationFilter;
    const matchService = serviceFilter === 'All' || (p.services && p.services.some(s => s.service_name === serviceFilter));
    return matchStatus && matchSearch && matchLocation && matchService;
  });

  // Stats
  const totalProviders = providers.length;
  const pendingCount = providers.filter(p => p.status === 'Pending').length;
  const approvedCount = providers.filter(p => p.status === 'Approved').length;

  // Calculate slices
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentProviders = filtered.slice(indexOfFirstRow, indexOfLastRow);

  // Dynamic Column Logic
  const headers = activeTab === 'Pending'
    ? ['Name', 'Services', 'Location', 'Tenure', 'Compliance', 'Status']
    : (activeTab === 'Approved' || activeTab === 'Rejected')
      ? ['Name', 'Services', 'Location', 'Tenure', 'Status', 'Operations']
      : ['Name', 'Services', 'Location', 'Tenure', 'Compliance', 'Status', 'Operations'];

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

  const handleAddProvider = (newProvider: Provider) => {
    setProviders([newProvider, ...providers]);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/providers/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProviders(providers.map(p => p._id === id ? response.data : p));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this provider?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/providers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProviders(providers.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting provider:', error);
    }
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
              <button
                onClick={() => setIsServiceFilterOpen(!isServiceFilterOpen)}
                className="flex items-center gap-3 pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 shadow-sm transition-all hover:border-gray-200 w-full"
              >
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <span className="truncate">{serviceFilter === 'All' ? 'All Services' : serviceFilter}</span>
                <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isServiceFilterOpen ? 'rotate-180' : ''}`} size={12} />
              </button>

              <AnimatePresence>
                {isServiceFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsServiceFilterOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        <div
                          onClick={() => { setServiceFilter('All'); setIsServiceFilterOpen(false); }}
                          className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-blue-50 transition-colors ${serviceFilter === 'All' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500'}`}
                        >
                          All Services
                        </div>
                        {categories.map((cat, idx) => {
                          const name = cat.category_name || cat.name || `Category ${idx + 1}`;
                          return (
                            <div
                              key={cat._id || idx}
                              onClick={() => {
                                setServiceFilter(name);
                                setIsServiceFilterOpen(false);
                              }}
                              className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-blue-50 transition-colors ${serviceFilter === name ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500'}`}
                            >
                              {name}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={UserPlus}
              onClick={() => setIsInviteModalOpen(true)}
              className="shadow-lg bg-blue-600 text-[10px] py-3 rounded-2xl hidden md:flex"
            >
              Invite Expert
            </Button>
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
                  key={provider._id}
                  className="hover:bg-blue-50/20 transition-all group/row border-b border-gray-50 last:border-0 text-[11px]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={provider.user_id?.profile_image || `https://ui-avatars.com/api/?name=${provider.user_id?.name || 'Expert'}&background=EFF6FF&color=2563EB&bold=true`}
                          alt={provider.user_id?.name || 'Provider'}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover/row:ring-blue-100 transition-all"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${provider.availability_status === 'available' ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </div>
                      <div className="flex flex-col">
                        <span 
                          onClick={() => setEditingProvider(provider)}
                          className="font-black text-gray-900 group-hover/row:text-blue-600 transition-colors uppercase tracking-tight cursor-pointer"
                        >
                          {provider.user_id?.name || 'Pending Identity'}
                        </span>
                        <span className="text-[8px] font-black text-gray-400 tracking-[0.1em]">#{String(provider._id).slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="scale-90 origin-left">
                      <Badge variant="neutral">
                        {provider.services?.[0]?.service_name || 'General'}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-bold uppercase text-[9px] tracking-widest">{provider.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-900 font-black">
                      <Award size={14} className="text-blue-600" />
                      <span>{provider.services?.[0]?.experience || 0} Yrs</span>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {provider.status !== 'Pending' && (
                          <>
                            {provider.status === 'Approved' ? (
                              <>
                                <button onClick={() => setSelectedProvider(provider)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View"><Eye size={14} /></button>
                                <button onClick={() => handleUpdateStatus(provider._id, 'Blocked')} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-all" title="Deactivate"><Power size={14} /></button>
                                <button onClick={() => handleDelete(provider._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete"><Trash2 size={14} /></button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => setSelectedProvider(provider)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View"><Eye size={14} /></button>
                                <button onClick={() => handleUpdateStatus(provider._id, 'Pending')} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Reconsider"><RotateCcw size={14} /></button>
                                <button onClick={() => handleDelete(provider._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete"><Trash2 size={14} /></button>
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

      <ApprovalModal
        provider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
        onUpdate={handleUpdateStatus}
      />
      <InviteExpertModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onAdd={handleAddProvider}
      />
      <ProviderDetailsModal
        isOpen={!!editingProvider}
        onClose={() => setEditingProvider(null)}
        provider={editingProvider}
        onUpdateComplete={() => {
          setEditingProvider(null);
          fetchProviders();
        }}
      />
    </div>
  );
};

export default ProviderTable;
