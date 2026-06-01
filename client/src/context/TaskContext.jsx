import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Fetch all tasks from the server
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      setError(err);
      toast.error(`Failed to load tasks: ${err}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initially on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create a new task
  const addTask = async (taskData) => {
    try {
      const newTask = await api.post('/tasks', taskData);
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      toast.success('Task created successfully!');
      return true;
    } catch (err) {
      toast.error(err || 'Failed to create task');
      return false;
    }
  };

  // Edit an existing task
  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await api.put(`/tasks/${id}`, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      toast.success('Task updated successfully!');
      return true;
    } catch (err) {
      toast.error(err || 'Failed to update task');
      return false;
    }
  };

  // Toggle task status
  const toggleTaskStatus = async (id) => {
    try {
      const updatedTask = await api.patch(`/tasks/${id}/status`);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      toast.success(
        updatedTask.completed ? 'Task completed! 🎉' : 'Task marked active'
      );
    } catch (err) {
      toast.error(err || 'Failed to update status');
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error(err || 'Failed to delete task');
    }
  };

  // Handle reordering (local preview and api commit)
  const reorderTasksList = async (reorderedIds) => {
    // 1. Locally reorder state immediately for immediate UX feedback
    const taskMap = new Map(tasks.map((t) => [t.id, t]));
    const updatedTasks = [];

    reorderedIds.forEach((id) => {
      if (taskMap.has(id)) {
        updatedTasks.push(taskMap.get(id));
        taskMap.delete(id);
      }
    });
    // Append remaining
    taskMap.forEach((t) => updatedTasks.push(t));

    setTasks(updatedTasks);

    // 2. Persist order in backend
    try {
      await api.patch('/tasks/reorder', { taskIds: reorderedIds });
    } catch (err) {
      // Revert if API fails
      toast.error(`Failed to persist order: ${err}`);
      fetchTasks();
    }
  };

  // Compute filtered & searched tasks dynamically
  const getFilteredTasks = useCallback(() => {
    return tasks.filter((task) => {
      // Apply Filter tab
      if (filter === 'active' && task.completed) return false;
      if (filter === 'completed' && !task.completed) return false;

      // Apply Search query
      if (search.trim() !== '') {
        const query = search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        return matchesTitle;
      }

      return true;
    });
  }, [tasks, filter, search]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        filter,
        setFilter,
        search,
        setSearch,
        fetchTasks,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        reorderTasksList,
        filteredTasks: getFilteredTasks(),
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
