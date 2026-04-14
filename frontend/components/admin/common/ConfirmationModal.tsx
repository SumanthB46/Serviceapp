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
  confirmLabel = 'Delete',
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
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-[380px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100/50 pointer-events-auto flex flex-col items-center p-8 pt-10 text-center"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Icon Section */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-12 h-12 bg-red-600 rounded-xl rotate-45 flex items-center justify-center shadow-lg shadow-red-200">
              <div className="-rotate-45">
                <AlertTriangle size={24} className="text-white fill-white/20" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3 mb-10">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {title}
            </h3>
            <p className="text-[13px] font-medium text-gray-500 leading-relaxed max-w-[280px]">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 order-2 sm:order-1 py-3.5 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition-all"
            >
              {confirmLabel}
            </button>
            <button
              onClick={onClose}
              className="flex-1 order-1 sm:order-2 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 active:scale-95 transition-all"
            >
              {cancelLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmationModal;
