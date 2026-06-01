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
      colorClass: 'text-zinc-300 bg-[#171C1A]/50 border-[#242D2A]',
    },
    {
      title: 'Active Tasks',
      value: active,
      icon: Play,
      colorClass: 'text-[#34D399] bg-[#34D399]/5 border-[#34D399]/15',
    },
    {
      title: 'Completed',
      value: completed,
      icon: CheckCircle2,
      colorClass: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/25 font-bold',
    },
    {
      title: 'Overdue',
      value: overdue,
      icon: AlertTriangle,
      colorClass: overdue > 0 
        ? 'text-rose-400 bg-rose-500/10 border-rose-500/25 font-semibold' 
        : 'text-zinc-500 bg-[#171C1A]/20 border-[#242D2A]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {statCards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="glass-panel rounded-2xl p-5 border relative overflow-hidden transition-all duration-305 hover:border-[#2E3A36]"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-zinc-450 text-xs md:text-sm font-medium tracking-wide uppercase">
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
