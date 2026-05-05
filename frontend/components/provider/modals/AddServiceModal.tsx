"use client";

import React, { useState } from 'react';
import Modal from '@/components/admin/common/Modal';
import { Upload, Plus, X, Sparkles, Clock, Zap } from 'lucide-react';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddServiceModal({ isOpen, onClose }: AddServiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    priceRange: '',
    duration: '',
    description: '',
    isFeatured: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("New Service Data:", formData);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add New Service"
      size="lg"
      footer={
        <>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Service
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Placeholder */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Service Cover Image</label>
          <div className="h-48 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:bg-slate-100/50 transition-all">
            <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-all">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-slate-400">Click to upload or drag and drop</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Service Name</label>
            <input 
              type="text"
              placeholder="e.g. Deep Home Cleaning"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
            <select 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary outline-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select Category</option>
              <option value="cleaning">Cleaning</option>
              <option value="repair">Repair</option>
              <option value="painting">Painting</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="h-3 w-3 text-primary" />
              Price Range
            </label>
            <input 
              type="text"
              placeholder="e.g. ₹1,999 - ₹4,499"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary outline-none"
              value={formData.priceRange}
              onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-3 w-3 text-primary" />
              Service Duration
            </label>
            <input 
              type="text"
              placeholder="e.g. 4 - 6 Hours"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary outline-none"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Service Description</label>
          <textarea 
            rows={4}
            placeholder="Describe what's included in this service..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary outline-none resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <input 
            type="checkbox"
            id="featured"
            className="h-5 w-5 rounded border-amber-300 text-amber-500 focus:ring-amber-500"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
          />
          <label htmlFor="featured" className="flex items-center gap-2 text-sm font-bold text-amber-900 cursor-pointer">
            <Sparkles className="h-4 w-4" />
            Mark as Featured Service
          </label>
        </div>
      </form>
    </Modal>
  );
}
