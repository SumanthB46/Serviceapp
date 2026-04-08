"use client";

import React, { useState } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import BannerCard, { Banner } from './BannerCard';
import BannerForm from './BannerForm';
import Modal from '../common/Modal';
import Button from '../common/Button';

interface BannersOverviewProps {
  initialBanners: Banner[];
}

export default function BannersOverview({ initialBanners }: BannersOverviewProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Banners<span className="text-blue-600">.</span>
          </h1>
        </div>
        <Button variant="primary" icon={Plus} size="sm" className="shadow-lg bg-blue-600 text-[11px] py-3 rounded-2xl" onClick={() => { setEditingBanner(null); setIsFormOpen(true); }}>Add Banner</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {banners.map(banner => (
          <BannerCard
            key={banner.id}
            banner={banner}
            onEdit={(b) => { setEditingBanner(b); setIsFormOpen(true); }}
            onToggle={(b) => { setBanners(prev => prev.map(item => item.id === b.id ? { ...item, isActive: !item.isActive } : item)); }}
            onDelete={(b) => { setBanners(prev => prev.filter(item => item.id !== b.id)); }}
          />
        ))}

        <div
          onClick={() => { setEditingBanner(null); setIsFormOpen(true); }}
          className="bg-white/40 backdrop-blur-xl border-2 border-dashed border-gray-100 rounded-2xl min-h-[220px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/60 hover:border-blue-400 transition-all duration-300 group shadow-sm"
        >
          <div className="p-4 bg-white rounded-full shadow-sm text-gray-300 group-hover:text-blue-500 group-hover:scale-110 transition-transform">
            <ImageIcon size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-600">New Promotion</span>
        </div>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingBanner ? 'Edit Banner' : 'Configure New Banner'}
        size="md"
      >
        <BannerForm
          initialData={editingBanner}
          onSubmit={(data) => { setIsFormOpen(false); }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
