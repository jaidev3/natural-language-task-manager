import React, { useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: task.name,
    assignee: task.assignee || "",
    dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 16) : "",
    priority: task.priority,
  });

  const formatDueDate = (date?: Date) => {
    if (!date) return "No due date";
    return formatDateTime(date);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: task.name,
      assignee: task.assignee || "",
      dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 16) : "",
      priority: task.priority,
    });
  };

  const handleSave = () => {
    if (!onUpdate) return;

    const updates: Partial<Task> = {
      name: editData.name.trim() || task.name,
      assignee: editData.assignee.trim() || undefined,
      priority: editData.priority,
      dueDate: editData.dueDate ? new Date(editData.dueDate) : undefined,
    };

    onUpdate(task.id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: task.name,
      assignee: task.assignee || "",
      dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 16) : "",
      priority: task.priority,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  if (isEditing && onUpdate) {
    return (
      <div
        className={`task-item ${task.isCompleted ? "completed" : ""} editing`}
      >
        <div className="task-item-content">
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.isCompleted}
            onChange={() => onToggleComplete(task.id)}
          />
          <div className="task-details">
            <div className="edit-field">
              <label>Task Name:</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="edit-input task-name-input"
                placeholder="Enter task name"
              />
            </div>

            <div className="edit-fields-row">
              <div className="edit-field">
                <label>Assignee:</label>
                <input
                  type="text"
                  value={editData.assignee}
                  onChange={(e) =>
                    handleInputChange("assignee", e.target.value)
                  }
                  className="edit-input"
                  placeholder="Enter assignee"
                />
              </div>

              <div className="edit-field">
                <label>Due Date:</label>
                <input
                  type="datetime-local"
                  value={editData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className="edit-input"
                />
              </div>

              <div className="edit-field">
                <label>Priority:</label>
                <select
                  value={editData.priority}
                  onChange={(e) =>
                    handleInputChange("priority", e.target.value)
                  }
                  className="edit-input"
                >
                  <option value="P1">P1 (Highest)</option>
                  <option value="P2">P2 (High)</option>
                  <option value="P3">P3 (Medium)</option>
                  <option value="P4">P4 (Low)</option>
                </select>
              </div>
            </div>

            <div className="task-original">💬 Original: "{task.text}"</div>

            <div className="edit-actions">
              <button onClick={handleSave} className="save-button">
                ✅ Save
              </button>
              <button onClick={handleCancel} className="cancel-button">
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="task-actions">
          {onUpdate && (
            <button onClick={handleEdit} className="edit-button">
              ✏️ Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(task.id)} className="delete-button">
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
