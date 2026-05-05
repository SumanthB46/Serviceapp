"use client";

import React, { useState } from "react";
import ProviderLayout from "@/components/provider/ProviderLayout";
import { MapPin, Navigation, Save, Search, Target, Info, Map as MapIcon, Plus } from "lucide-react";

export default function ServiceAreaPage() {
  const [radius, setRadius] = useState(15);
  const [address, setAddress] = useState("Sector 45, Gurgaon, Haryana, India");

  return (
    <ProviderLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Service Area</h1>
          <p className="text-slate-500 font-medium">Define where you are available to provide services.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Card */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Location</label>
                  <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Detect
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-4 w-4 text-primary" />
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 font-bold focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Service Radius</label>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-black">{radius} KM</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                  <span>1 KM</span>
                  <span>50 KM</span>
                </div>
              </div>

              <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <Save className="h-4 w-4" />
                Save Area Settings
              </button>
            </div>

            <div className="bg-blue-50 p-6 rounded-[24px] border border-blue-100">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-1 shrink-0" />
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  Setting a realistic radius helps in getting more relevant bookings and reduces travel time.
                </p>
              </div>
            </div>
          </div>

          {/* Map View Placeholder */}
          <div className="lg:col-span-2 bg-white p-2 rounded-[40px] border border-slate-100 shadow-sm relative min-h-[500px] overflow-hidden">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
              <MapIcon className="h-24 w-24 text-slate-200" />
              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/77.0266,28.4595,12/800x600?access_token=mock')] bg-cover opacity-60"></div>
              
              {/* Visual Radius Circle */}
              <div className="relative h-64 w-64 border-4 border-primary/30 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <div className="h-4 w-4 bg-primary border-4 border-white rounded-full shadow-xl relative z-10"></div>
                <div className="absolute -top-12 bg-white px-3 py-1.5 rounded-xl shadow-xl border border-slate-100">
                   <span className="text-xs font-black text-slate-900">{radius} KM Reach</span>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2">
              <button className="p-3 bg-white text-slate-600 rounded-xl shadow-xl hover:bg-slate-50 transition-all border border-slate-100">
                <Plus className="h-5 w-5" />
              </button>
              <button className="p-3 bg-white text-slate-600 rounded-xl shadow-xl hover:bg-slate-50 transition-all border border-slate-100">
                <Navigation className="h-5 w-5" />
              </button>
            </div>

            <div className="absolute top-8 left-8 right-8">
              <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-xl flex items-center gap-3">
                <Search className="h-4 w-4 text-slate-400 ml-2" />
                <input 
                  type="text" 
                  placeholder="Search a location..." 
                  className="bg-transparent border-none outline-none text-sm text-slate-600 w-full font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
