"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation, MapPin, Search, ChevronRight, Loader2 } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
}

const popularCities = [
  "Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", 
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Gurgaon"
];

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Using OpenStreetMap's Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
          );
          const data = await response.json();
          
          const city = data.address.city || 
                       data.address.town || 
                       data.address.village || 
                       data.address.state_district || 
                       "Unknown Location";
          
          onSelect(city);
          onClose();
        } catch (err) {
          setError("Failed to fetch city name");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setError("Permission denied or location unavailable");
        setIsLocating(false);
      }
    );
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSelect(searchQuery.trim());
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[201] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white pointer-events-auto w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    Select Location
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Find services available in your area
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-slate-50 transition-colors rounded-full"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] no-scrollbar">
                {/* Search Bar */}
                <form onSubmit={handleManualSearch} className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1D2B83] transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city e.g. Bengaluru"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent focus:border-[#1D2B83]/20 focus:bg-white rounded-2xl outline-none transition-all text-slate-700 font-medium"
                  />
                  <button 
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-[#1D2B83] hover:opacity-70"
                  >
                    Search
                  </button>
                </form>

                {/* Current Location Button */}
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={isLocating}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-[#1D2B83]/30 hover:bg-slate-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#1D2B83]">
                    {isLocating ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Navigation className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-slate-800 text-sm">
                      {isLocating ? "Locating you..." : "Use my current location"}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {error || "Detect location automatically via browser"}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1D2B83] transition-colors" />
                </button>

                {/* Popular Cities */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Popular Cities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {popularCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => onSelect(city)}
                        className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-[#1D2B83]/30 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all text-sm font-bold text-left"
                      >
                        <MapPin className="w-4 h-4 text-slate-300" />
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 bg-slate-50/50 flex justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Select a city to explore top services
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LocationModal;
