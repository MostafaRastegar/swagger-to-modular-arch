// src/components/shared/FileExplorer.js
import React, { useState, useEffect } from "react";
import {
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Code,
  Download,
  RefreshCw,
} from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";

const FileExplorer = ({ outputPath, onFileSelect, refreshTrigger = 0 }) => {
  const [fileTree, setFileTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [folderContents, setFolderContents] = useState({});
  const { currentWorkspace } = useWorkspace();

  // Fetch the root directory
  const fetchRootDirectory = async () => {
    try {
      setLoading(true);

      // Construct URL with workspace ID if available
      let url = `http://localhost:3001/api/files/${outputPath}`;
      if (currentWorkspace) {
        url += `?workspaceId=${currentWorkspace.id}`;
      }

      console.log("Fetching directory:", url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch directory: ${response.statusText}`);
      }

      const data = await response.json();
      setFileTree(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update fetchFolderContents to include workspace ID
  const fetchFolderContents = async (folderPath) => {
    try {
      // Construct URL with workspace ID if available
      let url = `http://localhost:3001/api/files/${folderPath}`;
      if (currentWorkspace) {
        url += `?workspaceId=${currentWorkspace.id}`;
      }

      console.log("Fetching folder contents:", url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch folder contents: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Store folder contents in state
      setFolderContents((prev) => ({
        ...prev,
        [folderPath]: data.items || [],
      }));

      return data;
    } catch (err) {
      console.error(`Error fetching folder ${folderPath}:`, err);
      setError(err.message);
      return null;
    }
  };

  // Update useEffect to depend on refreshTrigger
  useEffect(() => {
    if (outputPath) {
      fetchRootDirectory();
    }
  }, [outputPath, currentWorkspace, refreshTrigger]); // Re-fetch when workspace changes or refreshTrigger changes

  const handleToggleFolder = async (folderPath) => {
    // Check if folder is currently expanded
    const isCurrentlyExpanded = expandedFolders[folderPath];

    // Update expanded state
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !isCurrentlyExpanded,
    }));

    // If folder is being expanded and we don't have its contents yet, fetch them
    if (!isCurrentlyExpanded && !folderContents[folderPath]) {
      await fetchFolderContents(folderPath);
    }
  };

  // Manual refresh function
  const refreshFiles = () => {
    fetchRootDirectory();
  };

  // Update handleFileClick to include workspace ID
  const handleFileClick = async (item) => {
    try {
      // Construct URL with workspace ID if available
      let url = `http://localhost:3001/api/files/${item.path}`;
      if (currentWorkspace) {
        url += `?workspaceId=${currentWorkspace.id}`;
      }

      console.log("Fetching file:", url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const data = await response.json();

      if (onFileSelect) {
        onFileSelect(data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const renderItem = (item, level = 0) => {
    const isExpanded = expandedFolders[item.path];
    const padding = level * 16;

    if (item.type === "directory") {
      const folderItems = folderContents[item.path] || [];

      return (
        <div key={item.path}>
          <div
            className="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleToggleFolder(item.path)}
          >
            <div
              style={{ paddingLeft: `${padding}px` }}
              className="flex items-center"
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <Folder size={16} className="text-yellow-500 ml-1 mr-2" />
              <span>{item.name}</span>
            </div>
          </div>

          {isExpanded && folderItems.length > 0 && (
            <div>
              {folderItems.map((childItem) => renderItem(childItem, level + 1))}
            </div>
          )}
        </div>
      );
    }

    const getFileIcon = (extension) => {
      switch (extension) {
        case "js":
        case "jsx":
        case "ts":
        case "tsx":
          return <Code size={16} className="text-blue-500 ml-1 mr-2" />;
        default:
          return <File size={16} className="text-gray-500 ml-1 mr-2" />;
      }
    };

    return (
      <div
        key={item.path}
        className="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => handleFileClick(item)}
      >
        <div
          style={{ paddingLeft: `${padding + 16}px` }}
          className="flex items-center"
        >
          {getFileIcon(item.extension)}
          <span>{item.name}</span>
        </div>
      </div>
    );
  };

  if (loading && !fileTree) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw size={24} className="animate-spin text-blue-500" />
        <span className="ml-2">Loading files...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md">
        <p className="font-medium">Error loading files:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!fileTree) {
    return <div className="text-gray-500 p-4">No files to display</div>;
  }

  // Update download URL to include workspace ID
  const getDownloadUrl = () => {
    let url = `http://localhost:3001/api/download/${outputPath}`;

    if (currentWorkspace) {
      url += `?workspaceId=${currentWorkspace.id}&download=true`;
    }

    return url;
  };

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center border-b">
        <h4 className="font-medium">Files</h4>
        <div className="flex space-x-2">
          <button
            onClick={refreshFiles}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
          >
            <RefreshCw size={16} className="mr-1" />
            Refresh
          </button>
          <a
            href={getDownloadUrl()}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            download
          >
            <Download size={16} className="mr-1" />
            Download All
          </a>
        </div>
      </div>
      <div className="p-2 max-h-80 overflow-y-auto">
        {fileTree.items && fileTree.items.map((item) => renderItem(item))}
      </div>
    </div>
  );
};

export default FileExplorer;
