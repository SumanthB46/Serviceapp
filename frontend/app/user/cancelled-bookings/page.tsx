"use client";

import React from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import CancelledBookings from "@/components/user/bookings/CancelledBookings";

export default function CancelledBookingsPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <CancelledBookings />
      </div>
      <Footer />
    </main>
  );
}
