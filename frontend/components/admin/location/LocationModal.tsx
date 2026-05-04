"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, MapPin, Globe2, Activity } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationState: any | null;
  onSave: (locationData: any) => void;
}

import axios from 'axios';
import { API_URL } from '@/config/api';

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, locationState, onSave }) => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'area' as 'city' | 'area',
    parent_id: '',
    state: 'Karnataka',
    country: 'India',
    pincode: '',
    latitude: 12.9716,
    longitude: 77.5946,
    status: 'active' as 'active' | 'inactive'
  });

  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchCities = async () => {
    try {
      const resp = await axios.get(`${API_URL}/locations`);
      setCities(resp.data.filter((l: any) => l.type === 'city'));
    } catch (e) {
      console.error('Error fetching cities in modal:', e);
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchCities();
      document.body.style.overflow = 'hidden';
      if (locationState) {
        setFormData({
          name: locationState.name || '',
          type: locationState.type || 'area',
          parent_id: typeof locationState.parent_id === 'object' ? locationState.parent_id?._id : (locationState.parent_id || ''),
          state: locationState.state || 'Karnataka',
          country: locationState.country || 'India',
          pincode: locationState.pincode || '',
          latitude: locationState.coordinates?.coordinates[1] || locationState.latitude || 12.9716,
          longitude: locationState.coordinates?.coordinates[0] || locationState.longitude || 77.5946,
          status: locationState.status || 'active'
        });

      } else {
        setFormData({
          name: '',
          type: 'area',
          parent_id: '',
          state: 'Karnataka',
          country: 'India',
          pincode: '',
          latitude: 12.9716,
          longitude: 77.5946,
          status: 'active'
        });

      }
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, locationState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-[0.1em]">
                {locationState ? 'Update Entry' : 'Configure Location'}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Operational Territory Node</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            <div className="bg-[#F8FAFC] border border-gray-100 p-6 rounded-[2rem] space-y-4 relative group">
              <div className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any, parent_id: e.target.value === 'city' ? '' : formData.parent_id })}
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-200 transition-all appearance-none"
                    >
                      <option value="city">City Hub</option>
                      <option value="area">Localized Area</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-200 transition-all appearance-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={12} className="text-blue-500" /> {formData.type === 'city' ? 'City Name' : 'Area Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={formData.type === 'city' ? "e.g. Bangalore" : "e.g. Whitefield"}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-200 transition-all"
                  />
                </div>

                {formData.type === 'area' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                      Parent City Hub
                    </label>
                    {cities.length > 0 ? (
                      <select
                        required
                        value={formData.parent_id}
                        onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-200 transition-all appearance-none"
                      >
                        <option value="">Select Operational Hub</option>
                        {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-2xl text-[10px] font-bold text-amber-700 uppercase tracking-tight">
                        No active City Hubs found. Please create a Hub first.
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                    Strategic Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 560001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-200 transition-all"
                  />
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-200 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-200 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-200 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-200 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Save size={14} /> {locationState ? 'Update' : 'Register'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default LocationModal;
