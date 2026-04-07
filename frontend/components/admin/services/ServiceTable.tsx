"use client";

import React, { useState, useEffect } from 'react';
import {
  Zap, Droplets, Wind, Hammer, Paintbrush, Scissors, ShieldCheck, Trash2, Plus, Pencil, Power,
  Layers, LayoutGrid, Search, Filter, RefreshCw, BarChart3, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import CategoryCard from './CategoryCard';
import Table from '../common/Table';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { name: 'Electrician', icon: Zap, serviceCount: 8, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { name: 'Plumber', icon: Droplets, serviceCount: 6, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'AC Repair', icon: Wind, serviceCount: 5, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { name: 'Carpenter', icon: Hammer, serviceCount: 7, color: 'text-orange-600', bg: 'bg-orange-50' },
  { name: 'Cleaning', icon: Trash2, serviceCount: 9, color: 'text-red-600', bg: 'bg-red-50' },
  { name: 'Painting', icon: Paintbrush, serviceCount: 4, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const ServiceTable: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Simplified Modern Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Service <span className="text-blue-600">Categories</span></h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" icon={Plus} className="shadow-lg bg-blue-600 text-[11px] py-3 rounded-2xl px-6">Add Category</Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="categories"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="space-y-6"
        >
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden group min-h-[400px] flex flex-col">
            <div className="flex-1">
              <Table
                headers={['Category Identity', 'Visual Icon', 'Catalog Size', 'Status', 'Actions']}
                className="relative z-10"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {CATEGORIES.map((cat, i) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={cat.name}
                      className="hover:bg-blue-50/20 transition-all group/row border-b border-gray-50 last:border-0 text-[11px]"
                    >
                      <td className="px-6 py-4">
                        <span className="font-black text-gray-900 uppercase tracking-tight text-[10px]">{cat.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`w-8 h-8 rounded-xl ${cat.bg} flex items-center justify-center ${cat.color} shadow-sm group-hover/row:scale-110 transition-transform`}>
                          <cat.icon size={16} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-gray-900">{cat.serviceCount}</span>
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Services</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <button
                            className={`relative w-12 h-6 flex items-center p-0.5 rounded-full transition-all duration-300 shadow-inner group/toggle ${i % 4 === 0 ? 'bg-red-600' : 'bg-green-600'}`}
                            title={i % 4 === 0 ? 'Domain Offline' : 'Domain Operational'}
                          >
                            {/* Sliding Circle Indicator */}
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 z-10 ${i % 4 === 0 ? 'translate-x-0' : 'translate-x-6'}`} />

                            {/* ON/OFF Labels */}
                            <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[7px] font-black uppercase tracking-tighter text-white pointer-events-none">
                              <span className={`transition-opacity duration-300 ${i % 4 === 0 ? 'opacity-0' : 'opacity-100'}`}>ON</span>
                              <span className={`transition-opacity duration-300 ${i % 4 === 0 ? 'opacity-100' : 'opacity-0'}`}>OFF</span>
                            </div>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button className="p-1 px-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100 active:scale-95" title="Edit Domain"><Pencil size={12} /></button>
                          <button className="p-1 px-3 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 active:scale-95" title="Remove Vertical"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </Table>
            </div>


          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ServiceTable;
