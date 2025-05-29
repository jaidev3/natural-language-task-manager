export interface Task {
  id: string;
  text: string; // Original natural language input
  name: string; // Parsed task name
  assignee?: string;
  dueDate?: Date;
  priority: "P1" | "P2" | "P3" | "P4";
  isCompleted: boolean;
}
