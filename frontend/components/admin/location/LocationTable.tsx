"use client";

import React, { useState } from 'react';
import { CityToggle } from './CityToggle';
import Table from '../common/Table';
import Button from '../common/Button';
import Badge from '../common/Badge';
import LocationModal from './LocationModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Filter, RefreshCw } from 'lucide-react';

const CITIES_INIT = [
  { city: 'Mumbai', active: true, stateRegion: 'MH, IN' },
  { city: 'Delhi', active: true, stateRegion: 'DL, IN' },
  { city: 'Bangalore', active: true, stateRegion: 'KA, IN' },
  { city: 'Chennai', active: false, stateRegion: 'TN, IN' },
  { city: 'Hyderabad', active: true, stateRegion: 'TG, IN' },
  { city: 'Pune', active: false, stateRegion: 'MH, IN' },
  { city: 'Kolkata', active: true, stateRegion: 'WB, IN' },
  { city: 'Ahmedabad', active: false, stateRegion: 'GJ, IN' },
  { city: 'Chandigarh', active: true, stateRegion: 'CH, IN' },
  { city: 'Jaipur', active: true, stateRegion: 'RJ, IN' },
];

const LocationTable: React.FC = () => {
  const [cities, setCities] = useState(CITIES_INIT);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);

  // Filter State
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const handleToggle = (cityName: string, value: boolean) => {
    setCities(prev => prev.map(c => c.city === cityName ? { ...c, active: value } : c));
  };

  const handleOpenAdd = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cityData: any) => {
    setEditingLocation(cityData);
    setIsModalOpen(true);
  };

  const handleSave = (locationData: any) => {
    if (editingLocation) {
        setCities(cities.map(c => c.city === editingLocation.city ? locationData : c));
    } else {
        setCities([locationData, ...cities]);
    }
  };

  // Derived filtered data
  const filteredCities = cities.filter(c => {
      if (filterStatus === 'All') return true;
      if (filterStatus === 'Active') return c.active;
      if (filterStatus === 'Halted') return !c.active;
      return true;
  });

  // Calculate slices
  const totalPages = Math.ceil(filteredCities.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentCities = filteredCities.slice(indexOfFirstRow, indexOfLastRow);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Geo <span className="text-blue-600">Distribution</span></h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Operational City Control</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
             variant="primary" 
             size="sm" 
             icon={Plus} 
             onClick={handleOpenAdd}
             className="shadow-lg bg-blue-600 text-[11px] py-3 rounded-2xl px-6"
          >
             Add Strategic Hub
          </Button>
        </div>
      </div>

      {/* Quick Toggles - Compressed */}
      <div className="space-y-3">
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quick Status Rail</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {cities.map(({ city, active }) => (
            <CityToggle key={city} city={city} isActive={active} onChange={handleToggle} />
          ))}
        </div>
      </div>

      {/* Filter and Table Control Rail */}
      <div className="bg-white/40 backdrop-blur-xl p-3 px-5 rounded-2xl border border-white/60 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 relative z-20">
          <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Total Result: {filteredCities.length} Hubs
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
                          {['All', 'Active', 'Halted'].map(status => (
                              <button
                                  key={status}
                                  onClick={() => { setFilterStatus(status); setIsFilterDropdownOpen(false); setCurrentPage(1); }}
                                  className={`w-full px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors ${filterStatus === status ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500'}`}
                              >
                                  {status === 'All' ? 'Show All' : status}
                              </button>
                          ))}
                      </motion.div>
                  )}
              </AnimatePresence>

              <button
                  onClick={() => { setFilterStatus('All'); setCurrentPage(1); }}
                  className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                  title="Reset view"
              >
                  <RefreshCw size={16} />
              </button>
          </div>
      </div>

      {/* Detailed Table - High Density */}
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden group min-h-[380px] flex flex-col relative z-10">
        <div className="flex-1">
          <Table
            headers={['Hub City', 'State', 'Operational', 'Agents', 'Volume', 'Manage']}
          >
            {currentCities.map((c) => (
              <tr key={c.city} className="hover:bg-blue-50/20 transition-all text-[11px] group text-gray-700 border-b border-gray-50 last:border-0">
                <td className="px-6 py-3 font-black text-gray-900 group-hover:text-blue-600 uppercase tracking-tight">{c.city}</td>
                <td className="px-6 py-3 text-gray-500 font-bold uppercase text-[9px] tracking-widest leading-none">{c.stateRegion || 'MH, IN'}</td>
                <td className="px-6 py-3">
                  <div className="scale-75 origin-left">
                    <Badge variant={c.active ? 'success' : 'neutral'}>{c.active ? 'Active' : 'Halted'}</Badge>
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-900 font-black">{Math.floor(Math.random() * 50) + 10}</td>
                <td className="px-6 py-3 text-gray-600 font-bold">{Math.floor(Math.random() * 200) + 30}</td>
                <td className="px-6 py-3">
                  <div className="flex justify-center gap-1">
                    <button 
                       onClick={() => handleOpenEdit(c)}
                       className="p-1 px-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100 active:scale-95"
                    ><Pencil size={12} /></button>
                    <button className="p-1 px-2 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 active:scale-95"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>

        {/* Global Hub Pagination - Centered */}
        <div className="p-5 border-t border-white/20 bg-white/10 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4 w-full">

            {/* Navigation Rail */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-blue-600 disabled:opacity-30 shadow-sm transition-all"
              >
                <ChevronLeft size={14} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[28px] h-7 px-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm border ${currentPage === page
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
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-blue-600 disabled:opacity-30 shadow-sm transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>


          </div>
        </div>
      </div>
      
      <LocationModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         locationState={editingLocation}
         onSave={handleSave}
      />
    </div>
  );
};

export default LocationTable;
