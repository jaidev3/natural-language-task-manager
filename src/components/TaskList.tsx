import React from "react";
import type { Task } from "../types/task";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
  onDeleteTask?: (id: string) => void;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>📝 No tasks yet!</h3>
        <p>Add your first task using natural language above.</p>
        <p>
          Try something like: "Finish project report John by tomorrow 5pm P1"
        </p>
      </div>
    );
  }

  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const totalTasks = tasks.length;

  return (
    <div>
      <h2>
        📋 Tasks ({completedTasks}/{totalTasks} completed)
      </h2>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
}
