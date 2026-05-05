"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

interface ProviderLayoutProps {
  children: React.ReactNode;
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col lg:pl-72">
        <TopNavbar onOpenSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
