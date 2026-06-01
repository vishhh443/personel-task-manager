import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';
import SkeletonLoader from './SkeletonLoader';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function TaskList({ onEditClick, onDeleteClick, onCreateClick }) {
  const { filteredTasks, loading, reorderTasksList } = useTasks();

  // Configure sensors for drag-and-drop.
  // We add an activationConstraint to PointerSensor so that drag handles don't block simple clicks/taps on other interactive buttons.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // drag starts only after moving 5px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedTasks = arrayMove(filteredTasks, oldIndex, newIndex);
      const reorderedIds = reorderedTasks.map((t) => t.id);
      reorderTasksList(reorderedIds);
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (filteredTasks.length === 0) {
    return <EmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div id="task-list-container" className="w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4 w-full" role="list">
            {filteredTasks.map((task) => (
              <div key={task.id} role="listitem">
                <TaskCard
                  task={task}
                  onEditClick={onEditClick}
                  onDeleteClick={onDeleteClick}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
