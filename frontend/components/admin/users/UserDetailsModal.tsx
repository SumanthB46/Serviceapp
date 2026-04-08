"use client";

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { createPortal } from 'react-dom';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { User } from '../types';
import { Mail, Phone, Calendar, Shield, History, MessageSquare, AlertCircle, ExternalLink, User as UserIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserDetailsModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'bookings' | 'complaints'>('profile');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !user) return null;

  const dummyBookings = [
    { id: '#BK-8821', service: 'AC Repair', date: '2026-03-15', status: 'Completed', amount: '₹1,200' },
    { id: '#BK-8822', service: 'House Cleaning', date: '2026-03-20', status: 'Pending', amount: '₹2,500' },
    { id: '#BK-8823', service: 'Plumbing', date: '2026-03-25', status: 'Cancelled', amount: '₹800' },
  ];

  const dummyComplaints = [
    { id: '#CP-102', subject: 'Late Service', date: '2026-03-16', status: 'Resolved', severity: 'Medium' },
    { id: '#CP-105', subject: 'Damage Reported', date: '2026-03-22', status: 'Active', severity: 'High' },
  ];

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 pointer-events-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-[9999] border border-white/20 pointer-events-auto"
        >
          {/* Header */}
          <div className="px-8 pt-4 pb-1 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-[0.1em]">User Portfolio Bureau</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="px-8 pb-6 space-y-5">
            {/* Essential Profile Card */}
            <div className="bg-[#F8FAFC] border border-gray-100 p-5 rounded-[2rem] flex items-center gap-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[9px] font-black rounded-full uppercase tracking-widest">{user.status}</span>
              </div>

              <div className="w-20 h-15 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-blue-200 uppercase">
                {user.name.split(' ').map((n: string) => n[0]).join('')}
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{user.name}</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">Registry ID: US-{user.id + 1000}</p>

                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Mail size={12} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <Phone size={12} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">{user.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Bureau */}
            <div className="flex gap-2 p-1.5 bg-[#F1F5F9] rounded-2xl">
              {[
                { id: 'profile', label: 'Identity Bureau', icon: UserIcon },
                { id: 'bookings', label: 'History Warehouse', icon: History },
                { id: 'complaints', label: 'Issue Tracker', icon: AlertCircle },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm border border-white'
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Viewport */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="min-h-[300px]"
            >
              {activeTab === 'profile' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-100 p-5 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Identity Bureau</span>
                      <Shield size={14} className="text-blue-500" />
                    </div>
                    <p className="text-[11px] font-bold text-gray-600 leading-relaxed uppercase tracking-wide">Standard inspection required for this high-volume account tier.</p>
                    <button className="flex items-center gap-2 text-[10px] font-black text-blue-600">
                      VIEW COMPLIANCE <ExternalLink size={10} />
                    </button>
                  </div>
                  <div className="bg-white border border-gray-100 p-5 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Credential Hub</span>
                      <Calendar size={14} className="text-green-500" />
                    </div>
                    <p className="text-[11px] font-bold text-gray-600 leading-relaxed uppercase tracking-wide">Account active since {user.joinedDate || 'March 2026'}.</p>
                    <button className="flex items-center gap-2 text-[10px] font-black text-green-600">
                      VIEW LOGS <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="bg-[#0F172A] rounded-[2rem] p-6 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <History size={150} />
                  </div>
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6">Historical Data Repository</h4>

                  {dummyBookings.length > 0 ? (
                    <div className="space-y-3 relative z-10">
                      {dummyBookings.map(bk => (
                        <div key={bk.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                              <Calendar size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">{bk.service}</p>
                              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{bk.id} • {bk.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-white">{bk.amount}</p>
                            <p className={`text-[8px] font-black uppercase tracking-tighter ${bk.status === 'Completed' ? 'text-green-400' : bk.status === 'Cancelled' ? 'text-red-400' : 'text-blue-400'}`}>
                              {bk.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center space-y-3 opacity-30">
                      <History size={48} className="mx-auto" />
                      <p className="text-xs font-bold uppercase tracking-widest">Zero transactions detected.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'complaints' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">User Issue Tracker</h4>
                    <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{dummyComplaints.length} Critical Issues</span>
                  </div>

                  {dummyComplaints.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {dummyComplaints.map(cp => (
                        <div key={cp.id} className="p-5 border border-gray-100 rounded-[1.5rem] bg-white hover:border-red-200 transition-all group">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cp.severity === 'High' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-500'}`}>
                                <MessageSquare size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-gray-800 tracking-tight">{cp.subject}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Case ID: {cp.id} • {cp.date}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${cp.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {cp.status}
                            </span>
                          </div>
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Analyze Case</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                      <Shield size={32} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Clean Compliance Record</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Operational Controls */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button onClick={onClose} className="flex-1 py-4 bg-[#F1F5F9] text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Close Pipeline</button>
              <button className="px-8 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:scale-105 transition-all">Terminate Account</button>
              <button className="px-8 py-4 bg-green-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-200 hover:scale-105 transition-all">Elevate Access</button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default UserDetailsModal;
