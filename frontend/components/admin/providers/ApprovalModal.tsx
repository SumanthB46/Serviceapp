"use client";

import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Provider } from '../types';
import { 
  MapPin, Star, Briefcase, Calendar, ShieldCheck, Award, ShieldAlert, 
  FileSearch, CheckCircle2, Mail, Phone, Clock, FileText, UserCheck, UserX, Trash2, Eye
} from 'lucide-react';

interface ApprovalModalProps {
  provider: Provider | null;
  onClose: () => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ provider, onClose }) => {
  if (!provider) return null;

  const statusVariant = provider.status === 'Approved' ? 'success' : provider.status === 'Pending' ? 'warning' : provider.status === 'Blocked' ? 'neutral' : 'danger';

  return (
    <Modal
      isOpen={!!provider}
      onClose={onClose}
      title="Partner Verification Bureau"
      size="md"
      footer={
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-2">
              <button className="text-[10px] text-gray-400 font-black uppercase hover:text-red-600 transition-colors">Terminate Account</button>
           </div>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose} className="text-[10px] uppercase font-black px-6">Close</Button>
              {provider.status === 'Pending' && (
                <>
                  <Button variant="outline" size="sm" onClick={onClose} className="text-[10px] uppercase font-black text-amber-600 border-amber-100 bg-amber-50 shadow-sm">Request Docs</Button>
                  <Button variant="danger" size="sm" onClick={onClose} className="text-[10px] uppercase font-black bg-red-600 shadow-lg">Reject Entry</Button>
                  <Button variant="success" size="sm" onClick={onClose} className="text-[10px] uppercase font-black bg-green-600 shadow-lg">Approve Access</Button>
                </>
              )}
              {provider.status === 'Rejected' && (
                <Button variant="primary" size="sm" onClick={onClose} className="text-[10px] uppercase font-black bg-blue-600 shadow-lg">Reconsider Application</Button>
              )}
           </div>
        </div>
      }
    >
      <div className="space-y-8 py-2">
        {/* Profile Identity Deck */}
        <div className="flex items-start gap-6 bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100">
           <div className="relative group">
              <img
                src={provider.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=EFF6FF&color=2563EB&bold=true&size=100`}
                alt={provider.name}
                className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-md group-hover:rotate-3 transition-transform"
              />
              <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${provider.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                 <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
           </div>
           <div className="flex-1">
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{provider.name}</h3>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Registry ID: {provider.providerId}</p>
                 </div>
                 <div className="scale-90 origin-left">
                    <Badge variant={statusVariant}>{provider.status}</Badge>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                 <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm text-blue-500 transition-transform group-hover:scale-110">
                       <Mail size={12} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-600 truncate">{provider.email}</span>
                 </div>
                 <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm text-green-500 transition-transform group-hover:scale-110">
                       <Phone size={12} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-600">{provider.phone}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Verification Status Multi-Tier */}
        <div className="grid grid-cols-2 gap-4">
           <div className={`p-4 rounded-[1.5rem] border flex items-center justify-between transition-all ${provider.idVerified ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-white rounded-xl shadow-sm"><ShieldCheck size={16} /></div>
                 <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.15em] opacity-60">Identity Bureau</p>
                    <p className="text-[11px] font-black">{provider.idVerified ? 'Verified' : 'Inspection Required'}</p>
                 </div>
              </div>
              <button className="p-1.5 bg-white rounded-lg border border-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Eye size={12} /></button>
           </div>
           <div className={`p-4 rounded-[1.5rem] border flex items-center justify-between transition-all ${provider.expVerified ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-white rounded-xl shadow-sm"><Award size={16} /></div>
                 <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.15em] opacity-60">Credential Bureau</p>
                    <p className="text-[11px] font-black">{provider.experience}Y Certification</p>
                 </div>
              </div>
              <button className="p-1.5 bg-white rounded-lg border border-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Eye size={12} /></button>
           </div>
        </div>

        {/* Dynamic Verification Hub */}
        <div className="bg-blue-600 rounded-[2rem] p-6 text-white shadow-lg overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
           <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Evidence Repository</h4>
                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/50 rounded-lg border border-blue-400/30">
                    <div className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Doc Cloud Active</span>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/10 hover:bg-white/20 transition-all rounded-[1.5rem] p-4 border border-white/10 flex flex-col items-center gap-3 group/doc cursor-pointer">
                    <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover/doc:-rotate-6">
                       <FileText size={24} />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-100">National_ID.jpg</p>
                 </div>
                 <div className="bg-white/10 hover:bg-white/20 transition-all rounded-[1.5rem] p-4 border border-white/10 flex flex-col items-center gap-3 group/doc cursor-pointer">
                    <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover/doc:rotate-6">
                       <Award size={24} />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-100">Experience_Cert.pdf</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApprovalModal;
