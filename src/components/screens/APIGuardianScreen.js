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

const APIGuardianScreen = () => {
  const [oldSpec, setOldSpec] = useState(null);
  const [newSpec, setNewSpec] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [report, setReport] = useState(null);

  const handleFileChange = (fileType, e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileType === "old") {
        setOldSpec(selectedFile);
      } else {
        setNewSpec(selectedFile);
      }
    }
  };

  const handleCompare = () => {
    if (!oldSpec || !newSpec) return;

    setIsComparing(true);

    // Simulate API call to compare specs
    // In a real implementation, this would call the actual API Guardian logic
    setTimeout(() => {
      // Sample report data
      const sampleReport = {
        critical: [
          {
            type: "ENDPOINT_REMOVED",
            path: "/api/users/details",
            method: "GET",
            message: "Endpoint removed: /api/users/details",
            impact: "Clients using this endpoint will break",
            recommendation:
              "Consider keeping the endpoint and marking it as deprecated",
          },
          {
            type: "REQUIRED_PARAM_ADDED",
            path: "/api/orders",
            method: "POST",
            param: "customer_id",
            paramIn: "body",
            message:
              "New required parameter 'customer_id' (body) added to POST /api/orders",
            impact:
              "Existing clients will not send this parameter and will break",
            recommendation:
              "Consider making the parameter optional with backward compatible defaults",
          },
        ],
        warning: [
          {
            type: "OPTIONAL_PARAM_REMOVED",
            path: "/api/products",
            method: "GET",
            param: "tags",
            paramIn: "query",
            message:
              "Optional parameter 'tags' (query) removed from GET /api/products",
            impact:
              "Clients sending this parameter may break if they rely on its behavior",
            recommendation:
              "Consider keeping the parameter for backward compatibility",
          },
        ],
        info: [
          {
            type: "ENDPOINT_ADDED",
            path: "/api/products/featured",
            message: "New endpoint added: /api/products/featured",
          },
        ],
        suggestions: [
          {
            title: "API Versioning",
            description:
              "Consider implementing versioning for your API to maintain backward compatibility.",
            options: [
              "URL path versioning (e.g., /v1/resource, /v2/resource)",
              "Query parameter versioning (e.g., /resource?version=1)",
            ],
          },
          {
            title: "Deprecation Strategy",
            description:
              "Before removing endpoints or changing behavior, use deprecation notices to inform API consumers.",
            options: [
              'Add "Deprecated" header to responses',
              "Keep deprecated endpoints for at least one release cycle",
            ],
          },
        ],
      };

      setReport(sampleReport);
      setIsComparing(false);
    }, 2000);
  };

  const resetComparison = () => {
    setOldSpec(null);
    setNewSpec(null);
    setReport(null);
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old API Spec Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <h4 className="font-medium mb-3">Old API Specification</h4>
              {oldSpec ? (
                <div>
                  <Check size={36} className="mx-auto text-green-500 mb-2" />
                  <p className="text-gray-800 font-medium">{oldSpec.name}</p>
                  <p className="text-gray-500 text-sm">
                    {(oldSpec.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    className="mt-3 text-blue-600 hover:text-blue-800"
                    onClick={() => setOldSpec(null)}
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={36} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-2">
                    Select your old API specification
                  </p>
                  <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 inline-block text-sm">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      accept=".json,.yaml,.yml"
                      onChange={(e) => handleFileChange("old", e)}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* New API Spec Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <h4 className="font-medium mb-3">New API Specification</h4>
              {newSpec ? (
                <div>
                  <Check size={36} className="mx-auto text-green-500 mb-2" />
                  <p className="text-gray-800 font-medium">{newSpec.name}</p>
                  <p className="text-gray-500 text-sm">
                    {(newSpec.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    className="mt-3 text-blue-600 hover:text-blue-800"
                    onClick={() => setNewSpec(null)}
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={36} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-2">
                    Select your new API specification
                  </p>
                  <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 inline-block text-sm">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      accept=".json,.yaml,.yml"
                      onChange={(e) => handleFileChange("new", e)}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCompare}
              disabled={!oldSpec || !newSpec || isComparing}
              className={`flex items-center px-6 py-3 rounded-lg ${
                !oldSpec || !newSpec || isComparing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isComparing ? (
                <>
                  <RefreshCw size={20} className="mr-2 animate-spin" />
                  Analyzing API Changes...
                </>
              ) : (
                <>
                  <AlertTriangle size={20} className="mr-2" />
                  Detect Breaking Changes
                </>
              )}
            </button>
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
