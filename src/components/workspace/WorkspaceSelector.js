// src/components/workspace/WorkspaceSelector.js
import React, { useState } from "react";
import { Briefcase, Plus, RefreshCw } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";
import Button from "../shared/Button";

const WorkspaceSelector = () => {
  const {
    currentWorkspace,
    workspaces,
    loading,
    error,
    fetchWorkspaces,
    switchWorkspace,
    createWorkspace,
  } = useWorkspace();

  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName) return;

    try {
      await createWorkspace(newWorkspaceName);
      setNewWorkspaceName("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create workspace:", error);
      // Error is already handled in the context
    }
  };

  return (
    <div className="relative">
      {/* Current Workspace Display */}
      <div
        className="flex items-center p-2 rounded-md bg-white border cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Briefcase size={18} className="text-blue-600 mr-2" />
        <div className="flex-1 truncate">
          {currentWorkspace ? (
            <span className="font-medium">{currentWorkspace.name}</span>
          ) : (
            <span className="text-gray-500">Select a workspace</span>
          )}
        </div>
        <button
          className="ml-2 p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            fetchWorkspaces();
          }}
          title="Refresh workspaces"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Dropdown for workspace selection */}
      {showDropdown && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg z-10">
          <div className="max-h-60 overflow-y-auto">
            {workspaces.length > 0 ? (
              <ul className="py-1">
                {workspaces.map((workspace) => (
                  <li
                    key={workspace.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      currentWorkspace?.id === workspace.id
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      switchWorkspace(workspace.id);
                      setShowDropdown(false);
                    }}
                  >
                    {workspace.name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-2 text-gray-500">No workspaces found</div>
            )}
          </div>

          {/* Create new workspace section */}
          <div className="border-t p-2">
            {isCreating ? (
              <form
                onSubmit={handleCreateWorkspace}
                className="flex items-center"
              >
                <input
                  type="text"
                  placeholder="Workspace name"
                  className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="rounded-l-none"
                  disabled={!newWorkspaceName}
                >
                  Create
                </Button>
              </form>
            ) : (
              <button
                className="flex items-center w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-100 rounded-md"
                onClick={() => setIsCreating(true)}
              >
                <Plus size={16} className="mr-2" />
                Create new workspace
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
};

export default WorkspaceSelector;
