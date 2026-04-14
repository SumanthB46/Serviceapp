"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Activity, IndianRupee, Layers } from 'lucide-react';

interface SubServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  subService: any | null;
  category: any;
  onSave: (subService: any) => void;
}

const SubServiceModal: React.FC<SubServiceModalProps> = ({ isOpen, onClose, subService, category, onSave }) => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    service_name: '',
    base_price: '',
    description: '',
    duration: '',
    image: '',
    status: 'active'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (subService) {
        setFormData({
          service_name: subService.service_name || '',
          base_price: String(subService.base_price) || '',
          description: subService.description || '',
          duration: String(subService.duration) || '',
          image: subService.image || '',
          status: subService.status || 'active'
        });
      } else {
        setFormData({
          service_name: '',
          base_price: '',
          description: '',
          duration: '',
          image: '',
          status: 'active'
        });
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, subService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...subService,
      service_name: formData.service_name,
      base_price: Number(formData.base_price),
      description: formData.description,
      duration: Number(formData.duration),
      image: formData.image,
      status: formData.status,
      category_id: category._id
    });
    onClose();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 pointer-events-none">
        {/* Backdrop */}
        <motion.div
          key="subservice-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        />

        {/* Modal Content */}
        <motion.div
          key="subservice-content"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-[9999] border border-white/20 pointer-events-auto"
        >
          {/* Header */}
          <div className="px-8 pt-6 pb-2 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-[0.1em]">
                {subService ? 'Edit Offering' : 'New Offering'}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Catalog: {category?.category_name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            {/* Form Section Hub */}
            <div className="bg-[#F8FAFC] border border-gray-100 p-6 rounded-[2rem] space-y-4 relative group">
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                  <Layers size={120} />
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                    <Layers size={12} className="text-blue-500" /> Service Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wire Fixes"
                    value={formData.service_name}
                    onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                    <X size={12} className="text-blue-500 rotate-45" /> Description
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Briefly describe this service..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                    <Layers size={12} className="text-blue-500" /> Image URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                      <IndianRupee size={12} className="text-blue-500" /> Pricing Matrix
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="299"
                        value={formData.base_price}
                        onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                      <Activity size={12} className="text-blue-500" /> Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all appearance-none"
                    >
                      <option value="active">Active (Live)</option>
                      <option value="inactive">Inactive (Offline)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                      <Activity size={12} className="text-blue-500" /> Duration (Mins)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="60"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-[#F1F5F9] text-gray-600 rounded-2xl text-[10px] font-black tracking-widest hover:bg-gray-200 transition-all"
              >
                Cancel Entry
              </button>
              <button
                type="submit"
                className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Save size={14} /> {subService ? 'Update Offering' : 'Deploy Offering'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default SubServiceModal;
