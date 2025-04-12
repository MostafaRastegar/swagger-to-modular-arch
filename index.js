#!/usr/bin/env node
// Main entry point for the Swagger TypeScript generator
const { generateModules } = require("./src/core/module-generator");

// Process command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    swaggerFilePath: args[0] || "swagger.json",
    outputDir: "src/modules",
    createFolders: false,
    folderStructure: "modules",
  };

  // Parse named arguments
  args.forEach((arg, index) => {
    if (arg === "--output" && args[index + 1]) {
      options.outputDir = args[index + 1];
    } else if (arg === "--create-folders") {
      options.createFolders = true;
    } else if (arg === "--folder-structure" && args[index + 1]) {
      options.folderStructure = args[index + 1];
    }
  });

  return options;
}

// Execute if run directly
if (require.main === module) {
  const options = parseArgs();
  generateModules(options.swaggerFilePath, {
    outputDir: options.outputDir,
    createFolders: options.createFolders,
    folderStructure: options.folderStructure,
  });
}

module.exports = {
  generateModules,
};
