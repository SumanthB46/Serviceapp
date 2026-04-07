"use client";

import React from "react";
import Image from "next/image";
import { Star, Clock } from "lucide-react";
import { Button } from "antd";
import { motion } from "framer-motion";

interface ServiceCardProps {
  image: string;
  title: string;
  rating: number;
  // duration: string;
  price: string;
  category?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  image,
  title,
  rating,
  // duration,
  price,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex-shrink-0 w-[300px] bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 transition-all hover:shadow-xl group"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="text-[10px] font-bold text-slate-700">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-3 truncate">
          {title}
        </h3>
        
        <div className="flex items-center gap-4 mb-5">
          {/* <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">{duration}</span>
          </div> */}
          <div className="flex items-center gap-1">
            {/* <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">from</span> */}
            <span className="text-sm text-slate-700 font-bold">{price}</span>
          </div>
        </div>

        <Button 
          type="primary" 
          className="w-full bg-[#1D2B83] hover:bg-[#151f63] h-10 rounded-xl font-bold text-xs tracking-widest transition-all duration-300 border-none"
        >
          BOOK NOW
        </Button>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
