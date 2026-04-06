"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  Phone
} from "lucide-react";
import {
  FacebookFilled,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinFilled,
  YoutubeFilled
} from "@ant-design/icons";

const links = [
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
];

const socialLinks = [
  { icon: FacebookFilled, href: "#" },
  { icon: TwitterOutlined, href: "#" },
  { icon: InstagramOutlined, href: "#" },
  { icon: LinkedinFilled, href: "#" },
  { icon: YoutubeFilled, href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24">

          {/* Logo & Info column */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black text-[#1D2B83] tracking-tight italic">
                ArchitecturalService
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs font-medium">
              Your one-stop destination for premium home services. From repairs to renovations, we bring the professionals to you.
            </p>
            <div className="flex items-center gap-2 text-[#1D2B83]">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Verified Solutions</span>
            </div>
          </div>

          {/* Quick Links column - requested links */}
          <div className="col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900 mb-6 underline decoration-[#1D2B83] decoration-2 underline-offset-8">
              Explore
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-bold text-slate-600 hover:text-[#1D2B83] transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support / Contact info */}
          <div className="col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900 mb-6 underline decoration-[#1D2B83] decoration-2 underline-offset-8">
              Support
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-[#1D2B83] transition-all">
                  <Mail className="h-4 w-4 text-[#1D2B83]" />
                </div>
                <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">support@smartservice.com</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-[#1D2B83] transition-all">
                  <Phone className="h-4 w-4 text-[#1D2B83]" />
                </div>
                <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">+1 (800) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Social column */}
          <div className="col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900 mb-6 underline decoration-[#1D2B83] decoration-2 underline-offset-8">
              Follow Us
            </h4>
            <div className="grid grid-cols-3 gap-3 max-w-[150px]">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={i}
                    href={social.href}
                    className="h-11 w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1D2B83] hover:border-[#1D2B83] transition-all shadow-sm group"
                  >
                    <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        <div className="mt-16 border-t border-slate-100 pt-8 text-center text-xs text-slate-400">
          © 2024 ArchitecturalService. A Summer Sanctuary for Your Home.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
