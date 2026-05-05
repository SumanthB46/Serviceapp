"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UserCircle, 
  Settings, 
  Calendar, 
  Package, 
  Wallet, 
  Star, 
  Bell, 
  MapPin, 
  Image as ImageIcon,
  Wrench,
  LogOut,
  X
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/provider/dashboard" },
  { name: "Services", icon: Wrench, href: "/provider/services" },
  { name: "Availability", icon: Calendar, href: "/provider/availability" },
  { name: "Bookings", icon: Package, href: "/provider/bookings" },
  { name: "Earnings", icon: Wallet, href: "/provider/earnings" },
  { name: "Reviews", icon: Star, href: "/provider/reviews" },
  { name: "Notifications", icon: Bell, href: "/provider/notifications" },
  { name: "Service Area", icon: MapPin, href: "/provider/area" },
  { name: "Portfolio", icon: ImageIcon, href: "/provider/portfolio" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-50 transition-transform lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#1D2B83] rounded-lg flex items-center justify-center">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">ServiceSwift</span>
            </Link>
            <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-slate-400"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100">
            <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
