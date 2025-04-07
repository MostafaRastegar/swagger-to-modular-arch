// Interface generation utilities
const { pascalCase, camelCase } = require("../utils/stringUtils");
const {
  getTypeFromSchema,
  checkForPagination,
  collectNeededSchemas,
} = require("../parsers/schemaParser");

/**
 * Generate the interfaces section
 * @param {string} tag - Tag name
 * @param {Array} operations - Array of operations
 * @param {Object} swagger - Swagger object
 * @param {Map} allSchemas - Map of all schemas
 * @returns {string} Generated interfaces code
 */
function generateInterfacesSection(tag, operations, swagger, allSchemas) {
  let output = "";

  // Add common interfaces
  output += generateCommonInterfaces();

  // Extract and generate response schemas first to make sure they're available
  output += generateResponseSchemas(operations, swagger, allSchemas);

  // Collect all needed schemas
  const { neededSchemas, generatedSchemas } = collectNeededSchemas(
    operations,
    allSchemas
  );

  // Generate model interfaces
  output += generateModelInterfaces(
    neededSchemas,
    allSchemas,
    generatedSchemas
  );

  // Generate parameter interfaces
  output += generateParamInterfaces(operations, allSchemas, generatedSchemas);

  // Generate request body interfaces
  output += generateRequestBodyInterfaces(
    operations,
    allSchemas,
    generatedSchemas
  );

  // Generate service interface
  output += generateServiceInterface(tag, operations, swagger, allSchemas);

  return output;
}

/**
 * Generate common interface definitions
 * @returns {string} Generated common interfaces
 */
function generateCommonInterfaces() {
  return `// Common response wrapper
interface ResponseObject<T> {
  data: T;
}

// Pagination parameters
interface PaginationParams {
  page?: number;
  page_size?: number;
}

// Paginated response
interface PaginationList<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

`;
}

/**
 * Generate response schema interfaces
 * @param {Array} operations - Array of operations
 * @param {Object} swagger - Swagger object
 * @param {Map} allSchemas - Map of all schemas
 * @returns {string} Generated response interfaces
 */
function generateResponseSchemas(operations, swagger, allSchemas) {
  const generatedSchemas = new Set();
  let output = `// Response interfaces\n`;

  operations.forEach((operation) => {
    // Check for success responses (200, 201)
    for (const code of ["200", "201"]) {
      if (operation.responses[code] && operation.responses[code].content) {
        const content = Object.values(operation.responses[code].content)[0];
        if (!content || !content.schema) continue;

        const schema = content.schema;

        // Handle paginated responses with inline schema
        if (
          schema.type === "object" &&
          schema.properties &&
          schema.properties.results
        ) {
          // Generate interface for the pagination container
          const containerInterfaceName = `${pascalCase(
            operation.operationId
          )}Response`;

          // Generate the item interface
          const itemInterfaceName = `${pascalCase(
            operation.operationId
          )}ResponseItem`;

          // Extract the item schema from results array
          const resultsSchema = schema.properties.results;
          if (resultsSchema.type === "array" && resultsSchema.items) {
            let itemSchema = resultsSchema.items;

            // Generate item interface if it's an inline object
            if (!itemSchema.$ref && itemSchema.type === "object") {
              if (!generatedSchemas.has(itemInterfaceName)) {
                output += `interface ${itemInterfaceName} {\n`;

                if (itemSchema.properties) {
                  Object.entries(itemSchema.properties).forEach(
                    ([propName, propSchema]) => {
                      const required =
                        itemSchema.required &&
                        itemSchema.required.includes(propName)
                          ? ""
                          : "?";
                      const propType = getTypeFromSchema(
                        propSchema,
                        allSchemas
                      );
                      output += `  ${propName}${required}: ${propType};\n`;
                    }
                  );
                }

                output += `}\n\n`;
                generatedSchemas.add(itemInterfaceName);
              }

              // Store for return type generation
              operation.responseItemInterface = itemInterfaceName;
            }
            // Handle referenced schema
            else if (itemSchema.$ref) {
              const refType = itemSchema.$ref.split("/").pop();
              operation.responseItemInterface = refType;
            }
          }

          // Store the item interface name for direct use in return types
          operation.responsePaginationInterface = false; // Don't use a container type
          operation.responseItemInterface =
            operation.responseItemInterface || "any";
        }
        // Handle non-paginated response with inline schema
        else if (!schema.$ref && schema.type === "object") {
          const interfaceName = `${pascalCase(operation.operationId)}Response`;

          // Generate interface for the schema
          if (!generatedSchemas.has(interfaceName)) {
            output += `interface ${interfaceName} {\n`;

            if (schema.properties) {
              Object.entries(schema.properties).forEach(
                ([propName, propSchema]) => {
                  const required =
                    schema.required && schema.required.includes(propName)
                      ? ""
                      : "?";
                  const propType = getTypeFromSchema(propSchema, allSchemas);
                  output += `  ${propName}${required}: ${propType};\n`;
                }
              );
            }

            output += `}\n\n`;
            generatedSchemas.add(interfaceName);
          }

          operation.responseInterface = interfaceName;
        }
        // Handle schema reference
        else if (schema.$ref) {
          const typeName = schema.$ref.split("/").pop();
          operation.responseInterface = typeName;
        }
      }
    }
  });

  return output;
}

/**
 * Generate model interfaces
 * @param {Set} neededSchemas - Set of needed schema names
 * @param {Map} allSchemas - Map of all schemas
 * @param {Set} generatedSchemas - Set of generated schema names
 * @returns {string} Generated model interfaces
 */
function generateModelInterfaces(neededSchemas, allSchemas, generatedSchemas) {
  let output = `// Model interfaces\n`;

  // Generate all explicitly referenced schemas
  neededSchemas.forEach((schemaName) => {
    if (!generatedSchemas.has(schemaName)) {
      const schema = allSchemas.get(schemaName);
      if (schema) {
        output += generateModelInterface(
          schemaName,
          schema,
          allSchemas,
          generatedSchemas
        );
      } else {
        // Placeholder for missing schema
        output += `interface ${schemaName} {\n  // Schema not found, generated empty interface\n}\n\n`;
        generatedSchemas.add(schemaName);
      }
    }
  });

  return output;
}

/**
 * Generate a model interface from a schema
 * @param {string} name - Schema name
 * @param {Object} schema - Schema object
 * @param {Map} allSchemas - Map of all schemas
 * @param {Set} generatedSchemas - Set of generated schema names
 * @returns {string} Generated model interface
 */
function generateModelInterface(name, schema, allSchemas, generatedSchemas) {
  let output = "";
  generatedSchemas.add(name);

  // Handle allOf case
  if (schema.allOf) {
    // Merge properties from subschemas
    const { properties, required } = mergeAllOfSchema(
      schema,
      allSchemas,
      generatedSchemas
    );

    // Generate merged interface
    output += `interface ${name} {\n`;
    Object.entries(properties).forEach(([propName, propSchema]) => {
      const isRequired = required.includes(propName);
      const propType = getTypeFromSchema(propSchema, allSchemas);
      output += `  ${propName}${isRequired ? "" : "?"}: ${propType};\n`;
    });
    output += `}\n\n`;
  }
  // Handle object case
  else if (schema.type === "object" || schema.properties) {
    output += `interface ${name} {\n`;
    if (schema.properties) {
      Object.entries(schema.properties).forEach(([propName, propSchema]) => {
        const required =
          schema.required && schema.required.includes(propName) ? "" : "?";
        const type = getTypeFromSchema(propSchema, allSchemas);
        output += `  ${propName}${required}: ${type};\n`;
      });
    }
    output += `}\n\n`;
  }
  // Handle array case
  else if (schema.type === "array" && schema.items) {
    const itemType = getTypeFromSchema(schema.items, allSchemas);
    output += `type ${name} = ${itemType}[];\n\n`;
  }
  // Handle enum case
  else if (schema.enum) {
    const values = schema.enum
      .map((v) => (typeof v === "string" ? `'${v}'` : v))
      .join(" | ");
    output += `type ${name} = ${values};\n\n`;
  }
  // Handle simple type case
  else {
    const type = getTypeFromSchema(schema, allSchemas);
    output += `type ${name} = ${type};\n\n`;
  }

  return output;
}

/**
 * Merge properties from allOf schemas
 * @param {Object} schema - Schema object
 * @param {Map} allSchemas - Map of all schemas
 * @param {Set} generatedSchemas - Set of generated schema names
 * @returns {Object} Merged properties and required fields
 */
function mergeAllOfSchema(schema, allSchemas, generatedSchemas) {
  const properties = {};
  const required = [];

  schema.allOf.forEach((subSchema) => {
    if (subSchema.$ref) {
      const refName = subSchema.$ref.split("/").pop();
      const refSchema = allSchemas.get(refName);

      // Generate referenced schema if needed
      if (refSchema && !generatedSchemas.has(refName)) {
        generateModelInterface(
          refName,
          refSchema,
          allSchemas,
          generatedSchemas
        );
      }
    }

    // Merge in properties and required fields
    if (subSchema.properties) {
      Object.entries(subSchema.properties).forEach(([prop, propSchema]) => {
        properties[prop] = propSchema;
      });
    }

    if (subSchema.required) {
      required.push(...subSchema.required);
    }
  });

  return { properties, required };
}

/**
 * Generate parameter interfaces
 * @param {Array} operations - Array of operations
 * @param {Map} allSchemas - Map of all schemas
 * @param {Set} generatedSchemas - Set of generated schema names
 * @returns {string} Generated parameter interfaces
 */
function generateParamInterfaces(operations, allSchemas, generatedSchemas) {
  let output = `\n// Parameter interfaces\n`;

  operations.forEach((operation) => {
    // Check if operation needs a parameter interface
    const hasPathParams = operation.pathParams.length > 0;
    const queryParams = operation.parameters
      ? operation.parameters.filter((p) => p.in === "query")
      : [];

    if (hasPathParams || queryParams.length > 0) {
      // Special case: only one path param (like an ID) and no query params
      if (
        hasPathParams &&
        operation.pathParams.length === 1 &&
        queryParams.length === 0
      ) {
        const pathParam = operation.pathParams[0];
        const paramDef = operation.parameters
          ? operation.parameters.find(
              (p) => p.name === pathParam && p.in === "path"
            )
          : null;

        const type =
          paramDef && paramDef.schema
            ? getTypeFromSchema(paramDef.schema, allSchemas)
            : "number";

        // Store the param name and type for direct usage in service generation
        operation.directParam = {
          name: pathParam,
          type: type,
        };
        operation.paramsInterface = null; // Indicate we're using direct param
      } else {
        // Use a regular param interface for more complex cases
        const interfaceName = getParamInterfaceName(operation);

        // Skip if already generated
        if (generatedSchemas.has(interfaceName)) return;

        output += `interface ${interfaceName} {\n`;

        // Add path parameters
        operation.pathParams.forEach((param) => {
          const paramDef = operation.parameters
            ? operation.parameters.find(
                (p) => p.name === param && p.in === "path"
              )
            : null;

          const type =
            paramDef && paramDef.schema
              ? getTypeFromSchema(paramDef.schema, allSchemas)
              : "number | string";

          output += `  ${param}: ${type};\n`;
        });

        // Add query parameters
        queryParams.forEach((param) => {
          const required = param.required ? "" : "?";
          const type = param.schema
            ? getTypeFromSchema(param.schema, allSchemas)
            : "any";
          output += `  ${param.name}${required}: ${type};\n`;
        });

        output += `}\n\n`;
        generatedSchemas.add(interfaceName);

        // Store for service generation
        operation.paramsInterface = interfaceName;
      }
    }
  });

  return output;
}

/**
 * Generate request body interfaces
 * @param {Array} operations - Array of operations
 * @param {Map} allSchemas - Map of all schemas
 * @param {Set} generatedSchemas - Set of generated schema names
 * @returns {string} Generated request body interfaces
 */
function generateRequestBodyInterfaces(
  operations,
  allSchemas,
  generatedSchemas
) {
  let output = `// Request body interfaces\n`;

  operations
    .filter((op) => op.requestBody && op.requestBody.content)
    .forEach((operation) => {
      const contentType = Object.keys(operation.requestBody.content)[0];
      const bodyContent = operation.requestBody.content[contentType];

      if (!bodyContent || !bodyContent.schema) return;

      const interfaceName = getRequestBodyInterfaceName(operation);

      // Skip if already generated
      if (generatedSchemas.has(interfaceName)) return;

      // Check if it's a reference to an existing schema
      if (bodyContent.schema.$ref) {
        const refType = bodyContent.schema.$ref.split("/").pop();
        output += `type ${interfaceName} = ${refType};\n\n`;
        operation.bodyInterface = interfaceName;
        generatedSchemas.add(interfaceName);
        return;
      }

      // Handle inline schema
      output += `interface ${interfaceName} {\n`;

      if (bodyContent.schema.properties) {
        Object.entries(bodyContent.schema.properties).forEach(
          ([prop, propSchema]) => {
            const required =
              bodyContent.schema.required &&
              bodyContent.schema.required.includes(prop)
                ? ""
                : "?";
            const type = getTypeFromSchema(propSchema, allSchemas);
            output += `  ${prop}${required}: ${type};\n`;
          }
        );
      }

      output += `}\n\n`;
      operation.bodyInterface = interfaceName;
      generatedSchemas.add(interfaceName);
    });

  return output;
}

/**
 * Generate service interface
 * @param {string} tag - Tag name
 * @param {Array} operations - Array of operations
 * @param {Object} swagger - Swagger object
 * @param {Map} allSchemas - Map of all schemas
 * @returns {string} Generated service interface
 */
function generateServiceInterface(tag, operations, swagger, allSchemas) {
  let output = `// Service interface\ninterface I${pascalCase(tag)}Service {\n`;

  operations.forEach((operation) => {
    const methodName = camelCase(operation.operationId);
    operation.methodName = methodName; // Store for implementation

    // Collect method parameters
    const methodParams = [];

    // Add operation parameters
    if (operation.directParam) {
      // For simple cases with a single ID parameter
      methodParams.push(
        `${operation.directParam.name}: ${operation.directParam.type}`
      );
    } else if (operation.paramsInterface) {
      // For complex parameter interfaces
      methodParams.push(`params: ${operation.paramsInterface}`);
    } else if (operation.pathParams.length > 0) {
      // Fallback: Use path params directly
      operation.pathParams.forEach((param) => {
        const paramDef = operation.parameters
          ? operation.parameters.find(
              (p) => p.name === param && p.in === "path"
            )
          : null;

        const type =
          paramDef && paramDef.schema
            ? getTypeFromSchema(paramDef.schema, allSchemas)
            : "number | string";

        methodParams.push(`${param}: ${type}`);
      });
    }

    // Add body parameter for non-GET operations
    if (
      operation.bodyInterface &&
      ["POST", "PUT", "PATCH"].includes(operation.method)
    ) {
      methodParams.push(`body: ${operation.bodyInterface}`);
    }

    // Get return type
    const returnType = getReturnType(operation, swagger, allSchemas);

    // Generate method signature
    output += `  ${methodName}(${methodParams.join(", ")}): ${returnType};\n`;
  });

  output += `}\n`;
  return output;
}

/**
 * Get parameter interface name for an operation
 * @param {Object} operation - Operation object
 * @returns {string} Parameter interface name
 */
function getParamInterfaceName(operation) {
  return `${pascalCase(operation.operationId)}Params`;
}

/**
 * Get request body interface name for an operation
 * @param {Object} operation - Operation object
 * @returns {string} Request body interface name
 */
function getRequestBodyInterfaceName(operation) {
  return `${pascalCase(operation.operationId)}Request`;
}

/**
 * Get return type for an operation
 * @param {Object} operation - Operation object
 * @param {Object} swagger - Swagger object
 * @param {Map} allSchemas - Map of all schemas
 * @returns {string} Return type
 */
function getReturnType(operation, swagger, allSchemas) {
  // Check if operation has DELETE method (returns void)
  if (operation.method === "DELETE") {
    return "Promise<void>";
  }

  // Check if paginated
  const hasPagination = checkForPagination(operation);

  // Check for success responses
  for (const code of ["200", "201"]) {
    if (operation.responses[code] && operation.responses[code].content) {
      const content = Object.values(operation.responses[code].content)[0];
      if (!content || !content.schema) continue;

      // Handle paginated response
      if (
        hasPagination &&
        ((content.schema.$ref && content.schema.$ref.includes("Paginated")) ||
          (content.schema.properties && content.schema.properties.results))
      ) {
        // Use the item type directly if available
        if (operation.responseItemInterface) {
          return `Promise<ResponseObject<PaginationList<${operation.responseItemInterface}>>>`;
        }

        // Otherwise handle based on the schema
        return handlePaginatedReturnType(content.schema, allSchemas);
      }

      // Handle regular response
      if (operation.responseInterface) {
        return `Promise<ResponseObject<${operation.responseInterface}>>`;
      }

      return handleRegularReturnType(content.schema, allSchemas);
    }
  }

  // Default case
  return "Promise<ResponseObject<any>>";
}

/**
 * Handle return type for paginated responses
 * @param {Object} schema - Schema object
 * @param {Map} allSchemas - Map of all schemas
 * @returns {string} Return type
 */
function handlePaginatedReturnType(schema, allSchemas) {
  if (schema.$ref) {
    const typeName = schema.$ref.split("/").pop();
    return `Promise<ResponseObject<${typeName}>>`;
  }

  // Extract item type from schema
  let itemType = "any";
  if (schema.properties && schema.properties.results) {
    const resultsSchema = schema.properties.results;
    if (resultsSchema.type === "array" && resultsSchema.items) {
      if (resultsSchema.items.$ref) {
        itemType = resultsSchema.items.$ref.split("/").pop();
      } else {
        itemType = getTypeFromSchema(resultsSchema.items, allSchemas);
      }
    }
  }

  return `Promise<ResponseObject<PaginationList<${itemType}>>>`;
}

/**
 * Handle return type for regular (non-paginated) responses
 * @param {Object} schema - Schema object
 * @param {Map} allSchemas - Map of all schemas
 * @returns {string} Return type
 */
function handleRegularReturnType(schema, allSchemas) {
  if (schema.$ref) {
    const typeName = schema.$ref.split("/").pop();
    return `Promise<ResponseObject<${typeName}>>`;
  }

  if (schema.type === "array" && schema.items) {
    const itemType = schema.items.$ref
      ? schema.items.$ref.split("/").pop()
      : getTypeFromSchema(schema.items, allSchemas);

    return `Promise<ResponseObject<${itemType}[]>>`;
  }

  return `Promise<ResponseObject<${getTypeFromSchema(schema, allSchemas)}>>`;
}

module.exports = {
  generateInterfacesSection,
  getParamInterfaceName,
  getRequestBodyInterfaceName,
  generateServiceInterface,
};
