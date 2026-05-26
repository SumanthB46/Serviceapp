"use client";

import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { ShieldAlert, Mail } from 'lucide-react';
import { Provider } from '../types';
import axios from 'axios';
import { API_URL } from '@/config/api';

const rejectionReasonsList = [
  "Invalid identity proof",
  "Blurred / unreadable document",
  "Business details mismatch",
  "Phone number verification failed",
  "Experience proof missing",
  "Incomplete profile information",
  "Service expertise not verified",
  "Duplicate account detected",
  "Address verification failed",
  "Suspicious activity detected"
];

interface RejectVerificationModalProps {
  provider: Provider | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RejectVerificationModal: React.FC<RejectVerificationModalProps> = ({ provider, isOpen, onClose, onSuccess }) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !provider) return null;

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const handleReject = async () => {
    if (selectedReasons.length === 0 && !additionalNotes.trim()) {
      alert('Please select or provide a reason for rejection.');
      return;
    }
    
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/providers/${provider._id}/verification-action`, {
        action_type: 'rejected',
        reasons: selectedReasons,
        custom_message: additionalNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error rejecting provider:', error);
      alert('Failed to send rejection. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Partner Verification"
      size="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose} className="uppercase font-black text-[10px]">Cancel</Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={handleReject} 
            disabled={isSending || (selectedReasons.length === 0 && !additionalNotes.trim())}
            className="uppercase font-black text-[10px] bg-red-600 shadow-lg"
          >
            {isSending ? 'Sending Mail...' : 'Send Rejection Mail'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        <div className="text-sm text-gray-600 mb-4">
          Please select the reason for rejection. This message will be emailed to the provider.
        </div>

        <div className="grid grid-cols-2 gap-3">
          {rejectionReasonsList.map(reason => (
            <div 
              key={reason}
              onClick={() => toggleReason(reason)}
              className={`p-3 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                selectedReasons.includes(reason) 
                  ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-red-100 hover:bg-red-50/50'
              }`}
            >
              {reason}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Additional Notes (Optional)</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="e.g. Your uploaded ID proof name does not match your registered profile details."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs focus:border-red-300 focus:ring-4 focus:ring-red-100 min-h-[100px] resize-none"
          />
        </div>

        {/* Email Preview */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Mail size={100} />
          </div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <ShieldAlert size={14} className="text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Email Preview</span>
          </div>
          <div className="text-[11px] space-y-1 relative z-10">
            <p><span className="font-bold text-gray-700">Subject:</span> Verification Request Rejected</p>
            <div className="h-px w-full bg-gray-200 my-2" />
            <div className="text-gray-600 leading-relaxed">
              We reviewed your verification request and found some issues that require correction.
              {selectedReasons.length > 0 && (
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  {selectedReasons.map(r => <li key={r}>{r}</li>)}
                </ul>
              )}
              {additionalNotes && (
                <p className="mt-2 italic">"{additionalNotes}"</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RejectVerificationModal;
