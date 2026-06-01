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
      colorClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      radialClass: 'from-indigo-500/20 to-transparent',
    },
    {
      title: 'Active Tasks',
      value: active,
      icon: Play,
      colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      radialClass: 'from-amber-500/20 to-transparent',
    },
    {
      title: 'Completed',
      value: completed,
      icon: CheckCircle2,
      colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      radialClass: 'from-emerald-500/20 to-transparent',
    },
    {
      title: 'Overdue',
      value: overdue,
      icon: AlertTriangle,
      colorClass: overdue > 0 
        ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' 
        : 'text-gray-400 bg-gray-500/5 border-gray-500/10',
      radialClass: overdue > 0 ? 'from-rose-500/20 to-transparent' : 'from-gray-500/10 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {statCards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`glass-panel rounded-2xl p-5 border relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-white/20`}
            role="status"
            aria-live="polite"
          >
            {/* Ambient radial lighting inside cards */}
            <div className={`absolute -right-10 -bottom-10 w-28 h-28 rounded-full bg-radial ${stat.radialClass} blur-xl pointer-events-none`} />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-gray-400 text-xs md:text-sm font-medium tracking-wide uppercase">
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
