// File: distributedGenerator.js
const fs = require("fs");
const path = require("path");
const { generateEndpointsSection } = require("./endpointGenerator");
const { generateInterfacesSection } = require("./interfaceGenerator");
const { generateServiceSection } = require("./serviceGenerator");
const { generatePresentationSection } = require("./presentationGenerator");
const { pascalCase } = require("../utils/stringUtils");

/**
 * Generate distributed files for each tag according to folder structure
 * @param {string} tag - Tag name
 * @param {Array} operations - Array of operations
 * @param {Object} swagger - Swagger object
 * @param {Map} allSchemas - Map of all schemas
 * @param {string} outputDir - Base output directory
 */
function generateDistributedFiles(
  tag,
  operations,
  swagger,
  allSchemas,
  outputDir
) {
  console.log(`Generating distributed files for ${tag}...`);

  try {
    // Generate all sections
    const endpointsSection = generateEndpointsSection(tag, operations);
    const interfacesSection = generateInterfacesSection(
      tag,
      operations,
      swagger,
      allSchemas
    );
    const serviceSection = generateServiceSection(tag, operations);
    const presentationSection = generatePresentationSection(tag, operations);

    // Set up paths
    const originalTag = tag; // Keep the original tag name
    const capitalizedTag = pascalCase(tag);

    const entityDir = path.join(outputDir, originalTag);
    const domainsDir = path.join(entityDir, "domains");
    const modelsDir = path.join(domainsDir, "models");

    // Create directories if they don't exist
    [entityDir, domainsDir, modelsDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // 1. Generate models file
    const modelsFile = path.join(modelsDir, `${capitalizedTag}.ts`);
    const modelsContent = generateModelsFile(interfacesSection, capitalizedTag);
    fs.writeFileSync(modelsFile, modelsContent, "utf8");
    console.log(`Generated models file: ${modelsFile}`);

    // 2. Generate service interface file
    const serviceInterfaceFile = path.join(
      domainsDir,
      `I${capitalizedTag}Service.ts`
    );
    const serviceInterfaceContent = generateServiceInterfaceFile(
      interfacesSection,
      capitalizedTag
    );
    fs.writeFileSync(serviceInterfaceFile, serviceInterfaceContent, "utf8");
    console.log(`Generated service interface file: ${serviceInterfaceFile}`);

    // 3. Generate service implementation file
    const serviceImplFile = path.join(entityDir, `${originalTag}.service.ts`);
    const serviceImplContent = generateServiceImplFile(
      endpointsSection,
      serviceSection,
      capitalizedTag,
      originalTag,
      tag
    );
    fs.writeFileSync(serviceImplFile, serviceImplContent, "utf8");
    console.log(`Generated service implementation file: ${serviceImplFile}`);

    // 4. Generate presentation file
    const presentationFile = path.join(
      entityDir,
      `${originalTag}.presentation.ts`
    );
    const presentationContent = generatePresentationFile(
      presentationSection,
      capitalizedTag,
      originalTag,
      tag
    );
    fs.writeFileSync(presentationFile, presentationContent, "utf8");
    console.log(`Generated presentation file: ${presentationFile}`);

    console.log(
      `Distributed file generation for ${tag} completed successfully!`
    );
  } catch (error) {
    console.error(`Error generating distributed files for ${tag}:`, error);
  }
}

/**
 * Generate models file content
 * @param {string} interfacesSection - Interfaces section
 * @param {string} capitalizedTag - Capitalized tag name
 * @returns {string} Generated file content
 */
function generateModelsFile(interfacesSection, capitalizedTag) {
  // Extract model interfaces from the interfacesSection
  const modelInterfaces = extractModelInterfaces(interfacesSection);

  return `// Generated model interfaces for ${capitalizedTag}

${modelInterfaces}

// Export all model interfaces
export {
  ResponseObject,
  PaginationParams,
  PaginationList,
  ${getExportedInterfaces(modelInterfaces).join(",\n  ")}
};`;
}

/**
 * Generate service interface file content
 * @param {string} interfacesSection - Interfaces section
 * @param {string} capitalizedTag - Capitalized tag name
 * @returns {string} Generated file content
 */
function generateServiceInterfaceFile(interfacesSection, capitalizedTag) {
  // Extract service interface from the interfacesSection
  const serviceInterface = extractServiceInterface(interfacesSection);
  const modelInterfaces = extractModelInterfaceNames(interfacesSection);

  return `// Generated service interface for ${capitalizedTag}
import {
  ResponseObject,
  PaginationList,
  ${modelInterfaces.join(",\n  ")}
} from './models/${capitalizedTag}';

${serviceInterface}

export { I${capitalizedTag}Service };`;
}

/**
 * Generate service implementation file content
 * @param {string} endpointsSection - Endpoints section
 * @param {string} serviceSection - Service implementation section
 * @param {string} capitalizedTag - Capitalized tag name
 * @param {string} originalTag - Original tag name
 * @param {string} tag - Tag name
 * @returns {string} Generated file content
 */
function generateServiceImplFile(
  endpointsSection,
  serviceSection,
  capitalizedTag,
  originalTag,
  tag
) {
  return `// Generated service implementation for ${originalTag}
import { serviceHandler } from '../utils/serviceHandler';
import request from '../utils/request';
import { I${capitalizedTag}Service } from './domains/I${capitalizedTag}Service';

// ENDPOINTS
${endpointsSection}

// SERVICE IMPLEMENTATION
${serviceSection}

export { ${capitalizedTag}Service, endpoints };`;
}

/**
 * Generate presentation file content
 * @param {string} presentationSection - Presentation section
 * @param {string} capitalizedTag - Capitalized tag name
 * @param {string} originalTag - Original tag name
 * @param {string} tag - Tag name
 * @returns {string} Generated file content
 */
function generatePresentationFile(
  presentationSection,
  capitalizedTag,
  originalTag,
  tag
) {
  return `// Generated presentation layer for ${originalTag}
import { useQuery, useMutation } from 'react-query';
import { ${capitalizedTag}Service } from './${originalTag}.service';

// PRESENTATION LAYER
${presentationSection}

export { ${capitalizedTag}Presentation };`;
}

/**
 * Extract model interfaces from interfaces section
 * @param {string} interfacesSection - Interfaces section
 * @returns {string} Model interfaces
 */
function extractModelInterfaces(interfacesSection) {
  // This is a simplified implementation. In a real-world scenario,
  // you might want to use an AST parser to properly extract interfaces.

  // For now, return the whole interfacesSection except service interface part
  const serviceInterfaceStart = interfacesSection.indexOf(
    "// Service interface"
  );

  if (serviceInterfaceStart !== -1) {
    return interfacesSection.substring(0, serviceInterfaceStart);
  }

  return interfacesSection;
}

/**
 * Extract service interface from interfaces section
 * @param {string} interfacesSection - Interfaces section
 * @returns {string} Service interface
 */
function extractServiceInterface(interfacesSection) {
  // This is a simplified implementation. In a real-world scenario,
  // you might want to use an AST parser to properly extract interfaces.

  const serviceInterfaceStart = interfacesSection.indexOf(
    "// Service interface"
  );

  if (serviceInterfaceStart !== -1) {
    return interfacesSection.substring(serviceInterfaceStart);
  }

  return "";
}

/**
 * Extract interface names for import statements
 * @param {string} interfacesSection - Interfaces section
 * @returns {string[]} Array of interface names
 */
function extractModelInterfaceNames(interfacesSection) {
  const interfaces = [];
  const regex = /interface\s+(\w+)/g;
  let match;

  while ((match = regex.exec(interfacesSection)) !== null) {
    // Skip common interfaces
    if (
      ![
        "ResponseObject",
        "PaginationParams",
        "PaginationList",
        "IService",
      ].some((common) => match[1].includes(common))
    ) {
      interfaces.push(match[1]);
    }
  }

  // Also look for type definitions
  const typeRegex = /type\s+(\w+)/g;
  while ((match = typeRegex.exec(interfacesSection)) !== null) {
    interfaces.push(match[1]);
  }

  return interfaces;
}

/**
 * Get list of exported interfaces
 * @param {string} modelInterfaces - Model interfaces section
 * @returns {string[]} Array of interface names to export
 */
function getExportedInterfaces(modelInterfaces) {
  return extractModelInterfaceNames(modelInterfaces);
}

module.exports = {
  generateDistributedFiles,
};
