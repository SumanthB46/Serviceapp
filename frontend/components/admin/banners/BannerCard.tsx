"use client";

import React from 'react';
import { Pencil as Edit, Pause, Play, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  targetUrl: string;
  isActive: boolean;
  expiresOn?: string;
}

interface BannerCardProps {
  banner: Banner;
  onEdit?: (b: Banner) => void;
  onDelete?: (b: Banner) => void;
  onToggle?: (b: Banner) => void;
}

const BannerCard: React.FC<BannerCardProps> = ({ banner, onEdit, onDelete, onToggle }) => {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-all duration-300">
      <div className="relative h-32 overflow-hidden bg-gray-100">
        <img 
          src={banner.imageUrl} 
          alt={banner.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute top-2 right-2">
           <div className="scale-75 origin-top-right">
              <Badge variant={banner.isActive ? 'success' : 'danger'}>
                {banner.isActive ? 'Live' : 'Paused'}
              </Badge>
           </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-xs font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate">{banner.title}</h3>
          <div className="flex items-center gap-2 mt-1">
             <span className="px-1.5 py-0.5 bg-gray-100 text-[8px] font-black text-gray-500 uppercase tracking-widest rounded-sm border border-gray-200">ID: {banner.id}</span>
             <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider truncate max-w-[120px]">{banner.targetUrl}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/20">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onEdit?.(banner)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
              title="Edit Configuration"
            >
              <Edit size={14} />
            </button>
            <button 
              onClick={() => onToggle?.(banner)}
              className={`p-1.5 rounded-lg transition-colors ${banner.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
              title={banner.isActive ? 'Pause Campaign' : 'Resume Campaign'}
            >
              {banner.isActive ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>
          
          <button 
            onClick={() => onDelete?.(banner)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
            title="Remove Banner"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
