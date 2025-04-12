// dashboard/src/components/shared/FileUploader.js
import React from "react";
import { Upload, Check } from "lucide-react";

const FileUploader = ({
  onFileSelect,
  acceptedTypes = ".json,.yaml,.yml",
  file = null,
}) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  return (
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
            onClick={() => onFileSelect && onFileSelect(null)}
          >
            Change file
          </button>
        </div>
      ) : (
        <div>
          <Upload size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 mb-2">Drag and drop your file here, or</p>
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
            Browse Files
            <input
              type="file"
              className="hidden"
              accept={acceptedTypes}
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
