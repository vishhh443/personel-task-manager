import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import DashboardStats from '../components/DashboardStats';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Plus, CheckSquare, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { deleteTask } = useTasks();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Deletion confirm states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Open modal for task creation
  const handleCreateClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Open modal for task editing
  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Open delete verification modal
  const handleDeleteClick = (id) => {
    setDeletingTaskId(id);
    setIsConfirmOpen(true);
  };

  // Handle deletion confirmation
  const handleConfirmDelete = async () => {
    if (deletingTaskId) {
      await deleteTask(deletingTaskId);
      setIsConfirmOpen(false);
      setDeletingTaskId(null);
    }
  };

  return (
    <div className="w-full min-h-screen px-4 md:px-8 py-8 md:py-12 max-w-6xl mx-auto flex flex-col gap-6 relative">
      {/* Header Block */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white shadow-inner">
            <CheckSquare size={32} className="stroke-[2.25]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>TaskFlow</span>
              <span className="text-xs font-bold text-zinc-300 bg-zinc-850 border border-zinc-700 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={10} />
                <span>Monochrome</span>
              </span>
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm mt-0.5 font-medium">
              Elegant personal task management engineered for focus.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCreateClick}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-zinc-200 text-black font-bold text-sm rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </header>

      {/* Dashboard Statistics Panel */}
      <section aria-label="Task statistics">
        <DashboardStats />
      </section>

      {/* Controls Bar: Search & Tabs */}
      <section aria-label="Task search and filters" className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-900/40 glass-panel p-4 rounded-2xl">
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>
        <div className="self-end md:self-auto w-full md:w-auto">
          <FilterTabs />
        </div>
      </section>

      {/* Task List container */}
      <main className="flex-1">
        <TaskList
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onCreateClick={handleCreateClick}
        />
      </main>

      {/* Footer Branding */}
      <footer className="text-center text-xs text-gray-500 mt-12 pt-6 border-t border-white/5">
        <p>© 2026 TaskFlow Personal Task Manager. Built with React, Express, & Tailwind CSS.</p>
      </footer>

      {/* Task Modal Overlay */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
      />

      {/* Confirm Deletion Overlay */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeletingTaskId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you absolutely sure you want to delete this task? This action will permanently remove it from the tasks.json file."
      />
    </div>
  );
}
