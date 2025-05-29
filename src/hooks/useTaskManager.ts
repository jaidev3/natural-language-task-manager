import { useState, useEffect } from "react";
import type { Task } from "../types/task";
import { v4 as uuidv4 } from "uuid";
// import { parseNaturalLanguageTask } from "../services/nlpParser";
import { parseStoredTasks } from "../utils/storageUtils";
import { parseNaturalLanguageTaskAi } from "../services/openaiParser";

export function useTaskManager() {
  const [apiKey, setApiKey] = useState("");
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? parseStoredTasks(storedTasks) : [];
  });

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async (naturalLanguageInput: string) => {
    // const parsedData = await parseNaturalLanguageTask(naturalLanguageInput);
    const parsedData = await parseNaturalLanguageTaskAi(
      naturalLanguageInput,
      apiKey
    );
    console.log(parsedData);
    // return;
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
    apiKey,
    setApiKey,
  };
}
