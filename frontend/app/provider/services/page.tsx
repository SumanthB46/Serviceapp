"use client";

import React, { useState } from "react";
import ProviderLayout from "@/components/provider/ProviderLayout";
import AddServiceModal from "@/components/provider/modals/AddServiceModal";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Star, 
  Clock, 
  Zap,
  CheckCircle2,
  XCircle,
  ToggleLeft as Toggle,
  ToggleRight,
  Sparkles
} from "lucide-react";

const initialServices = [
  {
    id: 1,
    name: "Deep Home Cleaning",
    priceRange: "₹1,999 - ₹4,499",
    duration: "4 - 6 Hours",
    isAvailable: true,
    isFeatured: true,
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1581578731548-c64695ce6958?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "Bathroom Deep Cleaning",
    priceRange: "₹499 - ₹1,299",
    duration: "1 - 2 Hours",
    isAvailable: true,
    isFeatured: false,
    rating: 4.8,
    reviews: 86,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "Sofa Cleaning",
    priceRange: "₹899 - ₹2,499",
    duration: "2 - 3 Hours",
    isAvailable: false,
    isFeatured: false,
    rating: 4.7,
    reviews: 52,
    image: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800&auto=format&fit=crop&q=60"
  }
];

export default function ServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const toggleAvailability = (id: number) => {
    setServices(services.map(s => s.id === id ? { ...s, isAvailable: !s.isAvailable } : s));
  };

  return (
    <ProviderLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Services Management</h1>
            <p className="text-slate-500 font-medium">Manage your service offerings, pricing, and availability.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            Add New Service
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex-1 flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 w-full">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search your services..." 
              className="bg-transparent border-none outline-none text-sm text-slate-600 w-full font-medium"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary w-full md:w-40">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
              {/* Image & Badges */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {service.isFeatured && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                  <span className={`px-3 py-1.5 ${service.isAvailable ? "bg-emerald-500" : "bg-slate-500"} text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg`}>
                    {service.isAvailable ? "Active" : "Offline"}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-600 hover:text-primary transition-colors shadow-sm">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-bold">{service.rating}</span>
                    <span className="text-xs text-slate-400 font-medium">({service.reviews})</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-1">{service.name}</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Price Range
                    </span>
                    <span className="text-slate-900 font-bold">{service.priceRange}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Duration
                    </span>
                    <span className="text-slate-900 font-bold">{service.duration}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
                  <button 
                    onClick={() => toggleAvailability(service.id)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500"
                  >
                    {service.isAvailable ? (
                      <ToggleRight className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <Toggle className="h-6 w-6 text-slate-300" />
                    )}
                    Available
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Service Placeholder */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="h-full min-h-[400px] rounded-[32px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-slate-50 transition-all group"
          >
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm border border-slate-100">
              <Plus className="h-8 w-8" />
            </div>
            <div className="text-center px-6">
              <span className="block text-lg font-bold text-slate-900">Add New Service</span>
              <span className="block text-sm font-medium text-slate-400 mt-1">Scale your business by adding more categories</span>
            </div>
          </button>
        </div>
      </div>
      <AddServiceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </ProviderLayout>
  );
}
