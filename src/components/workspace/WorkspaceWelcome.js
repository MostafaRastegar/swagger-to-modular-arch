// src/components/workspace/WorkspaceWelcome.js
import React, { useState } from "react";
import { Briefcase, Plus, ArrowRight, Globe } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";
import Button from "../shared/Button";

const WorkspaceWelcome = ({ onComplete }) => {
  const { workspaces, createWorkspace, switchWorkspace } = useWorkspace();
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [isCreating, setIsCreating] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName) return;

    setLoading(true);
    setError(null);

    try {
      await createWorkspace(newWorkspaceName);
      if (onComplete) onComplete();
    } catch (err) {
      setError("Failed to create workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWorkspace = (e) => {
    e.preventDefault();
    if (!workspaceId) return;

    setLoading(true);
    setError(null);

    try {
      switchWorkspace(workspaceId);
      if (onComplete) onComplete();
    } catch (err) {
      setError("Workspace not found. Please check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Briefcase size={32} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome to Workspaces
        </h2>
        <p className="text-gray-600 mt-2">
          Choose a workspace to start working or create a new one
        </p>
      </div>

      <div className="flex border-b">
        <button
          className={`flex-1 py-2 font-medium text-center ${
            isCreating
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setIsCreating(true)}
        >
          Create New Workspace
        </button>
        <button
          className={`flex-1 py-2 font-medium text-center ${
            !isCreating
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setIsCreating(false)}
        >
          Join Existing Workspace
        </button>
      </div>

      <div className="mt-6">
        {isCreating ? (
          <form onSubmit={handleCreateWorkspace}>
            <label className="block text-gray-700 font-medium mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a name for your workspace"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full mt-4"
              icon={<Plus size={20} />}
              disabled={!newWorkspaceName || loading}
            >
              {loading ? "Creating..." : "Create Workspace"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleJoinWorkspace}>
            <label className="block text-gray-700 font-medium mb-2">
              Workspace ID
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter workspace ID to join"
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full mt-4"
              icon={<ArrowRight size={20} />}
              disabled={!workspaceId || loading}
            >
              {loading ? "Joining..." : "Join Workspace"}
            </Button>
          </form>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {workspaces.length > 0 && (
          <div className="mt-6">
            <p className="text-gray-700 font-medium mb-2">
              Your Recent Workspaces
            </p>
            <ul className="divide-y border rounded-lg">
              {workspaces.slice(0, 5).map((workspace) => (
                <li key={workspace.id} className="p-3 hover:bg-gray-50">
                  <button
                    className="w-full flex items-center text-left"
                    onClick={() => {
                      switchWorkspace(workspace.id);
                      if (onComplete) onComplete();
                    }}
                  >
                    <Briefcase size={18} className="text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium">{workspace.name}</div>
                      <div className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(workspace.created).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 border-t pt-4 text-center text-gray-600 text-sm">
        <p>
          Workspaces allow you to organize your work and collaborate with
          others.
        </p>
      </div>
    </div>
  );
};

export default WorkspaceWelcome;
