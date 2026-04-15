"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarCheck,
  List,
  Layers,
  MapPin,
  Image as ImageIcon,
  BarChart2,
  X,
  ChevronRight,
  LogOut,
  Settings,
  Ticket
} from 'lucide-react';
import { motion } from 'framer-motion';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Providers', href: '/admin/providers', icon: Briefcase },
  { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'Categories', href: '/admin/categories', icon: List },
  { name: 'Sub-Services', href: '/admin/sub-services', icon: Layers },
  { name: 'Locations', href: '/admin/locations', icon: MapPin },
  { name: 'Offers', href: '/admin/offers', icon: Ticket },
  { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { name: 'Reports', href: '/admin/reports', icon: BarChart2 },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] border-r border-white/5 transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex-shrink-0 flex flex-col h-screen overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* Branding Header - Slightly more compact */}
      <div className="flex items-center justify-between h-20 px-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
        <Link href="/admin" className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
            <span className="text-white font-black text-lg">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight leading-none">ArchitecturalService</span>
          </div>
        </Link>
        <button
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Navigation - No scroll area, adjusted padding */}
      <div className="flex-1 px-3 py-4 flex flex-col">

        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (pathname.startsWith(link.href) && link.href !== '/admin');
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-400 rounded-r-full"
                  />
                )}

                <div className="flex items-center gap-3 relative z-10">
                  <div className={`transition-all duration-300 ${isActive ? 'text-white' : 'group-hover:text-blue-400 group-hover:scale-110'
                    }`}>
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[13px] font-bold tracking-tight transition-transform duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
                    }`}>
                    {link.name}
                  </span>
                </div>
                {isActive && <ChevronRight size={12} className="opacity-60 relative z-10" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Section - More compact */}
      <div className="p-4 border-t border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group mb-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner text-xs">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Administrator</p>
            <p className="text-[9px] text-gray-500 font-bold truncate">superadmin@sswift.com</p>
          </div>
          <Settings size={14} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
        </div>

        <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest">
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
