import React, { useState, useEffect } from "react";
import "./ApiKeyManager.css";

interface ApiKeyManagerProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onDeleteApiKey: () => void;
}

export function ApiKeyManager({
  apiKey,
  onApiKeyChange,
  onDeleteApiKey,
}: ApiKeyManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(!!apiKey);

  // Sync tempApiKey when apiKey prop changes
  useEffect(() => {
    setTempApiKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    if (tempApiKey.trim()) {
      onApiKeyChange(tempApiKey.trim());
      setIsEditing(false);
      setIsCollapsed(true);
    }
  };

  const handleCancel = () => {
    setTempApiKey(apiKey);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTempApiKey(apiKey);
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete the API key? This will remove it from local storage."
      )
    ) {
      onDeleteApiKey();
      setIsCollapsed(false);
    }
  };

  const maskApiKey = (key: string) => {
    if (!key) return "";
    if (key.length <= 8) return "*".repeat(key.length);
    return (
      key.substring(0, 4) +
      "*".repeat(key.length - 8) +
      key.substring(key.length - 4)
    );
  };

  return (
    <div className="api-key-manager">
      <div
        className="api-key-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="api-key-title">
          <span className="api-key-icon">🔑</span>
          <h3>OpenAI API Key</h3>
          <span
            className={`api-key-status ${
              apiKey ? "configured" : "not-configured"
            }`}
          >
            {apiKey ? "Configured" : "Not Configured"}
          </span>
        </div>
        <button className="collapse-toggle" type="button">
          {isCollapsed ? "▼" : "▲"}
        </button>
      </div>

      {!isCollapsed && (
        <div className="api-key-content">
          {!apiKey && !isEditing ? (
            <div className="api-key-setup">
              <p className="api-key-description">
                Enter your OpenAI API key to enable natural language task
                parsing. Your key will be stored securely in your browser's
                local storage.
              </p>
              <div className="api-key-input-group">
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="api-key-input"
                />
                <button
                  onClick={handleSave}
                  disabled={!tempApiKey.trim()}
                  className="api-key-button primary"
                >
                  Save API Key
                </button>
              </div>
            </div>
          ) : isEditing ? (
            <div className="api-key-edit">
              <div className="api-key-input-group">
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="api-key-input"
                  autoFocus
                />
                <div className="api-key-actions">
                  <button
                    onClick={handleSave}
                    className="api-key-button primary"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="api-key-button secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="api-key-display">
              <div className="api-key-value">
                <span className="api-key-text">
                  {showApiKey ? apiKey : maskApiKey(apiKey)}
                </span>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="api-key-toggle-visibility"
                  title={showApiKey ? "Hide API key" : "Show API key"}
                >
                  {showApiKey ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <div className="api-key-actions">
                <button
                  onClick={handleEdit}
                  className="api-key-button secondary"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="api-key-button danger"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
