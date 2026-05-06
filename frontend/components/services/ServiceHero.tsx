

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import FilterSidebar from "./FilterSidebar";



interface ServiceHeroProps {
  onSearch: (query: string) => void;
  onApplyFilters: (filters: {
    sortBy: string;
    minPrice: string;
    maxPrice: string;
    rating: string;
  }) => void;
}

const ServiceHero: React.FC<ServiceHeroProps> = ({
  onSearch,
  onApplyFilters
}) => {
  const [selected, setSelected] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <section className="bg-white pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <h1 className="text-[50px] font-black text-[#1D2B83] leading-none mb-6 tracking-tight">
          All Services
        </h1>
        {/* <p className="max-w-2xl text-lg text-slate-400 font-medium leading-relaxed mb-12">
          Explore a curated ecosystem of premium home maintenance, aesthetic care, 
          and educational expertise. Precise execution for the modern homeowner.
        </p> */}

        {/* Search and Filters Bar */}
        <div className="flex items-center justify-end gap-3 mb-8">
          {/* Search and Filters (Right Side) */}
          <div className="flex items-center gap-3 w-full lg:w-auto px-2">
            {/* Search Input */}
            <div className="relative flex-1 lg:flex-none lg:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search services..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full bg-white rounded-full py-3 pl-11 pr-6 text-xs font-medium text-slate-700 outline-none border border-transparent focus:border-[#1D2B83]/20 transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-white px-5 py-3 rounded-full border border-transparent hover:border-[#1D2B83]/20 shadow-sm transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#1D2B83]" />
              <span className="text-xs font-bold text-[#1D2B83]">Filters</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filter Sidebar Component */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={onApplyFilters}
      />
    </section>
  );
};

export default ServiceHero;
