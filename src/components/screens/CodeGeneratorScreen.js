// dashboard/src/components/screens/CodeGeneratorScreen.js
import React, { useState, useEffect } from "react";
import {
  Upload,
  Cog,
  Code,
  FileType,
  FolderTree,
  Check,
  AlertCircle,
  RefreshCw,
  Download,
} from "lucide-react";
import {
  generateCode,
  testApiConnection,
} from "../../adapters/codeGeneratorAdapter";
import FileUploader from "../shared/FileUploader";
import Button from "../shared/Button";
import FileExplorer from "../shared/FileExplorer";
import FileViewer from "../shared/FileViewer";
import { useSettings } from "../../context/SettingsContext";
import { useWorkspace } from "../../context/WorkspaceContext";
import WorkspaceIndicator from "../workspace/WorkspaceIndicator";

const CodeGeneratorScreen = () => {
  const { currentWorkspace } = useWorkspace();
  const [file, setFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [generationResult, setGenerationResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const { settings } = useSettings();
  const [options, setOptions] = useState({
    outputDir: settings.general.defaultOutputDir || "src/generated",
    createFolders: false,
    folderStructure: "modules",
    workspaceId: currentWorkspace?.id || null, // Initialize with current workspace ID
  });

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    // Reset generation status when new file is uploaded
    setGenerationComplete(false);
    setGenerationResult(null);
    setError(null);
  };

  const handleOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOptions({
      ...options,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGenerate = async () => {
    if (!file) return;

    // Check if we have a workspace
    if (!currentWorkspace) {
      setError("Please select or create a workspace before generating code");
      return;
    }

    // Ensure workspaceId is included in options
    const generateOptions = {
      ...options,
      workspaceId: currentWorkspace.id,
    };

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Generating code with options:", generateOptions);
      const result = await generateCode(file, generateOptions);

      console.log("Generation result:", result);
      setGenerationResult(result);
      setGenerationComplete(true);
    } catch (error) {
      console.error("Error generating code:", error);
      setError(error.message || "Failed to generate code");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (currentWorkspace) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        workspaceId: currentWorkspace.id,
      }));
    }
  }, [currentWorkspace]);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const status = await testApiConnection();
        setApiStatus(status);
        console.log("API status:", status);
      } catch (error) {
        console.error("Failed to connect to API:", error);
        setApiStatus({
          status: "error",
          message: "Could not connect to API server",
        });
      }
    };

    checkApiStatus();
  }, []);

  return (
    <div className="space-y-6">
      {/* API Status Indicator */}
      <WorkspaceIndicator />
      {apiStatus && apiStatus.status !== "ok" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">API Error: </strong>
          <span className="block sm:inline">
            {apiStatus.message || "Cannot connect to API server"}
          </span>
          <p className="mt-2 text-sm">
            Make sure the API server is running on http://localhost:3001
          </p>
        </div>
      )}
      {/* File Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <FileType size={20} className="mr-2 text-blue-600" />
          Upload Swagger/OpenAPI Specification
        </h3>

        <FileUploader
          onFileSelect={handleFileChange}
          acceptedTypes=".json,.yaml,.yml"
          file={file}
        />
      </div>
      {/* Configuration Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Cog size={20} className="mr-2 text-blue-600" />
          Generation Options
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Output Directory</label>
            <input
              type="text"
              name="outputDir"
              value={options.outputDir}
              onChange={handleOptionChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., src/modules"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Folder Structure</label>
            <select
              name="folderStructure"
              value={options.folderStructure}
              onChange={handleOptionChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="modules">Modules</option>
              <option value="domain">Domain-Driven</option>
              <option value="flat">Flat Structure</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="createFolders"
              name="createFolders"
              checked={options.createFolders}
              onChange={handleOptionChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="createFolders" className="ml-2 text-gray-700">
              Create distributed folder structure
            </label>
          </div>
        </div>
      </div>
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {/* Generate Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleGenerate}
          disabled={
            !file || isGenerating || !apiStatus || apiStatus.status !== "ok"
          }
          variant={
            !file || isGenerating || !apiStatus || apiStatus.status !== "ok"
              ? "secondary"
              : "primary"
          }
          size="large"
          icon={
            isGenerating ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              <Code size={20} />
            )
          }
        >
          {isGenerating ? "Generating..." : "Generate Code"}
        </Button>
      </div>
      {/* Results Section - only show when generation is complete */}
      {generationComplete && generationResult && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <FolderTree size={20} className="mr-2 text-blue-600" />
            Generated Files
          </h3>

          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-green-600 font-medium flex items-center">
              <Check size={20} className="mr-2" />
              Code generation completed successfully!
            </p>
            <p className="text-gray-600 mt-2">
              Files were generated at:{" "}
              <code className="bg-gray-200 px-2 py-1 rounded">
                {generationResult.outputPath}
              </code>
            </p>
          </div>

          {/* File Explorer and Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="text-md font-medium mb-3">File Explorer</h4>
              <FileExplorer
                outputPath={generationResult.outputPath}
                onFileSelect={setSelectedFile}
              />
            </div>

            <div>
              <h4 className="text-md font-medium mb-3">File Viewer</h4>
              {selectedFile ? (
                <FileViewer file={selectedFile} />
              ) : (
                <div className="border rounded-md p-8 bg-gray-50 text-center text-gray-500">
                  Select a file to view its content
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end mt-6">
            <a
              href={`http://localhost:3001/api/download/${generationResult.outputPath}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              download
            >
              <Download size={18} className="mr-2" />
              Download All Files
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeGeneratorScreen;
