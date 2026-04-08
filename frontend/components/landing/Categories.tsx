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
          { id: "fan", name: "Fan installation / repair", image: "/images/categorymodal/electrical/ceiling.png", duration: "45 mins", badge: "Sale" },
          { id: "light", name: "Light & switch installation", image: "/images/categorymodal/electrical/wall-lamp.png", duration: "30 mins" },
          { id: "wiring", name: "Wiring / rewiring", image: "/images/categorymodal/electrical/wiring.png", duration: "60 mins" },
          { id: "inverter", name: "Inverter setup", image: "/images/categorymodal/electrical/solar-inverter.png", duration: "45 mins", badge: "New" },
          { id: "doorbell", name: "Doorbell installation", image: "/images/categorymodal/electrical/doorbell.png", duration: "20 mins" },
        ],
      },
      {
        title: "Plumbing",
        services: [
          { id: "tap", name: "Tap repair", image: "/images/categorymodal/plumbing/plumbing.png", duration: "30 mins" },
          { id: "leakage", name: "Pipe leakage fix", image: "/images/categorymodal/plumbing/leaking.png", duration: "45 mins", badge: "Sale" },
          { id: "fittings", name: "Bathroom fittings", image: "/images/categorymodal/plumbing/shower.png", duration: "60 mins" },
          { id: "tank-cleaning", name: "Water tank cleaning", image: "/images/categorymodal/plumbing/cleaning (1).png", duration: "90 mins" },
          { id: "motor", name: "Motor repair", image: "/images/categorymodal/plumbing/motor.png", duration: "60 mins" },
        ],
      },
      {
        title: "Carpentry",
        services: [
          { id: "furniture", name: "Furniture repair", image: "/images/categorymodal/carpentry/sofa.png", duration: "60 mins", badge: "Sale" },
          { id: "door-fixing", name: "Door / window fixing", image: "/images/categorymodal/carpentry/window.png", duration: "45 mins" },
          { id: "kitchen-work", name: "Modular kitchen work", image: "/images/categorymodal/carpentry/kitchen.png", duration: "120 mins", badge: "Expert" },
          { id: "shelf", name: "Shelf installation", image: "/images/categorymodal/carpentry/stand.png", duration: "45 mins" },
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
          { id: "full-house", name: "Full house deep cleaning", image: "/images/categorymodal/home_cleaning/cleaning (2).png", duration: "4-6 hrs", badge: "Best Seller" },
          { id: "kitchen-clean", name: "Kitchen deep cleaning", image: "/images/categorymodal/home_cleaning/kitchen (1).png", duration: "2 hrs" },
          { id: "bathroom-clean", name: "Bathroom cleaning", image: "/images/categorymodal/home_cleaning/bathtub-cleaning.png", duration: "1 hr" },
          { id: "sofa-clean", name: "Sofa cleaning", image: "/images/categorymodal/home_cleaning/cleaning (3).png", duration: "1.5 hrs" },
        ],
      },
      {
        title: "Commercial Cleaning",
        services: [
          { id: "office", name: "Office cleaning", image: "/images/categorymodal/commercial_cleaning/office.png", duration: "2 hrs" },
          { id: "bulk", name: "Apartment bulk cleaning", image: "/images/categorymodal/commercial_cleaning/cleaning-service.png", duration: "1 hrs" },
          { id: "post-construction", name: "Post-construction cleaning", image: "/images/categorymodal/commercial_cleaning/power-washing.png", duration: "3 hrs" },
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
          { id: "ac-install", name: "AC installation", image: "/images/categorymodal/ac/air-conditioner.png", duration: "45 mins", badge: "Sale" },
          { id: "ac-repair", name: "AC repair", image: "/images/categorymodal/ac/air-conditioner (1).png", duration: "45 mins" },
          { id: "ac-gas", name: "Gas refill", image: "/images/categorymodal/ac/maintenance.png", duration: "45 mins" },
          { id: "ac-service", name: "AC servicing", image: "/images/categorymodal/ac/service (1).png", duration: "45 mins" },
        ],
      },
      {
        title: "Washing Machine",
        services: [
          { id: "wm-repair", name: "Repair", image: "/images/categorymodal/washing_machine/repair.png" },
          { id: "wm-install", name: "Installation", image: "/images/categorymodal/washing_machine/washing-machine.png" },
          { id: "wm-drum", name: "Drum cleaning", image: "/images/categorymodal/washing_machine/washing-machine (1).png" },
        ],
      },
      {
        title: "Refrigerator",
        services: [
          { id: "ref-cooling", name: "Cooling issue fix", image: "/images/categorymodal/refrigerator/fridge.png" },
          { id: "ref-gas", name: "Gas refill", image: "/images/categorymodal/refrigerator/gear.png" },
          { id: "ref-service", name: "General service", image: "/images/categorymodal/refrigerator/toolbox.png" },
        ],
      },
      {
        title: "TV",
        services: [
          { id: "tv-mount", name: "Wall mounting", image: "/images/categorymodal/tv/cinema.png" },
          { id: "tv-screen", name: "Screen repair", image: "/images/categorymodal/tv/tv.png" },
          { id: "tv-setup", name: "Setup", image: "/images/categorymodal/tv/monitor.png" },
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
          { id: "interior", name: "Interior painting", image: "/images/categorymodal/painting/interior-design.png" },
          { id: "exterior", name: "Exterior painting", image: "/images/categorymodal/painting/building.png" },
          { id: "waterproof", name: "Waterproofing", image: "/images/categorymodal/painting/waterproof.png" },
        ],
      },
      {
        title: "Renovation",
        services: [
          { id: "bath-reno", name: "Bathroom renovation", image: "/images/categorymodal/renovation/shinny.png"},
          { id: "kit-reno", name: "Kitchen renovation", image: "/images/categorymodal/renovation/kitchen (2).png" },
          { id: "tile-work", name: "Tile work", image: "/images/categorymodal/renovation/mosaic.png" },
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
          { id: "cctv", name: "CCTV installation", image: "/images/categorymodal/tech/camera.png" },
          { id: "smart-home", name: "Smart home setup", image: "/images/categorymodal/tech/smart-house.png" },
          { id: "wifi", name: "WiFi / router setup", image: "/images/categorymodal/tech/router.png" },
          { id: "automation", name: "Home automation", image: "/images/categorymodal/tech/customization.png" },
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
          { id: "gardening", name: "Gardening", image: "/images/categorymodal/outdoor/gardening (1).png" },
          { id: "pest", name: "Pest control", image: "/images/categorymodal/outdoor/pest-control.png" },
          { id: "tank-clean", name: "Water tank cleaning", image: "/images/categorymodal/outdoor/water-tank.png" },
          { id: "landscaping", name: "Landscaping", image: "/images/categorymodal/outdoor/river.png" },
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
          { id: "salon", name: "Salon at home", image: "/images/categorymodal/personal/hair-cutting.png" },
          { id: "spa", name: "Spa / massage", image: "/images/categorymodal/personal/massage.png" },
          { id: "makeup", name: "Makeup artist", image: "/images/categorymodal/personal/makeup.png" },
          { id: "fitness", name: "Fitness trainer", image: "/images/categorymodal/personal/exercise.png" },
          { id: "tutor", name: "Home tutor", image: "/images/categorymodal/personal/tutoring.png" },
        ],
      },
    ],
  },
  {
    id: "b2b",
    name: "B2B / Bulk",
    image: "/images/category/service.png",
    label: "BUSINESS",
    groups: [
      {
        title: "Apartment / Society",
        services: [
          { id: "society-bulk", name: "Apartment / Society Services", image: "/images/categorymodal/emergency/repair (2).png" },
          { id: "bulk-elec", name: "Bulk electrical work", image: "/images/categorymodal/emergency/electrician.png" },
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
