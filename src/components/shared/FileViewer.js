// dashboard/src/components/shared/FileViewer.js
import React from "react";
import { Download, Copy, Check } from "lucide-react";
import Button from "./Button";

const FileViewer = ({ file, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!file) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageClass = (extension) => {
    switch (extension) {
      case "js":
        return "language-javascript";
      case "jsx":
        return "language-jsx";
      case "ts":
        return "language-typescript";
      case "tsx":
        return "language-tsx";
      case "json":
        return "language-json";
      case "html":
        return "language-html";
      case "css":
        return "language-css";
      default:
        return "language-plaintext";
    }
  };

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center border-b">
        <h4 className="font-medium">{file.name}</h4>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="small"
            icon={copied ? <Check size={16} /> : <Copy size={16} />}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={<Download size={16} />}
            onClick={() => {
              const element = document.createElement("a");
              const fileBlob = new Blob([file.content], { type: "text/plain" });
              element.href = URL.createObjectURL(fileBlob);
              element.download = file.name;
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
          >
            Download
          </Button>
        </div>
      </div>
      <pre
        className={`p-4 overflow-x-auto ${getLanguageClass(file.extension)}`}
      >
        <code>{file.content}</code>
      </pre>
    </div>
  );
};

export default FileViewer;
