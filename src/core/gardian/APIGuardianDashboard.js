import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ThumbsUp,
} from "lucide-react";

// Sample report data - in real implementation, this would be loaded from your API Guardian report
const sampleReport = {
  critical: [
    {
      type: "ENDPOINT_REMOVED",
      path: "/api/users/details",
      method: "GET",
      message: "Endpoint removed: /api/users/details",
      impact: "Clients using this endpoint will break",
      recommendation:
        "Consider keeping the endpoint and marking it as deprecated, or create a new versioned path (e.g., /v2/api/users/details)",
    },
    {
      type: "REQUIRED_PARAM_ADDED",
      path: "/api/orders",
      method: "POST",
      param: "customer_id",
      paramIn: "body",
      message:
        "New required parameter 'customer_id' (body) added to POST /api/orders",
      impact: "Existing clients will not send this parameter and will break",
      recommendation:
        "Consider making the parameter optional with backward compatible defaults",
    },
    {
      type: "SCHEMA_TYPE_CHANGED",
      context: "schema 'OrderItem'",
      property: "quantity",
      oldType: "string",
      newType: "integer",
      message:
        "Schema type changed in schema 'OrderItem' from 'string' to 'integer'",
      impact: "Clients expecting the old type will break",
      recommendation:
        "Consider maintaining the same type or introducing versioning",
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
    {
      type: "CONTENT_TYPE_REMOVED",
      path: "/api/upload",
      method: "POST",
      contentType: "multipart/form-data",
      message:
        "Content type 'multipart/form-data' removed from request body in POST /api/upload",
      impact: "Clients sending this content type will break",
      recommendation: "Consider keeping support for this content type",
    },
  ],
  info: [
    {
      type: "ENDPOINT_ADDED",
      path: "/api/products/featured",
      message: "New endpoint added: /api/products/featured",
    },
    {
      type: "OPTIONAL_REQUEST_BODY_ADDED",
      path: "/api/users/preferences",
      method: "PUT",
      message: "Optional request body added to PUT /api/users/preferences",
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
        "Header versioning (e.g., Accept: application/vnd.api+json;version=1)",
        "Content negotiation (e.g., Accept: application/vnd.api.v1+json)",
      ],
    },
    {
      title: "Deprecation Strategy",
      description:
        "Before removing endpoints or changing behavior, use deprecation notices to inform API consumers.",
      options: [
        'Add "Deprecated" header to responses',
        "Add deprecation notices in API documentation",
        "Keep deprecated endpoints for at least one release cycle",
        "Maintain backward compatibility with defaults",
      ],
    },
  ],
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Breaking Changes Summary</h2>
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          {icon}
          <h2 className="text-xl font-bold ml-2">
            {title}{" "}
            <span className="text-gray-500 text-lg">({changes.length})</span>
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <ThumbsUp className="text-green-600" size={24} />
          <h2 className="text-xl font-bold ml-2">Recommendations</h2>
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

// Main dashboard component
const APIGuardianDashboard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Try to fetch the report from the file
    fetch("/api-guardian-report.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to load report. Make sure to run API Guardian first."
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Successfully loaded report data:", data);
        setReport(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading report:", error);
        // Only use sample data in development environment
        if (process.env.NODE_ENV === "development") {
          console.warn("Using sample data for development purposes");
          setReport(sampleReport);
        } else {
          setError(
            "Failed to load report. Please run API Guardian first to generate a report."
          );
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <h2 className="text-xl font-bold">Error Loading Report</h2>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          API Guardian Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Visual report of API breaking changes and recommendations
        </p>
      </header>

      <SummaryStats report={report} />

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

      <Recommendations suggestions={report.suggestions} />
    </div>
  );
};

export default APIGuardianDashboard;
