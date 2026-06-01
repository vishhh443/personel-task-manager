import React from 'react';
import { useTasks } from '../context/TaskContext';

export default function FilterTabs() {
  const { filter, setFilter, tasks } = useTasks();

  const total = tasks.length;
  const active = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;

  const tabs = [
    { id: 'all', label: 'All', count: total },
    { id: 'active', label: 'Active', count: active },
    { id: 'completed', label: 'Completed', count: completed },
  ];

  return (
    <div className="flex p-1 glass-panel rounded-xl border border-white/5 w-full md:w-auto" role="tablist" aria-label="Task filters">
      {tabs.map((tab) => {
        const isActive = filter === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls="task-list-container"
            id={`filter-tab-${tab.id}`}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center justify-center gap-2 flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
              isActive
                ? 'bg-white text-black shadow-md shadow-white/5'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-zinc-250 text-black'
                  : 'bg-zinc-900 text-zinc-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
