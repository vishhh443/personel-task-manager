import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const { search, setSearch } = useTasks();

  return (
    <div className="relative w-full">
      <label htmlFor="task-search" className="sr-only">
        Search tasks by title
      </label>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        id="task-search"
        type="text"
        className="w-full glass-panel pl-11 pr-10 py-3 rounded-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 text-sm md:text-base"
        placeholder="Search tasks by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
      />
      {search && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
          onClick={() => setSearch('')}
          aria-label="Clear search input"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
