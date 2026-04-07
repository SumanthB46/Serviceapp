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

interface ServiceItem {
  id: string;
  image: string;
  title: string;
  rating: number;
  price: string;
  priceValue: number; // For sorting and filtering
  category: string;
}

const allServices: ServiceItem[] = [
  {
    id: "1",
    image: "/images/services/full_house.jpg",
    title: "Full House Cleaning",
    rating: 4.9,
    price: "₹2,499 – ₹5,999",
    priceValue: 2499,
    category: "cleaning",
  },
  {
    id: "2",
    image: "/images/services/bathroom.jpg",
    title: "Bathroom Cleaning",
    rating: 4.8,
    price: "₹499 – ₹899",
    priceValue: 499,
    category: "cleaning",
  },
  {
    id: "3",
    image: "/images/services/kitchen.jpg",
    title: "Kitchen Cleaning",
    rating: 5.0,
    price: "₹999 – ₹1,799",
    priceValue: 999,
    category: "cleaning",
  },
  {
    id: "4",
    image: "/images/services/carpet_cleaning.jpg",
    title: "Carpet Cleaning",
    rating: 4.7,
    price: "₹199 – ₹499",
    priceValue: 199,
    category: "cleaning",
  },
  {
    id: "5",
    image: "/images/services/electrical_panel_service_1775460125959.png",
    title: "Smart Home Setup",
    rating: 4.9,
    price: "₹2,499.00",
    priceValue: 2499,
    category: "electrical",
  },
  {
    id: "6",
    image: "/images/services/electrical_panel_service_1775460125959.png",
    title: "Fixture Installation",
    rating: 4.7,
    price: "₹499.00",
    priceValue: 499,
    category: "installation",
  },
  {
    id: "7",
    image: "/images/services/ac_sterilization_service_1775460291924.png",
    title: "HVAC Sterilization",
    rating: 5.0,
    price: "₹1,899.00",
    priceValue: 1899,
    category: "ac-repair",
  },
  {
    id: "8",
    image: "/images/services/m1.jpg",
    title: "Leak Detection",
    rating: 4.9,
    price: "₹999.00",
    priceValue: 999,
    category: "plumbing",
  },
  {
    id: "9",
    image: "/images/services/salon_blowout_1775459997104.png",
    title: "Deep Sculpt Facial",
    rating: 5.0,
    price: "₹2,500.00",
    priceValue: 2500,
    category: "salon",
  },
  {
    id: "10",
    image: "/images/services/manicure_service_1775460066015.png",
    title: "Signature Pedicure",
    rating: 4.7,
    price: "₹1,200.00",
    priceValue: 1200,
    category: "salon",
  },
  {
    id: "11",
    image: "/images/services/ac_sterilization_service_1775460291924.png",
    title: "Full System Re-gas",
    rating: 4.7,
    price: "₹3,500.00",
    priceValue: 3500,
    category: "ac-repair",
  },
  {
    id: "12",
    image: "/images/services/m2.jpg",
    title: "Pipe Replacement",
    rating: 4.8,
    price: "₹4,000.00",
    priceValue: 4000,
    category: "plumbing",
  },
];

const ServicesContent = () => {
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

  // Sync with param change if needed (optional, but good for back/forward navigation)
  React.useEffect(() => {
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
        service.title.toLowerCase().includes(searchQuery.toLowerCase())
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

          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 border-t border-slate-100 pt-10">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
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
