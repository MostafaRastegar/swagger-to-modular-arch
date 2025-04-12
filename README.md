## Contact

If you have any questions or feedback, please open an issue on GitHub or contact the maintainers directly.

---

Built with ❤️
# Swagger to Modular Architecture Toolkit

A comprehensive toolkit that transforms Swagger/OpenAPI specifications into a modular, layered TypeScript architecture, helping developers build type-safe, maintainable API integrations with minimal effort.

![Swagger to Modular Architecture Screenshot](https://github.com/MostafaRastegar/swagger-to-modular-arch/blob/main/public/banner.png?raw=true)

## Important Requirements

- **API Tags Required**: Your Swagger/OpenAPI file **must** include `tags` for each API endpoint. The code generation is organized by these `tags`, and without them, the tool cannot generate proper code structures.
like this:
   ```json
   {
     "paths": {
       "/users": {
         "get": {
           "tags": ["Users"],  // This tag is required
           "summary": "Get all users",
           // ...
         }
       }
     }
   }
   ```
- **Workspace-First Approach**: Always start by creating or joining a workspace before attempting to generate code or create mock servers.

## Features

- **Code Generator** - Transform OpenAPI/Swagger specs into TypeScript interfaces, services, and React Query hooks using a modular, layered architecture
- **API Guardian** - Detect breaking changes between API versions to ensure backward compatibility
- **Mock Server** - Create functional mock servers from your API specifications for development and testing
- **Workspace Management** - Organize and isolate your projects with comprehensive workspace support
- **Visual Interface** - Modern, user-friendly dashboard for all operations

## Installation

### Prerequisites

- Node.js 20.0.0 or higher
- npm or yarn

### Getting Started

```bash
# Clone the repository
git clone https://github.com/MostafaRastegar/swagger-to-modular-arch.git
cd swagger-to-modular-arch

# Install dependencies
npm install

# Start the application
npm start
```

This will start both the API server (port 3001) and the dashboard (port 3000).

## Usage

### Dashboard

After starting the application, open your browser and navigate to http://localhost:3000 to access the dashboard.

### Code Generation

Generate TypeScript code from your Swagger/OpenAPI specification:

1. First, ensure you have created a workspace and (optionally) set a default Swagger file
2. Select the "Code Generator" tab in the dashboard
3. Upload your Swagger/OpenAPI specification file or use the default file from your workspace
4. Configure your generation options:
   - Output directory
   - Folder structure (modules, domain-driven, or flat)
   - Distributed folder creation
5. Click "Generate Code"
6. Browse and download the generated files

> **Note:** The code generator organizes output based on the tags defined in your Swagger/OpenAPI specification. Ensure all your API endpoints have appropriate tags, or the generator won't be able to properly organize the code.

Generated code includes:
- TypeScript interfaces for all API models
- Service classes with typed API endpoints
- Presentation layer with React Query hooks for data fetching
- Feature-oriented modular organization
- Proper type safety across all components

### API Guardian

Detect breaking changes between API versions:

1. First, ensure you have created a workspace
2. Select the "API Guardian" tab
3. Upload your old and new API specifications, or use the default Swagger file from your workspace as either the old or new specification
4. Click "Detect Breaking Changes"
5. Review the comprehensive report showing:
   - Critical breaking changes
   - Warnings
   - Informational changes
   - Recommendations for maintaining backward compatibility

> **Note:** You can use your workspace's default Swagger file as either the old or new specification to simplify comparing against a standard baseline.

### Mock Server

Create a mock server for testing and development:

1. First, ensure you have created a workspace
2. Select the "Mock Server" tab
3. Upload your Swagger/OpenAPI specification or use the default file from your workspace
4. Configure server options:
   - Port number
   - Data generation options
5. Click "Generate Mock Server"
6. Follow the provided instructions to start your mock server

> **Note:** The mock server generates realistic test data based on your API schema definitions. Each endpoint defined in your Swagger file with proper tags will be available in your mock server.

### Workspaces

Manage isolated environments for your projects:

#### Recommended User Flow

1. **Create a Workspace**: Start by creating a new workspace that will contain all your project files
2. **Upload and Set Default Swagger File**: Upload your Swagger/OpenAPI specification and set it as the default for this workspace
3. **Generate Code/Create Mock Servers**: Use the default Swagger file to generate code or create mock servers
4. **All assets will be stored in your workspace** for easy access and management

#### Collaboration with Team Members

1. **Share Your Workspace**: Each workspace has a unique 6-character share code that you can provide to team members
2. **Team Members Join**: Other developers can join your workspace by entering the share code in the "Join Workspace" section
3. **Shared Resources**: All team members will have access to the same workspace resources, including the default Swagger file, generated code, and mock servers

#### Managing Workspaces

- Switch between workspaces from the workspace selector in the header
- Each workspace is completely isolated from others
- Set different default Swagger files for different projects



## Configuration

### Settings

The application offers a range of configuration options:

- **General Settings**
  - Default output directory
  - Welcome screen toggle
  - Auto-save settings
  - Confirmation dialogs

- **Appearance**
  - Light/dark theme
  - Accent color
  - Interface layout options

- **API Guardian**
  - Report format and level
  - Auto-export options
  - Recommendation customization

- **Mock Server**
  - Default port
  - CORS settings
  - Data generation options

- **Code Generator**
  - Comment inclusion
  - Tab size and quote style
  - Prettier configuration
  - Index file creation

### Project Structure

The toolkit follows a modular architecture:

```
src/
├── components/       # UI components
├── context/          # React contexts for state management
├── core/             # Core functionality
│   ├── api/          # API server implementation
│   ├── code-generator/ # Code generation logic
│   ├── guardian/     # API comparison logic
│   ├── server/       # Mock server generation
│   └── utils/        # Shared utilities
└── adapters/         # Interface adapters
```

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/MostafaRastegar/swagger-to-modular-arch.git
cd swagger-to-modular-arch

# Install dependencies
npm install

# Start the development server
npm run start

# Build for production
npm run build
```

### Running Tests

```bash
npm test
```

## Architecture Overview

The Swagger to Modular Architecture Toolkit generates code following a pragmatic, feature-oriented approach that balances structure and flexibility.

### Generated Code Structure

The tool generates a modular architecture organized by API features (tags):

```
src/
├── modules/               # Generated modules (organized by API tags)
│   ├── users/             # Example module for "Users" tag
│   │   ├── domains/       # Domain models and interfaces
│   │   │   ├── models/    # Models and interfaces
│   │   │   │   └── Users.ts      # Entity interfaces
│   │   │   └── IUsersService.ts  # Service interfaces
│   │   ├── users.service.ts      # Service implementation
│   │   └── users.presentation.ts # Presentation layer with React Query hooks
│   └── [other-tag]/       # Other API tag modules
└── utils/                 # Shared utilities
    ├── request.ts         # HTTP client abstraction
    └── serviceHandler.ts  # Error handling and response processing
```

### Architecture Principles

![Modular Architecture Diagram](https://github.com/MostafaRastegar/swagger-to-modular-arch/blob/main/public/diagram.png?raw=true)

This architecture can be described as **"Feature-Oriented Modular Architecture with Lightweight Layer Separation"** and follows these principles:

1. **Feature-First Organization**
   - Code is primarily organized by business capability/feature (API tags)
   - Each feature is isolated and self-contained
   - Makes it easy to understand all aspects of a particular feature

2. **Lightweight Layer Separation**
   - Within each feature, code is separated into logical layers:
     - **Domain Layer**: Models and interfaces
     - **Service Layer**: Implementation of business logic and API communication
     - **Presentation Layer**: UI-focused data access and state management
   - Keeps related code together while maintaining separation of concerns

3. **Practical Dependency Management**
   - Presentation depends on Services
   - Services implement Domain interfaces
   - Domain models have no external dependencies
   - Practical balance between strict architectural rules and development convenience

4. **API Integration Focus**
   - Optimized for consuming RESTful APIs
   - Strong typing throughout the entire stack
   - React Query hooks for modern data fetching

### Core Technologies

- **Frontend**: React, TailwindCSS
- **State Management**: React Context API
- **API Communication**: Fetch API
- **Data Fetching**: React Query
- **Code Generation**: Custom parsers and generators
- **Mock Server**: JSON Server
- **Breaking Changes Detection**: Custom comparators

### API Specification Support

- OpenAPI 3.0.x
- Swagger 2.0

### Swagger/OpenAPI Requirements

For optimal results, ensure your Swagger/OpenAPI specification follows these guidelines:

1. **Tags are mandatory**: Each endpoint must have at least one tag to properly organize the generated code
   ```json
   {
     "paths": {
       "/users": {
         "get": {
           "tags": ["Users"],  // This tag is required
           "summary": "Get all users",
           // ...
         }
       }
     }
   }
   ```

2. **Consistent naming**: Use consistent naming conventions for your endpoints, models, and parameters

3. **Defined response schemas**: Include response schemas for all endpoints to generate proper TypeScript interfaces

4. **Parameter descriptions**: Include descriptions for parameters to generate better documentation in the code

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request