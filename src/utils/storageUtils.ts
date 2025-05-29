/**
 * Utility functions for localStorage management
 */

import type { Task } from "../types/task";

/**
 * Parse stored task data from localStorage and convert to proper Task objects
 */
export function parseStoredTasks(storedData: string): Task[] {
  try {
    const parsedTasks = JSON.parse(storedData);
    if (!Array.isArray(parsedTasks)) return [];

    return parsedTasks.map((task: any) => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }));
  } catch (error) {
    console.error("Error parsing stored tasks:", error);
    return [];
  }
}

export function clearTaskStorage(): void {
  localStorage.removeItem("tasks");
  console.log("Task storage cleared");
}

export function validateTaskData(tasks: any[]): Task[] {
  return tasks.filter((task) => {
    return (
      task &&
      typeof task.id === "string" &&
      typeof task.name === "string" &&
      typeof task.text === "string" &&
      typeof task.isCompleted === "boolean" &&
      ["P1", "P2", "P3", "P4"].includes(task.priority)
    );
  });
}

export function migrateTaskData(): void {
  const storedTasks = localStorage.getItem("tasks");
  if (!storedTasks) return;

  try {
    const parsedTasks = JSON.parse(storedTasks);
    if (!Array.isArray(parsedTasks)) {
      clearTaskStorage();
      return;
    }

    const validatedTasks = validateTaskData(parsedTasks);
    const migratedTasks = validatedTasks.map((task) => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }));

    localStorage.setItem("tasks", JSON.stringify(migratedTasks));
    console.log("Task data migrated successfully");
  } catch (error) {
    console.error("Error migrating task data:", error);
    clearTaskStorage();
  }
}
