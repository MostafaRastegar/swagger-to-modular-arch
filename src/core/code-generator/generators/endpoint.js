/**
 * Endpoint Generator Module
 *
 * Generates TypeScript code for API endpoints based on Swagger/OpenAPI specification.
 */

/**
 * Generate the endpoints section for a tag
 * @param {string} tag - Tag name
 * @param {Array} operations - Array of operations
 * @returns {string} Generated endpoints code
 */
function generateEndpointsSection(tag, operations) {
  // Create the nested structure with the tag as a key in uppercase
  let output = `const endpoints = {\n`;
  output += `  ${tag.toUpperCase()}: {\n`;

  operations.forEach((operation) => {
    // Create endpoint key
    const endpointKey = buildEndpointKey(operation);
    operation.endpointKey = endpointKey;

    // Generate endpoint function
    if (operation.pathParams.length > 0) {
      const paramsString = operation.pathParams
        .map((param) => `${param}: string | number`)
        .join(", ");

      const urlTemplate = operation.path.replace(/{([^}]+)}/g, "${$1}");
      output += `    ${endpointKey}: (${paramsString}) => \`\${HOST_URL_API}${urlTemplate}\`,\n`;
    } else {
      output += `    ${endpointKey}: () => \`\${HOST_URL_API}${operation.path}\`,\n`;
    }
  });

  output += `  },\n`;
  output += `};\n`;
  return output;
}

/**
 * Build the endpoint key from an operation
 * @param {Object} operation - Operation object
 * @returns {string} Endpoint key
 */
function buildEndpointKey(operation) {
  let endpointKey = operation.method; // Start with HTTP method

  // Parse path segments
  const pathSegments = operation.path.replace(/^\//, "").split("/");

  // Add resource name
  if (pathSegments[0] === "api" && pathSegments.length > 1) {
    endpointKey += `_${pathSegments[1].toUpperCase().replace(/-/g, "_")}`;
  }

  // Add remaining path segments
  for (
    let i = pathSegments[0] === "api" ? 2 : 1;
    i < pathSegments.length;
    i++
  ) {
    const segment = pathSegments[i];
    if (segment === "") continue;

    if (segment.startsWith("{") && segment.endsWith("}")) {
      endpointKey += "_ID";
    } else {
      endpointKey += `_${segment.toUpperCase().replace(/-/g, "_")}`;
    }
  }

  return endpointKey;
}

module.exports = {
  generateEndpointsSection,
  buildEndpointKey,
};
