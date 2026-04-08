"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Mail, Phone, Shield, User as UserIcon, Save } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: any) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'OPERATIONAL'
  });
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Math.floor(Math.random() * 10000),
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    setFormData({ name: '', email: '', phone: '', status: 'OPERATIONAL' });
    onClose();
  };

  if (!mounted || !isOpen) return null;

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
          className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-[9999] border border-white/20 pointer-events-auto"
        >
          {/* Header */}
          <div className="px-8 pt-6 pb-2 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-[0.1em]">Onboard New Member</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            {/* Form Section Hub */}
            <div className="bg-[#F8FAFC] border border-gray-100 p-6 rounded-[2rem] space-y-4 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                  <UserPlus size={120} />
               </div>

               <div className="space-y-4 relative z-10">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <UserIcon size={12} className="text-blue-500" /> Full Name
                     </label>
                     <input 
                        type="text" 
                        required
                        placeholder="e.g. Alexander Pierce"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all"
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                           <Mail size={12} className="text-blue-500" /> Email Access
                        </label>
                        <input 
                           type="email" 
                           required
                           placeholder="alex@nexus.com"
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                           <Phone size={12} className="text-blue-500" /> Contact Link
                        </label>
                        <input 
                           type="tel" 
                           required
                           placeholder="+91 98765 43210"
                           value={formData.phone}
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                           className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Shield size={12} className="text-blue-500" /> Operational Status
                     </label>
                     <div className="flex gap-2">
                        {['OPERATIONAL', 'ONBOARDING', 'SUSPENDED'].map(status => (
                           <button
                              type="button"
                              key={status}
                              onClick={() => setFormData({...formData, status })}
                              className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                 formData.status === status 
                                 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                                 : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'
                              }`}
                           >
                              {status}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 border-dashed">
               <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                     <Shield size={14} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Security Protocol</p>
                     <p className="text-[10px] font-bold text-blue-600 leading-relaxed mt-1">A temporary verification link will be dispatched to the provided email address upon registration.</p>
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
               <button 
                  type="button"
                  onClick={onClose} 
                  className="flex-1 py-4 bg-[#F1F5F9] text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
               >
                  Cancel Entry
               </button>
               <button 
                  type="submit"
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                  <Save size={14} /> Commit to Registry
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default AddUserModal;
