"use client";

import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const ContactHero = () => {
    const reveal = useScrollReveal(0.15);

    return (
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-[#f5f5f7]">
            <div
                ref={reveal.ref}
                className={`max-w-7xl mx-auto px-6 scroll-hidden ${reveal.isVisible ? 'scroll-visible' : ''}`}
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] text-blue-900">
                    Let&apos;s Build Your{' '}
                    <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent">
                        Vision.
                    </span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-500 leading-relaxed">
                    Our architectural consultants are ready to transform your residential
                    aspirations into a curated reality. Reach out for a bespoke consultation.
                </p>
            </div>
        </section>
    );
};

export default ContactHero;
