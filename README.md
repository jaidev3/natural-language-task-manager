# Natural Language Task Manager (Enterprise-Grade To-Do List)

## Objective

Build a Web App that lets a user add natural language tasks like:
"Finish landing page Aman by 11pm 20th June"
"Call client Rajeev tomorrow 5pm"

## Functionality Requirements

- Extract:
  - Task Name (e.g., "Finish landing page")
  - Assignee (e.g., "Aman")
  - Due Date & Time (e.g., "11pm 20th June")
  - Default priority P3 unless specified as P1, P2, or P4
- Display the parsed task in a beautiful UI task board/list.

**Example Output:**
| Task | Assigned To | Due Date/Time | Priority |
|---------------------|-------------|--------------------|----------|
| Finish landing page | Aman | 11:00 PM, 20 June | P3 |

## Bonus Features

- Allow editing of the parsed task directly in the UI.

## Project Plan

**Phase 1: Core Functionality & Setup**

1.  **Project Initialization & Basic Structure**:
    - Confirm React + Vite setup.
    - Create a basic folder structure:
      - `src/components/`: For UI components (e.g., `TaskList`, `TaskItem`, `TaskInput`).
      - `src/services/`: For logic like NLP parsing, task management.
      - `src/hooks/`: For custom React hooks.
      - `src/utils/`: For utility functions (e.g., date formatting).
      - `src/types/`: For TypeScript type definitions.
2.  **Natural Language Processing (NLP) Module** (`src/services/nlpParser.ts`):
    - **Objective**: Implement a function that takes a natural language string and returns a structured task object.
    - **Extraction Logic**:
      - **Task Name**: Identify the core action/description.
      - **Assignee**: Look for names or keywords indicating assignment (e.g., "Aman", "to [Name]").
      - **Due Date & Time**: Parse various date/time formats (e.g., "tomorrow 5pm", "20th June 11pm", "next Monday").
      - **Priority**: Detect P1, P2, P4 keywords; default to P3 if none found.
    - **Tools**: Consider libraries like `compromise` for general NLP and `date-fns` for robust date parsing and manipulation.
3.  **Task Data Structure Definition** (`src/types/task.ts`):
    - Define a TypeScript interface for a task, e.g.:
      ```typescript
      interface Task {
        id: string;
        text: string; // Original natural language input
        name: string; // Parsed task name
        assignee?: string;
        dueDate?: Date;
        priority: "P1" | "P2" | "P3" | "P4";
        isCompleted: boolean;
      }
      ```
4.  **Task Management Logic** (Initially in-memory, e.g., using React state or a custom hook `src/hooks/useTaskManager.ts`):
    - **Add Task**: Function to take parsed task data and add it to a list.
    - **List Tasks**: Store and provide the current list of tasks.
    - **Generate Unique IDs**: Use a library like `uuid`.

**Phase 2: Frontend Development (React)**

1.  **Task Input Component** (`src/components/TaskInput.tsx`):
    - An input field for users to type their natural language tasks.
    - On submission, it calls the NLP parser and then the task-adding function.
2.  **Task Item Component** (`src/components/TaskItem.tsx`):
    - Displays a single task with its details: Name, Assignee, Due Date/Time (formatted nicely), Priority.
    - Could include a checkbox for marking as complete.
3.  **Task List/Board Component** (`src/components/TaskList.tsx`):
    - Renders a list of `TaskItem` components.
    - Could be a simple list or a more complex board view (e.g., columns for priorities or statuses).
4.  **Main Application UI** (`App.tsx`):
    - Integrate `TaskInput` and `TaskList`.
    - Manage the overall application state (tasks list).

**Phase 3: Styling & User Experience (UX)**

1.  **Styling**:
    - Apply CSS to create a "beautiful UI".
    - Choose a styling approach:
      - Vanilla CSS / CSS Modules.
      - Utility-first CSS (e.g., Tailwind CSS).
      - CSS-in-JS (e.g., Styled Components, Emotion).
      - Component library (e.g., Material-UI, Ant Design).
2.  **UX Enhancements**:
    - Clear visual feedback on actions (e.g., task added, errors in parsing).
    - Responsive design for different screen sizes.
    - User-friendly date/time display.

**Phase 4: Bonus Features (Iterative)**

1.  **In-UI Task Editing**:
    - Allow users to click on a task's details (name, assignee, due date, priority) and modify them directly.
    - Update the task state accordingly.
2.  **Task Deletion**:
    - Add a button or action to remove tasks.
3.  **Persistence**:
    - Save tasks to `localStorage` so they persist across browser sessions.
    - (Later) Consider a proper backend and database if scaling or multi-user features are needed.
4.  **Filtering/Sorting**:
    - Allow users to filter tasks (e.g., by assignee, priority) or sort them (e.g., by due date).
5.  **Error Handling & Edge Cases**:
    - Gracefully handle inputs that can't be parsed.
    - Provide helpful error messages.

## Production Dependencies

- `react`: For building the user interface.
- `react-dom`: For rendering React components in the browser.
- `compromise`: For client-side Natural Language Processing to parse task strings.
- `date-fns`: For robust date parsing, formatting, and manipulation.
- `uuid`: For generating unique IDs for tasks.

## Development Dependencies

- `@types/react`: TypeScript definitions for React.
- `@types/react-dom`: TypeScript definitions for React DOM.
- `@types/compromise`: TypeScript definitions for `compromise`.
- `@types/uuid`: TypeScript definitions for `uuid`.
- `@vitejs/plugin-react`: Vite plugin for React.
- `eslint` and related plugins: For linting and code quality.
- `typescript`: For static typing.
- `vite`: For the build tool and development server.
