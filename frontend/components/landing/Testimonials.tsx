"use client";

import React from "react";
import { Rate, Avatar } from "antd";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Home Owner",
    feedback: "The AC repair service was exceptional. The technician arrived on time and explained everything clearly. Truly professional!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Architect",
    feedback: "Best deep cleaning service I've ever used. My house feels brand new. The attention to detail was unbelievable.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=michael",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Marketing Manager",
    feedback: "Finding a reliable math tutor for my son was so easy. Within hours we were matched with an expert. Amazing platform!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=elena",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-[#FCF8FF] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900">What our homeowners say</h2>
          <p className="mt-4 text-lg text-slate-600">Join thousands of happy customers who trust us with their homes.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col rounded-3xl bg-white p-8 shadow-soft"
            >
              <Rate disabled defaultValue={t.rating} className="mb-6 text-sm text-yellow-400" />
              <p className="mb-8 flex-grow text-slate-600 italic">"{t.feedback}"</p>
              <div className="flex items-center gap-4">
                <Avatar src={t.avatar} size={48} className="border-2 border-slate-100" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
