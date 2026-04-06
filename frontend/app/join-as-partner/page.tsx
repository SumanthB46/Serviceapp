"use client";

import React, { useRef } from "react";
import { PartnerNavbar } from "@/components/partner/PartnerNavbar";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { PartnerFeatures } from "@/components/partner/PartnerFeatures";
import { PartnerRegistrationSection } from "@/components/partner/PartnerRegistration";
import { PartnerFAQ } from "@/components/partner/PartnerFAQ";
import { PartnerTerms } from "@/components/partner/PartnerTerms";
import { PartnerFinalCTA } from "@/components/partner/PartnerFinalCTA";
import { PartnerFooterStrip } from "@/components/partner/PartnerFooter";
import StickyNavPill from '@/components/common/StickyNavPill';
/**
 * JoinAsPartnerPage Layout
 * Extracted into smaller, modular components in @/components/partner/
 * for better maintainability and performance.
 */
export default function JoinAsPartnerPage() {
    const formRef = useRef<HTMLDivElement>(null);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <div className="min-h-screen bg-[#FCF8FF] font-sans">
            <StickyNavPill />
            {/* Header / Navigation */}
            <PartnerNavbar onRegisterClick={scrollToForm} />

            {/* 1. Hero Section */}
            <PartnerHero onRegisterClick={scrollToForm} />

            {/* 2. Core Features & Benefits */}
            {/* Includes Sections: Who Can Join, How It Works, Benefits, Documents Required, Testimonials */}
            <PartnerFeatures />

            {/* 3. Multi-Step Registration Form */}
            <PartnerRegistrationSection formRef={formRef} />

            {/* 4. Terms and Conditions Summary */}
            <PartnerTerms />

            {/* 5. Frequently Asked Questions */}
            <PartnerFAQ />

            {/* 6. Final Call to Action */}
            <PartnerFinalCTA onRegisterClick={scrollToForm} />

            {/* 7. Footer Strip */}
            <PartnerFooterStrip />
        </div>
    );
}
