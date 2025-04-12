import React from "react";

const Sidebar = ({
  menuItems,
  activeTab,
  onTabChange,
  compact = false,
  showLabels = true,
}) => {
  return (
    <div
      className={`${
        compact ? "w-16" : "w-64"
      } bg-white shadow-md transition-all duration-300`}
    >
      <div
        className={`${
          compact ? "p-2 justify-center" : "p-4"
        } border-b flex items-center`}
      >
        {!compact ? (
          <h1 className="text-xl font-bold text-gray-800">API Toolkit</h1>
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            A
          </div>
        )}
      </div>
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`flex items-center w-full ${
                  compact ? "justify-center" : ""
                } px-4 py-3 text-left ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                title={compact ? item.label : ""}
              >
                <span className={compact ? "" : "mr-3"}>{item.icon}</span>
                {!compact && showLabels && item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
export default Sidebar;
