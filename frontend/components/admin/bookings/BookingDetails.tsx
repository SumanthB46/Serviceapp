"use client";

import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from './StatusBadge';
import { Booking } from '../types';
import { User, Briefcase, Calendar, DollarSign, Hash } from 'lucide-react';

interface BookingDetailsProps {
  booking: Booking | null;
  onClose: () => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const fields = [
    { icon: Hash,       label: 'Booking ID', value: booking.id },
    { icon: User,       label: 'Customer',   value: booking.customer },
    { icon: Briefcase,  label: 'Provider',   value: booking.provider },
    { icon: Briefcase,  label: 'Service',    value: booking.service },
    { icon: Calendar,   label: 'Date',       value: booking.date },
    { icon: DollarSign, label: 'Amount',     value: booking.amount },
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
        <span className="text-2xl font-bold text-gray-900">{booking.amount}</span>
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
