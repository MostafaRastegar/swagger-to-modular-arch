/**
 * Schema Parser
 *
 * Utilities for parsing and processing Swagger/OpenAPI schemas
 */

/**
 * Extract all schemas from Swagger components
 * @param {Object} swagger - Swagger object
 * @returns {Map} Map of schema name to schema object
 */
function extractAllSchemas(swagger) {
  const schemaMap = new Map();

  if (swagger.components && swagger.components.schemas) {
    Object.entries(swagger.components.schemas).forEach(([name, schema]) => {
      schemaMap.set(name, schema);
    });
  } else if (swagger.definitions) {
    // Support for OpenAPI 2.0 (Swagger)
    Object.entries(swagger.definitions).forEach(([name, schema]) => {
      schemaMap.set(name, schema);
    });
  }

  return schemaMap;
}

/**
 * Recursively collect schemas from a schema object
 * @param {Object} schema - Schema object
 * @param {Set} neededSchemas - Set to collect needed schema names
 */
function collectSchemasFromSchema(schema, neededSchemas) {
  if (!schema) return;

  // Reference case
  if (schema.$ref) {
    const refName = extractRefName(schema.$ref);
    neededSchemas.add(refName);
    return;
  }

  // Array case
  if (schema.type === "array" && schema.items) {
    collectSchemasFromSchema(schema.items, neededSchemas);
    return;
  }

  // Object with properties case
  if (schema.properties) {
    Object.values(schema.properties).forEach((propSchema) => {
      collectSchemasFromSchema(propSchema, neededSchemas);
    });
    return;
  }

  // Object with additionalProperties case
  if (schema.additionalProperties) {
    collectSchemasFromSchema(schema.additionalProperties, neededSchemas);
  }
}

/**
 * Extract reference name from a $ref
 * @param {string} ref - Reference string (e.g. "#/components/schemas/User")
 * @returns {string} Reference name (e.g. "User")
 */
function extractRefName(ref) {
  return ref.split("/").pop();
}

/**
 * Collect all needed schemas from operations
 * @param {Array} operations - Array of operations
 * @param {Map} allSchemas - Map of all schemas
 * @returns {Object} Object with neededSchemas and generatedSchemas
 */
function collectNeededSchemas(operations, allSchemas) {
  const neededSchemas = new Set();
  const generatedSchemas = new Set();

  // Collect schemas from operations
  operations.forEach((operation) => {
    // From responses
    Object.values(operation.responses || {}).forEach((response) => {
      if (response.content) {
        Object.values(response.content).forEach((content) => {
          if (content.schema)
            collectSchemasFromSchema(content.schema, neededSchemas);
        });
      }
    });

    // From request bodies
    if (operation.requestBody && operation.requestBody.content) {
      Object.values(operation.requestBody.content).forEach((content) => {
        if (content.schema)
          collectSchemasFromSchema(content.schema, neededSchemas);
      });
    }

    // From parameters
    (operation.parameters || []).forEach((param) => {
      if (param.schema) collectSchemasFromSchema(param.schema, neededSchemas);
    });
  });

  // Create placeholders for missing schemas
  neededSchemas.forEach((schemaName) => {
    if (!allSchemas.has(schemaName)) {
      console.log(`Creating placeholder for missing schema: ${schemaName}`);
      allSchemas.set(schemaName, {
        type: "object",
        properties: {},
        description: "Auto-generated placeholder for missing schema",
      });
    }
  });

  return { neededSchemas, generatedSchemas };
}

/**
 * Get TypeScript type from schema
 * @param {Object} schema - Schema object
 * @param {Map} allSchemas - Map of all schemas
 * @returns {string} TypeScript type
 */
function getTypeFromSchema(schema, allSchemas) {
  if (!schema) return "any";

  // Handle $ref
  if (schema.$ref) {
    return extractRefName(schema.$ref);
  }

  // Handle arrays
  if (schema.type === "array" && schema.items) {
    const itemType = getTypeFromSchema(schema.items, allSchemas);
    return `${itemType}[]`;
  }

  // Handle enums
  if (schema.enum) {
    return schema.enum
      .map((v) => (typeof v === "string" ? `'${v}'` : v))
      .join(" | ");
  }

  // Handle basic types
  switch (schema.type) {
    case "integer":
    case "number":
      return "number";
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "object":
      if (schema.additionalProperties) {
        const valueType = getTypeFromSchema(
          schema.additionalProperties,
          allSchemas
        );
        return `Record<string, ${valueType}>`;
      }
      return "Record<string, any>";
    default:
      return "any";
  }
}

/**
 * Check if an operation uses pagination
 * @param {Object} operation - Operation object
 * @returns {boolean} Whether the operation uses pagination
 */
function checkForPagination(operation) {
  // Check for pagination parameters
  if (
    operation.parameters &&
    operation.parameters.some(
      (p) => p.name === "page" || p.name === "page_size"
    )
  ) {
    return true;
  }

  // Check response schema for pagination structure
  for (const code of ["200", "201"]) {
    if (operation.responses[code] && operation.responses[code].content) {
      const content = Object.values(operation.responses[code].content)[0];
      if (!content || !content.schema) continue;

      // Direct pagination structure
      if (
        content.schema.properties &&
        content.schema.properties.count !== undefined &&
        content.schema.properties.results !== undefined
      ) {
        return true;
      }

      // Reference to paginated type
      if (content.schema.$ref && content.schema.$ref.includes("Paginated")) {
        return true;
      }
    }
  }

  return false;
}

module.exports = {
  extractAllSchemas,
  collectNeededSchemas,
  collectSchemasFromSchema,
  getTypeFromSchema,
  checkForPagination,
  extractRefName,
};
