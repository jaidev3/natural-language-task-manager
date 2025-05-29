import React from "react";
import type { Task } from "../types/task";
import { formatDateTime } from "../utils/dateUtils";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  onDelete?: (id: string) => void;
}

export function TaskItem({
  task,
  onToggleComplete,
  onUpdate,
  onDelete,
}: TaskItemProps) {
  const formatDueDate = (date?: Date) => {
    if (!date) return "No due date";
    return formatDateTime(date);
  };

  return (
    <div className={`task-item ${task.isCompleted ? "completed" : ""}`}>
      <div className="task-item-content">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.isCompleted}
          onChange={() => onToggleComplete(task.id)}
        />
        <div className="task-details">
          <h3 className={`task-name ${task.isCompleted ? "completed" : ""}`}>
            {task.name}
          </h3>
          <div className="task-meta">
            <div className="task-meta-item">
              <span>👤 {task.assignee || "Unassigned"}</span>
            </div>
            <div className="task-meta-item">
              <span>📅 {formatDueDate(task.dueDate)}</span>
            </div>
            <div className="task-meta-item">
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority}
              </span>
            </div>
          </div>
          <div className="task-original">💬 Original: "{task.text}"</div>
        </div>
        {onDelete && (
          <button onClick={() => onDelete(task.id)} className="delete-button">
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
}
