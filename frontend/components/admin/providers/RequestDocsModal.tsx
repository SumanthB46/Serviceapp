"use client";

import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Mail, FileSearch } from 'lucide-react';
import { Provider } from '../types';
import axios from 'axios';
import { API_URL } from '@/config/api';

const requiredDocumentsList = [
  "Government ID proof",
  "Address proof",
  "Professional certification",
  "Experience certificate",
  "Business registration",
  "GST certificate",
  "PAN card",
  "Police verification",
  "Portfolio / Work images",
  "Bank account proof"
];

interface RequestDocsModalProps {
  provider: Provider | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RequestDocsModal: React.FC<RequestDocsModalProps> = ({ provider, isOpen, onClose, onSuccess }) => {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !provider) return null;

  const toggleDoc = (doc: string) => {
    setSelectedDocs(prev => 
      prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]
    );
  };

  const handleRequest = async () => {
    if (selectedDocs.length === 0 && !additionalNotes.trim()) {
      alert('Please select or specify at least one required document.');
      return;
    }
    
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/providers/${provider._id}/verification-action`, {
        action_type: 'requested_docs',
        requested_docs: selectedDocs,
        custom_message: additionalNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error requesting docs:', error);
      alert('Failed to send request. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Additional Documents"
      size="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose} className="uppercase font-black text-[10px]">Cancel</Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleRequest} 
            disabled={isSending || (selectedDocs.length === 0 && !additionalNotes.trim())}
            className="uppercase font-black text-[10px] bg-blue-600 shadow-lg"
          >
            {isSending ? 'Sending Mail...' : 'Send Request'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        <div className="text-sm text-gray-600 mb-4">
          Select or specify the required documents. This request will be emailed to the provider.
        </div>

        <div className="grid grid-cols-2 gap-3">
          {requiredDocumentsList.map(doc => (
            <div 
              key={doc}
              onClick={() => toggleDoc(doc)}
              className={`p-3 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                selectedDocs.includes(doc) 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-100 hover:bg-blue-50/50'
              }`}
            >
              {doc}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Additional Document Request</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="e.g. Please upload a clear scanned copy of your electrician license."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs focus:border-blue-300 focus:ring-4 focus:ring-blue-100 min-h-[80px] resize-none"
          />
        </div>

        {/* Email Preview */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Mail size={100} />
          </div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <FileSearch size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Email Preview</span>
          </div>
          <div className="text-[11px] space-y-1 relative z-10">
            <p><span className="font-bold text-gray-700">Subject:</span> Additional Documents Required</p>
            <div className="h-px w-full bg-gray-200 my-2" />
            <div className="text-gray-600 leading-relaxed">
              To continue your partner verification process, please upload the following documents:
              {selectedDocs.length > 0 && (
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  {selectedDocs.map(d => <li key={d}>{d}</li>)}
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

export default RequestDocsModal;
