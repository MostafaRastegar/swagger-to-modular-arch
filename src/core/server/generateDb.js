function generateDb(swagger) {
  const db = {};
  const routes = extractRoutes(swagger);

  routes.forEach((route) => {
    const resourceName = extractResourceName(route);
    const responseSchema = findResponseSchema(swagger, route);

    if (responseSchema) {
      db[resourceName] = generateDataFromSchema(responseSchema, 1);
    }
  });

  return db;
}

function extractRoutes(swagger) {
  const routes = [];

  for (const [path, methods] of Object.entries(swagger.paths)) {
    for (const [method, details] of Object.entries(methods)) {
      routes.push({ path, method, details });
    }
  }

  return routes;
}

function extractResourceName(route) {
  // Convert path to resource name by removing numbers and parameters
  const pathSegments = route.path
    .replace(/\{[^}]+\}/g, "") // Remove parameters
    .split("/")
    .filter(Boolean);

  return pathSegments.map((segment) => segment.replace(/-/g, "_")).join("_");
}

function findResponseSchema(swagger, route) {
  const responses = route.details.responses;

  // Priority given to 200 or 201 responses
  const successCodes = ["200", "201"];

  for (const code of successCodes) {
    if (responses[code] && responses[code].content) {
      const contentType = Object.keys(responses[code].content)[0];
      return responses[code].content[contentType].schema;
    }
  }

  return null;
}

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

function generateArrayData(schema, count) {
  const items = [];

  for (let i = 1; i <= count; i++) {
    items.push(generateItem(schema, i));
  }

  return items;
}

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

function generateIntegerValue(propName, propSchema, index) {
  const min = propSchema.minimum || 0;
  const max = propSchema.maximum || 1000;
  return min + Math.floor(Math.random() * (max - min)) + index;
}

function generateNumberValue(propName, propSchema, index) {
  return parseFloat((Math.random() * 100 + index).toFixed(2));
}

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

function generateObjectPropertyValue(propName, propSchema, index) {
  const obj = {};

  if (propSchema.properties) {
    Object.keys(propSchema.properties).forEach((key) => {
      obj[key] = generatePropertyValue(key, propSchema.properties[key], index);
    });
  }

  return obj;
}

module.exports = generateDb;
