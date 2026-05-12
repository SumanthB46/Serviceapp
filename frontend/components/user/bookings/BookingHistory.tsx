"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  ChevronRight, 
  User, 
  Phone, 
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  ArrowRight,
  Star
} from "lucide-react";
import { message, Modal, Tabs, Button, Tag, Divider, Empty, Skeleton } from "antd";
import { API_URL, BACKEND_URL } from "@/config/api";
import Navbar from "@/components/common/Navbar";

interface Booking {
  _id: string;
  booking_id: string;
  subservice_id: any;
  service_id?: any; // Legacy support
  provider_id: any;
  address_id: any;
  scheduled_at: string;
  booking_time: string;
  service_price: number;
  total_amount?: number; // Legacy support
  status: string;
  payment_method: string;
  payment_status: string;
  createdAt: string;
}

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  // Cancellation Modal State
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("Bookings API Response:", data);
      
      if (Array.isArray(data)) {
        setBookings(data);
      } else if (data.bookings && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      messageApi.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    setCancellingBookingId(bookingId);
    setCancelModalVisible(true);
    setCancelReason("");
  };

  const submitCancellation = async () => {
    if (!cancellingBookingId || !cancelReason) {
      messageApi.warning("Please provide a reason for cancellation");
      return;
    }

    try {
      setIsCancelling(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/bookings/${cancellingBookingId}/cancel`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          reason: cancelReason,
          cancelled_by: 'customer' // Explicitly set for backend clarity
        })
      });
      
      if (res.ok) {
        messageApi.success("Booking cancelled successfully");
        setCancelModalVisible(false);
        fetchBookings();
      } else {
        const data = await res.json();
        messageApi.error(data.message || "Failed to cancel booking");
      }
    } catch (err) {
      messageApi.error("An error occurred while cancelling");
    } finally {
      setIsCancelling(false);
    }
  };

  const filterBookings = () => {
    switch (activeTab) {
      case "upcoming":
        return bookings.filter(b => ["pending", "accepted"].includes(b.status));
      case "ongoing":
        return bookings.filter(b => ["in_progress"].includes(b.status));
      case "completed":
        return bookings.filter(b => ["completed"].includes(b.status));
      case "cancelled":
        return bookings.filter(b => ["cancelled", "rejected"].includes(b.status));
      default:
        return bookings;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { color: 'gold', icon: <Clock size={14} />, label: 'Pending' };
      case 'accepted': return { color: 'blue', icon: <CheckCircle2 size={14} />, label: 'Accepted' };
      case 'in_progress': return { color: 'purple', icon: <ArrowRight size={14} />, label: 'In Progress' };
      case 'completed': return { color: 'green', icon: <CheckCircle2 size={14} />, label: 'Completed' };
      case 'cancelled': return { color: 'red', icon: <XCircle size={14} />, label: 'Cancelled' };
      case 'rejected': return { color: 'default', icon: <XCircle size={14} />, label: 'Rejected' };
      default: return { color: 'default', icon: <Info size={14} />, label: status };
    }
  };

  const getTimelineSteps = (currentStatus: string) => {
    const steps = [
      { key: 'pending', label: 'Booking Confirmed' },
      { key: 'accepted', label: 'Provider Assigned' },
      { key: 'in_progress', label: 'Service Started' },
      { key: 'completed', label: 'Completed' }
    ];

    const currentIndex = steps.findIndex(s => s.key === currentStatus);
    
    // If cancelled, show a different timeline or handle specifically
    if (currentStatus === 'cancelled' || currentStatus === 'rejected') {
      return (
        <div className="flex items-center gap-2 text-red-500 font-bold text-xs bg-red-50 px-4 py-2 rounded-full">
          <XCircle size={16} /> Booking {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between w-full max-w-md mt-4">
        {steps.map((step, idx) => {
          const isDone = currentIndex >= idx;
          const isNext = currentIndex + 1 === idx;
          
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                  isDone ? 'bg-[#1D2B83] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {isDone ? <CheckCircle2 size={12} /> : idx + 1}
                </div>
                <span className={`text-[8px] font-bold uppercase tracking-wider mt-2 whitespace-nowrap absolute -bottom-4 ${
                  isDone ? 'text-[#1D2B83]' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-[2px] mx-1 transition-all ${
                  currentIndex > idx ? 'bg-[#1D2B83]' : 'bg-slate-100'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {contextHolder}
      {modalContextHolder}
      <Navbar />
      
      <div className="max-w-[1440px] mx-auto px-6 pt-24 pb-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Bookings</h1>
          <div className="w-12 h-1 bg-[#1D2B83] mx-auto mt-2 rounded-full opacity-20" />
        </div>

        <div className="mb-8">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="custom-tabs"
            items={[
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'ongoing', label: 'Ongoing' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' },
            ]}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-50 rounded w-3/4" />
                    <div className="h-6 bg-slate-50 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-slate-50 rounded w-full" />
                  <div className="h-3 bg-slate-50 rounded w-full" />
                  <div className="h-3 bg-slate-50 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filterBookings().length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="text-slate-200" size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">No {activeTab} bookings</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-sm mx-auto">
              Your service history is currently empty for this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterBookings().map((booking) => {
              const subservice = booking.subservice_id || booking.service_id;
              const imageUrl = subservice?.image ? (subservice.image.startsWith('http') ? subservice.image : `${BACKEND_URL}${subservice.image}`) : null;
              const statusCfg = getStatusConfig(booking.status);
              
              return (
                <div key={booking._id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group">
                  {/* Header: Image, Title, Price */}
                  <div className="p-5 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                      {imageUrl ? (
                        <img src={imageUrl} alt={subservice?.subservice_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Info size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate text-sm mb-1 group-hover:text-blue-600 transition-colors">
                        {subservice?.subservice_name || subservice?.service_name}
                      </h3>
                      <p className="text-xl font-black text-[#1D2B83] tracking-tight">
                        ₹{booking.service_price || booking.total_amount}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 flex-1 flex flex-col">
                    {/* ID & Status Row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                        {booking.booking_id}
                      </span>
                      <Tag color={statusCfg.color} className="m-0 rounded-full border-none px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        {statusCfg.icon}
                        {statusCfg.label}
                      </Tag>
                    </div>

                    {/* Service Details with Icons */}
                    <div className="space-y-3 mb-5 py-4 border-y border-slate-50">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                          <Calendar size={14} />
                        </div>
                        <span className="text-xs font-bold">{new Date(booking.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                          <Clock size={14} />
                        </div>
                        <span className="text-xs font-bold">{booking.booking_time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                          <MapPin size={14} />
                        </div>
                        <span className="text-xs font-bold truncate">{booking.address_id?.city || booking.address_id?.address_line?.split(',')[0] || 'Bangalore'}</span>
                      </div>
                    </div>

                    {/* Provider Info */}
                    <div className="mt-auto flex items-center gap-3 bg-slate-50/80 p-3 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                        <User size={14} className="text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Service Provider</p>
                        <p className="text-xs font-black text-slate-700 truncate">
                          {booking.provider_id?.user_id?.name || 'Searching...'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 bg-slate-50/30 flex gap-2 border-t border-slate-100">
                    {['pending', 'accepted'].includes(booking.status) && (
                      <Button 
                        danger 
                        type="text" 
                        size="small"
                        className="flex-1 font-black text-[10px] uppercase tracking-widest h-10 rounded-xl hover:bg-red-50 transition-colors"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button 
                      type="primary" 
                      size="small"
                      className="flex-1 bg-[#1D2B83] border-none font-black text-[10px] uppercase tracking-widest h-10 rounded-xl shadow-md shadow-blue-900/10"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Reason Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <XCircle size={20} />
            <span className="font-black uppercase tracking-tight">Cancel Booking</span>
          </div>
        }
        open={cancelModalVisible}
        onCancel={() => !isCancelling && setCancelModalVisible(false)}
        footer={[
          <Button 
            key="back" 
            onClick={() => setCancelModalVisible(false)}
            disabled={isCancelling}
            className="rounded-xl font-bold uppercase text-[10px] tracking-widest h-10"
          >
            Go Back
          </Button>,
          <Button 
            key="submit" 
            danger 
            type="primary" 
            loading={isCancelling}
            onClick={submitCancellation}
            className="rounded-xl font-bold uppercase text-[10px] tracking-widest h-10 px-6"
          >
            Confirm Cancellation
          </Button>,
        ]}
        centered
        width={400}
        className="premium-modal"
      >
        <div className="py-4">
          <p className="text-slate-500 text-sm font-medium mb-6">
            We're sorry to see you cancel. Please let us know the reason for cancellation to help us improve our service.
          </p>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">
              Select Reason
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Change of plans",
                "Found a better price",
                "Provider not responsive",
                "Scheduled for wrong time",
                "Booked by mistake",
                "Other"
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setCancelReason(reason)}
                  className={`text-left px-4 py-3 rounded-xl border-2 transition-all text-xs font-bold ${
                    cancelReason === reason 
                    ? 'border-[#1D2B83] bg-blue-50 text-[#1D2B83]' 
                    : 'border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            {cancelReason === "Other" || !["Change of plans", "Found a better price", "Provider not responsive", "Scheduled for wrong time", "Booked by mistake", "Other"].includes(cancelReason) && cancelReason !== "" ? (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1 mb-2">
                  Please specify
                </label>
                <textarea
                  className="w-full rounded-xl border-2 border-slate-100 p-3 text-xs font-medium focus:border-[#1D2B83] outline-none transition-all min-h-[80px]"
                  placeholder="Tell us more..."
                  value={["Change of plans", "Found a better price", "Provider not responsive", "Scheduled for wrong time", "Booked by mistake", "Other"].includes(cancelReason) ? "" : cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .premium-modal .ant-modal-content {
          border-radius: 2rem;
          padding: 2rem;
        }
        .premium-modal .ant-modal-header {
          margin-bottom: 1.5rem;
          border-bottom: none;
        }
        .premium-modal .ant-modal-title {
          font-size: 1.25rem;
        }
        .custom-tabs .ant-tabs-nav::before {
          border-bottom: none;
        }
        .custom-tabs .ant-tabs-tab {
          padding: 12px 24px;
          margin: 0 4px !important;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .custom-tabs .ant-tabs-tab-active {
          background: #1D2B83 !important;
        }
        .custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: white !important;
          font-weight: 900 !important;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 11px;
        }
        .custom-tabs .ant-tabs-tab:not(.ant-tabs-tab-active) .ant-tabs-tab-btn {
          color: #94a3b8 !important;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 11px;
        }
        .custom-tabs .ant-tabs-ink-bar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default BookingHistory;
