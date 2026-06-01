import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Clock, Edit2, Trash2, GripVertical, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TaskCard({ task, onEditClick, onDeleteClick }) {
  const { toggleTaskStatus } = useTasks();

  // Sortable drag-and-drop hooks from @dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 20 : 1,
  };

  // Overdue check
  const isOverdue = !task.completed && task.dueDate && (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  })();

  // Formatting dates
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // Prevent timezone shift
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group glass-panel rounded-2xl p-5 border relative overflow-hidden transition-all duration-300 ${
        task.completed
          ? 'border-emerald-500/25 bg-emerald-950/5'
          : isOverdue
          ? 'border-rose-500/35 bg-rose-950/10 shadow-lg shadow-rose-950/10'
          : 'border-white/5 bg-slate-900/40 hover:border-indigo-500/30'
      }`}
      aria-label={`Task: ${task.title}`}
    >
      {/* Visual background indicators */}
      {isOverdue && (
        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 pointer-events-none" />
      )}
      {task.completed && (
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 pointer-events-none" />
      )}

      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="p-1 rounded text-gray-500 hover:text-white cursor-grab active:cursor-grabbing hover:bg-white/5 transition-all duration-200"
          title="Drag to reorder"
          aria-label="Drag handle to reorder task"
        >
          <GripVertical size={16} />
        </div>

        {/* Checkbox Toggle Switch (Custom Animated Toggle) */}
        <div className="pt-0.5">
          <label className="relative inline-flex items-center cursor-pointer" aria-label="Toggle task status">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={task.completed}
              onChange={() => toggleTaskStatus(task.id)}
            />
            {/* Animated outer background switch */}
            <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white peer-checked:after:border-white transition-all duration-300" />
          </label>
        </div>

        {/* Task Details Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4
              className={`text-base font-semibold text-white truncate transition-all duration-300 ${
                task.completed ? 'line-through text-gray-500 decoration-gray-600' : ''
              }`}
            >
              {task.title}
            </h4>

            {/* Badges */}
            {task.completed ? (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                <CheckCircle2 size={10} />
                <span>Completed</span>
              </span>
            ) : isOverdue ? (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                <AlertCircle size={10} />
                <span>Overdue</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={`text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed transition-all duration-300 ${
                task.completed ? 'text-gray-600' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadata Footer */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1" title={`Created on ${createdDate}`}>
              <Clock size={12} />
              <span>Created {createdDate}</span>
            </span>

            {task.dueDate && (
              <span
                className={`flex items-center gap-1 ${
                  isOverdue ? 'text-rose-400 font-medium' : ''
                }`}
                title={`Due by ${formatDate(task.dueDate)}`}
              >
                <Calendar size={12} />
                <span>Due {formatDate(task.dueDate)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Task Actions */}
        <div className="flex items-center gap-1.5 self-center opacity-85 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-2">
          <button
            type="button"
            onClick={() => onEditClick(task)}
            className="p-2 rounded-xl text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/10 transition-all duration-200"
            title="Edit task"
            aria-label={`Edit task: ${task.title}`}
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteClick(task.id)}
            className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition-all duration-200"
            title="Delete task"
            aria-label={`Delete task: ${task.title}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
