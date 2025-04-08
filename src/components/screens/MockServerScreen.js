// MockServerScreen.js
import React, { useState, useEffect } from "react";
import {
  Upload,
  Server,
  TerminalSquare,
  Copy,
  CheckCircle,
  Play,
  Database,
  FileJson,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { generateMockServer } from "../../adapters/mockServerAdapter";
import { useSettings } from "../../context/SettingsContext";
import WorkspaceIndicator from "../workspace/WorkspaceIndicator";
import { useWorkspace } from "../../context/WorkspaceContext";

const MockServerScreen = () => {
  const { settings } = useSettings();
  const [file, setFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [mockServer, setMockServer] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const { currentWorkspace } = useWorkspace();

  // Check if mock server is running when component mounts or
  // when mockServer state changes
  useEffect(() => {
    if (mockServer) {
      checkServerStatus();
    }
  }, [mockServer]);

  const checkServerStatus = async () => {
    setCheckingStatus(true);
    try {
      const response = await fetch(
        "http://localhost:3001/api/mock-server/status"
      );
      const data = await response.json();
      setIsRunning(data.running);
    } catch (err) {
      console.error("Error checking server status:", err);
      setIsRunning(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : e;
    if (selectedFile) {
      setFile(selectedFile);

      // Reset mock server state when a new file is uploaded
      setMockServer(null);
      setIsRunning(false);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) return;
    if (!currentWorkspace) {
      setError(
        "Please select or create a workspace before generating mock server"
      );
      return;
    }
    setIsGenerating(true);
    setError(null);

    try {
      // Apply settings to mock server options
      const mockServerOptions = {
        port: settings.mockServer.defaultPort,
        enableCors: settings.mockServer.enableCors,
        generateRandomData: settings.mockServer.generateRandomData,
        dataEntryCount: settings.mockServer.dataEntryCount,
        workspaceId: currentWorkspace.id,
      };

      // Call the real API with settings
      const result = await generateMockServer(file, mockServerOptions);

      if (result.success === false) {
        throw new Error(result.message || "Failed to generate mock server");
      }

      // Update the command to use the configured port
      const command = result.command.replace(
        /--port \d+/,
        `--port ${settings.mockServer.defaultPort}`
      );
      setMockServer({
        dbPath: result.dbPath,
        routesPath: result.routesPath,
        endpointCount: result.endpointCount,
        port: settings.mockServer.defaultPort,
        command: command,
        workspaceId: result.workspaceId || currentWorkspace.id,
      });

      if (result.endpoints && result.endpoints.length > 0) {
        setEndpoints(result.endpoints);
      }
    } catch (err) {
      console.error("Error generating mock server:", err);
      setError(err.message || "Failed to generate mock server");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunServer = () => {
    // Open the instructions for running the server
    // Since we can't start the server directly from the browser
    alert(
      `To run the mock server, open a terminal and run this command:\n\n${mockServer.command}`
    );
  };

  const handleCopyCommand = () => {
    if (!mockServer) return;

    // Copy the command to clipboard
    navigator.clipboard.writeText(mockServer.command);

    // Show copied indicator
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderEndpoints = () => {
    // Use real endpoints if available, otherwise use sample data
    const displayEndpoints =
      endpoints.length > 0
        ? endpoints
        : [
            { path: "/api/users", method: "GET", description: "Get all users" },
            {
              path: "/api/users/{id}",
              method: "GET",
              description: "Get user by ID",
            },
            {
              path: "/api/users",
              method: "POST",
              description: "Create a new user",
            },
            {
              path: "/api/users/{id}",
              method: "PUT",
              description: "Update user",
            },
            {
              path: "/api/users/{id}",
              method: "DELETE",
              description: "Delete user",
            },
          ];

    return (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Path
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayEndpoints.map((endpoint, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      endpoint.method === "GET"
                        ? "bg-blue-100 text-blue-800"
                        : endpoint.method === "POST"
                        ? "bg-green-100 text-green-800"
                        : endpoint.method === "PUT"
                        ? "bg-yellow-100 text-yellow-800"
                        : endpoint.method === "DELETE"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  {endpoint.path}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {endpoint.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <WorkspaceIndicator />

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Server size={20} className="mr-2 text-blue-600" />
          Create Mock Server
        </h3>
        <p className="text-gray-600 mb-6">
          Upload your Swagger/OpenAPI specification to generate a fully
          functional mock server.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {file ? (
            <div>
              <Check size={48} className="mx-auto text-green-500 mb-2" />
              <p className="text-gray-800 font-medium">{file.name}</p>
              <p className="text-gray-500 text-sm">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              <button
                className="mt-3 text-blue-600 hover:text-blue-800"
                onClick={() => setFile(null)}
              >
                Change file
              </button>
            </div>
          ) : (
            <div>
              <Upload size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 mb-2">
                Drag and drop your Swagger file here, or
              </p>
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept=".json,.yaml,.yml"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={!file || isGenerating}
            className={`flex items-center px-6 py-3 rounded-lg ${
              !file || isGenerating
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={20} className="mr-2 animate-spin" />
                Generating Mock Server...
              </>
            ) : (
              <>
                <Server size={20} className="mr-2" />
                Generate Mock Server
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mock Server Status */}
      {mockServer && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Server size={20} className="mr-2 text-green-600" />
            Mock Server Ready
          </h3>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-2" size={20} />
              <span className="text-green-700">
                Mock server has been successfully generated with{" "}
                {mockServer.endpointCount} endpoints.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <Database size={18} className="mr-2 text-blue-600" />
                Database File
              </h4>
              <p className="text-gray-600 mb-2">
                Contains all mock data for your API responses:
              </p>
              <code className="block bg-gray-100 p-2 rounded text-sm font-mono">
                {mockServer.dbPath}
              </code>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <FileJson size={18} className="mr-2 text-blue-600" />
                Routes File
              </h4>
              <p className="text-gray-600 mb-2">
                Contains the route mappings for your API:
              </p>
              <code className="block bg-gray-100 p-2 rounded text-sm font-mono">
                {mockServer.routesPath}
              </code>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <TerminalSquare size={18} className="mr-2 text-blue-600" />
              Run Command
            </h4>
            <div className="flex items-center bg-gray-800 text-white p-3 rounded font-mono text-sm">
              <pre className="flex-1 overflow-x-auto">{mockServer.command}</pre>
              <button
                onClick={handleCopyCommand}
                className="ml-2 text-gray-400 hover:text-white"
                title="Copy to clipboard"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600 mr-2">Server Status:</span>
              {checkingStatus ? (
                <span className="text-sm text-gray-600">
                  <RefreshCw size={16} className="inline mr-1 animate-spin" />
                  Checking...
                </span>
              ) : (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isRunning
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {isRunning
                    ? "Running on port " + mockServer.port
                    : "Not Running"}
                </span>
              )}

              {!checkingStatus && !isRunning && (
                <button
                  onClick={checkServerStatus}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  <RefreshCw size={12} className="inline mr-1" />
                  Refresh
                </button>
              )}
            </div>

            <button
              onClick={handleRunServer}
              className="flex items-center px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              <Play size={18} className="mr-2" />
              How to Run Server
            </button>
          </div>
        </div>
      )}

      {/* Endpoints Documentation */}
      {mockServer && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Available Endpoints</h3>
          {renderEndpoints()}

          <div className="bg-blue-50 p-4 rounded-lg mt-6 border border-blue-200">
            <p className="text-blue-700">
              <strong>Note:</strong> All endpoints can be accessed at{" "}
              <code className="bg-blue-100 px-1 py-0.5 rounded">
                http://localhost:{mockServer.port}
              </code>{" "}
              once the server is running.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockServerScreen;
