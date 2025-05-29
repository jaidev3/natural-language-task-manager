import { useState } from "react";
import type { Task } from "../types/task";
import { v4 as uuidv4 } from "uuid";
import { parseNaturalLanguageTask } from "../services/nlpParser";

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (naturalLanguageInput: string) => {
    const parsedData = parseNaturalLanguageTask(naturalLanguageInput);

    const newTask: Task = {
      id: uuidv4(),
      text: naturalLanguageInput,
      name: parsedData.name,
      assignee: parsedData.assignee,
      dueDate: parsedData.dueDate,
      priority: parsedData.priority,
      isCompleted: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
}
