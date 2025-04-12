/**
 * Mock Data Generator
 *
 * Utility functions for generating mock data based on schema definitions
 */

/**
 * Generate data from schema
 * @param {Object} schema - Schema object from Swagger
 * @param {number} count - Number of items to generate
 * @returns {Array|Object} Generated data
 */
function generateDataFromSchema(schema, count) {
  // For arrays or array-type items
  if (schema.type === "array") {
    return generateArrayData(schema.items || schema, count);
  }

  // For cases with results property (like paginated responses)
  if (schema.properties && schema.properties.results) {
    return generateArrayData(
      schema.properties.results.items || schema.properties.results,
      count
    );
  }

  // For regular objects
  return generateArrayData(schema, count);
}

/**
 * Generate array of items
 * @param {Object} schema - Schema object
 * @param {number} count - Number of items to generate
 * @returns {Array} Array of generated items
 */
function generateArrayData(schema, count) {
  const items = [];

  for (let i = 1; i <= count; i++) {
    items.push(generateItem(schema, i));
  }

  return items;
}

/**
 * Generate a single item
 * @param {Object} schema - Schema object
 * @param {number} index - Index for consistent ID generation
 * @returns {Object} Generated item
 */
function generateItem(schema, index) {
  const item = { id: index };

  if (schema.properties) {
    Object.keys(schema.properties).forEach((propName) => {
      const propSchema = schema.properties[propName];

      // Skip read-only properties and already set id
      if (propName !== "id" && !propSchema.readOnly) {
        item[propName] = generatePropertyValue(propName, propSchema, index);
      }
    });
  }

  return item;
}

/**
 * Generate property value based on property type
 * @param {string} propName - Property name
 * @param {Object} propSchema - Property schema
 * @param {number} index - Index for consistent value generation
 * @returns {any} Generated property value
 */
function generatePropertyValue(propName, propSchema, index) {
  const type = propSchema.type;

  switch (type) {
    case "integer":
      return generateIntegerValue(propName, propSchema, index);

    case "number":
      return generateNumberValue(propName, propSchema, index);

    case "string":
      return generateStringValue(propName, propSchema, index);

    case "boolean":
      return index % 2 === 0;

    case "array":
      return generateArrayPropertyValue(propName, propSchema, index);

    case "object":
      return generateObjectPropertyValue(propName, propSchema, index);

    default:
      return `${propName}-${index}`;
  }
}

/**
 * Generate integer property value
 * @param {string} propName - Property name
 * @param {Object} propSchema - Property schema
 * @param {number} index - Index for consistent value generation
 * @returns {number} Generated integer
 */
function generateIntegerValue(propName, propSchema, index) {
  const min = propSchema.minimum || 0;
  const max = propSchema.maximum || 1000;
  return min + Math.floor(Math.random() * (max - min)) + index;
}

/**
 * Generate number property value
 * @param {string} propName - Property name
 * @param {Object} propSchema - Property schema
 * @param {number} index - Index for consistent value generation
 * @returns {number} Generated number
 */
function generateNumberValue(propName, propSchema, index) {
  return parseFloat((Math.random() * 100 + index).toFixed(2));
}

/**
 * Generate string property value
 * @param {string} propName - Property name
 * @param {Object} propSchema - Property schema
 * @param {number} index - Index for consistent value generation
 * @returns {string} Generated string
 */
function generateStringValue(propName, propSchema, index) {
  // Priority given to enum
  if (propSchema.enum) {
    return propSchema.enum[index % propSchema.enum.length];
  }

  // For specific formats
  switch (propSchema.format) {
    case "date-time":
      return new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString();

    case "email":
      return `user${index}@example.com`;

    default:
      // For IP address, MAC and similar cases
      if (propName.includes("ip")) {
        return `192.168.${index}.${Math.floor(Math.random() * 255)}`;
      }

      if (propName.includes("mac")) {
        return `00:1A:2B:3C:${index.toString(16).padStart(2, "0")}:${Math.floor(
          Math.random() * 255
        )
          .toString(16)
          .padStart(2, "0")}`;
      }

      return `${propName}-${index}`;
  }
}

/**
 * Generate array property value
 * @param {string} propName - Property name
 * @param {Object} propSchema - Property schema
 * @param {number} index - Index for consistent value generation
 * @returns {Array} Generated array
 */
function generateArrayPropertyValue(propName, propSchema, index) {
  const items = [];
  const itemCount = Math.min(3, Math.floor(Math.random() * 3) + 1);

  for (let i = 0; i < itemCount; i++) {
    items.push(
      generatePropertyValue(`${propName}_item`, propSchema.items || {}, i + 1)
    );
  }

  return items;
}

/**
 * Generate object property value
 * @param {string} propName - Property name
 * @param {Object} propSchema - Property schema
 * @param {number} index - Index for consistent value generation
 * @returns {Object} Generated object
 */
function generateObjectPropertyValue(propName, propSchema, index) {
  const obj = {};

  if (propSchema.properties) {
    Object.keys(propSchema.properties).forEach((key) => {
      obj[key] = generatePropertyValue(key, propSchema.properties[key], index);
    });
  }

  return obj;
}

module.exports = {
  generateDataFromSchema,
  generateArrayData,
  generateItem,
  generatePropertyValue,
  generateIntegerValue,
  generateNumberValue,
  generateStringValue,
  generateArrayPropertyValue,
  generateObjectPropertyValue,
};
