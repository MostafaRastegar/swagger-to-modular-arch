// dashboard/src/components/shared/FileExplorer.js
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

const FileExplorer = ({ outputPath, onFileSelect }) => {
  const [fileTree, setFileTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [folderContents, setFolderContents] = useState({});

  // دریافت اطلاعات مسیر اصلی
  const fetchRootDirectory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/files/${outputPath}`
      );

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

  // دریافت محتوای یک پوشه خاص
  const fetchFolderContents = async (folderPath) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/files/${folderPath}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch folder contents: ${response.statusText}`
        );
      }

      const data = await response.json();

      // ذخیره محتوای پوشه در state
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

  useEffect(() => {
    if (outputPath) {
      fetchRootDirectory();
    }
  }, [outputPath]);

  const handleToggleFolder = async (folderPath) => {
    // بررسی وضعیت جاری باز/بسته بودن پوشه
    const isCurrentlyExpanded = expandedFolders[folderPath];

    // به روزرسانی وضعیت باز/بسته بودن
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !isCurrentlyExpanded,
    }));

    // اگر پوشه در حال باز شدن است و محتوای آن را هنوز نداریم، آن را دریافت کنیم
    if (!isCurrentlyExpanded && !folderContents[folderPath]) {
      await fetchFolderContents(folderPath);
    }
  };

  const handleFileClick = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/files/${item.path}`
      );

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

  // رندر یک آیتم در درخت فایل (فایل یا پوشه)
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

          {/* فقط وقتی پوشه باز است و محتوای آن وجود دارد، زیرآیتم‌ها را نمایش بده */}
          {isExpanded && folderItems.length > 0 && (
            <div>
              {folderItems.map((childItem) => renderItem(childItem, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // رندر فایل
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

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center border-b">
        <h4 className="font-medium">Files</h4>
        <a
          href={`http://localhost:3001/api/download/${outputPath}`}
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
          download
        >
          <Download size={16} className="mr-1" />
          Download All
        </a>
      </div>
      <div className="p-2 max-h-80 overflow-y-auto">
        {fileTree.items && fileTree.items.map((item) => renderItem(item))}
      </div>
    </div>
  );
};

export default FileExplorer;
