"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Save, Tag, Activity, Palette } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: any | null;
  onSave: (category: any) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, category, onSave }) => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    status: 'ON',
    colorTheme: 'blue'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (category) {
        setFormData({
          name: category.name || '',
          status: 'ON',
          colorTheme: category.bg ? category.bg.split('-')[1] || 'blue' : 'blue'
        });
      } else {
        setFormData({ name: '', status: 'ON', colorTheme: 'blue' });
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      // Pass back initial attributes if editing, otherwise stub defaults
      icon: category ? category.icon : Layers,
      serviceCount: category ? category.serviceCount : 0,
      color: `text-${formData.colorTheme}-600`,
      bg: `bg-${formData.colorTheme}-50`
    });
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
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-[0.1em]">
              {category ? 'Edit Category' : 'New Category'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Tag size={12} className="text-blue-500" /> Category Identity
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Electrical Services"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all uppercase"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Activity size={12} className="text-blue-500" /> Status
                    </label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all appearance-none"
                    >
                      <option value="ON">Operational (ON)</option>
                      <option value="OFF">Offline (OFF)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Palette size={12} className="text-blue-500" /> Color Theme
                    </label>
                    <select 
                      value={formData.colorTheme}
                      onChange={(e) => setFormData({...formData, colorTheme: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all appearance-none"
                    >
                      <option value="blue">Blue Spectrum</option>
                      <option value="cyan">Cyan Aqua</option>
                      <option value="purple">Purple Royal</option>
                      <option value="orange">Orange Bright</option>
                      <option value="yellow">Yellow Electric</option>
                      <option value="red">Red Alert</option>
                      <option value="green">Green Eco</option>
                    </select>
                  </div>
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
                Cancel Edit
              </button>
              <button 
                type="submit"
                className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Save size={14} /> {category ? 'Update Vertical' : 'Deploy Vertical'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default CategoryModal;
