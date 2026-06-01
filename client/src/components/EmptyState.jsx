import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Sparkles, Inbox, RefreshCw } from 'lucide-react';

export default function EmptyState({ onCreateClick }) {
  const { tasks, setFilter, setSearch } = useTasks();

  const isSearchOrFilterActive = tasks.length > 0;

  const handleReset = () => {
    setFilter('all');
    setSearch('');
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 glass-panel rounded-2xl text-center max-w-lg mx-auto mt-6">
      <div className="p-4 rounded-full bg-[#171C1A] border border-[#242D2A] text-[#10B981] mb-6 animate-pulse">
        {isSearchOrFilterActive ? (
          <Inbox size={40} className="stroke-[1.5]" />
        ) : (
          <Sparkles size={40} className="stroke-[1.5]" />
        )}
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">
        {isSearchOrFilterActive ? 'No Matching Tasks Found' : 'No Tasks Yet'}
      </h3>
      
      <p className="text-zinc-400 text-sm md:text-base mb-6 max-w-sm">
        {isSearchOrFilterActive
          ? "We couldn't find any tasks matching your current search or filter criteria. Try adjusting them."
          : 'Organize your day, boost your productivity, and clear your mind by creating your first task.'}
      </p>

      {isSearchOrFilterActive ? (
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#171C1A] border border-[#242D2A] hover:border-[#2E3A36] text-white text-sm font-semibold rounded-xl transition-all duration-200"
        >
          <RefreshCw size={16} />
          <span>Reset Filters & Search</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreateClick}
          className="px-6 py-3 bg-[#10B981] hover:bg-[#34D399] text-[#0B0F0E] font-bold text-sm rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
        >
          Create Your First Task
        </button>
      )}
    </div>
  );
}
