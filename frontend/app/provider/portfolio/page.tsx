"use client";

import React, { useState } from "react";
import ProviderLayout from "@/components/provider/ProviderLayout";
import UploadPortfolioModal from "@/components/provider/modals/UploadPortfolioModal";
import { Plus, Image as ImageIcon, Trash2, Maximize2, Upload, X } from "lucide-react";

const initialGallery = [
  { id: 1, title: "Living Room Transformation", category: "Deep Cleaning", image: "https://images.unsplash.com/photo-1581578731548-c64695ce6958?w=800&auto=format&fit=crop&q=60" },
  { id: 2, title: "Bathroom Sanitization", category: "Sanitization", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60" },
  { id: 3, title: "Sofa Foam Wash", category: "Sofa Cleaning", image: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800&auto=format&fit=crop&q=60" },
  { id: 4, title: "Kitchen Degreasing", category: "Kitchen Cleaning", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=60" },
  { id: 5, title: "AC Filter Cleaning", category: "AC Service", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60" },
];

export default function PortfolioPage() {
  const [gallery, setGallery] = useState(initialGallery);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const removePhoto = (id: number) => {
    setGallery(gallery.filter(item => item.id !== id));
  };

  return (
    <ProviderLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Portfolio Gallery</h1>
            <p className="text-slate-500 font-medium">Showcase your best work to build trust with customers.</p>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            <Upload className="h-4 w-4" />
            Upload New Photos
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Upload Placeholder */}
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="aspect-square rounded-[40px] border-4 border-dashed border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-4 group"
          >
            <div className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm">
              <Plus className="h-8 w-8" />
            </div>
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Click to upload</span>
          </button>

          {gallery.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-[40px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-1">{item.category}</span>
                <h3 className="text-lg font-black text-white leading-tight">{item.title}</h3>
                
                <div className="mt-6 flex items-center gap-3">
                  <button className="flex-1 py-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-2">
                    <Maximize2 className="h-3 w-3" />
                    Preview
                  </button>
                  <button 
                    onClick={() => removePhoto(item.id)}
                    className="p-2.5 bg-rose-500/20 backdrop-blur-md text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Quick Actions Hidden by default */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl">
                  <ImageIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {gallery.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <ImageIcon className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Your portfolio is empty</h3>
            <p className="text-slate-400 font-medium">Upload photos of your work to get 2x more bookings.</p>
          </div>
        )}
      </div>
      <UploadPortfolioModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </ProviderLayout>
  );
}
