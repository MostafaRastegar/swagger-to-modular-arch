// Tag processing utilities
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

/**
 * Process a single tag
 * @param {string} tag - Tag name
 * @param {Object} swagger - Swagger object
 * @param {string} outputDir - Output directory
 * @param {Map} allSchemas - Map of all schemas
 */
function processTag(tag, swagger, outputDir, allSchemas) {
  console.log(`Generating unified file for ${tag}...`);

  try {
    // Collect operations
    const operations = collectTagOperations(tag, swagger);

    if (operations.length === 0) {
      console.warn(`No operations found for tag: ${tag}`);
      return;
    }

    // Generate file content
    const fileContent = generateFileContent(
      tag,
      operations,
      swagger,
      allSchemas
    );

    // Write to file
    const outputPath = path.join(outputDir, `${tag}.ts`);
    writeToFile(outputPath, fileContent);
  } catch (error) {
    console.error(`Error generating file for tag ${tag}:`, error);
  }
}

/**
 * Generate the final file content
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

// ===== ENDPOINTS =====
${endpointsSection}

// ===== INTERFACES =====
${interfacesSection}

// ===== SERVICE IMPLEMENTATION =====
${serviceSection}

// ===== PRESENTATION LAYER =====
${presentationSection}
`;
}

module.exports = {
  processTag,
};
