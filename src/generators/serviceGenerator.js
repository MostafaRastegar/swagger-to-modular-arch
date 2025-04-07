// Service generation utilities
const { pascalCase } = require("../utils/stringUtils");

/**
 * Generate service implementation
 * @param {string} tag - Tag name
 * @param {Array} operations - Array of operations
 * @returns {string} Generated service implementation
 */
function generateServiceSection(tag, operations) {
  const serviceName = `${pascalCase(tag)}Service`;

  let output = `function ${serviceName}(): I${pascalCase(tag)}Service {\n`;
  output += `  return {\n`;

  // Generate method implementations
  operations.forEach((operation) => {
    const httpMethod = operation.method.toLowerCase();
    const endpointKey = operation.endpointKey;

    // Generate implementation based on HTTP method and parameters
    output += generateMethodImplementation(
      operation,
      tag,
      httpMethod,
      endpointKey
    );
  });

  // Remove trailing comma if needed
  output = output.replace(/,\n$/, "\n");

  output += `  };\n}\n`;
  return output;
}

/**
 * Generate a method implementation
 * @param {Object} operation - Operation object
 * @param {string} tag - Tag name
 * @param {string} httpMethod - HTTP method
 * @param {string} endpointKey - Endpoint key
 * @returns {string} Generated method implementation
 */
function generateMethodImplementation(operation, tag, httpMethod, endpointKey) {
  const methodName = operation.methodName;
  let implementation = "";

  // Check if we have a direct parameter (like agent_id) instead of a params object
  const hasDirectParam = operation.directParam !== undefined;
  const directParamName = hasDirectParam ? operation.directParam.name : null;

  switch (httpMethod) {
    case "get":
      if (operation.pathParams.length > 0) {
        // GET with path params
        const hasQueryParams =
          operation.parameters &&
          operation.parameters.some((p) => p.in === "query");

        implementation = `    ${methodName}: (`;

        // Handle parameters based on whether we have a direct param or params object
        if (hasDirectParam) {
          implementation += `${directParamName}`;
        } else {
          implementation += `params`;
        }

        implementation += `) => \n`;
        implementation += `      serviceHandler(() => \n`;

        // Use the appropriate parameter reference in the endpoint call
        if (hasDirectParam) {
          implementation += `        request().get(endpoints.${tag.toUpperCase()}.${endpointKey}(${directParamName})`;
        } else {
          implementation += `        request().get(endpoints.${tag.toUpperCase()}.${endpointKey}(params.${
            operation.pathParams[0]
          })`;
        }

        if (hasQueryParams && !hasDirectParam) {
          implementation += `, { params }`;
        }

        implementation += `)\n      ),\n`;
      } else {
        // GET list
        implementation = `    ${methodName}: (params) => \n`;
        implementation += `      serviceHandler(() => \n`;
        implementation += `        request().get(endpoints.${tag.toUpperCase()}.${endpointKey}(), { params })\n`;
        implementation += `      ),\n`;
      }
      break;

    case "post":
      if (operation.pathParams.length > 0) {
        // POST with path param
        implementation = `    ${methodName}: (`;

        // Handle parameters based on whether we have a direct param or params object
        if (hasDirectParam) {
          implementation += `${directParamName}, body`;
        } else {
          implementation += `params, body`;
        }

        implementation += `) => \n`;
        implementation += `      serviceHandler(() => \n`;

        // Use the appropriate parameter reference in the endpoint call
        if (hasDirectParam) {
          implementation += `        request().post(endpoints.${tag.toUpperCase()}.${endpointKey}(${directParamName}), body)\n`;
        } else {
          implementation += `        request().post(endpoints.${tag.toUpperCase()}.${endpointKey}(params.${
            operation.pathParams[0]
          }), body)\n`;
        }

        implementation += `      ),\n`;
      } else {
        // POST without path param
        implementation = `    ${methodName}: (body) => \n`;
        implementation += `      serviceHandler(() => \n`;
        implementation += `        request().post(endpoints.${tag.toUpperCase()}.${endpointKey}(), body)\n`;
        implementation += `      ),\n`;
      }
      break;

    case "put":
      if (operation.pathParams.length > 0) {
        // PUT with path param
        implementation = `    ${methodName}: (`;

        // Handle parameters based on whether we have a direct param or params object
        if (hasDirectParam) {
          implementation += `${directParamName}, body`;
        } else {
          implementation += `params, body`;
        }

        implementation += `) => \n`;
        implementation += `      serviceHandler(() => \n`;

        // Use the appropriate parameter reference in the endpoint call
        if (hasDirectParam) {
          implementation += `        request().put(endpoints.${tag.toUpperCase()}.${endpointKey}(${directParamName}), body)\n`;
        } else {
          implementation += `        request().put(endpoints.${tag.toUpperCase()}.${endpointKey}(params.${
            operation.pathParams[0]
          }), body)\n`;
        }

        implementation += `      ),\n`;
      } else {
        // PUT without path param
        implementation = `    ${methodName}: (body) => \n`;
        implementation += `      serviceHandler(() => \n`;
        implementation += `        request().put(endpoints.${tag.toUpperCase()}.${endpointKey}(), body)\n`;
        implementation += `      ),\n`;
      }
      break;

    case "delete":
      if (operation.pathParams.length > 0) {
        // For DELETE operations, we already may have simplified param handling
        if (hasDirectParam) {
          // Simple DELETE with single ID
          implementation = `    ${methodName}: (${directParamName}) => \n`;
          implementation += `      serviceHandler(() => \n`;
          implementation += `        request().delete(endpoints.${tag.toUpperCase()}.${endpointKey}(${directParamName}))\n`;
          implementation += `      ),\n`;
        } else {
          // DELETE with complex params
          implementation = `    ${methodName}: (params) => \n`;
          implementation += `      serviceHandler(() => \n`;
          implementation += `        request().delete(endpoints.${tag.toUpperCase()}.${endpointKey}(params.${
            operation.pathParams[0]
          }))\n`;
          implementation += `      ),\n`;
        }
      } else {
        // DELETE without params
        implementation = `    ${methodName}: () => \n`;
        implementation += `      serviceHandler(() => \n`;
        implementation += `        request().delete(endpoints.${tag.toUpperCase()}.${endpointKey}())\n`;
        implementation += `      ),\n`;
      }
      break;

    default:
      // Other HTTP methods
      implementation = `    ${methodName}: (params) => \n`;
      implementation += `      serviceHandler(() => \n`;
      implementation += `        request().${httpMethod}(endpoints.${tag.toUpperCase()}.${endpointKey}(), params)\n`;
      implementation += `      ),\n`;
  }

  return implementation;
}

module.exports = {
  generateServiceSection,
  generateMethodImplementation,
};
