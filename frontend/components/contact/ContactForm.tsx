"use client";

import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const ContactForm = () => {
    const reveal = useScrollReveal(0.1);
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormState({ name: '', email: '', message: '' });
        }, 3000);
    };

    return (
        <div
            ref={reveal.ref}
            className={`scroll-hidden ${reveal.isVisible ? 'scroll-visible' : ''}`}
        >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/[0.04] p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                    Send a Message
                </h2>

                {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-5 shadow-lg shadow-green-200">
                            <CheckCircle size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Message Sent!
                        </h3>
                        <p className="text-gray-500">
                            We&apos;ll get back to you within 24 hours.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-7">
                        {/* Name Field */}
                        <div className="relative">
                            <label
                                htmlFor="contact-name"
                                className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                                    focusedField === 'name' || formState.name
                                        ? '-top-5 text-xs font-semibold text-indigo-600 tracking-wide'
                                        : 'top-3 text-sm text-gray-400'
                                }`}
                            >
                                Name
                            </label>
                            <input
                                id="contact-name"
                                type="text"
                                required
                                value={formState.name}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) =>
                                    setFormState({ ...formState, name: e.target.value })
                                }
                                className="w-full pt-3 pb-3 bg-transparent border-b-2 border-gray-200 focus:border-indigo-500 outline-none transition-colors duration-300 text-gray-900"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                            <label
                                htmlFor="contact-email"
                                className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                                    focusedField === 'email' || formState.email
                                        ? '-top-5 text-xs font-semibold text-indigo-600 tracking-wide'
                                        : 'top-3 text-sm text-gray-400'
                                }`}
                            >
                                Email
                            </label>
                            <input
                                id="contact-email"
                                type="email"
                                required
                                value={formState.email}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) =>
                                    setFormState({ ...formState, email: e.target.value })
                                }
                                className="w-full pt-3 pb-3 bg-transparent border-b-2 border-gray-200 focus:border-indigo-500 outline-none transition-colors duration-300 text-gray-900"
                            />
                        </div>

                        {/* Message Field */}
                        <div className="relative">
                            <label
                                htmlFor="contact-message"
                                className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                                    focusedField === 'message' || formState.message
                                        ? '-top-5 text-xs font-semibold text-indigo-600 tracking-wide'
                                        : 'top-3 text-sm text-gray-400'
                                }`}
                            >
                                Message
                            </label>
                            <textarea
                                id="contact-message"
                                required
                                rows={4}
                                value={formState.message}
                                onFocus={() => setFocusedField('message')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) =>
                                    setFormState({ ...formState, message: e.target.value })
                                }
                                className="w-full pt-3 pb-3 bg-transparent border-b-2 border-gray-200 focus:border-indigo-500 outline-none transition-colors duration-300 text-gray-900 resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#15157D] to-[#2E3192] text-white px-8 py-3.5 rounded-lg font-bold text-sm tracking-widest uppercase shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                            <span>SUBMIT INQUIRY</span>
                            {/* <Send
                                size={16} 
                                strokeWidth={2.5}
                                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                            /> */}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactForm;
