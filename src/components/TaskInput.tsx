import React, { useState } from "react";

interface TaskInputProps {
  onAddTask: (input: string) => void;
  apiKey?: string;
}

export function TaskInput({ onAddTask, apiKey }: TaskInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey?.trim()) {
      alert(
        "Please configure your OpenAI API key first to enable natural language task parsing."
      );
      return;
    }
    if (input.trim()) {
      onAddTask(input.trim());
      setInput("");
    }
  };

  const isDisabled = !apiKey?.trim();

  return (
    <div>
      {!apiKey?.trim() && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            backgroundColor: "#fef3cd",
            color: "#856404",
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          ⚠️ Please configure your OpenAI API key above to enable natural
          language task parsing.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isDisabled
              ? "Configure API key first to add tasks"
              : "Enter task in natural language (e.g., 'Finish landing page Aman by 11pm 20th June')"
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            opacity: isDisabled ? 0.6 : 1,
          }}
          disabled={isDisabled}
        />
        <button
          type="submit"
          disabled={isDisabled || !input.trim()}
          style={{
            opacity: isDisabled || !input.trim() ? 0.6 : 1,
            cursor: isDisabled || !input.trim() ? "not-allowed" : "pointer",
          }}
        >
          Add Task
        </button>
      </form>
    </div>
  );
}
