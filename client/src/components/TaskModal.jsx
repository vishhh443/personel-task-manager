import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Calendar, FileText, AlignLeft } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, task }) {
  const { addTask, updateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  const modalRef = useRef(null);

  // Initialize/reset form state on opening or toggling edit target
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setDueDate(task.dueDate || '');
      } else {
        setTitle('');
        setDescription('');
        setDueDate('');
      }
      setErrors({});
      
      // Focus the title input once open
      setTimeout(() => {
        const input = modalRef.current?.querySelector('#task-title');
        input?.focus();
      }, 50);
    }
  }, [isOpen, task]);

  // Handle escape key closure and tab focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      
      // Tab trapping
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset validations
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task title cannot be empty.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
    };

    let success = false;
    if (task) {
      success = await updateTask(task.id, payload);
    } else {
      success = await addTask(payload);
    }

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="glass-panel w-full max-w-lg rounded-2xl border border-white/10 p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
          <h3 id="modal-title" className="text-lg font-semibold text-white">
            {task ? 'Edit TaskDetails' : 'Create New Task'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <FileText size={16} className="text-gray-400" />
              <span>Title <span className="text-indigo-400">*</span></span>
            </label>
            <input
              id="task-title"
              type="text"
              className={`w-full glass-panel px-4 py-2.5 rounded-xl border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                errors.title
                  ? 'border-rose-500/50 focus:ring-rose-500/40 focus:border-rose-500'
                  : 'border-white/10 focus:ring-indigo-500/50 focus:border-indigo-500'
              }`}
              placeholder="e.g. Complete presentation review"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, title: null }));
                }
              }}
              autoComplete="off"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-400 font-medium" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="task-desc" className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <AlignLeft size={16} className="text-gray-400" />
              <span>Description</span>
            </label>
            <textarea
              id="task-desc"
              rows={3}
              className="w-full glass-panel px-4 py-2.5 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 text-sm resize-none"
              placeholder="Describe what needs to be done..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Due Date Field */}
          <div>
            <label htmlFor="task-due" className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Calendar size={16} className="text-gray-400" />
              <span>Due Date</span>
            </label>
            <input
              id="task-due"
              type="date"
              className="w-full glass-panel px-4 py-2.5 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 text-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Actions Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium text-sm transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/25 transition-all duration-200"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
