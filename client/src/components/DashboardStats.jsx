import React from 'react';
import { useTasks } from '../context/TaskContext';
import { ClipboardList, Play, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function DashboardStats() {
  const { tasks } = useTasks();

  // Overdue check logic
  const isOverdue = (task) => {
    if (task.completed || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const total = tasks.length;
  const active = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter(isOverdue).length;

  const statCards = [
    {
      title: 'Total Tasks',
      value: total,
      icon: ClipboardList,
      colorClass: 'text-zinc-100 bg-zinc-900 border-zinc-800',
    },
    {
      title: 'Active Tasks',
      value: active,
      icon: Play,
      colorClass: 'text-zinc-300 bg-zinc-900 border-zinc-800',
    },
    {
      title: 'Completed',
      value: completed,
      icon: CheckCircle2,
      colorClass: 'text-white bg-zinc-900 border-zinc-800',
    },
    {
      title: 'Overdue',
      value: overdue,
      icon: AlertTriangle,
      colorClass: overdue > 0 
        ? 'text-white bg-zinc-900 border-zinc-700 font-bold' 
        : 'text-zinc-500 bg-zinc-900 border-zinc-850',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {statCards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="glass-panel rounded-2xl p-5 border relative overflow-hidden transition-all duration-300 hover:border-zinc-700"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-zinc-400 text-xs md:text-sm font-medium tracking-wide uppercase">
                {stat.title}
              </span>
              <div className={`p-2 rounded-xl border ${stat.colorClass}`}>
                <Icon size={18} className="stroke-[2.25]" />
              </div>
            </div>

            <div className="relative z-10">
              <span className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                {stat.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
