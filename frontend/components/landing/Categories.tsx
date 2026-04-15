"use client";

import React, { useState } from "react";
import {
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryModal from "./CategoryModal";

interface Category {
  id: string;
  name: string;
  image: string;
  label: string;
  redirectPath?: string;
  groups?: {
    title: string;
    services: {
      id: string;
      name: string;
      image: string;
    }[];
  }[];
}

const categoriesData: Category[] = [
  {
    id: "home-services",
    name: "Home Services",
    image: "/images/Category/house.png",
    label: "REPAIR & FIX",
    groups: [
      {
        title: "",
        services: [
          { id: "electrical", name: "Electrical", image: "/images/categorymodal/electrical/wiring.png" },
          { id: "plumbing", name: "Plumbing", image: "/images/categorymodal/plumbing/plumbing.png" },
          { id: "carpentry", name: "Carpentry", image: "/images/categorymodal/carpentry/sofa.png" },
        ],
      },
    ],
  },
  {
    id: "cleaning",
    name: "Cleaning Services",
    image: "/images/Category/cleaning.png",
    label: "DEEP CLEAN",
    groups: [
      {
        title: "",
        services: [
          { id: "home-cleaning", name: "Home Cleaning", image: "/images/categorymodal/home_cleaning/cleaning (2).png" },
          { id: "commercial-cleaning", name: "Commercial Cleaning", image: "/images/categorymodal/commercial_cleaning/office.png" },
        ],
      },
    ],
  },
  {
    id: "appliances",
    name: "Appliance Services",
    image: "/images/Category/trolley.png",
    label: "GADGET FIX",
    groups: [
      {
        title: "",
        services: [
          { id: "ac-services", name: "AC Services", image: "/images/categorymodal/ac/air-conditioner.png" },
          { id: "washing-machine", name: "Washing Machine", image: "/images/categorymodal/washing_machine/washing-machine.png" },
          { id: "refrigerator", name: "Refrigerator", image: "/images/categorymodal/refrigerator/fridge.png" },
          { id: "tv", name: "TV", image: "/images/categorymodal/tv/tv.png" },
        ],
      },
    ],
  },
  {
    id: "improvement",
    name: "Home Improvement",
    image: "/images/Category/paint-roller.png",
    label: "RENOVATION",
    groups: [
      {
        title: "",
        services: [
          { id: "painting", name: "Painting", image: "/images/categorymodal/painting/interior-design.png" },
          { id: "renovation", name: "Renovation", image: "/images/categorymodal/renovation/shinny.png" },
        ],
      },
    ],
  },
  {
    id: "tech",
    name: "Smart / Tech",
    image: "/images/Category/security-cam.png",
    label: "PRO SETUP",
    redirectPath: "/services/tech",
  },
  {
    id: "outdoor",
    name: "Outdoor Services",
    image: "/images/Category/gardening.png",
    label: "GREEN & CLEAN",
    redirectPath: "/services/outdoor",
  },
  {
    id: "lifestyle",
    name: "Personal & Lifestyle",
    image: "/images/Category/salon.png",
    label: "LUXURY CARE",
    redirectPath: "/services/lifestyle",
  },
  {
    id: "b2b",
    name: "B2B / Bulk",
    image: "/images/category/service.png",
    label: "BUSINESS",
    groups: [
      {
        title: "",
        services: [
          { id: "apartment-society", name: "Apartment / Society Services", image: "/images/categorymodal/emergency/repair (2).png" },
          { id: "commercial-vendors", name: "Commercial Vendors", image: "/images/categorymodal/emergency/technician.png" },
        ],
      },
    ],
  },
  {
    id: "emergency",
    name: "Emergency Services",
    image: "/images/Category/emergency-call.png",
    label: "24/7 SUPPORT",
    redirectPath: "/services/emergency",
  }
  
];

const Categories = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryClick = (category: Category) => {
    if (category.redirectPath) {
      router.push(category.redirectPath);
      return;
    }
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  return (
    <section className="bg-[#F5F2FB] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
            What do you need help with?
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-1.5 w-20 bg-[#1D2B83] rounded-full origin-left"
          />
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-4 px-2">
          {categoriesData.map((cat, index) => {
            const isActive = selectedCategory?.id === cat.id;

            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06, type: "spring", bounce: 0.4 }}
                whileHover={{ y: -6, scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => handleCategoryClick(cat)}
                className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-4 transition-all duration-300 ${isActive
                  ? "border-[#1D2B83] bg-[#1D2B83] text-white shadow-lg shadow-[#1D2B83]/20"
                  : "border-white bg-white text-slate-600 shadow-sm hover:border-blue-100 hover:bg-[#F0F7FF] hover:shadow-md"
                  }`}
              >
                <div
                  className={`rounded-xl p-2 transition-all duration-300 ${isActive ? "bg-white/20 scale-110" : "bg-slate-50"
                    }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className={`text-[7px] font-black uppercase tracking-[0.1em] ${isActive ? "text-white/70" : "text-slate-400"}`}>
                    {cat.label}
                  </span>
                  <span className="text-[9px] font-black uppercase text-center leading-tight">
                    {cat.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* View More Button */}
        <div className="mt-12 flex justify-center">
          <Link href="/services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#1D2B83] shadow-md transition-all hover:bg-[#1D2B83] hover:text-white"
            >
              View All Services
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Selection Modal */}
      {selectedCategory && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          categoryName={selectedCategory.name}
          serviceGroups={selectedCategory.groups || []}
        />
      )}
    </section>
  );
};

export default Categories;
