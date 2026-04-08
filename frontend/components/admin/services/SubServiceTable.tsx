"use client";

import React, { useState } from 'react';
import {
    Zap, Droplets, Wind, Hammer, Paintbrush, Trash2, Plus, Pencil, Power,
    Search, Filter, RefreshCw, BarChart3, ChevronLeft, LayoutGrid, Layers, ArrowLeft
} from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import Badge from '../common/Badge';
import SubServiceModal from './SubServiceModal';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    { name: 'Electrician', icon: Zap, serviceCount: 8, color: 'text-yellow-600', bg: 'bg-yellow-50', desc: 'Electrical repairs, wiring & installations' },
    { name: 'Plumber', icon: Droplets, serviceCount: 6, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Leak fixes, pipe installs & basic plumbing' },
    { name: 'AC Repair', icon: Wind, serviceCount: 5, color: 'text-cyan-600', bg: 'bg-cyan-50', desc: 'Cooling systems, gas refilling & cleaning' },
    { name: 'Carpenter', icon: Hammer, serviceCount: 7, color: 'text-orange-600', bg: 'bg-orange-50', desc: 'Furniture repair, wood works & installations' },
    { name: 'Cleaning', icon: Trash2, serviceCount: 9, color: 'text-red-600', bg: 'bg-red-50', desc: 'Full home cleaning, sofa & carpet wash' },
    { name: 'Painting', icon: Paintbrush, serviceCount: 4, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Interior, exterior & texture painting' },
];

const SUB_SERVICES_DATA = [
    { id: 1, name: 'Fan Installation', category: 'Electrician', price: '₹299', status: 'Active' },
    { id: 2, name: 'Pipe Leak Fix', category: 'Plumber', price: '₹499', status: 'Active' },
    { id: 3, name: 'AC Gas Refill', category: 'AC Repair', price: '₹799', status: 'Inactive' },
    { id: 4, name: 'Door Hinge Repair', category: 'Carpenter', price: '₹349', status: 'Active' },
    { id: 5, name: 'Interior Painting', category: 'Painting', price: '₹2499', status: 'Active' },
    { id: 6, name: 'Kitchen Deep Clean', category: 'Cleaning', price: '₹699', status: 'Active' },
    { id: 7, name: 'Sofa Shampooing', category: 'Cleaning', price: '₹1299', status: 'Active' },
    { id: 8, name: 'Switchboard Fixing', category: 'Electrician', price: '₹199', status: 'Active' },
];

const SubServiceTable: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Core data state
    const [subServices, setSubServices] = useState(SUB_SERVICES_DATA);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    
    // Filter dropdown state
    const [filterStatus, setFilterStatus] = useState('All');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    const filteredSubServices = subServices.filter(s =>
        s.category === selectedCategory &&
        (s.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterStatus === 'All' || s.status === filterStatus)
    );

    const handleOpenAdd = () => {
        setEditingService(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (subService: any) => {
        setEditingService(subService);
        setIsModalOpen(true);
    };

    const handleSave = (savedService: any) => {
        if (editingService) {
            setSubServices(subServices.map(s => s.id === savedService.id ? savedService : s));
        } else {
            setSubServices([savedService, ...subServices]);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header Evolution */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>

                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        {selectedCategory ? (
                            <span className="flex items-center gap-2">
                                Catalog<span className="text-blue-600">.</span>
                                <span className="text-gray-300 text-2xl font-light">/</span>
                                <span className="text-blue-600">{selectedCategory.toLowerCase()}</span>
                            </span>
                        ) : (
                            <>Sub-services<span className="text-blue-600">.</span></>
                        )}
                    </h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1 italic">
                        {selectedCategory}
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
                        <Button 
                            variant="primary" 
                            size="sm" 
                            icon={Plus} 
                            onClick={handleOpenAdd}
                            className="shadow-lg bg-blue-600 text-[11px] py-3 rounded-2xl px-5"
                        >
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
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {CATEGORIES.map((cat) => (
                            <div
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className="relative bg-white/20 backdrop-blur-2xl border border-white/40 rounded-[2rem] p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer group overflow-hidden"
                            >
                                {/* Frosted Ambient Glow */}
                                <div className={`absolute -top-12 -left-12 w-32 h-32 rounded-full ${cat.bg} opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-700`} />
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                                <div className="flex items-start justify-between relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl ${cat.bg}/40 backdrop-blur-md flex items-center justify-center ${cat.color} shadow-lg shadow-black/5 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500`}>
                                        <cat.icon size={28} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Catalog Size</span>
                                        <span className="text-2xl font-black text-gray-900 mt-1.5 tracking-tighter">{cat.serviceCount}</span>
                                    </div>
                                </div>

                                <div className="mt-6 relative z-10">
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                                    <p className="text-[11px] text-gray-500 mt-2 font-medium leading-relaxed max-w-[200px] opacity-80 line-clamp-2">
                                        {cat.desc}
                                    </p>
                                </div>

                                <div className="mt-6 pt-5 border-t border-white/30 flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">Open Registry</span>
                                    </div>
                                    <div className="w-9 h-9 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-inner">
                                        <LayoutGrid size={16} />
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
                        <div className="bg-white/40 backdrop-blur-xl p-3 px-5 rounded-2xl border border-white/60 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 relative z-20">
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
                                    title="Reset view"
                                >
                                    <RefreshCw size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden group min-h-[460px] flex flex-col">
                            <div className="flex-1">
                                <Table
                                    headers={['Offering Detail', 'Catalog ID', 'Pricing Matrix', 'Status', 'Actions']}
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
                                                    <div className="flex items-center">
                                                        <button
                                                            className={`relative w-12 h-6 flex items-center p-0.5 rounded-full transition-all duration-300 shadow-inner group/toggle ${s.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}
                                                            title={s.status === 'Active' ? 'Offering Live' : 'Offering Offline'}
                                                        >
                                                            {/* Sliding Indicator */}
                                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 z-10 ${s.status === 'Active' ? 'translate-x-6' : 'translate-x-0'}`} />

                                                            {/* ON/OFF Labels */}
                                                            <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[7px] font-black uppercase tracking-tighter text-white pointer-events-none">
                                                                <span className={`transition-opacity duration-300 ${s.status === 'Active' ? 'opacity-100' : 'opacity-0'}`}>ON</span>
                                                                <span className={`transition-opacity duration-300 ${s.status === 'Active' ? 'opacity-0' : 'opacity-100'}`}>OFF</span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1.5 transition-opacity">
                                                        <button 
                                                            onClick={() => handleOpenEdit(s)}
                                                            className="p-1 px-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100 active:scale-95" 
                                                            title="Edit Catalog"
                                                        >
                                                            <Pencil size={12} />
                                                        </button>
                                                        <button className="p-1 px-3 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 active:scale-95" title="Remove Entry"><Trash2 size={12} /></button>
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

            <SubServiceModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                subService={editingService}
                category={selectedCategory || ''}
                onSave={handleSave}
            />
        </div>
    );
};

export default SubServiceTable;
