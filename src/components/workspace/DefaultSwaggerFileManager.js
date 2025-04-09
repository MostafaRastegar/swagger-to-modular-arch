// Create src/components/workspace/DefaultSwaggerFileManager.js

import React, { useState } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import {
  Upload,
  FileType,
  Check,
  AlertTriangle,
  RefreshCw,
  Download,
} from "lucide-react";
import Button from "../shared/Button";

const DefaultSwaggerFileManager = () => {
  const {
    currentWorkspace,
    defaultSwaggerFile,
    checkingDefaultFile,
    checkDefaultSwaggerFile,
    setWorkspaceDefaultSwagger,
  } = useWorkspace();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentWorkspace) return;

    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const result = await setWorkspaceDefaultSwagger(selectedFile);

      if (result.success) {
        setUploadSuccess(true);
        setSelectedFile(null);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setError(result.message || "Failed to set default Swagger file");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setUploading(false);
    }
  };

  const refreshDefaultFile = () => {
    if (currentWorkspace) {
      checkDefaultSwaggerFile(currentWorkspace.id);
    }
  };

  // Return empty component if no workspace selected
  if (!currentWorkspace) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <FileType size={20} className="mr-2 text-blue-600" />
        Default Swagger File
      </h3>

      <p className="text-gray-600 mb-6">
        Set a default Swagger file for this workspace. This file will be used
        automatically when generating code, creating mock servers, or checking
        API changes.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center">
          <Check size={20} className="mr-2" />
          <span>Default Swagger file has been set successfully!</span>
        </div>
      )}

      {/* Current default file section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Current Default File</h4>
          <button
            onClick={refreshDefaultFile}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            disabled={checkingDefaultFile}
          >
            <RefreshCw
              size={16}
              className={`mr-1 ${checkingDefaultFile ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {checkingDefaultFile ? (
          <div className="text-center py-4 bg-gray-50 rounded-md border">
            <RefreshCw
              size={24}
              className="mx-auto text-blue-500 animate-spin mb-2"
            />
            <p className="text-gray-600">Checking for default file...</p>
          </div>
        ) : defaultSwaggerFile ? (
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-blue-800">
                  {defaultSwaggerFile.name}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Uploaded:{" "}
                  {new Date(defaultSwaggerFile.uploadedAt).toLocaleString()}
                </p>
                {defaultSwaggerFile.endpoints && (
                  <p className="text-sm text-blue-700">
                    {defaultSwaggerFile.endpoints} API endpoints
                  </p>
                )}
              </div>
              <Button
                variant="secondary"
                size="small"
                icon={<Download size={16} />}
                onClick={() => {
                  // This is a placeholder. In a real implementation,
                  // you would have a way to download the file
                  alert("Download functionality would be implemented here");
                }}
              >
                Download
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 flex items-center">
            <AlertTriangle size={20} className="text-yellow-500 mr-2" />
            <p className="text-yellow-700">
              No default Swagger file set for this workspace
            </p>
          </div>
        )}
      </div>

      {/* Upload new file section */}
      <div>
        <h4 className="font-medium mb-3">Upload New Default File</h4>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {selectedFile ? (
            <div>
              <Check size={40} className="mx-auto text-green-500 mb-2" />
              <p className="text-gray-800 font-medium">{selectedFile.name}</p>
              <p className="text-gray-500 text-sm">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => setSelectedFile(null)}
                >
                  Change file
                </button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleUpload}
                  disabled={uploading}
                  icon={
                    uploading ? (
                      <RefreshCw className="animate-spin" size={16} />
                    ) : null
                  }
                >
                  {uploading ? "Uploading..." : "Set as Default"}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Upload size={40} className="mx-auto text-gray-400 mb-2" />
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
      </div>
    </div>
  );
};

export default DefaultSwaggerFileManager;
