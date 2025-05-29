import React, { useState } from "react";
import { parseMeetingTranscript } from "../services/openaiParser";
import type { ParsedTaskData } from "../services/openaiParser";

interface MeetingTranscriptParserProps {
  onAddTasks: (tasks: ParsedTaskData[]) => void;
  apiKey?: string;
}

export function MeetingTranscriptParser({
  onAddTasks,
  apiKey,
}: MeetingTranscriptParserProps) {
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<ParsedTaskData[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey?.trim()) {
      alert(
        "Please configure your OpenAI API key first to enable transcript parsing."
      );
      return;
    }
    if (!transcript.trim()) {
      alert("Please enter a meeting transcript to analyze.");
      return;
    }

    setIsLoading(true);
    try {
      const tasks = await parseMeetingTranscript(transcript.trim(), apiKey);
      setExtractedTasks(tasks);
      setShowPreview(true);
    } catch (error) {
      console.error("Error parsing transcript:", error);
      alert("Error parsing transcript. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllTasks = () => {
    onAddTasks(extractedTasks);
    setTranscript("");
    setExtractedTasks([]);
    setShowPreview(false);
  };

  const handleRemoveTask = (index: number) => {
    setExtractedTasks(extractedTasks.filter((_, i) => i !== index));
  };

  const handleEditTask = (
    index: number,
    field: keyof ParsedTaskData,
    value: any
  ) => {
    const updated = [...extractedTasks];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedTasks(updated);
  };

  const isDisabled = !apiKey?.trim();

  return (
    <div className="meeting-transcript-parser">
      <h3>🎙️ Meeting Minutes to Tasks</h3>
      <p className="description">
        Paste your meeting transcript below and AI will automatically extract
        all actionable tasks with assignees and deadlines.
      </p>

      {!apiKey?.trim() && (
        <div className="warning-message">
          ⚠️ Please configure your OpenAI API key above to enable meeting
          transcript parsing.
        </div>
      )}

      <form onSubmit={handleAnalyze}>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={
            isDisabled
              ? "Configure API key first to parse meeting transcripts"
              : `Paste your meeting transcript here. For example:
"Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight."`
          }
          rows={8}
          disabled={isDisabled}
          className="transcript-textarea"
        />
        <div className="button-group">
          <button
            type="submit"
            disabled={isDisabled || !transcript.trim() || isLoading}
            className="analyze-button"
          >
            {isLoading ? "🤖 Analyzing..." : "🔍 Extract Tasks"}
          </button>
          {transcript.trim() && (
            <button
              type="button"
              onClick={() => {
                setTranscript("");
                setExtractedTasks([]);
                setShowPreview(false);
              }}
              className="clear-button"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {showPreview && extractedTasks.length > 0 && (
        <div className="task-preview">
          <h4>📋 Extracted Tasks ({extractedTasks.length})</h4>
          <p className="preview-description">
            Review and edit the extracted tasks before adding them to your task
            list:
          </p>

          <div className="extracted-tasks">
            {extractedTasks.map((task, index) => (
              <div key={index} className="extracted-task">
                <div className="task-header">
                  <span className="task-number">Task {index + 1}</span>
                  <button
                    onClick={() => handleRemoveTask(index)}
                    className="remove-task-button"
                    title="Remove this task"
                  >
                    ✕
                  </button>
                </div>

                <div className="task-fields">
                  <div className="field-group">
                    <label>Task Description:</label>
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) =>
                        handleEditTask(index, "name", e.target.value)
                      }
                      className="task-field"
                    />
                  </div>

                  <div className="field-group">
                    <label>Assignee:</label>
                    <input
                      type="text"
                      value={task.assignee || ""}
                      onChange={(e) =>
                        handleEditTask(
                          index,
                          "assignee",
                          e.target.value || undefined
                        )
                      }
                      placeholder="Not specified"
                      className="task-field"
                    />
                  </div>

                  <div className="field-group">
                    <label>Due Date:</label>
                    <input
                      type="datetime-local"
                      value={
                        task.dueDate
                          ? new Date(task.dueDate).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        handleEditTask(
                          index,
                          "dueDate",
                          e.target.value ? new Date(e.target.value) : undefined
                        )
                      }
                      className="task-field"
                    />
                  </div>

                  <div className="field-group">
                    <label>Priority:</label>
                    <select
                      value={task.priority}
                      onChange={(e) =>
                        handleEditTask(
                          index,
                          "priority",
                          e.target.value as "P1" | "P2" | "P3" | "P4"
                        )
                      }
                      className="task-field"
                    >
                      <option value="P1">P1 - Urgent</option>
                      <option value="P2">P2 - High</option>
                      <option value="P3">P3 - Medium</option>
                      <option value="P4">P4 - Low</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="preview-actions">
            <button
              onClick={handleAddAllTasks}
              className="add-all-button"
              disabled={extractedTasks.length === 0}
            >
              ✅ Add All {extractedTasks.length} Tasks
            </button>
            <button
              onClick={() => {
                setExtractedTasks([]);
                setShowPreview(false);
              }}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showPreview && extractedTasks.length === 0 && (
        <div className="no-tasks-message">
          <p>🤔 No actionable tasks were found in the transcript.</p>
          <p>
            Try including more specific assignments like "John, please finish
            the report by Friday" or "Sarah needs to call the client tomorrow".
          </p>
        </div>
      )}
    </div>
  );
}
