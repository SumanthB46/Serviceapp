"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, Clock, CheckCircle2 } from "lucide-react";
import { BACKEND_URL } from "@/config/api";

interface CartItemListProps {
  items: any[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
}

export default function CartItemList({ items, removeFromCart, updateQuantity }: CartItemListProps) {
  return (
    <section className="space-y-4">
      <AnimatePresence mode="popLayout">
        {items?.map((item: any) => {
          const subservice = item.subservice_id;
          if (!subservice) return null;

          const itemId = subservice._id || subservice;
          const subserviceName = subservice.subservice_name || "Service";
          const categoryName = subservice.category_id?.category_name || "Home Service";
          const duration = subservice.duration || "45 mins";
          const price = item.price_snapshot || 0;
          const quantity = item.quantity || 1;
          const image = subservice.image;

          return (
            <motion.div
              key={itemId}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
            >
              <div className="flex gap-6">
                {/* Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
                  {image ? (
                    <img 
                      src={image.startsWith('http') ? image : `${BACKEND_URL}${image}`} 
                      alt={subserviceName} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Plus className="w-6 h-6 text-slate-200" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {categoryName}
                    </span>
                    <button 
                      onClick={() => removeFromCart(itemId)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="text-lg md:text-xl font-black text-slate-800 leading-tight mb-2">
                    {subserviceName}
                  </h4>
                  
                  <div className="flex flex-wrap gap-3 mb-auto">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      <Clock className="w-3 h-3" />
                      {duration}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                      <CheckCircle2 className="w-3 h-3" />
                      Available Today
                    </div>
                  </div>

                  {/* Controls & Price */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                      <button 
                        onClick={() => updateQuantity(itemId, Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-600 disabled:opacity-30"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-black text-slate-800 text-sm">{quantity}</span>
                      <button 
                        onClick={() => updateQuantity(itemId, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Subtotal</p>
                      <p className="text-xl font-black text-[#1D2B83]">₹{price * quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </section>
  );
}
