// src/context/WorkspaceContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load workspaces on mount
  useEffect(() => {
    fetchWorkspaces();

    // Try to load the last used workspace from localStorage
    const savedWorkspaceId = localStorage.getItem("currentWorkspaceId");
    if (savedWorkspaceId) {
      fetchWorkspace(savedWorkspaceId);
    } else {
      setLoading(false);
    }
  }, []);

  // Save current workspace ID to localStorage when it changes
  useEffect(() => {
    if (currentWorkspace) {
      localStorage.setItem("currentWorkspaceId", currentWorkspace.id);
    }
  }, [currentWorkspace]);

  // Fetch all workspaces
  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/workspaces");

      if (!response.ok) {
        throw new Error(`Failed to fetch workspaces: ${response.statusText}`);
      }

      const data = await response.json();
      setWorkspaces(data.workspaces || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching workspaces:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific workspace
  const fetchWorkspace = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/workspaces/${id}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch workspace: ${response.statusText}`);
      }

      const data = await response.json();
      setCurrentWorkspace(data.workspace);
      setError(null);
    } catch (err) {
      console.error(`Error fetching workspace ${id}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new workspace
  const createWorkspace = async (name) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create workspace: ${response.statusText}`);
      }

      const data = await response.json();

      // Update workspaces list and set as current
      setWorkspaces([...workspaces, data.workspace]);
      setCurrentWorkspace(data.workspace);
      setError(null);

      return data.workspace;
    } catch (err) {
      console.error("Error creating workspace:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Switch to a different workspace
  const switchWorkspace = (workspaceId) => {
    const workspace = workspaces.find((ws) => ws.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
    } else {
      fetchWorkspace(workspaceId);
    }
  };

  // Clear current workspace
  const clearWorkspace = () => {
    setCurrentWorkspace(null);
    localStorage.removeItem("currentWorkspaceId");
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        loading,
        error,
        fetchWorkspaces,
        createWorkspace,
        switchWorkspace,
        clearWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

// Custom hook to use workspace context
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
