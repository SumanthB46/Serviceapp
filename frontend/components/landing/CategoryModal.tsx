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
            className="fixed inset-0 bg-black/40 backdrop-blur-[5px] z-[200]"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[201] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white pointer-events-auto w-full max-w-xl max-h-[85vh] rounded-[32px] shadow-2xl overflow-hidden relative flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-gray-50 flex-shrink-0">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {categoryName}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-slate-50 transition-colors rounded-full"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div className="space-y-10">
                  {serviceGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-6">
                      {group.title && (
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-tight">
                          {group.title}
                        </h3>
                      )}
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {group.services.map((service, serviceIdx) => {
                          // const Icon = service.icon;
                          return (
                            <motion.button
                              key={serviceIdx}
                              whileHover={{ y: -4 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleServiceClick(service.name)}
                              className="group flex flex-col items-center gap-3"
                            >
                              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center transition-all group-hover:bg-blue-50 group-hover:shadow-lg group-hover:shadow-blue-500/10 overflow-hidden">
                                {service.image ? (
                                  <img 
                                    src={service.image} 
                                    alt={service.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-3 h-3 rounded-full bg-[#1D2B83] opacity-20" />
                                )}
                              </div>
                              <span className="text-[11px] font-bold text-center leading-tight text-slate-600 group-hover:text-[#1D2B83] transition-colors max-w-[80px]">
                                {service.name}
                              </span>
                              {service.attributionLink && (
                                <a 
                                  href={service.attributionLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[6px] text-slate-300 hover:text-slate-500 transition-colors mt-0.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Icon by Freepik
                                </a>
                              )}
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
