// APIGuardianScreen.js
import React, { useState } from "react";
import {
  Upload,
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ThumbsUp,
  RefreshCw,
} from "lucide-react";
import {
  compareSpecs,
  validateSpecFile,
} from "../../adapters/apiGuardianAdapter";
import FileUploader from "../shared/FileUploader";
import Button from "../shared/Button";
import { useSettings } from "../../context/SettingsContext";

const APIGuardianScreen = () => {
  const { settings } = useSettings();
  const [oldSpec, setOldSpec] = useState(null);
  const [newSpec, setNewSpec] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  // این متد را اضافه می‌کنیم
  const handleFileValidation = async (file, type) => {
    try {
      // اگر فایلی انتخاب نشده، خروج
      if (!file) return null;

      // اعتبارسنجی فایل
      const validationResult = await validateSpecFile(file);

      // اگر معتبر بود، فایل را ست می‌کنیم
      if (type === "old") {
        setOldSpec(file);
        setError(null);
      } else {
        setNewSpec(file);
        setError(null);
      }

      return validationResult;
    } catch (err) {
      // خطا را نمایش می‌دهیم
      setError(`Invalid ${type} specification file: ${err.message}`);
      return null;
    }
  };

  const handleCompare = async () => {
    if (!oldSpec || !newSpec) return;

    setIsComparing(true);
    setError(null);

    try {
      const report = await compareSpecs(oldSpec, newSpec, {
        reportLevel: settings.guardian.defaultReportLevel,
        outputFormat: settings.guardian.defaultReportFormat,
      });

      setReport(report);

      // Auto export report if enabled
      if (settings.guardian.autoExportReport) {
        // This would typically download the report file
        // Since we can't directly trigger a download, we'll show a message
        alert(
          "Report auto-export feature is enabled. In a production environment, this would automatically download the report."
        );
      }

      setIsComparing(false);
    } catch (err) {
      setError(err.message);
      setIsComparing(false);
    }
  };

  const resetComparison = () => {
    setOldSpec(null);
    setNewSpec(null);
    setReport(null);
    setError(null);
  };
  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      {!report && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">
            Compare API Specifications
          </h3>
          <p className="text-gray-600 mb-6">
            Upload two versions of your API specification to detect breaking
            changes.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Error: </strong>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old API Spec Upload */}
            <div>
              <h4 className="font-medium mb-3">Old API Specification</h4>
              <FileUploader
                onFileSelect={(file) => handleFileValidation(file, "old")}
                acceptedTypes=".json,.yaml,.yml"
                file={oldSpec}
              />
            </div>

            {/* New API Spec Upload */}
            <div>
              <h4 className="font-medium mb-3">New API Specification</h4>
              <FileUploader
                onFileSelect={(file) => handleFileValidation(file, "new")}
                acceptedTypes=".json,.yaml,.yml"
                file={newSpec}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleCompare}
              disabled={!oldSpec || !newSpec || isComparing}
              variant={
                !oldSpec || !newSpec || isComparing ? "secondary" : "primary"
              }
              size="large"
              icon={
                isComparing ? (
                  <RefreshCw className="animate-spin" size={20} />
                ) : (
                  <AlertTriangle size={20} />
                )
              }
            >
              {isComparing
                ? "Analyzing API Changes..."
                : "Detect Breaking Changes"}
            </Button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {report && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              API Breaking Changes Report
            </h2>
            <button
              onClick={resetComparison}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <RefreshCw size={16} className="mr-1" />
              Start New Comparison
            </button>
          </div>

          {/* Summary Stats */}
          <SummaryStats report={report} />

          {/* Change Sections */}
          <ChangeSection
            title="Critical Breaking Changes"
            changes={report.critical}
            type="critical"
            icon={<AlertCircle className="text-red-500" size={24} />}
          />

          <ChangeSection
            title="Warnings"
            changes={report.warning}
            type="warning"
            icon={<AlertTriangle className="text-yellow-500" size={24} />}
          />

          <ChangeSection
            title="Info Changes"
            changes={report.info}
            type="info"
            icon={<Info className="text-blue-500" size={24} />}
          />

          {/* Recommendations */}
          <Recommendations suggestions={report.suggestions} />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
              Export as JSON
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
              Export as Markdown
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Generate Migration Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Component for summary stats
const SummaryStats = ({ report }) => {
  const totalChanges =
    report.critical.length + report.warning.length + report.info.length;
  const criticalPercentage =
    Math.round((report.critical.length / totalChanges) * 100) || 0;
  const warningPercentage =
    Math.round((report.warning.length / totalChanges) * 100) || 0;
  const infoPercentage =
    Math.round((report.info.length / totalChanges) * 100) || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Breaking Changes Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 p-4 rounded-md border-l-4 border-red-500">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={24} />
            <div>
              <p className="text-sm text-gray-500">Critical Changes</p>
              <p className="text-2xl font-bold text-red-600">
                {report.critical.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-500 mr-2" size={24} />
            <div>
              <p className="text-sm text-gray-500">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">
                {report.warning.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <Info className="text-blue-500 mr-2" size={24} />
            <div>
              <p className="text-sm text-gray-500">Info Changes</p>
              <p className="text-2xl font-bold text-blue-600">
                {report.info.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-2">Distribution of Changes</p>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div
              className="bg-red-500 h-full"
              style={{ width: `${criticalPercentage}%` }}
            ></div>
            <div
              className="bg-yellow-500 h-full"
              style={{ width: `${warningPercentage}%` }}
            ></div>
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${infoPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{criticalPercentage}% Critical</span>
          <span>{warningPercentage}% Warning</span>
          <span>{infoPercentage}% Info</span>
        </div>
      </div>
    </div>
  );
};

// Component for change items
const ChangeItem = ({ change, type }) => {
  const [expanded, setExpanded] = useState(false);

  let bgColor, borderColor, icon;
  switch (type) {
    case "critical":
      bgColor = "bg-red-50";
      borderColor = "border-red-500";
      icon = <AlertCircle className="text-red-500 flex-shrink-0" size={20} />;
      break;
    case "warning":
      bgColor = "bg-yellow-50";
      borderColor = "border-yellow-500";
      icon = (
        <AlertTriangle className="text-yellow-500 flex-shrink-0" size={20} />
      );
      break;
    case "info":
      bgColor = "bg-blue-50";
      borderColor = "border-blue-500";
      icon = <Info className="text-blue-500 flex-shrink-0" size={20} />;
      break;
    default:
      bgColor = "bg-gray-50";
      borderColor = "border-gray-500";
      icon = <Info className="text-gray-500 flex-shrink-0" size={20} />;
  }

  return (
    <div
      className={`${bgColor} border-l-4 ${borderColor} rounded-md mb-4 overflow-hidden`}
    >
      <div
        className="p-4 flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start">
          {icon}
          <div className="ml-3">
            <p className="font-medium">{change.message}</p>
            {change.path && (
              <p className="text-sm text-gray-600 mt-1">
                {change.method ? `${change.method} ` : ""}
                <code className="bg-gray-200 rounded px-1">{change.path}</code>
              </p>
            )}
          </div>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0">
          {change.impact && (
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-600">Impact:</p>
              <p className="text-sm">{change.impact}</p>
            </div>
          )}

          {change.recommendation && (
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-600">
                Recommendation:
              </p>
              <p className="text-sm">{change.recommendation}</p>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Change Type: <code>{change.type}</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Component for change section
const ChangeSection = ({ title, changes, type, icon }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          {icon}
          <h2 className="text-lg font-bold ml-2">
            {title}{" "}
            <span className="text-gray-500 text-base">({changes.length})</span>
          </h2>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {expanded && (
        <div className="mt-4">
          {changes.length > 0 ? (
            changes.map((change, index) => (
              <ChangeItem key={index} change={change} type={type} />
            ))
          ) : (
            <div className="flex items-center p-4 bg-gray-50 rounded-md">
              <Check className="text-green-500 mr-2" size={20} />
              <p>No {title.toLowerCase()} detected.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Component for recommendations
const Recommendations = ({ suggestions }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <ThumbsUp className="text-green-600" size={24} />
          <h2 className="text-lg font-bold ml-2">Recommendations</h2>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {expanded && (
        <div className="mt-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-green-50 rounded-md p-4 mb-4 border-l-4 border-green-500"
            >
              <h3 className="font-bold text-lg">{suggestion.title}</h3>
              <p className="mt-2">{suggestion.description}</p>

              {suggestion.options && suggestion.options.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold mb-2">Options:</p>
                  <ul className="list-none">
                    {suggestion.options.map((option, optIndex) => (
                      <li key={optIndex} className="flex items-start mb-2">
                        <ArrowRight
                          className="text-green-600 mr-2 flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>{option}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default APIGuardianScreen;
