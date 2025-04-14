/**
 * Code Generator Configuration
 *
 * Configuration settings and constants for the code generator
 */

const path = require("path");

module.exports = {
  // Default output directories
  DEFAULT_OUTPUT_DIR: "modules",

  // Default templates and structures
  DEFAULT_FOLDER_STRUCTURE: "modules",

  // File extensions
  FILE_EXTENSION: ".ts",

  // Template configs
  TEMPLATES: {
    COMMON_INTERFACES: [
      "ResponseObject<T>",
      "PaginationParams",
      "PaginationList<T>",
    ],

    IMPORTS: {
      SERVICE:
        "import { serviceHandler } from '../utils/serviceHandler';\nimport request from '../utils/request';",
      PRESENTATION: "import { useQuery, useMutation } from 'react-query';",
    },
  },

  // Logging settings
  LOGGING: {
    ENABLED: true,
    VERBOSE: false,
  },

  // Function to build a complete path
  buildOutputPath: (outputDir, fileName, extension = ".ts") => {
    return path.join(outputDir, `${fileName}${extension}`);
  },
};
