/**
 * Schema comparator
 *
 * Compares schema definitions between specifications to detect breaking changes
 */

/**
 * Compare schemas between two API specifications
 * @param {Object} oldSpec - Old API specification
 * @param {Object} newSpec - New API specification
 * @param {Object} report - Report to update
 */
function compareSchemas(oldSpec, newSpec, report) {
  const oldSchemas = oldSpec.components?.schemas || {};
  const newSchemas = newSpec.components?.schemas || {};

  // Check for removed schemas
  Object.keys(oldSchemas).forEach((schemaName) => {
    if (!newSchemas[schemaName]) {
      report.critical.push({
        type: "SCHEMA_REMOVED",
        schema: schemaName,
        message: `Schema '${schemaName}' removed`,
        impact: "API operations using this schema will break",
        recommendation: `Consider keeping the schema and marking it as deprecated`,
      });
    } else {
      // Compare schema definitions
      compareSchemaObjects(
        oldSchemas[schemaName],
        newSchemas[schemaName],
        `schema '${schemaName}'`,
        "",
        "",
        report
      );
    }
  });
}

/**
 * Compare schema objects for breaking changes
 * @param {Object} oldSchema - Old schema
 * @param {Object} newSchema - New schema
 * @param {string} context - Description of what is being compared
 * @param {string} path - API path (if applicable)
 * @param {string} method - HTTP method (if applicable)
 * @param {Object} report - Report to update
 */
function compareSchemaObjects(
  oldSchema,
  newSchema,
  context,
  path,
  method,
  report
) {
  if (!oldSchema || !newSchema) return;

  // Handle schema references
  if (oldSchema.$ref && newSchema.$ref) {
    // This is simplified - in a full implementation, we would resolve references
    if (oldSchema.$ref !== newSchema.$ref) {
      report.warning.push({
        type: "SCHEMA_REFERENCE_CHANGED",
        path,
        method: method.toUpperCase(),
        context,
        oldRef: oldSchema.$ref,
        newRef: newSchema.$ref,
        message: `Schema reference changed in ${context} from ${oldSchema.$ref} to ${newSchema.$ref}`,
        impact: "Clients expecting the old schema structure may break",
        recommendation: `Ensure the new reference maintains backward compatibility with the old reference`,
      });
    }
    return;
  }

  // Handle type changes
  if (oldSchema.type && newSchema.type && oldSchema.type !== newSchema.type) {
    report.critical.push({
      type: "SCHEMA_TYPE_CHANGED",
      path,
      method: method ? method.toUpperCase() : "",
      context,
      oldType: oldSchema.type,
      newType: newSchema.type,
      message: `Schema type changed in ${context} from '${oldSchema.type}' to '${newSchema.type}'`,
      impact: "Clients expecting the old type will break",
      recommendation: `Consider maintaining the same type or introducing versioning`,
    });
    return;
  }

  // Handle object properties
  if (oldSchema.type === "object" && newSchema.type === "object") {
    const oldProps = oldSchema.properties || {};
    const newProps = newSchema.properties || {};
    const oldRequired = oldSchema.required || [];
    const newRequired = newSchema.required || [];

    // Check for removed properties
    Object.keys(oldProps).forEach((prop) => {
      if (!newProps[prop]) {
        if (oldRequired.includes(prop)) {
          report.critical.push({
            type: "REQUIRED_PROPERTY_REMOVED",
            path,
            method: method ? method.toUpperCase() : "",
            context,
            property: prop,
            message: `Required property '${prop}' removed from ${context}`,
            impact: "Clients expecting this property will break",
            recommendation: `Consider keeping the property or introducing versioning`,
          });
        } else {
          report.warning.push({
            type: "OPTIONAL_PROPERTY_REMOVED",
            path,
            method: method ? method.toUpperCase() : "",
            context,
            property: prop,
            message: `Optional property '${prop}' removed from ${context}`,
            impact: "Clients using this property may break",
            recommendation: `Consider keeping the property for backward compatibility`,
          });
        }
      } else {
        // Recursively compare property schemas
        compareSchemaObjects(
          oldProps[prop],
          newProps[prop],
          `${context} property '${prop}'`,
          path,
          method,
          report
        );
      }
    });

    // Check for properties that became required
    newRequired.forEach((prop) => {
      if (oldProps[prop] && !oldRequired.includes(prop)) {
        report.critical.push({
          type: "PROPERTY_BECAME_REQUIRED",
          path,
          method: method ? method.toUpperCase() : "",
          context,
          property: prop,
          message: `Property '${prop}' became required in ${context}`,
          impact: "Clients not providing this property will break",
          recommendation: `Consider keeping the property optional with backward compatible defaults`,
        });
      }
    });

    // Check for new required properties
    newRequired.forEach((prop) => {
      if (!oldProps[prop]) {
        report.critical.push({
          type: "NEW_REQUIRED_PROPERTY",
          path,
          method: method ? method.toUpperCase() : "",
          context,
          property: prop,
          message: `New required property '${prop}' added to ${context}`,
          impact:
            "Existing clients will not provide this property and will break",
          recommendation: `Consider making the property optional with backward compatible defaults`,
        });
      }
    });
  }

  // Handle array item changes
  if (oldSchema.type === "array" && newSchema.type === "array") {
    compareSchemaObjects(
      oldSchema.items,
      newSchema.items,
      `${context} array items`,
      path,
      method,
      report
    );
  }

  // Handle enum changes
  if (oldSchema.enum && newSchema.enum) {
    const removedValues = oldSchema.enum.filter(
      (v) => !newSchema.enum.includes(v)
    );
    if (removedValues.length > 0) {
      report.critical.push({
        type: "ENUM_VALUES_REMOVED",
        path,
        method: method ? method.toUpperCase() : "",
        context,
        removedValues,
        message: `Enum values [${removedValues.join(
          ", "
        )}] removed from ${context}`,
        impact: "Clients sending these enum values will break",
        recommendation: `Consider keeping support for these enum values`,
      });
    }
  }
}

module.exports = {
  compareSchemas,
  compareSchemaObjects,
};
