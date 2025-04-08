// src/components/workspace/WorkspaceIndicator.js
import React from "react";
import { Briefcase, AlertTriangle } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";

const WorkspaceIndicator = () => {
  const { currentWorkspace } = useWorkspace();

  if (!currentWorkspace) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6 flex items-center">
        <AlertTriangle
          size={20}
          className="text-yellow-500 mr-2 flex-shrink-0"
        />
        <div>
          <p className="text-yellow-800 font-medium">No Workspace Selected</p>
          <p className="text-yellow-700 text-sm">
            Please select or create a workspace to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6 flex items-center">
      <Briefcase size={20} className="text-blue-600 mr-2 flex-shrink-0" />
      <div>
        <p className="text-blue-800 font-medium">
          Current Workspace: {currentWorkspace.name}
        </p>
        <p className="text-blue-700 text-sm">ID: {currentWorkspace.id}</p>
      </div>
    </div>
  );
};

export default WorkspaceIndicator;
