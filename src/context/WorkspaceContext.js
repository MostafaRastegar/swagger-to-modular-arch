// Update src/context/WorkspaceContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const { user } = useAuth();
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [defaultSwaggerFile, setDefaultSwaggerFile] = useState(null);
  const [checkingDefaultFile, setCheckingDefaultFile] = useState(false);

  const joinWorkspaceByShareCode = async (shareCode) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/workspaces/join",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shareCode,
            userId: user.id, // استفاده از ID کاربر فعلی
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // به‌روزرسانی لیست workspace‌ها
        // اگر workspace قبلاً در لیست نیست، اضافه می‌کنیم
        const existingWorkspace = workspaces.find(
          (ws) => ws.id === data.workspace.id
        );

        if (!existingWorkspace) {
          setWorkspaces([...workspaces, data.workspace]);
        }

        setCurrentWorkspace(data.workspace);
        return data.workspace;
      } else {
        throw new Error(data.message || "Failed to join workspace");
      }
    } catch (err) {
      console.error("Error joining workspace:", err);
      setError(err.message);
      throw err;
    }
  };
  // Load workspaces on mount
  useEffect(() => {
    if (isAuthReady) {
      fetchWorkspaces();
    }
    // Try to load the last used workspace from localStorage
    const savedWorkspaceId = localStorage.getItem("currentWorkspaceId");
    if (savedWorkspaceId) {
      fetchWorkspace(savedWorkspaceId);
    } else {
      setLoading(false);
    }
  }, [isAuthReady]);

  // Save current workspace ID to localStorage when it changes
  useEffect(() => {
    if (currentWorkspace) {
      localStorage.setItem("currentWorkspaceId", currentWorkspace.id);

      // Check for default Swagger file when workspace changes
      checkDefaultSwaggerFile(currentWorkspace.id);
    } else {
      setDefaultSwaggerFile(null);
    }
  }, [currentWorkspace]);

  useEffect(() => {
    // وقتی کاربر لود شد، پرچم آماده بودن را true می‌کنیم
    if (user) {
      setIsAuthReady(true);
    }
  }, [user]);

  // Fetch all workspaces
  const fetchWorkspaces = async () => {
    try {
      // استفاده از ID کاربر فعلی
      const userId = user?.id;

      if (!userId) {
        setError("User not authenticated");
        return;
      }

      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/workspaces?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch workspaces: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setWorkspaces(data.workspaces);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to fetch workspaces");
      }
    } catch (err) {
      console.error("Error fetching workspaces:", err);
      setError(err.message);
      setWorkspaces([]);
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

      // Check for default Swagger file
      checkDefaultSwaggerFile(id);
    } catch (err) {
      console.error(`Error fetching workspace ${id}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new workspace
  async function createWorkspace(name) {
    try {
      const response = await fetch("http://localhost:3001/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          userId: user.id, // استفاده از ID کاربر فعلی برای ایجاد workspace
        }),
      });

      const data = await response.json();

      if (data.success) {
        // به‌روزرسانی لیست workspace‌ها
        setWorkspaces([...workspaces, data.workspace]);
        setCurrentWorkspace(data.workspace);
      } else {
        throw new Error(data.message || "Failed to create workspace");
      }
    } catch (err) {
      console.error("Error creating workspace:", err);
      setError(err.message);
      throw err;
    }
  }

  // Switch to a different workspace
  const switchWorkspace = (workspaceId) => {
    const workspace = workspaces.find((ws) => ws.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      checkDefaultSwaggerFile(workspaceId);
    } else {
      fetchWorkspace(workspaceId);
    }
  };

  // Clear current workspace
  const clearWorkspace = () => {
    setCurrentWorkspace(null);
    setDefaultSwaggerFile(null);
    localStorage.removeItem("currentWorkspaceId");
  };

  // NEW METHODS FOR DEFAULT SWAGGER FILE

  // Check if workspace has a default Swagger file
  const checkDefaultSwaggerFile = async (workspaceId) => {
    if (!workspaceId) return;

    try {
      setCheckingDefaultFile(true);
      const response = await fetch(
        `http://localhost:3001/api/workspaces/${workspaceId}/has-default-swagger`
      );

      if (!response.ok) {
        throw new Error("Failed to check default Swagger file");
      }

      const data = await response.json();

      if (data.success && data.hasDefaultSwagger) {
        setDefaultSwaggerFile(data.defaultSwaggerFile);
      } else {
        setDefaultSwaggerFile(null);
      }
    } catch (err) {
      console.error("Error checking default Swagger file:", err);
      setDefaultSwaggerFile(null);
    } finally {
      setCheckingDefaultFile(false);
    }
  };

  // Set a default Swagger file for the current workspace
  const setWorkspaceDefaultSwagger = async (file) => {
    if (!currentWorkspace || !file) {
      return {
        success: false,
        message: "No workspace selected or no file provided",
      };
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("swaggerFile", file);

      const response = await fetch(
        `http://localhost:3001/api/workspaces/${currentWorkspace.id}/default-swagger`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to set default Swagger file");
      }

      const data = await response.json();

      if (data.success) {
        setDefaultSwaggerFile(data.fileInfo);
        return { success: true };
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (err) {
      console.error("Error setting default Swagger file:", err);
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
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
        defaultSwaggerFile,
        checkingDefaultFile,
        checkDefaultSwaggerFile,
        setWorkspaceDefaultSwagger,
        joinWorkspaceByShareCode,
        isAuthReady,
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
