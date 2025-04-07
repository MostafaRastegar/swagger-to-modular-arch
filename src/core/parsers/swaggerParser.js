// Swagger parsing utilities
const fs = require("fs");

/**
 * Parse Swagger file
 * @param {string} filePath - Path to Swagger file
 * @returns {Object} Parsed Swagger object
 */
function parseSwaggerFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  console.log(`Successfully read swagger file`);

  const swagger = JSON.parse(content);
  console.log(`Successfully parsed swagger JSON`);

  return swagger;
}

/**
 * Extract all unique tags from Swagger paths
 * @param {Object} swagger - Swagger object
 * @returns {string[]} Array of unique tags
 */
function extractUniqueTags(swagger) {
  const uniqueTags = new Set();

  Object.values(swagger.paths || {}).forEach((pathItem) => {
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

  Object.entries(swagger.paths || {}).forEach(([path, pathItem]) => {
    Object.entries(pathItem).forEach(([method, operation]) => {
      if (!["get", "post", "put", "delete", "patch"].includes(method)) return;
      if (!operation.tags || !operation.tags.includes(tag)) return;

      // Extract path parameters
      const pathParams = [];
      path.split("/").forEach((segment) => {
        if (segment.startsWith("{") && segment.endsWith("}")) {
          pathParams.push(segment.substring(1, segment.length - 1));
        }
      });

      operations.push({
        operationId:
          operation.operationId || `${method}${path.replace(/[^\w]+/g, "_")}`,
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

module.exports = {
  parseSwaggerFile,
  extractUniqueTags,
  collectTagOperations,
};
