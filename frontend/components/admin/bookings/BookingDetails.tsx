"use client";

import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from './StatusBadge';
import { Booking } from '../types';
import { User, Briefcase, Calendar, DollarSign, Hash } from 'lucide-react';

interface BookingDetailsProps {
  booking: any | null;
  onClose: () => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const fields = [
    { icon: Hash,       label: 'Booking ID', value: booking._id ? String(booking._id).slice(-6).toUpperCase() : '' },
    { icon: User,       label: 'Customer',   value: booking.user_id?.name || 'Unknown' },
    { icon: Briefcase,  label: 'Provider',   value: booking.provider_id?.user_id?.name || 'Unassigned' },
    { icon: Briefcase,  label: 'Service',    value: booking.service_id?.service_name || 'N/A' },
    { icon: Calendar,   label: 'Date',       value: `${new Date(booking.booking_date).toLocaleDateString()} ${booking.time_slot || ''}` },
    { icon: DollarSign, label: 'Amount',     value: `₹${booking.total_amount}` },
  ];

  return (
    <Modal
      isOpen={!!booking}
      onClose={onClose}
      title="Booking Details"
      size="md"
      footer={<Button variant="outline" size="sm" onClick={onClose}>Close</Button>}
    >
      <div className="flex items-center justify-between mb-5 p-4 bg-gray-50 rounded-2xl">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">Status</p>
          <StatusBadge status={booking.status} />
        </div>
        <span className="text-2xl font-bold text-gray-900">₹{booking.total_amount}</span>
      </div>

      <div className="space-y-3">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
              <Icon size={15} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-sm text-gray-800 font-semibold">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default BookingDetails;
