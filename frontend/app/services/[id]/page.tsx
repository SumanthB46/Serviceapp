"use client";

import React, { useState, useMemo, use } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import BookingServiceCard from "@/components/services/BookingServiceCard";
import BookingSidebar from "@/components/services/BookingSidebar";
import { Search, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

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

const servicesData: Record<string, ServiceData[]> = {
  electrical: [
    {
      id: "elec-1",
      title: "Fan installation / repair",
      rating: 4.88,
      reviews: "15.2K",
      price: 35,
      description: "Ceiling, wall, or exhaust fan installation. Noise troubleshooting and blade balancing.",
      image: "/images/services/fullhouse.png",
      subCategory: "Fan repair",
    },
    {
      id: "elec-2",
      title: "Light & switch installation",
      rating: 4.85,
      reviews: "9.7K",
      price: 59,
      description: "Installation of decorative lights, LEDs, or chandeliers. Modern switch panel mounting and testing.",
      image: "/images/services/kitchen.png",
      subCategory: "Light installation",
    },
    {
      id: "elec-3",
      title: "Wiring / rewiring",
      rating: 4.91,
      reviews: "5.1K",
      price: 199,
      description: "Full or partial house rewiring with fire-safe cables. Correction of short circuits and circuit up-gradation.",
      image: "/images/services/m1.jpg",
      subCategory: "Wiring",
    },
    {
      id: "elec-4",
      title: "Inverter setup",
      rating: 4.89,
      reviews: "4.5K",
      price: 89,
      description: "Installation and wiring of inverters and battery systems. Load testing and automatic switchover verification.",
      image: "/images/services/ac_sterilization_service_1775460291924.png",
      subCategory: "Inverter",
    },
    {
      id: "elec-5",
      title: "Doorbell installation",
      rating: 4.78,
      reviews: "3.2K",
      price: 25,
      description: "Installation of wired, wireless or smart video doorbells. App configuration and chime pairing included.",
      image: "/images/services/m2.jpg",
      subCategory: "Doorbell",
    },
  ],
  plumbing: [
    {
      id: "plumb-1",
      title: "Tap repair",
      rating: 4.82,
      reviews: "6.4K",
      price: 49,
      description: "Fixing leaky taps and replacing old fixtures with new ones.",
      image: "/images/services/m1.jpg",
      subCategory: "Taps",
    },
    {
      id: "plumb-2",
      title: "Pipe leakage fix",
      rating: 4.86,
      reviews: "8.1K",
      price: 99,
      description: "Detection and repair of hidden pipe leaks using specialized equipment.",
      image: "/images/services/m3.jpg",
      subCategory: "Leakage",
    },
    {
      id: "plumb-3",
      title: "Bathroom fittings",
      rating: 4.88,
      reviews: "5.7K",
      price: 129,
      description: "Installation of showers, commodes, and other bathroom accessories.",
      image: "/images/services/bathroom.png",
      subCategory: "Fittings",
    },
    {
      id: "plumb-4",
      title: "Water tank cleaning",
      rating: 4.92,
      reviews: "3.2K",
      price: 150,
      description: "Deep cleaning and UV disinfection of overhead and underground water tanks.",
      image: "/images/services/fullhouse.png",
      subCategory: "Tanks",
    },
    {
      id: "plumb-5",
      title: "Motor repair",
      rating: 4.85,
      reviews: "4.8K",
      price: 139,
      description: "Repair and servicing of water pumps and motors for consistent water supply.",
      image: "/images/services/m2.jpg",
      subCategory: "Motors",
    },
  ],
  carpentry: [
    {
      id: "carp-1",
      title: "Furniture repair",
      rating: 4.84,
      reviews: "7.2K",
      price: 79,
      description: "Fixing wobbling tables, broken chairs, and loose joints in wooden furniture.",
      image: "/images/services/m4.jpg",
      subCategory: "Repair",
    },
    {
      id: "carp-2",
      title: "Door/window fixing",
      rating: 4.86,
      reviews: "6.1K",
      price: 89,
      description: "Repairing hinges, locks, and alignment of doors and windows.",
      image: "/images/services/m5.jpg",
      subCategory: "Doors & Windows",
    },
    {
      id: "carp-3",
      title: "Modular kitchen work",
      rating: 4.90,
      reviews: "4.5K",
      price: 299,
      description: "Adjustment of modular cabinets and installation of new kitchen accessories.",
      image: "/images/services/kitchen.png",
      subCategory: "Kitchen",
    },
    {
      id: "carp-4",
      title: "Shelf installation",
      rating: 4.82,
      reviews: "5.3K",
      price: 69,
      description: "Installation of wall-mounted shelves for decor or utility.",
      image: "/images/services/m6.jpg",
      subCategory: "Shelving",
    },
  ],
  "home-cleaning": [
    {
      id: "hclean-1",
      title: "Full house deep cleaning",
      rating: 4.95,
      reviews: "18.4K",
      price: 499,
      description: "Systematic deep cleaning of all rooms including dusting, vacuuming, and mopping.",
      image: "/images/services/fullhouse.png",
      subCategory: "Full House",
    },
    {
      id: "hclean-2",
      title: "Kitchen deep cleaning",
      rating: 4.88,
      reviews: "9.2K",
      price: 199,
      description: "Removal of grease and stains from cabinets, exhaust fans, and walls.",
      image: "/images/services/kitchen.png",
      subCategory: "Kitchen",
    },
    {
      id: "hclean-3",
      title: "Bathroom cleaning",
      rating: 4.85,
      reviews: "11.1K",
      price: 99,
      description: "Disinfection and descaling of floor, wall tiles, and bathroom fixtures.",
      image: "/images/services/bathroom.png",
      subCategory: "Bathroom",
    },
    {
      id: "hclean-4",
      title: "Sofa cleaning",
      rating: 4.90,
      reviews: "7.6K",
      price: 149,
      description: "Dry vacuuming and shampooing for removal of deep-seated dirt.",
      image: "/images/services/carpet.png",
      subCategory: "Upholstery",
    },
  ],
  "commercial-cleaning": [
    {
      id: "cclean-1",
      title: "Office cleaning",
      rating: 4.92,
      reviews: "5.4K",
      price: 599,
      description: "Regular or deep cleaning for office spaces to maintain a professional environment.",
      image: "/images/services/fullhouse.png",
      subCategory: "Office",
    },
    {
      id: "cclean-2",
      title: "Apartment bulk cleaning",
      rating: 4.88,
      reviews: "3.7K",
      price: 1200,
      description: "Bulk cleaning services for entire apartment complexes or multiple units.",
      image: "/images/services/m2.jpg",
      subCategory: "Society",
    },
    {
      id: "cclean-3",
      title: "Post-construction cleaning",
      rating: 4.94,
      reviews: "2.1K",
      price: 899,
      description: "Removal of dust, debris, and stains after construction or renovation.",
      image: "/images/services/m3.jpg",
      subCategory: "Construction",
    },
  ],
  "ac-services": [
    {
      id: "ac-1",
      title: "AC installation",
      rating: 4.89,
      reviews: "9.5K",
      price: 149,
      description: "Professional installation of split or window AC units with perfect alignment.",
      image: "/images/services/ac_sterilization_service_1775460291924.png",
      subCategory: "Installation",
    },
    {
      id: "ac-2",
      title: "AC repair",
      rating: 4.82,
      reviews: "12.1K",
      price: 99,
      description: "Diagnosis and repair of cooling, noise, or electrical issues in your AC.",
      image: "/images/services/m1.jpg",
      subCategory: "Repair",
    },
    {
      id: "ac-3",
      title: "Gas refill",
      rating: 4.86,
      reviews: "7.3K",
      price: 199,
      description: "Refilling of refrigerant gas to restore optimal cooling performance.",
      image: "/images/services/m4.jpg",
      subCategory: "Gas",
    },
    {
      id: "ac-4",
      title: "AC servicing",
      rating: 4.92,
      reviews: "15.7K",
      price: 59,
      description: "Regular maintenance including filter cleaning and performance check.",
      image: "/images/services/ac_sterilization_service_1775460291924.png",
      subCategory: "Service",
    },
  ],
  "washing-machine": [
    {
      id: "wm-1",
      title: "Repair",
      rating: 4.85,
      reviews: "8.2K",
      price: 79,
      description: "Fixing drum issues, motor problems, or electrical control board faults.",
      image: "/images/services/m5.jpg",
      subCategory: "Repair",
    },
    {
      id: "wm-2",
      title: "Installation",
      rating: 4.88,
      reviews: "4.1K",
      price: 69,
      description: "Setting up new washing machines with proper plumbing and electrical connections.",
      image: "/images/services/m6.jpg",
      subCategory: "Installation",
    },
    {
      id: "wm-3",
      title: "Drum cleaning",
      rating: 4.80,
      reviews: "3.7K",
      price: 49,
      description: "Deep descaling and bacterial cleaning of the washing machine drum.",
      image: "/images/services/m1.jpg",
      subCategory: "Cleaning",
    },
  ],
  refrigerator: [
    {
      id: "ref-1",
      title: "Cooling issue fix",
      rating: 4.84,
      reviews: "9.3K",
      price: 99,
      description: "Resolving issues related to thermostat, gas leakage, or condenser.",
      image: "/images/services/m2.jpg",
      subCategory: "Cooling",
    },
    {
      id: "ref-2",
      title: "Gas refill",
      rating: 4.82,
      reviews: "5.1K",
      price: 149,
      description: "Refilling refrigerant gas for double door or side-by-side refrigerators.",
      image: "/images/services/m3.jpg",
      subCategory: "Gas",
    },
    {
      id: "ref-3",
      title: "General service",
      rating: 4.88,
      reviews: "6.7K",
      price: 59,
      description: "Complete cleaning and inspection of the appliance for long life.",
      image: "/images/services/m4.jpg",
      subCategory: "Service",
    },
  ],
  tv: [
    {
      id: "tv-1",
      title: "Wall mounting",
      rating: 4.92,
      reviews: "11.4K",
      price: 39,
      description: "Secure mounting of LED/Smart TVs on wall with cable management.",
      image: "/images/services/m5.jpg",
      subCategory: "Mounting",
    },
    {
      id: "tv-2",
      title: "Screen repair",
      rating: 4.75,
      reviews: "2.1K",
      price: 199,
      description: "Replacement or repair of display panels and backlights.",
      image: "/images/services/m6.jpg",
      subCategory: "Repair",
    },
    {
      id: "tv-3",
      title: "Setup",
      rating: 4.85,
      reviews: "4.8K",
      price: 29,
      description: "Configuring smart TV, soundbar, and home theater settings.",
      image: "/images/services/m1.jpg",
      subCategory: "Setup",
    },
  ],
  painting: [
    {
      id: "paint-1",
      title: "Interior painting",
      rating: 4.94,
      reviews: "8.7K",
      price: 1999,
      description: "Fresh coat of premium emulsion for your home interiors.",
      image: "/images/services/fullhouse.png",
      subCategory: "Interior",
    },
    {
      id: "paint-2",
      title: "Exterior painting",
      rating: 4.90,
      reviews: "5.1K",
      price: 2499,
      description: "Weatherproof exterior painting for protection and aesthetics.",
      image: "/images/services/m2.jpg",
      subCategory: "Exterior",
    },
    {
      id: "paint-3",
      title: "Waterproofing",
      rating: 4.88,
      reviews: "4.2K",
      price: 899,
      description: "Expert solutions for damp walls and terrace leakage.",
      image: "/images/services/m3.jpg",
      subCategory: "Waterproofing",
    },
  ],
  renovation: [
    {
      id: "reno-1",
      title: "Bathroom renovation",
      rating: 4.96,
      reviews: "3.1K",
      price: 4999,
      description: "Complete overhaul of your bathroom including tiles, plumbing, and fixtures.",
      image: "/images/services/bathroom.png",
      subCategory: "Bathroom",
    },
    {
      id: "reno-2",
      title: "Kitchen renovation",
      rating: 4.92,
      reviews: "2.7K",
      price: 6999,
      description: "Modern modular kitchen setup with smart storage and premium finishes.",
      image: "/images/services/kitchen.png",
      subCategory: "Kitchen",
    },
    {
      id: "reno-3",
      title: "Tile work",
      rating: 4.85,
      reviews: "5.4K",
      price: 499,
      description: "Laying of floor or wall tiles in any room of the house.",
      image: "/images/services/m4.jpg",
      subCategory: "Flooring",
    },
  ],
  tech: [
    {
      id: "tech-1",
      title: "CCTV installation",
      rating: 4.90,
      reviews: "6.1K",
      price: 299,
      description: "Setup of security cameras with remote viewing on your smartphone.",
      image: "/images/services/m5.jpg",
      subCategory: "CCTV",
    },
    {
      id: "tech-2",
      title: "Smart home setup",
      rating: 4.88,
      reviews: "4.5K",
      price: 199,
      description: "Installing smart speakers, lights, and plugs for voice control.",
      image: "/images/services/m6.jpg",
      subCategory: "Automation",
    },
    {
      id: "tech-3",
      title: "WiFi / router setup",
      rating: 4.84,
      reviews: "3.2K",
      price: 49,
      description: "Optimizing your home network for high-speed internet in every room.",
      image: "/images/services/m1.jpg",
      subCategory: "Internet",
    },
    {
      id: "tech-4",
      title: "Home automation",
      rating: 4.95,
      reviews: "2.8K",
      price: 499,
      description: "Complete automation of curtains, lights, and AC for a futuristic home.",
      image: "/images/services/m2.jpg",
      subCategory: "Smart Home",
    },
  ],
  outdoor: [
    {
      id: "out-1",
      title: "Gardening",
      rating: 4.92,
      reviews: "7.1K",
      price: 149,
      description: "Regular lawn maintenance, pruning, and fertilization for a lush green garden.",
      image: "/images/services/fullhouse.png",
      subCategory: "Gardening",
    },
    {
      id: "out-2",
      title: "Pest control",
      rating: 4.88,
      reviews: "12.4K",
      price: 99,
      description: "Durable and safe termite, cockroach, and mosquito control treatment.",
      image: "/images/services/m3.jpg",
      subCategory: "Pest Control",
    },
    {
      id: "out-3",
      title: "Water tank cleaning",
      rating: 4.90,
      reviews: "5.2K",
      price: 150,
      description: "Industrial cleaning of outdoor overhead tanks.",
      image: "/images/services/m4.jpg",
      subCategory: "Tank Cleaning",
    },
    {
      id: "out-4",
      title: "Landscaping",
      rating: 4.96,
      reviews: "1.2K",
      price: 1999,
      description: "Design and creation of beautiful terrace or outdoor garden landscapes.",
      image: "/images/services/m5.jpg",
      subCategory: "Design",
    },
  ],
  lifestyle: [
    {
      id: "life-1",
      title: "Salon at home",
      rating: 4.94,
      reviews: "25.1K",
      price: 199,
      description: "Haircut, facial, and grooming services by top-rated professionals at home.",
      image: "/images/services/salon_blowout_1775459997104.png",
      subCategory: "Salon",
    },
    {
      id: "life-2",
      title: "Spa / massage",
      rating: 4.92,
      reviews: "18.3K",
      price: 499,
      description: "Relaxing full-body massage and aromatherapy sessions for stress relief.",
      image: "/images/services/m6.jpg",
      subCategory: "Relaxation",
    },
    {
      id: "life-3",
      title: "Makeup artist",
      rating: 4.90,
      reviews: "7.2K",
      price: 899,
      description: "Bridal or party makeup with premium products by expert artists.",
      image: "/images/services/manicure_service_1775460066015.png",
      subCategory: "Makeup",
    },
    {
      id: "life-4",
      title: "Fitness trainer",
      rating: 4.95,
      reviews: "4.1K",
      price: 499,
      description: "Personal training sessions for yoga, weight loss, or muscle gain at home.",
      image: "/images/services/m1.jpg",
      subCategory: "Fitness",
    },
    {
      id: "life-5",
      title: "Home tutor",
      rating: 4.88,
      reviews: "3.5K",
      price: 299,
      description: "One-on-one academic tutoring for various subjects and grade levels.",
      image: "/images/services/m2.jpg",
      subCategory: "Education",
    },
  ],
  "apartment-society": [
    {
      id: "soc-1",
      title: "Bulk electrical work",
      rating: 4.94,
      reviews: "1.1K",
      price: 4999,
      description: "Large scale electrical maintenance and installation for apartment blocks.",
      image: "/images/services/m3.jpg",
      subCategory: "Electrical",
    },
    {
      id: "soc-2",
      title: "Wiring for buildings",
      rating: 4.92,
      reviews: "800",
      price: 9999,
      description: "Complete building-wide wiring projects for residential complexes.",
      image: "/images/services/m4.jpg",
      subCategory: "Wiring",
    },
    {
      id: "soc-3",
      title: "Lighting setup",
      rating: 4.90,
      reviews: "500",
      price: 2999,
      description: "Landscape and common area lighting using brands like Philips, Wipro.",
      image: "/images/services/m5.jpg",
      subCategory: "Lighting",
    },
    {
      id: "soc-4",
      title: "Maintenance contracts",
      rating: 4.95,
      reviews: "300",
      price: 1999,
      description: "Annual maintenance contracts for society common facilities.",
      image: "/images/services/m1.jpg",
      subCategory: "AMC",
    },
  ],
  "commercial-vendors": [
    {
      id: "comm-1",
      title: "Office maintenance",
      rating: 4.91,
      reviews: "1.2K",
      price: 3999,
      description: "On-call and scheduled maintenance for corporate office environments.",
      image: "/images/services/fullhouse.png",
      subCategory: "Maintenance",
    },
    {
      id: "comm-2",
      title: "Annual service contracts",
      rating: 4.96,
      reviews: "400",
      price: 7999,
      description: "Premium annual contracts for businesses ensuring zero downtime.",
      image: "/images/services/m6.jpg",
      subCategory: "AMC",
    },
    {
      id: "comm-3",
      title: "Equipment installation",
      rating: 4.89,
      reviews: "600",
      price: 1499,
      description: "Industrial grade equipment setup for commercial kitchens or labs.",
      image: "/images/services/kitchen.png",
      subCategory: "Installation",
    },
  ],
  emergency: [
    {
      id: "emerg-1",
      title: "Emergency electrician",
      rating: 4.98,
      reviews: "5.4K",
      price: 149,
      description: "Critical electrical fault detection and temporary restoration within 60 mins.",
      image: "/images/services/electrical_panel_service_1775460125959.png",
      subCategory: "Electrician",
    },
    {
      id: "emerg-2",
      title: "Emergency plumber",
      rating: 4.97,
      reviews: "4.8K",
      price: 129,
      description: "Rapid response for major pipe bursts or flood situations.",
      image: "/images/services/m1.jpg",
      subCategory: "Plumber",
    },
    {
      id: "emerg-3",
      title: "Lock repair",
      rating: 4.95,
      reviews: "3.2K",
      price: 99,
      description: "Emergency lockout help and critical lock repairs for security.",
      image: "/images/services/m5.jpg",
      subCategory: "Locksmith",
    },
    {
      id: "emerg-4",
      title: "Power failure support",
      rating: 4.96,
      reviews: "2.1K",
      price: 79,
      description: "Diagnosis of building-wide or phase-specific power failures.",
      image: "/images/services/m2.jpg",
      subCategory: "Support",
    },
  ],
};

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: categoryId } = use(params);
  const services = servicesData[categoryId] || [];
  
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeSubCategory, setActiveSubCategory] = useState("All Services");
  const [searchQuery, setSearchQuery] = useState("");

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
              {filteredServices.length > 0 ? (
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
