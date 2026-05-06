"use client";

import React, { useState, useMemo, use } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import BookingServiceCard from "@/components/services/BookingServiceCard";
import BookingSidebar from "@/components/services/BookingSidebar";
import { Search, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { useEffect } from "react";

interface ServiceData {
  id: string;
  title: string;
  rating: number;
  reviews: string;
  price: number;
  description: string;
  image: string;
  subCategory: string;
}

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: serviceId } = use(params);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeSubCategory, setActiveSubCategory] = useState("All Services");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api'}/sub-services?service_id=${serviceId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch sub-services');
        }
        const data = await response.json();
        
        // Map backend SubService to frontend ServiceData
        const mappedData: ServiceData[] = data.map((item: any) => ({
          id: item._id,
          title: item.subservice_name,
          rating: 4.8 + Math.random() * 0.2, // Random rating as placeholder if not in DB
          reviews: `${Math.floor(Math.random() * 10000)}`, // Placeholder reviews
          price: item.base_price,
          description: item.description,
          image: item.image || "/images/services/placeholder.png",
          subCategory: item.service_id?.service_name || "General",
        }));
        
        setServices(mappedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchSubServices();
    }
  }, [serviceId]);
  


  const subCategories = useMemo(() => {
    const subs = Array.from(new Set(services.map(s => s.subCategory)));
    return ["All Services", ...subs];
  }, [services]);

  const filteredServices = services.filter(service => {
    const matchesCategory = activeSubCategory === "All Services" || service.subCategory === activeSubCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const service = services.find(s => s.id === id);
    return {
      id,
      title: service?.title || "",
      price: service?.price || 0,
      quantity,
    };
  }).filter(item => item.quantity > 0);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const newQty = (prev[id] || 0) + delta;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  return (
    <main className="min-h-screen bg-[#FCF8FF]">
      <Navbar />
      
      {/* Header / Search Section */}
      <section className="pt-24 pb-12 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-8">

            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-x-0 -bottom-2 h-12 bg-[#1D2B83]/5 rounded-2xl blur-xl group-focus-within:bg-[#1D2B83]/10 transition-all" />
              <div className="relative flex items-center bg-white border-2 border-slate-100 group-focus-within:border-[#1D2B83] rounded-2xl px-6 h-16 transition-all shadow-sm">
                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-[#1D2B83]" />
                <input
                  type="text"
                  placeholder="Search for switch, socket, repair..."
                  className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-bold text-slate-700 placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Sub-category Pills */}
            <div className="flex items-center gap-3 no-scrollbar pb-2">
              {subCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubCategory(sub)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[11px] font-black tracking-widest transition-all border-2 ${
                    activeSubCategory === sub
                      ? "bg-[#1D2B83] border-[#1D2B83] text-white shadow-lg shadow-[#1D2B83]/20"
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Service List (Left) */}
            <div className="flex-1 space-y-8">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-[#1D2B83] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-500 font-bold">
                  {error}
                </div>
              ) : filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <BookingServiceCard
                      {...service}
                      quantity={cart[service.id] || 0}
                      onAdd={() => handleUpdateQuantity(service.id, 1)}
                      onRemove={() => handleUpdateQuantity(service.id, -1)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No services found</p>
                </div>
              )}
            </div>

            {/* Sidebar (Right) */}
            <aside className="w-full lg:w-[380px]">
              <BookingSidebar 
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
              />
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
