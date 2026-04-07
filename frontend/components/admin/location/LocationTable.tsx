"use client";

import React, { useState } from 'react';
import CityToggle from './CityToggle';
import Table from '../common/Table';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const CITIES_INIT = [
  { city: 'Mumbai', active: true },
  { city: 'Delhi', active: true },
  { city: 'Bangalore', active: true },
  { city: 'Chennai', active: false },
  { city: 'Hyderabad', active: true },
  { city: 'Pune', active: false },
  { city: 'Kolkata', active: true },
  { city: 'Ahmedabad', active: false },
  { city: 'Chandigarh', active: true },
  { city: 'Jaipur', active: true },
];

const LocationTable: React.FC = () => {
  const [cities, setCities] = useState(CITIES_INIT);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const handleToggle = (cityName: string, value: boolean) => {
    setCities(prev => prev.map(c => c.city === cityName ? { ...c, active: value } : c));
  };

  // Calculate slices
  const totalPages = Math.ceil(cities.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentCities = cities.slice(indexOfFirstRow, indexOfLastRow);

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
        <Button icon={Plus} size="sm" className="text-[11px] shadow-sm">Add Strategic Hub</Button>
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

      {/* Detailed Table - High Density */}
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden group min-h-[380px] flex flex-col">
        <div className="flex-1">
          <Table
            headers={['Hub City', 'State', 'Operational', 'Agents', 'Volume', 'Manage']}
          >
            {currentCities.map(({ city, active }) => (
              <tr key={city} className="hover:bg-blue-50/20 transition-all text-[11px] group text-gray-700 border-b border-gray-50 last:border-0">
                <td className="px-6 py-3 font-black text-gray-900 group-hover:text-blue-600 uppercase tracking-tight">{city}</td>
                <td className="px-6 py-3 text-gray-500 font-bold uppercase text-[9px] tracking-widest leading-none">MH, IN</td>
                <td className="px-6 py-3">
                  <div className="scale-75 origin-left">
                    <Badge variant={active ? 'success' : 'neutral'}>{active ? 'Active' : 'Halted'}</Badge>
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-900 font-black">{Math.floor(Math.random() * 50) + 10}</td>
                <td className="px-6 py-3 text-gray-600 font-bold">{Math.floor(Math.random() * 200) + 30}</td>
                <td className="px-6 py-3">
                  <div className="flex justify-center gap-1">
                    <button className="p-1 px-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100 active:scale-95"><Pencil size={12} /></button>
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
                      className={`min-w-[28px] h-7 px-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm border ${
                        currentPage === page
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

              {/* Status Info */}
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Geo-Hub Sync</span>
                 </div>
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-4 border-l border-white/20 leading-none">
                   Hub Distribution: <span className="text-gray-900">{indexOfFirstRow + 1}</span> to{" "}
                   <span className="text-gray-900">{Math.min(indexOfLastRow, cities.length)}</span> of{" "}
                   <span className="text-gray-900">{cities.length} Operational Centers</span>
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTable;
