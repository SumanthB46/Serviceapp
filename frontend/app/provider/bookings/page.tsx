"use client";

import React, { useState } from "react";
import ProviderLayout from "@/components/provider/ProviderLayout";
import BookingDetailModal from "@/components/provider/modals/BookingDetailModal";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Check, 
  X, 
  ChevronRight,
  User,
  MoreVertical
} from "lucide-react";

const tabs = ["Pending", "Accepted", "In Progress", "Completed"];

const bookings = [
  {
    id: "BK-9821",
    customer: "Priya Singh",
    service: "Deep Home Cleaning",
    dateTime: "15 May, 10:00 AM",
    address: "B-402, Sunshine Apartments, Sector 45, Gurgaon",
    amount: "₹2,499",
    status: "Pending",
    phone: "+91 98765 43210",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    id: "BK-9815",
    customer: "Rahul Verma",
    service: "AC Service",
    dateTime: "14 May, 02:30 PM",
    address: "H.No 124, Pocket C, Sarita Vihar, Delhi",
    amount: "₹899",
    status: "Accepted",
    phone: "+91 99887 76655",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  },
  {
    id: "BK-9810",
    customer: "Amit Kumar",
    service: "Bathroom Cleaning",
    dateTime: "12 May, 11:00 AM",
    address: "Flat 12, Tower 2, DLF Phase 3, Gurgaon",
    amount: "₹1,200",
    status: "Completed",
    phone: "+91 95554 33221",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
  }
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  return (
    <ProviderLayout>
      <BookingDetailModal 
        isOpen={!!selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
        booking={selectedBooking} 
      />
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Bookings</h1>
            <p className="text-slate-500 font-medium">Track your service requests and manage job progress.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all">
              <Calendar className="h-5 w-5" />
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="space-y-6">
          <div className="bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm inline-flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === tab 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm max-w-md">
            <Search className="h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by customer name or ID..." 
              className="bg-transparent border-none outline-none text-sm text-slate-600 w-full font-medium"
            />
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                  {/* Customer Info */}
                  <div className="flex items-center gap-4 lg:w-72">
                    <img src={booking.avatar} alt="" className="h-14 w-14 rounded-2xl border-2 border-white shadow-sm" />
                    <div>
                      <h3 className="text-base font-black text-slate-900">{booking.customer}</h3>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg uppercase">{booking.id}</span>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-1.5 bg-slate-50 rounded-lg">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold">{booking.dateTime}</span>
                      </div>
                      <div className="flex items-start gap-3 text-slate-500">
                        <div className="p-1.5 bg-slate-50 rounded-lg shrink-0">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium leading-relaxed">{booking.address}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-1.5 bg-slate-50 rounded-lg">
                          <Clock className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold">{booking.service}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-1.5 bg-slate-50 rounded-lg">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold">{booking.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8">
                    <div className="text-right lg:text-center mb-0 lg:mb-4">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Earnings</span>
                      <span className="text-xl font-black text-slate-900">{booking.amount}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {booking.status === "Pending" ? (
                        <>
                          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                            <Check className="h-4 w-4" />
                            Accept
                          </button>
                          <button className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all border border-rose-100">
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : booking.status === "Accepted" ? (
                        <button className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                          Start Job
                        </button>
                      ) : (
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No {activeTab} Bookings</h3>
              <p className="text-slate-400 font-medium">When you get a new booking, it will show up here.</p>
            </div>
          )}
        </div>
      </div>
    </ProviderLayout>
  );
}
