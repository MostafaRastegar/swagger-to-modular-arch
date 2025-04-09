// src/components/screens/WorkspaceScreen.js
import React, { useState, useEffect } from "react";
import {
  Briefcase,
  RefreshCw,
  Trash2,
  Edit,
  CheckCircle,
  Copy,
  ExternalLink,
  PlusCircle,
  AlertTriangle,
} from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";
import DefaultSwaggerFileManager from "../workspace/DefaultSwaggerFileManager"; // Import the new component

import Button from "../shared/Button";
import Card from "../shared/Card";

const WorkspaceScreen = () => {
  const {
    currentWorkspace,
    workspaces,
    loading,
    error,
    fetchWorkspaces,
    switchWorkspace,
    createWorkspace,
    clearWorkspace,
  } = useWorkspace();

  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [workspaceStats, setWorkspaceStats] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Fetch workspace stats
  useEffect(() => {
    if (workspaces.length > 0) {
      // In a real application, you would fetch actual statistics for each workspace
      // For now, we'll just create some mock data
      const stats = {};
      workspaces.forEach((workspace) => {
        stats[workspace.id] = {
          files: Math.floor(Math.random() * 100),
          lastModified: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          size: Math.floor(Math.random() * 1000) / 10, // MB
        };
      });
      setWorkspaceStats(stats);
    }
  }, [workspaces]);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName) return;

    try {
      await createWorkspace(newWorkspaceName);
      setNewWorkspaceName("");
    } catch (error) {
      console.error("Failed to create workspace:", error);
      // Error is already handled in the context
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Briefcase size={20} className="mr-2 text-blue-600" />
          Workspace Management
        </h3>

        <p className="text-gray-600 mb-6">
          Create and manage your workspaces. Each workspace provides an isolated
          environment for your projects.
        </p>

        {/* Create new workspace */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Create New Workspace</h4>
          <form onSubmit={handleCreateWorkspace} className="flex">
            <input
              type="text"
              placeholder="Enter workspace name"
              className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
            />
            <Button
              type="submit"
              variant="primary"
              className="rounded-l-none"
              icon={<PlusCircle size={18} />}
              disabled={!newWorkspaceName || loading}
            >
              Create
            </Button>
          </form>
        </div>

        {/* Current workspace info */}
        {currentWorkspace && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium flex items-center text-blue-800">
                  <CheckCircle size={18} className="mr-2 text-blue-600" />
                  Current Workspace
                </h4>
                <p className="text-blue-800 text-lg font-semibold mt-1">
                  {currentWorkspace.name}
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  Created: {formatDate(currentWorkspace.created)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                  title="Copy Workspace ID"
                  onClick={() => handleCopyId(currentWorkspace.id)}
                >
                  {copiedId === currentWorkspace.id ? (
                    <CheckCircle size={18} />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
                <button
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                  title="Clear Current Workspace"
                  onClick={clearWorkspace}
                >
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded">
              <span className="font-medium">Workspace ID:</span>{" "}
              {currentWorkspace.id}
            </div>
          </div>
        )}

        {/* List of workspaces */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Your Workspaces</h4>
            <Button
              variant="secondary"
              size="small"
              icon={
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
              }
              onClick={fetchWorkspaces}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 flex items-center">
              <AlertTriangle size={18} className="mr-2" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw
                size={24}
                className="animate-spin mx-auto text-blue-600 mb-2"
              />
              <p className="text-gray-600">Loading workspaces...</p>
            </div>
          ) : workspaces.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Files
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workspaces.map((workspace) => {
                    const stats = workspaceStats[workspace.id] || {
                      files: 0,
                      lastModified: workspace.created,
                      size: 0,
                    };
                    const isCurrent = currentWorkspace?.id === workspace.id;

                    return (
                      <tr
                        key={workspace.id}
                        className={isCurrent ? "bg-blue-50" : ""}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Briefcase
                              size={16}
                              className={`mr-2 ${
                                isCurrent ? "text-blue-600" : "text-gray-400"
                              }`}
                            />
                            <div className="font-medium text-gray-900">
                              {workspace.name}
                            </div>
                            {isCurrent && (
                              <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                Current
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(workspace.created)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stats.files}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stats.size} MB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => switchWorkspace(workspace.id)}
                              disabled={isCurrent}
                            >
                              Select
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900"
                              onClick={() => handleCopyId(workspace.id)}
                            >
                              {copiedId === workspace.id ? (
                                <CheckCircle
                                  size={16}
                                  className="text-green-600"
                                />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <Briefcase size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">
                No workspaces found. Create your first workspace above.
              </p>
            </div>
          )}
        </div>
      </Card>
      {currentWorkspace && <DefaultSwaggerFileManager />}
    </div>
  );
};

export default WorkspaceScreen;
