import { useTaskManager } from "./hooks/useTaskManager";
import { TaskInput } from "./components/TaskInput";
import { TaskList } from "./components/TaskList";
import { ApiKeyManager } from "./components/ApiKeyManager";
import { MeetingTranscriptParser } from "./components/MeetingTranscriptParser";
import "./App.css";

function App() {
  const {
    apiKey,
    tasks,
    addTask,
    addMultipleTasks,
    updateTask,
    deleteTask,
    toggleComplete,
    setApiKey,
    deleteApiKey,
  } = useTaskManager();

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎯 Natural Language Task Manager</h1>
        <p>
          Add tasks in natural language like "Finish landing page Aman by 11pm
          20th June".,
          <br />
          28th may ko Rajive ko bajar jana hai subha 10 baje Sabji lene, ghar me
          bilkul sabji nhi hai khayenge kya?,
          <br />
          30 may ko bhandara khane jana hai hanumanji ke mandir me, bhaut urgent
          hai.
        </p>
      </header>

      <main className="app-main">
        <div className="api-key-section">
          <ApiKeyManager
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            onDeleteApiKey={deleteApiKey}
          />
        </div>

        <div className="task-input-section">
          <TaskInput onAddTask={addTask} apiKey={apiKey} />
        </div>

        <div className="meeting-parser-section">
          <MeetingTranscriptParser
            onAddTasks={addMultipleTasks}
            apiKey={apiKey}
          />
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
