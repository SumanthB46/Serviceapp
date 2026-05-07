"use client";

import React, { useState, useMemo, Suspense } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import StickyNavPill from "@/components/common/StickyNavPill";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceCard from "@/components/services/ServiceCard";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useEffect } from "react";

interface ServiceItem {
  id: string;
  image: string;
  title: string;
  rating: number;
  price: string;
  priceValue: number;
  category: string;
}

const ServicesContent = () => {
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [filters, setFilters] = useState({
    sortBy: "recommended",
    minPrice: "0",
    maxPrice: "99999",
    rating: "any",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api'}/services`);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        
        const mappedData: ServiceItem[] = data.map((item: any) => ({
          id: item._id,
          image: item.images?.[0] || "/images/services/placeholder.png",
          title: item.service_name,
          rating: item.avg_rating || 0,
          price: `₹${item.base_price}`,
          priceValue: item.base_price,
          category: item.category_id?.category_name?.toLowerCase().replace(/ /g, '-') || "other",
        }));
        
        setAllServices(mappedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Sync with param change if needed (optional, but good for back/forward navigation)
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    if (searchParam !== undefined) {
      setSearchQuery(searchParam);
    }
  }, [categoryParam, searchParam]);

  const filteredServices = useMemo(() => {
    let result = [...allServices];

    // Category Filter
    if (activeCategory !== "all") {
      result = result.filter((service) => service.category === activeCategory);
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter((service) =>
        (service.title || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price Filter
    const min = parseFloat(filters.minPrice) || 0;
    const max = parseFloat(filters.maxPrice) || Infinity;
    result = result.filter(
      (service) => service.priceValue >= min && service.priceValue <= max
    );

    // Rating Filter
    if (filters.rating !== "any") {
      const minRating = parseFloat(filters.rating);
      result = result.filter((service) => service.rating >= minRating);
    }

    // Sort
    switch (filters.sortBy) {
      case "low-high":
        result.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "high-low":
        result.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "top-rated":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'recommended' or default
        break;
    }

    return result;
  }, [searchQuery, filters, activeCategory]);

  return (
    <main className="min-h-screen bg-[#FCF8FF]">
      <Navbar />
      <StickyNavPill />

      <ServiceHero 
        onSearch={setSearchQuery} 
        onApplyFilters={setFilters} 
      />

      {/* All Services Grid Section */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">
              {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
              {activeCategory !== "all" && <span className="text-[#1D2B83] capitalize"> in {activeCategory.replace("-", " ")}</span>}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#1D2B83] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-bold">
              {error}
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 border-t border-slate-100 pt-10">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  image={service.image}
                  title={service.title}
                  rating={service.rating}
                  price={service.price}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-t border-slate-100">
              <p className="text-slate-400 text-lg font-medium">No services found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                  setFilters({
                    sortBy: "recommended",
                    minPrice: "0",
                    maxPrice: "99999",
                    rating: "any",
                  });
                }}
                className="mt-4 text-[#1D2B83] font-bold underline underline-offset-4"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

const ServicesPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCF8FF] flex items-center justify-center">Loading services...</div>}>
      <ServicesContent />
    </Suspense>
  );
};

export default ServicesPage;
