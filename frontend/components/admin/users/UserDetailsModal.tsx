"use client";

import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { User } from '../types';
import { Mail, Phone, Calendar, Shield } from 'lucide-react';

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
  if (!user) return null;

  const details = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Phone', value: user.phone },
    { icon: Calendar, label: 'Joined', value: user.joinedDate || '—' },
    { icon: Shield, label: 'Status', value: user.status },
  ];

  return (
    <Modal
      isOpen={!!user}
      onClose={onClose}
      title="User Details"
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button variant="danger" size="sm">Block User</Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=EFF6FF&color=2563EB&bold=true&size=80`}
          alt={user.name}
          className="w-20 h-20 rounded-full border-4 border-blue-100 shadow"
        />
        <h3 className="text-xl font-bold text-gray-900 mt-3">{user.name}</h3>
        <div className="mt-2">
          <Badge variant={user.status === 'Active' ? 'success' : 'danger'}>{user.status}</Badge>
        </div>
      </div>

      <div className="space-y-4">
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
              <Icon size={16} className="text-blue-500" />
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

export default UserDetailsModal;
