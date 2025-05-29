import React, { useState } from "react";

interface TaskInputProps {
  onAddTask: (input: string) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAddTask(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter task in natural language (e.g., 'Finish landing page Aman by 11pm 20th June')"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}
