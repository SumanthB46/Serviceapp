"use client";

import React, { useState } from "react";
import {
  Wind, Zap, Pipette as Pipe, Sparkles, Settings, Hammer, ChevronRight,
  Home, Monitor, ShieldCheck, Trees, User, Building2,
  Lightbulb, Droplets, PenTool, Layout, WashingMachine, Refrigerator,
  Tv, Paintbrush, Construction, Video, Wifi, Smartphone, Bug, Scissors,
  Palmtree, GraduationCap, Dumbbell, Coffee, Leaf
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import CategoryModal from "./CategoryModal";

const categoriesData = [
  {
    id: "home-services",
    name: "Home Services",
    image: "/images/Category/house.png",
    label: "REPAIR & FIX",
    groups: [
      {
        title: "Electrical",
        services: [
          { id: "fan", name: "Fan installation / repair", attributionLink: "https://www.flaticon.com/free-icons/furniture-and-household" },
          { id: "light", name: "Light & switch installation" },
          { id: "wiring", name: "Wiring / rewiring" },
          { id: "inverter", name: "Inverter setup" },
          { id: "doorbell", name: "Doorbell installation" },
        ],
      },
      {
        title: "Plumbing",
        services: [
          { id: "tap", name: "Tap repair" },
          { id: "leakage", name: "Pipe leakage fix" },
          { id: "fittings", name: "Bathroom fittings", image: "/images/services/bathroom.png", attributionLink: "https://www.flaticon.com/free-icons/furniture-and-household" },
          { id: "tank-cleaning", name: "Water tank cleaning" },
          { id: "motor", name: "Motor repair" },
        ],
      },
      {
        title: "Carpentry",
        services: [
          { id: "furniture", name: "Furniture repair", icon: Hammer },
          { id: "door-fixing", name: "Door / window fixing", icon: Home },
          { id: "kitchen-work", name: "Modular kitchen work", icon: Layout },
          { id: "shelf", name: "Shelf installation", icon: PenTool },
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
        title: "Home Cleaning",
        services: [
          { id: "full-house", name: "Full house deep cleaning", image: "/images/services/fullhouse.png" },
          { id: "kitchen-clean", name: "Kitchen deep cleaning", image: "/images/services/kitchen.png" },
          { id: "bathroom-clean", name: "Bathroom cleaning", image: "/images/services/bathroom.png" },
          { id: "sofa-clean", name: "Sofa cleaning" },
        ],
      },
      {
        title: "Commercial Cleaning",
        services: [
          { id: "office", name: "Office cleaning", icon: Building2 },
          { id: "bulk", name: "Apartment bulk cleaning", icon: Building2 },
          { id: "post-construction", name: "Post-construction cleaning", icon: Construction },
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
        title: "AC Services",
        services: [
          { id: "ac-install", name: "AC installation", icon: Wind },
          { id: "ac-repair", name: "AC repair", icon: Settings },
          { id: "ac-gas", name: "Gas refill", icon: Wind },
          { id: "ac-service", name: "AC servicing", icon: Sparkles },
        ],
      },
      {
        title: "Washing Machine",
        services: [
          { id: "wm-repair", name: "Repair", icon: Settings },
          { id: "wm-install", name: "Installation", icon: Hammer },
          { id: "wm-drum", name: "Drum cleaning", icon: Sparkles },
        ],
      },
      {
        title: "Refrigerator",
        services: [
          { id: "ref-cooling", name: "Cooling issue fix", icon: Wind },
          { id: "ref-gas", name: "Gas refill", icon: Wind },
          { id: "ref-service", name: "General service", icon: Settings },
        ],
      },
      {
        title: "TV",
        services: [
          { id: "tv-mount", name: "Wall mounting", icon: Tv },
          { id: "tv-screen", name: "Screen repair", icon: Monitor },
          { id: "tv-setup", name: "Setup", icon: Settings },
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
        title: "Painting",
        services: [
          { id: "interior", name: "Interior painting", icon: Paintbrush },
          { id: "exterior", name: "Exterior painting", icon: Paintbrush },
          { id: "waterproof", name: "Waterproofing", icon: Droplets },
        ],
      },
      {
        title: "Renovation",
        services: [
          { id: "bath-reno", name: "Bathroom renovation", icon: Layout },
          { id: "kit-reno", name: "Kitchen renovation", icon: Layout },
          { id: "tile-work", name: "Tile work", icon: Layout },
        ],
      },
    ],
  },
  {
    id: "tech",
    name: "Smart / Tech",
    image: "/images/Category/security-cam.png",
    label: "PRO SETUP",
    groups: [
      {
        title: "Tech Solutions",
        services: [
          { id: "cctv", name: "CCTV installation", icon: Video },
          { id: "smart-home", name: "Smart home setup", icon: Smartphone },
          { id: "wifi", name: "WiFi / router setup", icon: Wifi },
          { id: "automation", name: "Home automation", icon: Zap },
        ],
      },
    ],
  },
  {
    id: "outdoor",
    name: "Outdoor Services",
    image: "/images/Category/gardening.png",
    label: "GREEN & CLEAN",
    groups: [
      {
        title: "Care & Maintenance",
        services: [
          { id: "gardening", name: "Gardening", icon: Leaf },
          { id: "pest", name: "Pest control", icon: Bug },
          { id: "tank-clean", name: "Water tank cleaning", icon: Droplets },
          { id: "landscaping", name: "Landscaping", icon: Palmtree },
        ],
      },
    ],
  },
  {
    id: "lifestyle",
    name: "Personal & Lifestyle",
    image: "/images/Category/salon.png",
    label: "LUXURY CARE",
    groups: [
      {
        title: "Wellness & Learning",
        services: [
          { id: "salon", name: "Salon at home", icon: Scissors },
          { id: "spa", name: "Spa / massage", icon: Sparkles },
          { id: "makeup", name: "Makeup artist", icon: Sparkles },
          { id: "fitness", name: "Fitness trainer", icon: Dumbbell },
          { id: "tutor", name: "Home tutor", icon: GraduationCap },
        ],
      },
    ],
  },
  {
    id: "b2b",
    name: "B2B / Bulk",
    image: "/images/Category/service.png",
    label: "BUSINESS",
    groups: [
      {
        title: "Apartment / Society",
        services: [
          { id: "society-bulk", name: "Apartment / Society Services", icon: Building2 },
          { id: "bulk-elec", name: "Bulk electrical work", icon: Zap },
        ],
      },
    ],
  },
];

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<typeof categoriesData[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryClick = (category: typeof categoriesData[0]) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  return (
    <section className="bg-[#F5F2FB] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
            What do you need help with?
          </h2>
          <div className="h-1.5 w-20 bg-[#1D2B83] rounded-full" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 px-2">
          {categoriesData.map((cat) => {
            const isActive = selectedCategory?.id === cat.id;

            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
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
          serviceGroups={selectedCategory.groups}
        />
      )}
    </section>
  );
};

export default Categories;
