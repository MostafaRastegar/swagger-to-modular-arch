/**
 * Tag Processor Module
 *
 * Processes each tag from a Swagger/OpenAPI specification and generates
 * appropriate TypeScript code.
 */
const path = require("path");
const { writeToFile } = require("../../utils/fileUtils");
const { collectTagOperations } = require("../parsers/swagger");
const { generateEndpointsSection } = require("../generators/endpoint");
const { generateInterfacesSection } = require("../generators/interface");
const { generateServiceSection } = require("../generators/service");
const { generatePresentationSection } = require("../generators/presentation");
const { pascalCase } = require("../../utils/stringUtils");
const { generateDistributedFiles } = require("../generators/distributed");

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
