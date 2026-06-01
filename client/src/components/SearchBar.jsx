import React, { useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const { search, setSearch } = useTasks();
  const inputRef = useRef(null);

  // Global keydown listener to focus input on '/' keypress
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Focus if '/' is pressed and user is not currently inside a form field
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

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
        ref={inputRef}
        type="text"
        className="w-full glass-panel pl-11 pr-12 py-3 rounded-xl border border-[#242D2A] text-white placeholder-[#8A9590]/50 focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-200 text-sm md:text-base bg-zinc-950/20"
        placeholder="Search tasks by title... (Press '/' to focus)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
      />
      {search ? (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-450 hover:text-white transition-colors duration-200"
          onClick={() => setSearch('')}
          aria-label="Clear search input"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none hidden md:flex" aria-hidden="true">
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500 bg-[#0B0F0E] border border-[#242D2A] rounded-md">
            /
          </kbd>
        </div>
      )}
    </div>
  );
}
