/**
 * Swagger Parser
 *
 * Utility functions for parsing Swagger/OpenAPI specifications
 */

const fs = require("fs");

/**
 * Parse Swagger file
 * @param {string} filePath - Path to Swagger file
 * @returns {Object} Parsed Swagger object
 * @throws {Error} If file cannot be read or parsed
 */
function parseSwaggerFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    console.log(`Successfully read swagger file: ${filePath}`);

    try {
      const swagger = JSON.parse(content);
      console.log(`Successfully parsed swagger JSON`);
      return swagger;
    } catch (parseError) {
      throw new Error(`Failed to parse JSON: ${parseError.message}`);
    }
  } catch (fileError) {
    throw new Error(`Failed to read file: ${fileError.message}`);
  }
}

/**
 * Extract all unique tags from Swagger paths
 * @param {Object} swagger - Swagger object
 * @returns {string[]} Array of unique tags
 */
function extractUniqueTags(swagger) {
  const uniqueTags = new Set();

  if (!swagger.paths) {
    console.warn("No paths found in swagger specification");
    return [];
  }

  Object.values(swagger.paths).forEach((pathItem) => {
    Object.entries(pathItem).forEach(([method, operation]) => {
      if (!["get", "post", "put", "delete", "patch"].includes(method)) return;

      if (operation.tags && Array.isArray(operation.tags)) {
        operation.tags.forEach((tag) => uniqueTags.add(tag));
      }
    });
  });

  return Array.from(uniqueTags);
}

/**
 * Collect operations for a tag
 * @param {string} tag - Tag name
 * @param {Object} swagger - Swagger object
 * @returns {Array} Operations for the tag
 */
function collectTagOperations(tag, swagger) {
  const operations = [];

  if (!swagger.paths) {
    return operations;
  }

  Object.entries(swagger.paths || {}).forEach(([path, pathItem]) => {
    Object.entries(pathItem).forEach(([method, operation]) => {
      if (!["get", "post", "put", "delete", "patch"].includes(method)) return;
      if (!operation.tags || !operation.tags.includes(tag)) return;

      // Extract path parameters
      const pathParams = extractPathParameters(path);

      // Create operation object
      operations.push({
        operationId: operation.operationId || generateOperationId(method, path),
        path,
        method: method.toUpperCase(),
        summary: operation.summary || "",
        description: operation.description || "",
        parameters: operation.parameters || [],
        requestBody: operation.requestBody || null,
        responses: operation.responses || {},
        pathParams,
      });
    });
  });

  return operations;
}

/**
 * Extract path parameters from a path
 * @param {string} path - API path
 * @returns {string[]} Array of path parameters
 */
function extractPathParameters(path) {
  const pathParams = [];

  path.split("/").forEach((segment) => {
    if (segment.startsWith("{") && segment.endsWith("}")) {
      pathParams.push(segment.substring(1, segment.length - 1));
    }
  });

  return pathParams;
}

/**
 * Generate an operation ID from method and path
 * @param {string} method - HTTP method
 * @param {string} path - API path
 * @returns {string} Generated operation ID
 */
function generateOperationId(method, path) {
  return `${method}${path.replace(/[^\w]+/g, "_")}`;
}

module.exports = {
  parseSwaggerFile,
  extractUniqueTags,
  collectTagOperations,
  extractPathParameters,
};
