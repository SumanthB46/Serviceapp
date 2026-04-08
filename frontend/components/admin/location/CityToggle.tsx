"use client";

import React, { useState } from 'react';
import { MapPin, Search, Plus, Filter, RefreshCw, Navigation } from 'lucide-react';
import Button from '../common/Button';
import LocationModal from './LocationModal';
import { motion, AnimatePresence } from 'framer-motion';

interface City {
  id: string;
  name: string;
  state: string;
  isActive: boolean;
  providers: number;
}

const DUMMY_CITIES: City[] = [
  { id: 'CT001', name: 'Mumbai', state: 'Maharashtra', isActive: true, providers: 1240 },
  { id: 'CT002', name: 'Delhi', state: 'Delhi NCR', isActive: true, providers: 980 },
  { id: 'CT003', name: 'Bangalore', state: 'Karnataka', isActive: true, providers: 1150 },
  { id: 'CT004', name: 'Hyderabad', state: 'Telangana', isActive: true, providers: 850 },
  { id: 'CT005', name: 'Chennai', state: 'Tamil Nadu', isActive: false, providers: 620 },
  { id: 'CT006', name: 'Pune', state: 'Maharashtra', isActive: true, providers: 540 },
  { id: 'CT007', name: 'Kolkata', state: 'West Bengal', isActive: false, providers: 410 },
  { id: 'CT008', name: 'Ahmedabad', state: 'Gujarat', isActive: true, providers: 320 },
  { id: 'CT009', name: 'Jaipur', state: 'Rajasthan', isActive: true, providers: 280 },
  { id: 'CT010', name: 'Lucknow', state: 'Uttar Pradesh', isActive: false, providers: 240 },
];

// --- Small UI Unit for Tables/Rails ---
export interface CityToggleProps {
  city: string;
  isActive: boolean;
  onChange: (name: string, isActive: boolean) => void;
}

export const CityToggle: React.FC<CityToggleProps> = ({ city, isActive, onChange }) => {
  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/60 p-3 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-2">
        <MapPin size={14} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
        <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight truncate max-w-[60px]">{city}</span>
      </div>
      <button
        onClick={() => onChange(city, !isActive)}
        className={`relative w-9 h-4.5 flex items-center p-0.5 rounded-full transition-all duration-500 shadow-inner ${isActive ? 'bg-green-600' : 'bg-red-600'}`}
      >
        <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-transform duration-500 z-10 ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
        <div className="absolute inset-0 flex items-center justify-between px-1 text-[5px] font-black uppercase tracking-tighter text-white pointer-events-none">
          <span className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>ON</span>
          <span className={`transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`}>OFF</span>
        </div>
      </button>
    </div>
  );
};

// --- Full Page/Grid Registry ---
const CityToggleRegistry: React.FC = () => {
  const [cities, setCities] = useState<City[]>(DUMMY_CITIES);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal & Add State
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter Dropdown State
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const toggleCity = (id: string) => {
    setCities(prev => prev.map(c =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleSave = (locationData: any) => {
    const newCity: City = {
       id: locationData.id || `CT${String(cities.length + 1).padStart(3, '0')}`,
       name: locationData.city,
       state: locationData.stateRegion,
       isActive: locationData.active,
       providers: locationData.providers || 0
    };
    setCities([newCity, ...cities]);
  };

  const filtered = cities.filter(c =>
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'All' || (filterStatus === 'Active' ? c.isActive : !c.isActive))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Bureau */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Location<span className="text-blue-600">s</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button 
             variant="primary" 
             size="sm" 
             icon={Plus} 
             onClick={() => setIsModalOpen(true)}
             className="shadow-lg bg-blue-600 text-[11px] py-3 rounded-2xl px-6"
          >
            Add New City
          </Button>
        </div>
      </div>

      {/* Operation Rail */}
      <div className="bg-white/40 backdrop-blur-xl p-3 px-5 rounded-2xl border border-white/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 relative z-20">
        <div className="relative flex-1 w-full group max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search commercial hubs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-100 focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100/50 rounded-xl text-[11px] font-bold text-gray-800 transition-all duration-300 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 relative">
          <Button 
              variant={filterStatus !== 'All' ? "primary" : "outline"} 
              size="sm" 
              icon={Filter} 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={`text-[10px] uppercase tracking-widest shadow-sm px-4 ${filterStatus !== 'All' ? 'bg-blue-600' : 'bg-white border-gray-100'}`}
          >
              {filterStatus !== 'All' ? filterStatus : 'Filters'}
          </Button>
          
          <AnimatePresence>
              {isFilterDropdownOpen && (
                  <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-8 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                      {['All', 'Active', 'Inactive'].map(status => (
                          <button
                              key={status}
                              onClick={() => { setFilterStatus(status); setIsFilterDropdownOpen(false); }}
                              className={`w-full px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors ${filterStatus === status ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500'}`}
                          >
                              {status === 'All' ? 'Show All' : status}
                          </button>
                      ))}
                  </motion.div>
              )}
          </AnimatePresence>

          <button
            onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}
            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* High-Density City Grid: 5 cities per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {filtered.map((city) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={city.id}
              className="relative bg-white/30 backdrop-blur-2xl border border-white/40 rounded-[2rem] p-5 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden"
            >
              {/* Hub Visualization */}
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-10 h-10 rounded-xl ${city.isActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center transition-all duration-500 shadow-inner`}>
                  <MapPin size={18} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Hub ID</span>
                  <span className="text-[10px] font-black text-gray-900 mt-1">{city.id}</span>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-base font-black text-gray-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors uppercase">{city.name}</h3>
                <p className="text-[9px] text-gray-500 mt-1 font-bold uppercase tracking-widest opacity-80">{city.state}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/30 flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-tight">Capability</span>
                  <span className="text-[11px] font-black text-gray-900 tracking-tight">{city.providers} <span className="text-gray-400 text-[8px]">PROS</span></span>
                </div>

                {/* Executive Toggle Switch */}
                <button
                  onClick={() => toggleCity(city.id)}
                  className={`relative w-10 h-5 flex items-center p-0.5 rounded-full transition-all duration-500 shadow-inner ${city.isActive ? 'bg-green-600' : 'bg-red-600'}`}
                  title={city.isActive ? 'Deactivate Hub' : 'Activate Hub'}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-500 z-10 ${city.isActive ? 'translate-x-4.5' : 'translate-x-0'}`} />
                  <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[6px] font-black uppercase tracking-tighter text-white pointer-events-none">
                    <span className={`transition-opacity duration-300 ${city.isActive ? 'opacity-100' : 'opacity-0'}`}>ON</span>
                    <span className={`transition-opacity duration-300 ${city.isActive ? 'opacity-0' : 'opacity-100'}`}>OFF</span>
                  </div>
                </button>
              </div>

              {/* Hub Status Ambient Beam */}
              <div className={`absolute -bottom-6 -right-6 w-16 h-16 rounded-full blur-2xl transition-all duration-700 ${city.isActive ? 'bg-green-500/20' : 'bg-red-500/10'}`} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
          <Navigation size={40} strokeWidth={1} className="opacity-20 animate-bounce" />
          <p className="text-[10px] font-black uppercase tracking-widest">No commercial hubs found in this search</p>
        </div>
      )}

      <LocationModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         locationState={null}
         onSave={handleSave}
      />
    </div>
  );
};

export default CityToggleRegistry;
