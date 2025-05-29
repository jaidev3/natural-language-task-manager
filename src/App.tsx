import React from "react";
import { useTaskManager } from "./hooks/useTaskManager";
import { TaskInput } from "./components/TaskInput";
import { TaskList } from "./components/TaskList";
import "./App.css";

function App() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } =
    useTaskManager();

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎯 Natural Language Task Manager</h1>
        <p>
          Add tasks in natural language like "Finish landing page Aman by 11pm
          20th June"
        </p>
      </header>

      <main className="app-main">
        <div className="task-input-section">
          <TaskInput onAddTask={addTask} />
        </div>

        <div className="task-list-section">
          <TaskList
            tasks={tasks}
            onToggleComplete={toggleComplete}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
