// MockServerScreen.js
import React, { useState } from "react";
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
} from "lucide-react";

const MockServerScreen = () => {
  const [file, setFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [mockServer, setMockServer] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Reset mock server state when a new file is uploaded
      setMockServer(null);
      setIsRunning(false);
    }
  };

  const handleGenerate = () => {
    if (!file) return;

    setIsGenerating(true);

    // Simulate API call to generate mock server
    setTimeout(() => {
      setIsGenerating(false);
      setMockServer({
        dbPath: "server/db.json",
        routesPath: "server/routes.json",
        endpointCount: 12,
        port: 3000,
        command:
          "json-server --watch server/db.json --routes server/routes.json --port 3000",
      });
    }, 1500);
  };

  const handleRunServer = () => {
    if (!mockServer) return;

    // In a real implementation, this would actually start the mock server
    setIsRunning(true);
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
    // Sample endpoints for display purposes
    const endpoints = [
      { path: "/api/users", method: "GET", description: "Get all users" },
      { path: "/api/users/{id}", method: "GET", description: "Get user by ID" },
      { path: "/api/users", method: "POST", description: "Create a new user" },
      { path: "/api/users/{id}", method: "PUT", description: "Update user" },
      { path: "/api/users/{id}", method: "DELETE", description: "Delete user" },
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
            {endpoints.map((endpoint, index) => (
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Server size={20} className="mr-2 text-blue-600" />
          Create Mock Server
        </h3>
        <p className="text-gray-600 mb-6">
          Upload your Swagger/OpenAPI specification to generate a fully
          functional mock server.
        </p>

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
            <Server size={20} className="mr-2" />
            {isGenerating
              ? "Generating Mock Server..."
              : "Generate Mock Server"}
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
            </div>

            <button
              onClick={handleRunServer}
              disabled={isRunning}
              className={`flex items-center px-4 py-2 rounded ${
                isRunning
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <Play size={18} className="mr-2" />
              {isRunning ? "Server Running" : "Start Server"}
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
