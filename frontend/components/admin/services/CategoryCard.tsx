"use client";

import React from 'react';
import { LucideIcon, Pencil, ChevronRight, LayoutList } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  serviceCount: number;
  color: string;
  bg: string;
  onEdit?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon: Icon, serviceCount, color, bg, onEdit }) => {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
    >
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 ${bg}`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div className={`p-3 rounded-xl ${bg} shadow-sm group-hover:rotate-12 transition-transform duration-500`}>
          <Icon size={18} className={color} strokeWidth={2.5} />
        </div>
        <button 
          onClick={onEdit}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <Pencil size={12} />
        </button>
      </div>

      <div className="mt-4 relative z-10">
        <h3 className="text-xs font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{name}</h3>
        <div className="flex items-center gap-2 mt-2">
           <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/50 text-gray-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-gray-100/50">
              <LayoutList size={10} />
              {serviceCount} SKUs
           </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Registry View</p>
         <div className="flex items-center gap-1 text-[9px] font-black text-blue-600 group-hover:translate-x-1 transition-transform">
            Details <ChevronRight size={10} />
         </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
