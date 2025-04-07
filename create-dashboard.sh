#!/bin/bash

# رنگ‌ها برای خروجی زیباتر
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== ایجاد ساختار داشبورد Swagger Toolkit ===${NC}"

# ایجاد پوشه داشبورد
mkdir -p dashboard
cd dashboard

# ایجاد ساختار پوشه‌ها
echo -e "${GREEN}ایجاد ساختار پوشه‌ها...${NC}"
mkdir -p public
mkdir -p src/components/layout
mkdir -p src/components/screens
mkdir -p src/components/shared
mkdir -p src/adapters
mkdir -p src/store/slices

# ایجاد فایل package.json
echo -e "${GREEN}ایجاد فایل package.json...${NC}"
cat > package.json << 'EOF'
{
  "name": "swagger-toolkit-dashboard",
  "version": "1.0.0",
  "description": "Visual dashboard for Swagger Toolkit",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1",
    "tailwindcss": "^3.4.17",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

# ایجاد فایل‌های کانفیگ
echo -e "${GREEN}ایجاد فایل‌های کانفیگ...${NC}"
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
  },
  plugins: [],
};
EOF

cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

# ایجاد index.html
echo -e "${GREEN}ایجاد index.html...${NC}"
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Swagger Toolkit Dashboard" />
    <title>Swagger Toolkit Dashboard</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# ایجاد فایل‌های React
echo -e "${GREEN}ایجاد فایل‌های React...${NC}"

# index.js
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
EOF

# App.js
cat > src/App.js << 'EOF'
import React from 'react';
import Dashboard from './components/layout/Dashboard';

function App() {
  return <Dashboard />;
}

export default App;
EOF

# Dashboard.js
cat > src/components/layout/Dashboard.js << 'EOF'
import React, { useState } from 'react';
import { Home, Code, Shield, Server, Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import HomeScreen from '../screens/HomeScreen';
import CodeGeneratorScreen from '../screens/CodeGeneratorScreen';
import APIGuardianScreen from '../screens/APIGuardianScreen';
import MockServerScreen from '../screens/MockServerScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Menu items configuration
  const menuItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'generator', label: 'Code Generator', icon: <Code size={20} /> },
    { id: 'guardian', label: 'API Guardian', icon: <Shield size={20} /> },
    { id: 'mockServer', label: 'Mock Server', icon: <Server size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  // Function to render the active content based on selected tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={setActiveTab} />;
      case 'generator':
        return <CodeGeneratorScreen />;
      case 'guardian':
        return <APIGuardianScreen />;
      case 'mockServer':
        return <MockServerScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        menuItems={menuItems} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      <div className="flex-1 overflow-auto">
        <Header 
          title={menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'} 
        />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
EOF

# Sidebar.js
cat > src/components/layout/Sidebar.js << 'EOF'
import React from 'react';

const Sidebar = ({ menuItems, activeTab, onTabChange }) => {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">API Toolkit</h1>
      </div>
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`flex items-center w-full px-4 py-3 text-left ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
EOF

# Header.js
cat > src/components/layout/Header.js << 'EOF'
import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      </div>
    </header>
  );
};

export default Header;
EOF

# HomeScreen.js
cat > src/components/screens/HomeScreen.js << 'EOF'
import React from 'react';
import { Code, Shield, Server, Upload, ArrowRight } from 'lucide-react';

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
  const features = [
    {
      id: 'generator',
      title: 'Code Generator',
      description: 'Generate TypeScript interfaces, services, and React components from Swagger/OpenAPI specifications.',
      icon: <Code size={24} />,
      buttonText: 'Generate Code',
    },
    {
      id: 'guardian',
      title: 'API Guardian',
      description: 'Detect breaking changes between different versions of your API specifications.',
      icon: <Shield size={24} />,
      buttonText: 'Check API Changes',
    },
    {
      id: 'mockServer',
      title: 'Mock Server',
      description: 'Create a fully functional mock server from your API specification for development and testing.',
      icon: <Server size={24} />,
      buttonText: 'Create Mock Server',
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to API Toolkit</h2>
        <p className="text-gray-600 mb-4">
          This toolkit provides comprehensive solutions for API development, testing, and maintenance.
          Choose a tool below to get started, or upload a Swagger/OpenAPI specification.
        </p>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center">
          <Upload className="text-blue-600 mr-3" size={20} />
          <span className="mr-3">Upload a Swagger/OpenAPI file:</span>
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Browse Files
            <input type="file" className="hidden" accept=".json,.yaml,.yml" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
EOF

# ایجاد فایل‌های Screen اسکلتی
echo -e "${GREEN}ایجاد فایل‌های Screen اسکلتی...${NC}"

# CodeGeneratorScreen.js
cat > src/components/screens/CodeGeneratorScreen.js << 'EOF'
import React from 'react';

const CodeGeneratorScreen = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">Code Generator</h3>
      <p className="text-gray-600">
        Upload your Swagger/OpenAPI specification to generate TypeScript interfaces, services, and React components.
      </p>
      {/* Implementation will go here */}
    </div>
  );
};

export default CodeGeneratorScreen;
EOF

# APIGuardianScreen.js
cat > src/components/screens/APIGuardianScreen.js << 'EOF'
import React from 'react';

const APIGuardianScreen = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">API Guardian</h3>
      <p className="text-gray-600">
        Compare two versions of your API specification to detect breaking changes.
      </p>
      {/* Implementation will go here */}
    </div>
  );
};

export default APIGuardianScreen;
EOF

# MockServerScreen.js
cat > src/components/screens/MockServerScreen.js << 'EOF'
import React from 'react';

const MockServerScreen = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">Mock Server</h3>
      <p className="text-gray-600">
        Generate a fully functional mock server from your API specification.
      </p>
      {/* Implementation will go here */}
    </div>
  );
};

export default MockServerScreen;
EOF

# SettingsScreen.js
cat > src/components/screens/SettingsScreen.js << 'EOF'
import React from 'react';

const SettingsScreen = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">Settings</h3>
      <p className="text-gray-600">
        Configure application settings and preferences.
      </p>
      {/* Implementation will go here */}
    </div>
  );
};

export default SettingsScreen;
EOF

# ایجاد کامپوننت‌های مشترک اسکلتی
echo -e "${GREEN}ایجاد کامپوننت‌های مشترک اسکلتی...${NC}"

# FileUploader.js
cat > src/components/shared/FileUploader.js << 'EOF'
import React, { useState } from 'react';
import { Upload, Check } from 'lucide-react';

const FileUploader = ({ onFileSelect, acceptedTypes = ".json,.yaml,.yml" }) => {
  const [file, setFile] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (onFileSelect) {
        onFileSelect(selectedFile);
      }
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
            onClick={() => { setFile(null); onFileSelect && onFileSelect(null); }}
          >
            Change file
          </button>
        </div>
      ) : (
        <div>
          <Upload size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 mb-2">
            Drag and drop your file here, or
          </p>
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
EOF

# Button.js
cat > src/components/shared/Button.js << 'EOF'
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon,
  disabled = false,
  onClick,
  className = '',
  ...rest
}) => {
  const baseStyles = "rounded-lg flex items-center justify-center font-medium";
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
  };
  
  const sizeStyles = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  };
  
  const disabledStyles = "opacity-50 cursor-not-allowed";
  
  const buttonStyles = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${disabled ? disabledStyles : ''} 
    ${className}
  `;
  
  return (
    <button 
      className={buttonStyles} 
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
EOF

# Card.js
cat > src/components/shared/Card.js << 'EOF'
import React from 'react';

const Card = ({ 
  children, 
  title,
  icon,
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center mb-4">
          {icon && <span className="mr-2">{icon}</span>}
          {title && <h3 className="text-lg font-medium">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
EOF

# ایجاد فایل‌های آداپتور اسکلتی
echo -e "${GREEN}ایجاد فایل‌های آداپتور اسکلتی...${NC}"

cat > src/adapters/codeGeneratorAdapter.js << 'EOF'
/**
 * آداپتور برای تعامل با ماژول تولید کد
 */

// این تابع با ماژول اصلی تولیدکننده کد ارتباط برقرار می‌کند
export const generateCode = async (file, options) => {
  try {
    // در یک پیاده‌سازی واقعی، این بخش با ماژول اصلی تعامل خواهد داشت
    console.log('Generating code with options:', options);
    
    // شبیه‌سازی عملیات آسنکرون
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Code generated successfully',
          outputPath: options.outputDir
        });
      }, 1500);
    });
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
};
EOF

cat > src/adapters/apiGuardianAdapter.js << 'EOF'
/**
 * آداپتور برای تعامل با ماژول API Guardian
 */

// این تابع با ماژول اصلی API Guardian ارتباط برقرار می‌کند
export const compareSpecs = async (oldSpecFile, newSpecFile, options) => {
  try {
    // در یک پیاده‌سازی واقعی، این بخش با ماژول اصلی تعامل خواهد داشت
    console.log('Comparing specs with options:', options);
    
    // شبیه‌سازی عملیات آسنکرون
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          critical: [],
          warning: [],
          info: [],
          suggestions: []
        });
      }, 1500);
    });
  } catch (error) {
    console.error('Error comparing specs:', error);
    throw error;
  }
};
EOF

cat > src/adapters/mockServerAdapter.js << 'EOF'
/**
 * آداپتور برای تعامل با ماژول سرور مجازی
 */

// این تابع با ماژول اصلی سرور مجازی ارتباط برقرار می‌کند
export const generateMockServer = async (file, options) => {
  try {
    // در یک پیاده‌سازی واقعی، این بخش با ماژول اصلی تعامل خواهد داشت
    console.log('Generating mock server with options:', options);
    
    // شبیه‌سازی عملیات آسنکرون
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          port: options.port || 3000,
          dbPath: 'server/db.json',
          routesPath: 'server/routes.json',
          command: `json-server --watch server/db.json --routes server/routes.json --port ${options.port || 3000}`
        });
      }, 1500);
    });
  } catch (error) {
    console.error('Error generating mock server:', error);
    throw error;
  }
};

// این تابع سرور مجازی را اجرا می‌کند
export const runMockServer = async (config) => {
  try {
    // در یک پیاده‌سازی واقعی، این بخش با ماژول اصلی تعامل خواهد داشت
    console.log('Running mock server with config:', config);
    
    // شبیه‌سازی عملیات آسنکرون
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          serverUrl: `http://localhost:${config.port}`,
          pid: 12345
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Error running mock server:', error);
    throw error;
  }
};
EOF

# ایجاد فایل‌های store اسکلتی
echo -e "${GREEN}ایجاد فایل‌های store اسکلتی...${NC}"

cat > src/store/index.js << 'EOF'
/**
 * تنظیمات پایه مدیریت وضعیت
 * 
 * در پیاده‌سازی واقعی، می‌توان از Redux یا Context API استفاده کرد
 */

import React, { createContext, useContext, useReducer } from 'react';

// ایجاد context
const StoreContext = createContext();

// ایجاد provider
export const StoreProvider = ({ children, initialState, reducer }) => (
  <StoreContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StoreContext.Provider>
);

// هوک برای دسترسی به store
export const useStore = () => useContext(StoreContext);
EOF

echo -e "${GREEN}ساختار داشبورد با موفقیت ایجاد شد!${NC}"

# بازگشت به دایرکتوری اصلی
cd ..

echo -e "${BLUE}=== پایان ایجاد ساختار داشبورد ===${NC}"
echo -e "برای شروع کار با داشبورد، دستورات زیر را اجرا کنید:"
echo -e "  cd dashboard"
echo -e "  npm install"
echo -e "  npm start"