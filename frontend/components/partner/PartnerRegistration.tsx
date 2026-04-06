"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    User,
    Phone,
    Mail,
    MapPin,
    Briefcase,
    ChevronDown,
    ChevronRight,
    Upload,
    Award,
} from "lucide-react";

const FORM_STEPS = ["Personal Info", "Professional", "Documents", "Review"];

const SERVICE_OPTIONS = [
    "Tutoring",
    "Cleaning",
    "Salon",
    "Bulk Ordering",
    "Loans / EMI",
    "AC Repair",
    "Electrical",
    "Plumbing",
    "Painting",
    "Carpentry",
    "Pest Control",
    "Appliance Repair",
    "Beauty & Spa",
    "Fitness Trainer",
    "Packers & Movers",
    "Laundry",
    "Other",
];

function InputField({
    icon,
    placeholder,
    value,
    onChange,
    type = "text",
}: {
    icon: React.ReactNode;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
}) {
    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-[#1D2B83] focus:outline-none focus:ring-2 focus:ring-[#1D2B83]/20 transition-all"
            />
        </div>
    );
}

export function MultiStepForm() {
    const [step, setStep] = useState(0);
    const [agreed, setAgreed] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState("");
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        category: "",
        experience: "",
        location: "",
    });

    const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

    const next = () => setStep((s) => Math.min(s + 1, FORM_STEPS.length - 1));
    const back = () => setStep((s) => Math.max(s - 1, 0));

    const handleSubmit = () => {
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 rounded-3xl bg-white p-12 shadow-soft text-center"
            >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Application Submitted!</h3>
                <p className="text-slate-500 max-w-sm">
                    Thanks for registering. Our team will review your application and get back to you within
                    24–48 hours.
                </p>
                <button
                    onClick={() => { setSubmitted(false); setStep(0); setForm({ name: "", phone: "", email: "", category: "", experience: "", location: "" }); setAgreed(false); setFileName(""); }}
                    className="mt-2 rounded-xl bg-[#1D2B83] px-8 py-3 text-sm font-semibold text-white hover:bg-[#16236b] transition-colors"
                >
                    Submit Another
                </button>
            </motion.div>
        );
    }

    return (
        <div className="rounded-3xl bg-white shadow-soft overflow-hidden">
            {/* Progress bar */}
            <div className="px-8 pt-8 pb-0">
                <div className="flex items-center gap-0 mb-8">
                    {FORM_STEPS.map((label, i) => (
                        <React.Fragment key={i}>
                            <div className="flex flex-col items-center gap-1">
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 ${i <= step
                                        ? "bg-[#1D2B83] text-white"
                                        : "bg-slate-100 text-slate-400"
                                        }`}
                                >
                                    {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                                </div>
                                <span
                                    className={`hidden sm:block text-[10px] font-semibold transition-colors duration-300 ${i <= step ? "text-[#1D2B83]" : "text-slate-400"
                                        }`}
                                >
                                    {label}
                                </span>
                            </div>
                            {i < FORM_STEPS.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-2 transition-colors duration-500 ${i < step ? "bg-[#1D2B83]" : "bg-slate-200"
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Form body */}
            <div className="px-8 pb-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.28 }}
                    >
                        {step === 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField icon={<User className="h-4 w-4" />} placeholder="Full Name" value={form.name} onChange={(v) => update("name", v)} />
                                    <InputField icon={<Phone className="h-4 w-4" />} placeholder="Phone Number" value={form.phone} onChange={(v) => update("phone", v)} type="tel" />
                                </div>
                                <InputField icon={<Mail className="h-4 w-4" />} placeholder="Email Address" value={form.email} onChange={(v) => update("email", v)} type="email" />
                                <InputField icon={<MapPin className="h-4 w-4" />} placeholder="City / Location" value={form.location} onChange={(v) => update("location", v)} />
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Professional Details</h3>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <select
                                        value={form.category}
                                        onChange={(e) => update("category", e.target.value)}
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 focus:border-[#1D2B83] focus:outline-none focus:ring-2 focus:ring-[#1D2B83]/20 transition-all"
                                    >
                                        <option value="">Select Service Category</option>
                                        {SERVICE_OPTIONS.map((o) => (
                                            <option key={o}>{o}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <select
                                        value={form.experience}
                                        onChange={(e) => update("experience", e.target.value)}
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 focus:border-[#1D2B83] focus:outline-none focus:ring-2 focus:ring-[#1D2B83]/20 transition-all"
                                    >
                                        <option value="">Years of Experience</option>
                                        <option>Less than 1 year</option>
                                        <option>1–3 years</option>
                                        <option>3–5 years</option>
                                        <option>5+ years</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Upload Documents</h3>
                                <p className="text-sm text-slate-500">
                                    Please upload clear photos or scans. Accepted formats: PDF, JPG, PNG (max 5 MB each).
                                </p>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                                />
                                <button
                                    onClick={() => fileRef.current?.click()}
                                    className="w-full flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[#1D2B83]/30 bg-[#F5F3FF] p-8 text-[#1D2B83] cursor-pointer hover:border-[#1D2B83]/60 hover:bg-[#EDE9FE] transition-colors"
                                >
                                    <Upload className="h-8 w-8 opacity-70" />
                                    <span className="text-sm font-semibold">
                                        {fileName ? fileName : "Click to upload documents"}
                                    </span>
                                    <span className="text-xs text-slate-400">ID Proof, Address Proof, Certifications</span>
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-5">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Review & Submit</h3>
                                <div className="rounded-2xl bg-slate-50 divide-y divide-slate-100">
                                    {[
                                        ["Name", form.name || "—"],
                                        ["Phone", form.phone || "—"],
                                        ["Email", form.email || "—"],
                                        ["Location", form.location || "—"],
                                        ["Category", form.category || "—"],
                                        ["Experience", form.experience || "—"],
                                        ["Documents", fileName || "Not uploaded"],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex items-center justify-between px-5 py-3">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{k}</span>
                                            <span className="text-sm font-medium text-slate-800">{v}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Terms */}
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div
                                        onClick={() => setAgreed(!agreed)}
                                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${agreed ? "border-[#1D2B83] bg-[#1D2B83]" : "border-slate-300 bg-white"
                                            }`}
                                    >
                                        {agreed && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                    </div>
                                    <span className="text-sm text-slate-600 leading-snug">
                                        I agree to the{" "}
                                        <span className="text-[#1D2B83] font-semibold underline cursor-pointer">
                                            Terms & Conditions
                                        </span>{" "}
                                        and{" "}
                                        <span className="text-[#1D2B83] font-semibold underline cursor-pointer">
                                            Partner Policy
                                        </span>
                                        .
                                    </span>
                                </label>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="mt-8 flex gap-3">
                    {step > 0 && (
                        <button
                            onClick={back}
                            className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Back
                        </button>
                    )}
                    {step < FORM_STEPS.length - 1 ? (
                        <button
                            onClick={next}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#1D2B83] py-3 text-sm font-bold text-white hover:bg-[#16236b] transition-colors"
                        >
                            Continue <ChevronRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            disabled={!agreed}
                            onClick={handleSubmit}
                            className={`flex-1 rounded-xl py-3 text-sm font-bold text-white transition-colors ${agreed ? "bg-[#1D2B83] hover:bg-[#16236b]" : "bg-slate-300 cursor-not-allowed"
                                }`}
                        >
                            Submit Application
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export function PartnerRegistrationSection({ formRef }: { formRef: React.RefObject<HTMLDivElement | null> }) {
    return (
        <section ref={formRef} className="py-24 px-4 bg-white" id="register">
            <div className="mx-auto max-w-2xl text-center mb-12">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1D2B83]">
                    Get Onboard
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
                    Apply to Become a Partner
                </h2>
                <p className="mt-4 text-slate-500">
                    Takes less than 3 minutes. No fees. No commitments.
                </p>
            </div>
            <div className="mx-auto max-w-2xl">
                <MultiStepForm />
            </div>
        </section>
    );
}
