"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface SubService {
  name: string;
  image?: string;
  attributionLink?: string;
  id: string;
  badge?: string;
  duration?: string;
  icon?: LucideIcon;
}

interface ServiceGroup {
  title: string;
  services: SubService[];
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  serviceGroups: ServiceGroup[];
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categoryName,
  serviceGroups,
}) => {
  const router = useRouter();

  const handleServiceClick = (serviceName: string) => {
    onClose();
    // Navigate to services page with the search query pre-filled
    router.push(`/services?search=${encodeURIComponent(serviceName)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[200]"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[201] p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="bg-white pointer-events-auto w-full max-w-xl max-h-[85vh] rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden relative flex flex-col"
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2.5 hover:bg-slate-50 transition-all rounded-full z-10 bg-white/80 backdrop-blur-sm shadow-sm"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-10 mt-2">
                <div className="space-y-12">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight text-center sm:text-left">
                    {categoryName}
                  </h2>

                  {serviceGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-8">
                      {group.title && (
                        <div className="flex items-center gap-4">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
                            {group.title}
                          </h3>
                          <div className="h-px w-full bg-slate-100" />
                        </div>
                      )}
                      
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-6 gap-y-10">
                        {group.services.map((service, serviceIdx) => {
                          const Icon = service.icon;
                          return (
                            <motion.button
                              key={serviceIdx}
                              whileHover={{ y: -6 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleServiceClick(service.name)}
                              className="group flex flex-col items-center gap-4"
                            >
                              <div className="relative w-full aspect-square bg-[#F8F9FA] rounded-[24px] flex items-center justify-center transition-all group-hover:bg-white group-hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] overflow-hidden border border-transparent group-hover:border-slate-100">
                                {service.image ? (
                                  <img 
                                    src={service.image} 
                                    alt={service.name} 
                                    className="w-1/2 h-1/2 object-contain"
                                  />
                                ) : Icon ? (
                                  <Icon className="w-8 h-8 text-slate-400 group-hover:text-[#1D2B83] transition-colors" />
                                ) : (
                                  <div className="w-3 h-3 rounded-full bg-[#1D2B83] opacity-20" />
                                )}

                                {/* Badge */}
                                {service.badge && (
                                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#E6F9F0] text-[#008A4E] text-[8px] font-bold rounded-full leading-none border border-[#BFF0D9]">
                                    {service.badge}
                                  </div>
                                )}

                                {/* Duration Label */}
                                {service.duration && (
                                  <div className="absolute bottom-2 inset-x-2 flex justify-center">
                                    <div className="px-2 py-0.5 bg-white/90 backdrop-blur-[2px] text-slate-500 text-[8px] font-bold rounded-md shadow-sm border border-slate-50">
                                      {service.duration}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <span className="text-[11px] font-bold text-center leading-tight text-slate-600 group-hover:text-[#1D2B83] transition-colors line-clamp-2 px-1">
                                {service.name}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;
