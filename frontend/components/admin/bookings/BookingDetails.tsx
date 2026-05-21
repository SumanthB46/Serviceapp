"use client";

import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from './StatusBadge';
import {
  User, Phone, Mail, Briefcase, MapPin, CreditCard, Receipt,
  Hash, Calendar, ChevronRight, X, ExternalLink, Star, Shield, Loader
} from 'lucide-react';
import axios from 'axios';
import { API_URL } from '@/config/api';

interface BookingDetailsProps {
  booking: any | null;
  onClose: () => void;
}

// ── Provider Service Detail Mini-Modal ─────────────────────────────────────
const ProviderServiceModal: React.FC<{ booking: any; onClose: () => void }> = ({ booking, onClose }) => {
  const provider = booking?.provider_id;
  const service = booking?.subservice_id;
  const address = booking?.address_id;
  const locationName = address 
    ? `${address.address_line}, ${address.city}`
    : booking?.location || 'N/A';

  return (
    <Modal isOpen={true} onClose={onClose} title="Provider Service Detail" size="sm"
      footer={<Button variant="outline" size="sm" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-4 py-2">
        {/* Provider card */}
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <img
            src={provider?.user_id?.profile_image || `https://ui-avatars.com/api/?name=${provider?.user_id?.name || 'P'}&background=EFF6FF&color=2563EB&bold=true`}
            className="w-14 h-14 rounded-xl object-cover ring-2 ring-blue-200"
            alt="provider"
          />
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-900">{provider?.user_id?.name || 'Unknown'}</p>
            <p className="text-[10px] text-gray-500 font-bold">{provider?.user_id?.email}</p>
            <p className="text-[10px] text-gray-500 font-bold">{provider?.user_id?.phone}</p>
          </div>
        </div>

        {/* Service details */}
        <div className="space-y-2">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Selected Service</p>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
            <p className="text-[11px] font-black text-indigo-600 uppercase">{service?.service_id?.service_name || service?.name || 'N/A'}</p>
            <p className="text-[10px] text-gray-500">Category: {service?.service_id?.category_id?.category_name || 'N/A'}</p>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Service Location</p>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <MapPin size={14} className="text-blue-500 shrink-0" />
            <p className="text-[11px] font-bold text-gray-700">{locationName}</p>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          <p className="text-[10px] font-black text-gray-600">100% Success Rate</p>
          <div className="ml-auto">
            <Shield size={14} className="text-green-600" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ── Main BookingDetails Modal ───────────────────────────────────────────────
const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onClose }) => {
  const [showProviderService, setShowProviderService] = useState(false);
  const [paymentData, setPaymentData] = React.useState<any>(null);
  const [loadingPayment, setLoadingPayment] = React.useState(true);

  React.useEffect(() => {
    if (!booking) return;
    
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/payments/${booking._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPaymentData(res.data);
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error('Failed to fetch payment details:', err);
        }
        setPaymentData(null);
      } finally {
        setLoadingPayment(false);
      }
    };
    fetchPayment();
  }, [booking?._id]);

  if (!booking) return null;

  const customer = booking.user_id;
  const provider = booking.provider_id;
  const service = booking.subservice_id;
  const isAssigned = !!provider;

  // Payment derivations
  const servicePrice = booking?.service_price || 0;
  const payable = paymentData?.amount || booking?.payable_amount || servicePrice;
  const paymentMethod = paymentData?.payment_method || booking?.payment_method || 'Cash';
  const paymentStatus = paymentData?.payment_status || booking?.payment_status || 'Pending';
  const transactionId = paymentData?.transaction_id || booking?.transaction_id;
  const paymentDate = paymentData?.payment_date;
  const createdAt = paymentData?.createdAt;
  const updatedAt = paymentData?.updatedAt;

  return (
    <>
      <Modal
        isOpen={!!booking}
        onClose={onClose}
        title="Booking Details"
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              #{String(booking._id).slice(-8).toUpperCase()}
            </span>
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          </div>
        }
      >
        <div className="space-y-4 -mt-2">

          {/* ── Status Strip ──────────────────────────────── */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Booking Status</p>
              <StatusBadge status={booking.status} />
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Scheduled</p>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-700">
                <Calendar size={12} className="text-blue-500" />
                {booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                {booking.booking_time ? ` · ${booking.booking_time}` : ''}
              </div>
            </div>
          </div>

          {/* ── Section 1: Customer ───────────────────────── */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Customer</p>
            <div className="flex items-center gap-4">
              <img
                src={customer?.profile_image || `https://ui-avatars.com/api/?name=${customer?.name || 'U'}&background=F0FDF4&color=16A34A&bold=true`}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100"
                alt="customer"
              />
              <div className="flex-1">
                <p className="text-[12px] font-black text-gray-900 uppercase tracking-tight">{customer?.name || 'Unknown'}</p>
                <div className="flex flex-col gap-0.5 mt-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
                    <Mail size={11} className="text-gray-400" />
                    {customer?.email || 'N/A'}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
                    <Phone size={11} className="text-gray-400" />
                    {customer?.phone || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Provider ───────────────────────── */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Expert Assigned</p>
            {isAssigned ? (
              <div className="flex items-center gap-4">
                <img
                  src={provider?.user_id?.profile_image || `https://ui-avatars.com/api/?name=${provider?.user_id?.name || 'P'}&background=EFF6FF&color=2563EB&bold=true`}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-100"
                  alt="provider"
                />
                <div className="flex-1">
                  <p className="text-[12px] font-black text-gray-900 uppercase tracking-tight">{provider?.user_id?.name || 'Unknown'}</p>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
                      <Mail size={11} className="text-gray-400" />
                      {provider?.user_id?.email || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
                      <Phone size={11} className="text-gray-400" />
                      {provider?.user_id?.phone || 'N/A'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowProviderService(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-200 group shrink-0"
                >
                  <Briefcase size={12} />
                  Services
                  <ExternalLink size={10} className="opacity-60" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <User size={18} className="text-gray-400" />
                </div>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Not Yet Assigned</p>
              </div>
            )}
          </div>

          {/* ── Section 3: Service & Bill ─────────────────── */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Service & Billing</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-[8px] font-black uppercase tracking-widest text-indigo-400 mb-1">Service</p>
                <p className="text-[11px] font-black text-indigo-700">{service?.service_id?.service_name || service?.name || 'N/A'}</p>
                <p className="text-[9px] text-indigo-400 font-bold mt-0.5">{service?.service_id?.category_id?.category_name || ''}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-[8px] font-black uppercase tracking-widest text-emerald-400 mb-1">Total Amount</p>
                <p className="text-[18px] font-black text-emerald-700">₹{booking.payable_amount || booking.service_price || 0}</p>
                <p className="text-[9px] text-emerald-400 font-bold uppercase">{booking.payment_method || 'Cash'}</p>
              </div>
            </div>

            {/* Address */}
            {(booking.address_id || booking.location) && (
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <MapPin size={13} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[10px] font-bold text-gray-600 leading-relaxed">
                  {booking.address_id 
                    ? `${booking.address_id.address_line}, ${booking.address_id.city}, ${booking.address_id.state} - ${booking.address_id.pincode}` 
                    : booking.location}
                </p>
              </div>
            )}

            <div className="pt-2">
              {loadingPayment ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <Loader size={20} className="animate-spin text-blue-500 mb-2" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Loading Payment...</p>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500">Method</span>
                    <span className="text-[10px] font-black text-gray-800 uppercase">{paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500">Status</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      paymentStatus === 'paid' || paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 
                      paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                      paymentStatus === 'refunded' ? 'bg-gray-200 text-gray-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {paymentStatus}
                    </span>
                  </div>
                  
                  {transactionId && (
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <span className="text-[10px] font-bold text-gray-500">Transaction ID</span>
                      <span className="text-[9px] font-black font-mono text-gray-700">
                        {transactionId}
                      </span>
                    </div>
                  )}
                  
                  {paymentDate && (
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <span className="text-[10px] font-bold text-gray-500">Payment Date</span>
                      <span className="text-[9px] font-black text-gray-700">
                        {new Date(paymentDate).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </Modal>

      {showProviderService && (
        <ProviderServiceModal booking={booking} onClose={() => setShowProviderService(false)} />
      )}
    </>
  );
};

export default BookingDetails;
