/**
 * Recommendation generator
 *
 * Generates API migration recommendations based on detected breaking changes
 */

/**
 * Generate recommendations for addressing breaking changes
 * @param {Object} report - Report to update with recommendations
 */
function generateRecommendations(report) {
  if (report.critical.length > 0 || report.warning.length > 0) {
    // General versioning recommendation
    report.suggestions.push({
      title: "API Versioning",
      description:
        "Consider implementing versioning for your API to maintain backward compatibility.",
      options: [
        "URL path versioning (e.g., /v1/resource, /v2/resource)",
        "Query parameter versioning (e.g., /resource?version=1)",
        "Header versioning (e.g., Accept: application/vnd.api+json;version=1)",
        "Content negotiation (e.g., Accept: application/vnd.api.v1+json)",
      ],
    });

    // Deprecation recommendation
    report.suggestions.push({
      title: "Deprecation Strategy",
      description:
        "Before removing endpoints or changing behavior, use deprecation notices to inform API consumers.",
      options: [
        'Add "Deprecated" header to responses',
        "Add deprecation notices in API documentation",
        "Keep deprecated endpoints for at least one release cycle",
        "Maintain backward compatibility with defaults",
      ],
    });
  }

  // If we have specific types of breaking changes, add targeted recommendations
  const criticalTypes = report.critical.map((c) => c.type);

  if (
    criticalTypes.includes("ENDPOINT_REMOVED") ||
    criticalTypes.includes("METHOD_REMOVED")
  ) {
    report.suggestions.push({
      title: "Endpoint Preservation",
      description:
        "Avoid removing endpoints or HTTP methods that clients may depend on.",
      options: [
        "Keep old endpoints but mark them as deprecated",
        "Create new endpoints alongside existing ones",
        "Implement request routing that handles both old and new patterns",
      ],
    });
  }

  if (
    criticalTypes.some(
      (type) => type.includes("PARAM") || type.includes("PROPERTY")
    )
  ) {
    report.suggestions.push({
      title: "Parameter/Property Compatibility",
      description:
        "Maintain compatibility when changing parameters or properties.",
      options: [
        "Keep support for old parameter/property names",
        "Make new required fields optional with sensible defaults",
        "Implement request/response transformation to handle different formats",
      ],
    });
  }

  if (criticalTypes.includes("SCHEMA_TYPE_CHANGED")) {
    report.suggestions.push({
      title: "Schema Type Safety",
      description:
        "Changing the type of a property can break client applications.",
      options: [
        "Create new properties instead of changing existing ones",
        "Support both old and new types during transition",
        "Implement server-side type conversion while warning about deprecation",
      ],
    });
  }
}

module.exports = {
  generateRecommendations,
};
