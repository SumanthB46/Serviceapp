"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Mail, Phone, Briefcase, User as UserIcon, Save, ShieldCheck, ChevronDown } from 'lucide-react';

interface InviteExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (provider: any) => void;
}

const InviteExpertModal: React.FC<InviteExpertModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: ''
  });
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const predefinedServices = ['Electrician', 'Plumbing', 'Cleaning', 'Carpentry', 'Painting', 'AC Repair', 'Pest Control', 'Appliance Repair'];
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
      providerId: `SP-${1000 + Math.floor(Math.random() * 1000)}`,
      status: 'Pending',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      location: 'Unassigned',
      experience: 0,
      rating: 0,
      idVerified: false,
      expVerified: false,
      docsRequested: true,
      active: false
    });
    setFormData({ name: '', email: '', phone: '', service: '' });
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
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-[0.1em]">Invite Service Expert</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            {/* Form Section Hub */}
            <div className="bg-[#F8FAFC] border border-gray-100 p-6 rounded-[2rem] space-y-4 relative group">
               {/* Background Icon Wrapper */}
               <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                 <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                    <UserPlus size={120} />
                 </div>
               </div>

               <div className="space-y-4 relative z-10">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <UserIcon size={12} className="text-blue-500" /> Full Name
                     </label>
                     <input 
                        type="text" 
                        required
                        placeholder="e.g. Rahul Sharma"
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
                           placeholder="rahul@nexus.com"
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

                  <div className="space-y-1 relative">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Briefcase size={12} className="text-blue-500" /> Service Category
                     </label>
                     <div className="relative">
                        <input
                           type="text"
                           required
                           placeholder="Select or type category..."
                           value={formData.service}
                           onChange={(e) => setFormData({...formData, service: e.target.value})}
                           onFocus={() => setIsServiceOpen(true)}
                           onBlur={() => setTimeout(() => setIsServiceOpen(false), 200)}
                           className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all pr-10"
                        />
                        <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-300 ${isServiceOpen ? 'rotate-180 text-blue-500' : ''}`} />
                        
                        <AnimatePresence>
                           {isServiceOpen && (
                              <motion.div 
                                 initial={{ opacity: 0, y: 5, scale: 0.98 }}
                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                 exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                 className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto"
                              >
                                 {predefinedServices.filter(s => s.toLowerCase().includes(formData.service.toLowerCase())).map((service) => (
                                    <div 
                                       key={service}
                                       onClick={() => setFormData({...formData, service})}
                                       className="px-4 py-3 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                                    >
                                       {service}
                                    </div>
                                 ))}
                                 {formData.service && !predefinedServices.some(s => s.toLowerCase() === formData.service.toLowerCase()) && (
                                    <div className="px-4 py-3 text-xs font-bold text-gray-500 italic border-t border-gray-50">
                                       Press Save to add "{formData.service}" as custom
                                    </div>
                                 )}
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 border-dashed">
               <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                     <ShieldCheck size={14} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Verification Protocol</p>
                     <p className="text-[10px] font-bold text-blue-600 leading-relaxed mt-1">An invitation link will be sent to the expert. They will appear in the "Pending" list until their documents are verified.</p>
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
                  <Save size={14} /> Send Invitation
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default InviteExpertModal;
