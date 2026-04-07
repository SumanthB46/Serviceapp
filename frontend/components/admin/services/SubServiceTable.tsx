"use client";

import React, { useState } from 'react';
import { 
  Zap, Droplets, Wind, Hammer, Paintbrush, Trash2, Plus, Pencil, Power,
  Search, Filter, RefreshCw, BarChart3, ChevronLeft, LayoutGrid, Layers, ArrowLeft
} from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { name: 'Electrician',  icon: Zap,        serviceCount: 8,  color: 'text-yellow-600', bg: 'bg-yellow-50',  desc: 'Electrical repairs, wiring & installations' },
  { name: 'Plumber',      icon: Droplets,    serviceCount: 6,  color: 'text-blue-600',   bg: 'bg-blue-50',    desc: 'Leak fixes, pipe installs & basic plumbing' },
  { name: 'AC Repair',    icon: Wind,        serviceCount: 5,  color: 'text-cyan-600',   bg: 'bg-cyan-50',    desc: 'Cooling systems, gas refilling & cleaning' },
  { name: 'Carpenter',    icon: Hammer,      serviceCount: 7,  color: 'text-orange-600', bg: 'bg-orange-50',  desc: 'Furniture repair, wood works & installations' },
  { name: 'Cleaning',     icon: Trash2,      serviceCount: 9,  color: 'text-red-600',    bg: 'bg-red-50',     desc: 'Full home cleaning, sofa & carpet wash' },
  { name: 'Painting',     icon: Paintbrush,  serviceCount: 4,  color: 'text-purple-600', bg: 'bg-purple-50',  desc: 'Interior, exterior & texture painting' },
];

const SUB_SERVICES_DATA = [
  { id: 1, name: 'Fan Installation',     category: 'Electrician', price: '₹299', status: 'Active' },
  { id: 2, name: 'Pipe Leak Fix',        category: 'Plumber',     price: '₹499', status: 'Active' },
  { id: 3, name: 'AC Gas Refill',        category: 'AC Repair',   price: '₹799', status: 'Inactive' },
  { id: 4, name: 'Door Hinge Repair',    category: 'Carpenter',   price: '₹349', status: 'Active' },
  { id: 5, name: 'Interior Painting',    category: 'Painting',    price: '₹2499',status: 'Active' },
  { id: 6, name: 'Kitchen Deep Clean',   category: 'Cleaning',    price: '₹699', status: 'Active' },
  { id: 7, name: 'Sofa Shampooing',      category: 'Cleaning',    price: '₹1299',status: 'Active' },
  { id: 8, name: 'Switchboard Fixing',   category: 'Electrician', price: '₹199', status: 'Active' },
];

const SubServiceTable: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubServices = SUB_SERVICES_DATA.filter(s => 
    s.category === selectedCategory && 
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header Evolution */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] leading-none">Catalog Explorer</span>
           </div>
           <h1 className="text-3xl font-black text-gray-900 tracking-tight lowercase">
              {selectedCategory ? (
                <span className="flex items-center gap-2">
                  catalog<span className="text-blue-600">.</span>
                  <span className="text-gray-300 text-2xl font-light">/</span>
                  <span className="text-blue-600">{selectedCategory.toLowerCase()}</span>
                </span>
              ) : (
                <>sub-services<span className="text-blue-600">.</span></>
              )}
           </h1>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1 italic">
             {selectedCategory ? `Managing granular offerings for ${selectedCategory}` : 'Select a domain to manage tiered offerings'}
           </p>
        </div>
        
        {selectedCategory && (
          <div className="flex items-center gap-3">
             <Button 
               variant="outline" 
               size="sm" 
               icon={ArrowLeft} 
               onClick={() => setSelectedCategory(null)}
               className="text-[10px] bg-white border-gray-100 uppercase tracking-widest shadow-sm px-4 rounded-xl"
             >
                Domains
             </Button>
             <Button variant="primary" size="sm" icon={Plus} className="shadow-lg bg-blue-600 text-[11px] py-3 rounded-2xl">
                Add Option
             </Button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div 
            key="category-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group relative overflow-hidden"
              >
                 <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${cat.bg} opacity-50 group-hover:scale-150 transition-transform duration-700 blur-2xl`} />
                 
                 <div className="flex items-start justify-between relative z-10">
                    <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center ${cat.color} shadow-sm group-hover:rotate-6 transition-transform`}>
                       <cat.icon size={28} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Catalog Size</span>
                       <span className="text-2xl font-black text-gray-900 mt-1">{cat.serviceCount}</span>
                    </div>
                 </div>

                 <div className="mt-8 relative z-10">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{cat.name}</h3>
                    <p className="text-[11px] text-gray-500 mt-2 font-medium leading-relaxed max-w-[200px]">
                      {cat.desc}
                    </p>
                 </div>

                 <div className="mt-8 pt-4 border-t border-gray-100/50 flex items-center justify-between relative z-10">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">Open Registry</span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                       <LayoutGrid size={14} />
                    </div>
                 </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="sub-service-table"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Table Control Rail */}
            <div className="bg-white/40 backdrop-blur-xl p-3 px-5 rounded-2xl border border-white/60 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full group max-w-sm">
                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                   <input
                     type="text"
                     placeholder={`Search in ${selectedCategory}...`}
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-100 focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100/50 rounded-xl text-[11px] font-bold text-gray-800 transition-all duration-300 shadow-sm"
                   />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" icon={Filter} className="text-[10px] bg-white border-gray-100 uppercase tracking-widest shadow-sm px-4">Filters</Button>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                    >
                       <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden group min-h-[460px] flex flex-col">
              <div className="flex-1">
                <Table
                  headers={['Offering Detail', 'Catalog ID', 'Pricing Matrix', 'Status', 'Audit Actions']}
                  className="relative z-10"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {filteredSubServices.map((s) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={s.id} 
                        className="hover:bg-blue-50/20 transition-all group/row border-b border-gray-50 last:border-0 text-[11px]"
                      >
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover/row:scale-110">
                                 <BarChart3 size={14} />
                              </div>
                              <span className="font-black text-gray-900 tracking-tight uppercase tracking-widest text-[10px]">{s.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-lg">#{String(s.id).padStart(3, '0')}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-baseline gap-1">
                              <span className="text-[8px] font-bold text-gray-400">INR</span>
                              <span className="font-black text-gray-900 tracking-tighter text-[13px]">{s.price.replace('₹', '')}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="scale-75 origin-left">
                            <Badge variant={s.status === 'Active' ? 'success' : 'neutral'}>{s.status}</Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <button className="p-1 px-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100 active:scale-95" title="Edit Catalog"><Pencil size={12} /></button>
                            <button className={`p-1 px-2 ${s.status === 'Active' ? 'text-gray-400' : 'text-green-600'} hover:bg-gray-50 rounded-lg transition-all border border-transparent active:scale-95`} title="Toggle Status">
                               <Power size={12} />
                            </button>
                            <button className="p-1 px-2 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 active:scale-95" title="Remove Entry"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </Table>
                
                {filteredSubServices.length === 0 && (
                   <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
                      <Layers size={40} strokeWidth={1} className="opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No options cataloged for this vertical</p>
                   </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubServiceTable;
