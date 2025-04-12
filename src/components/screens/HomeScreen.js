// src/components/screens/HomeScreen.js

import React from "react";
import {
  Code,
  Shield,
  Server,
  Upload,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";
import WorkspaceIndicator from "../workspace/WorkspaceIndicator";

const FeatureCard = ({ title, description, icon, buttonText, onClick }) => (
  <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
    <div className="flex items-center mb-4">
      <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-600">
        {icon}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
    <p className="text-gray-600 mb-6">{description}</p>
    <button
      onClick={onClick}
      className="flex items-center text-blue-600 font-medium hover:text-blue-800"
    >
      {buttonText} <ArrowRight size={16} className="ml-1" />
    </button>
  </div>
);

const HomeScreen = ({ onNavigate }) => {
  const { currentWorkspace } = useWorkspace();

  const features = [
    {
      id: "workspace",
      title: "Workspaces",
      description:
        "Manage your workspaces for organized and isolated project environments.",
      icon: <Briefcase size={24} />,
      buttonText: "Manage Workspaces",
    },
    {
      id: "generator",
      title: "Code Generator",
      description:
        "Generate TypeScript interfaces, services, and React components from Swagger/OpenAPI specifications.",
      icon: <Code size={24} />,
      buttonText: "Generate Code",
    },
    {
      id: "guardian",
      title: "API Guardian",
      description:
        "Detect breaking changes between different versions of your API specifications.",
      icon: <Shield size={24} />,
      buttonText: "Check API Changes",
    },
    {
      id: "mockServer",
      title: "Mock Server",
      description:
        "Create a fully functional mock server from your API specification for development and testing.",
      icon: <Server size={24} />,
      buttonText: "Create Mock Server",
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to API Toolkit</h2>
        <p className="text-gray-600 mb-4">
          This toolkit provides comprehensive solutions for API development,
          testing, and maintenance. Choose a tool below to get started, or
          upload a Swagger/OpenAPI specification.
        </p>

        {/* Workspace Status */}
        <WorkspaceIndicator />

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center">
          <Upload className="text-blue-600 mr-3" size={20} />
          <span className="mr-3">Upload a Swagger/OpenAPI file:</span>
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Browse Files
            <input type="file" className="hidden" accept=".json,.yaml,.yml" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            {...feature}
            onClick={() => onNavigate(feature.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
