import React, { useEffect, useRef } from 'react';
import { AlertOctagon } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  const dialogRef = useRef(null);

  // Trap focus and handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Focus the first button (Cancel button) to prevent accidental execution
    if (dialogRef.current) {
      const cancelBtn = dialogRef.current.querySelector('[data-autofocus]');
      cancelBtn?.focus();
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog body */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="glass-panel w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex gap-4">
          <div className="p-3 h-fit rounded-xl bg-[#171C1A] border border-[#242D2A] text-white">
            <AlertOctagon size={24} className="stroke-[2]" />
          </div>

          <div className="flex-1">
            <h3 id="confirm-dialog-title" className="text-lg font-semibold text-white mb-2">
              {title || 'Are you absolutely sure?'}
            </h3>
            <p id="confirm-dialog-message" className="text-zinc-400 text-sm leading-relaxed mb-6">
              {message || 'This action cannot be undone. This will permanently delete this task from the persistent database.'}
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#171C1A] hover:bg-[#1B211F] border border-[#242D2A] text-zinc-300 font-semibold text-sm transition-all duration-205"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all duration-200"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
