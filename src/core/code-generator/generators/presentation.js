/**
 * Presentation Generator Module
 *
 * Generates React Query hooks for API operations based on Swagger/OpenAPI specifications.
 */
const { pascalCase, camelCase } = require("../../utils/stringUtils");

/**
 * Generate the presentation section with React Query hooks
 * @param {string} tag - Tag name
 * @param {Array} operations - Array of operations
 * @returns {string} Generated presentation code
 */
function generatePresentationSection(tag, operations) {
  const serviceName = `${pascalCase(tag)}Service`;
  const presentationName = `${pascalCase(tag)}Presentation`;

  let output = `// React Query hooks for ${tag}\n`;
  output += `function ${presentationName}() {\n`;
  output += `  const Service = ${serviceName}();\n\n`;
  output += `  return {\n`;

  // Generate hooks for each operation
  operations.forEach((operation) => {
    const methodName = operation.methodName;
    const isGet = operation.method === "GET";
    const hookName = `use${pascalCase(methodName)}`;

    if (isGet) {
      // Generate useQuery hook
      output += generateQueryHook(operation, methodName, tag);
    } else {
      // Generate useMutation hook
      output += generateMutationHook(operation, methodName);
    }
  });

  // Remove trailing comma and close the object and function
  output = output.replace(/,\n$/, "\n");
  output += `  };\n`;
  output += `}\n`;

  return output;
}

/**
 * Generate a useQuery hook for GET operations
 * @param {Object} operation - Operation object
 * @param {string} methodName - Method name
 * @param {string} tag - Tag name
 * @returns {string} Generated hook code
 */
function generateQueryHook(operation, methodName, tag) {
  let output = "";
  const hookName = `use${pascalCase(methodName)}`;
  const queryKeyBase = `'${tag.toLowerCase()}-${methodName}'`;

  // Handle parameters
  if (operation.directParam) {
    // For simple ID parameter
    output += `    ${hookName}: (${operation.directParam.name}) => {\n`;
    output += `      return useQuery({\n`;
    output += `        queryKey: [${queryKeyBase}, ${operation.directParam.name}],\n`;
    output += `        queryFn: () => Service.${methodName}(${operation.directParam.name}),\n`;
    output += `      });\n`;
    output += `    },\n\n`;
  } else if (operation.paramsInterface) {
    // For complex parameters
    output += `    ${hookName}: (params) => {\n`;
    output += `      return useQuery({\n`;
    output += `        queryKey: [${queryKeyBase}, ...Object.values(params)],\n`;
    output += `        queryFn: () => Service.${methodName}(params),\n`;
    output += `      });\n`;
    output += `    },\n\n`;
  } else {
    // For no parameters or simple parameters
    output += `    ${hookName}: () => {\n`;
    output += `      return useQuery({\n`;
    output += `        queryKey: [${queryKeyBase}],\n`;
    output += `        queryFn: () => Service.${methodName}(),\n`;
    output += `      });\n`;
    output += `    },\n\n`;
  }

  return output;
}

/**
 * Generate a useMutation hook for non-GET operations
 * @param {Object} operation - Operation object
 * @param {string} methodName - Method name
 * @returns {string} Generated hook code
 */
function generateMutationHook(operation, methodName) {
  let output = "";
  const hookName = `use${pascalCase(methodName)}`;

  // Generate mutation signature based on parameters
  if (
    operation.directParam &&
    ["PUT", "POST", "PATCH"].includes(operation.method)
  ) {
    // For operations with ID and body
    output += `    ${hookName}: () => {\n`;
    output += `      return useMutation({\n`;
    output += `        mutationFn: (params: { ${operation.directParam.name}: ${operation.directParam.type}, body: any }) => {\n`;
    output += `          return Service.${methodName}(params.${operation.directParam.name}, params.body);\n`;
    output += `        },\n`;
    output += `      });\n`;
    output += `    },\n\n`;
  } else if (operation.directParam) {
    // For simple ID parameter (like DELETE)
    output += `    ${hookName}: () => {\n`;
    output += `      return useMutation({\n`;
    output += `        mutationFn: (${operation.directParam.name}: ${operation.directParam.type}) => {\n`;
    output += `          return Service.${methodName}(${operation.directParam.name});\n`;
    output += `        },\n`;
    output += `      });\n`;
    output += `    },\n\n`;
  } else if (operation.bodyInterface) {
    // For operations with just a body
    output += `    ${hookName}: () => {\n`;
    output += `      return useMutation({\n`;
    output += `        mutationFn: (body: ${operation.bodyInterface}) => {\n`;
    output += `          return Service.${methodName}(body);\n`;
    output += `        },\n`;
    output += `      });\n`;
    output += `    },\n\n`;
  } else {
    // Default case
    output += `    ${hookName}: () => {\n`;
    output += `      return useMutation({\n`;
    output += `        mutationFn: (params: any) => {\n`;
    output += `          return Service.${methodName}(params);\n`;
    output += `        },\n`;
    output += `      });\n`;
    output += `    },\n\n`;
  }

  return output;
}

module.exports = {
  generatePresentationSection,
};
