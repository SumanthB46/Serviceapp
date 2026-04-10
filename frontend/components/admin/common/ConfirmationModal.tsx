"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger'
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="p-8 pb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
              variant === 'danger' ? 'bg-red-50 text-red-500' : 
              variant === 'warning' ? 'bg-orange-50 text-orange-500' : 
              'bg-blue-50 text-blue-500'
            }`}>
              <AlertTriangle size={28} />
            </div>
            
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2 uppercase tracking-wide">{title}</h3>
            <p className="text-sm font-bold text-gray-500 leading-relaxed uppercase tracking-tight opacity-70 italic">{message}</p>
          </div>

          <div className="p-6 bg-gray-50/50 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-gray-100 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-4 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                variant === 'danger' ? 'bg-red-600 shadow-red-200 hover:bg-red-700' :
                variant === 'warning' ? 'bg-orange-600 shadow-orange-200 hover:bg-orange-700' :
                'bg-blue-600 shadow-blue-200 hover:bg-blue-700'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmationModal;
