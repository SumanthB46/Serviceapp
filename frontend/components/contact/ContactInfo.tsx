"use client";

import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const contactDetails = [
    {
        icon: MapPin,
        label: 'OUR STUDIO',
        lines: ['482 Architectural Way, Suite 100', 'San Francisco, CA 94103'],
        color: 'from-indigo-500 to-purple-500',
    },
    {
        icon: Mail,
        label: 'INQUIRIES',
        lines: ['hello@architecturalservice.com'],
        color: 'from-blue-500 to-indigo-500',
    },
    {
        icon: Phone,
        label: 'DIRECT LINE',
        lines: ['+1 (415) 555-0192'],
        color: 'from-violet-500 to-fuchsia-500',
    },
];

const ContactInfo = () => {
    const reveal = useScrollReveal(0.1);

    return (
        <div
            ref={reveal.ref}
            className={`space-y-8 scroll-hidden ${reveal.isVisible ? 'scroll-visible' : ''}`}
        >
            {/* Info Card */}
        <div className="bg-[#F5F2FB] backdrop-blur-xl rounded-3xl border border-gray-100 shadow-lg shadow-black/[0.03] p-8 md:p-10">
                <div className="space-y-8">
                    {contactDetails.map(({ icon: Icon, label, lines, color }) => (
                        <div key={label} className="flex items-start gap-5 group">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-[#E1E0FF] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            <Icon size={20} className="text-[#15157D]" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#15157D] tracking-[0.15em] uppercase mb-1.5">
                                    {label}
                                </p>
                                {lines.map((line) => (
                                    <p key={line} className="text-gray-600 text-[15px] leading-relaxed">
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Architecture Image */}
            <div className="relative overflow-hidden rounded-3xl shadow-lg shadow-black/[0.06] group">
                <img
                    src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&auto=format&fit=crop"
                    alt="Modern architectural building"
                    className="w-full h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
        </div>
    );
};

export default ContactInfo;
