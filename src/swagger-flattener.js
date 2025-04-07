/**
 * Swagger JSON Flattener
 *
 * This script takes a Swagger JSON file and inlines all $ref references.
 * Then it removes the components section.
 */

const fs = require("fs");
const path = require("path");

// If the input file path is not provided as an argument
if (process.argv.length < 3) {
  console.log("Please provide the path to the Swagger JSON file");
  console.log("Example: node swagger-flattener.js ./swagger.json");
  process.exit(1);
}

// Read the input and output file paths
const inputFilePath = process.argv[2];
const outputFilePath = process.argv[3] || "flattened-swagger.json";

// Read and parse the JSON file
try {
  const swaggerJson = JSON.parse(fs.readFileSync(inputFilePath, "utf8"));

  // Start processing
  console.log("Starting to process the Swagger JSON file...");

  // Save a copy of components/schemas for later reference
  const schemas = swaggerJson.components?.schemas || {};

  // Prepare an object to track processed references to avoid infinite loops
  const processedRefs = new Set();

  // Process the entire document to find and replace $ref references
  console.log("Replacing $ref references...");
  const result = resolveReferences(swaggerJson, schemas, processedRefs);

  // Remove the components section from the output
  console.log("Removing the components section...");
  if (result.components) {
    delete result.components;
  }

  // Write the result to the output file
  console.log(`Writing output to file ${outputFilePath}...`);
  fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2), "utf8");

  console.log("Processing completed successfully!");
} catch (error) {
  console.error("Error processing file:", error.message);
  process.exit(1);
}

/**
 * Replace all $ref references in an object with their actual content
 *
 * @param {Object} obj - The input object to process
 * @param {Object} schemas - The schemas repository for reference lookup
 * @param {Set} processedRefs - A set of processed references to avoid infinite loops
 * @param {Array} refPath - The current path for tracking circular references
 * @returns {Object} - The processed object
 */
function resolveReferences(obj, schemas, processedRefs, refPath = []) {
  // If the input value is an array, process each element
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      resolveReferences(item, schemas, processedRefs, refPath)
    );
  }

  // If the input value is not an object, return it unchanged
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // If the object contains a $ref, replace it
  if (obj.$ref && typeof obj.$ref === "string") {
    const refValue = obj.$ref;

    // If this reference has already been processed in the current path, it's likely a circular reference
    const refPathKey = JSON.stringify(refPath.concat(refValue));
    if (processedRefs.has(refPathKey)) {
      console.warn(`Warning: Circular reference detected: ${refValue}`);
      return { ...obj }; // Return a copy without resolving the reference
    }

    // Add this reference to the set of processed references
    processedRefs.add(refPathKey);

    // Process internal references to components/schemas
    if (refValue.startsWith("#/components/schemas/")) {
      const schemaName = refValue.replace("#/components/schemas/", "");
      if (schemas[schemaName]) {
        // Create a copy of the schema and resolve its internal references
        const resolvedSchema = resolveReferences(
          JSON.parse(JSON.stringify(schemas[schemaName])),
          schemas,
          processedRefs,
          refPath.concat(refValue)
        );

        // Merge additional properties (such as description) that may be present in the original object
        const otherProps = { ...obj };
        delete otherProps.$ref;

        return { ...resolvedSchema, ...otherProps };
      } else {
        console.warn(`Warning: Schema with name ${schemaName} not found`);
      }
    }

    // If the reference is external or not found, leave it unchanged
    return obj;
  }

  // Recursively process all properties of the object
  const result = {};
  for (const key in obj) {
    result[key] = resolveReferences(
      obj[key],
      schemas,
      processedRefs,
      refPath.concat(key)
    );
  }

  return result;
}
