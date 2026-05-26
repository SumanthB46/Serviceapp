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
    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <AnimatePresence mode="popLayout">
        {items?.map((item: any, index: number) => {
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: "hidden" }}
              transition={{ duration: 0.25 }}
            >
              {/* Divider between items */}
              {index > 0 && (
                <div className="mx-6 h-px bg-slate-100" />
              )}

              <div className="group flex gap-5 px-6 py-5">
                {/* Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
                  {image ? (
                    <img
                      src={image.startsWith("http") ? image : `${BACKEND_URL}${image}`}
                      alt={subserviceName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Plus className="w-5 h-5 text-slate-200" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {categoryName}
                    </span>
                    <button
                      onClick={() => removeFromCart(itemId)}
                      className="p-1.5 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 -mr-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-base font-black text-slate-800 leading-tight mb-2 truncate pr-2">
                    {subserviceName}
                  </h4>

                  <div className="flex flex-wrap gap-2 mb-auto">
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-50 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                      <Clock className="w-2.5 h-2.5" />
                      {duration}
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 rounded-full text-[9px] font-bold text-emerald-600 uppercase tracking-wide">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Available Today
                    </div>
                  </div>

                  {/* Controls & Price */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl">
                      <button
                        onClick={() => updateQuantity(itemId, Math.max(1, quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-600 disabled:opacity-30"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-black text-slate-800 text-sm">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(itemId, quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Subtotal</p>
                      <p className="text-lg font-black text-[#1D2B83]">₹{price * quantity}</p>
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
