// tagProcessor.js (modified)
const path = require("path");
const { writeToFile } = require("../utils/fileUtils");
const { collectTagOperations } = require("../parsers/swaggerParser");
const { generateEndpointsSection } = require("../generators/endpointGenerator");
const {
  generateInterfacesSection,
} = require("../generators/interfaceGenerator");
const { generateServiceSection } = require("../generators/serviceGenerator");
const {
  generatePresentationSection,
} = require("../generators/presentationGenerator");
const { pascalCase } = require("../utils/stringUtils");
const {
  generateDistributedFiles,
} = require("../generators/distributedGenerator");

/**
 * Process a single tag
 * @param {string} tag - Tag name
 * @param {Object} swagger - Swagger object
 * @param {string} outputDir - Output directory
 * @param {Map} allSchemas - Map of all schemas
 * @param {Object} options - Additional options
 */
function processTag(tag, swagger, outputDir, allSchemas, options = {}) {
  console.log(`Processing tag: ${tag}...`);
  console.log(`Generating ==========processTag=============== ${outputDir}...`);
  try {
    // Collect operations
    const operations = collectTagOperations(tag, swagger);

    if (operations.length === 0) {
      console.warn(`No operations found for tag: ${tag}`);
      return;
    }

    // Check if we should use distributed files
    if (options.createFolders) {
      // Generate distributed files
      generateDistributedFiles(tag, operations, swagger, allSchemas, outputDir);
    } else {
      // Generate unified file
      const fileContent = generateFileContent(
        tag,
        operations,
        swagger,
        allSchemas
      );

      // Write unified file
      const outputPath = path.join(outputDir, `${tag}.ts`);
      writeToFile(outputPath, fileContent);
    }
  } catch (error) {
    console.error(`Error processing tag ${tag}:`, error);
  }
}

/**
 * Generate the unified file content
 * @param {string} tag - Tag name
 * @param {Array} operations - Array of operations
 * @param {Object} swagger - Swagger object
 * @param {Map} allSchemas - Map of all schemas
 * @returns {string} Generated file content
 */
function generateFileContent(tag, operations, swagger, allSchemas) {
  // Generate each section
  const endpointsSection = generateEndpointsSection(tag, operations);
  const interfacesSection = generateInterfacesSection(
    tag,
    operations,
    swagger,
    allSchemas
  );
  const serviceSection = generateServiceSection(tag, operations);
  const presentationSection = generatePresentationSection(tag, operations);

  return `// Generated file for ${tag} - Unified implementation
import { serviceHandler } from '../utils/serviceHandler';
import request from '../utils/request';
import { useQuery, useMutation } from 'react-query';

// ===== ENDPOINTS =====
${endpointsSection}

// ===== INTERFACES =====
${interfacesSection}

// ===== SERVICE IMPLEMENTATION =====
${serviceSection}

// ===== PRESENTATION LAYER =====
${presentationSection}

// Export everything
export { ${pascalCase(tag)}Service, ${pascalCase(
    tag
  )}Presentation, endpoints };`;
}

module.exports = {
  processTag,
};
