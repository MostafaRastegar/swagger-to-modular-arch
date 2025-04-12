/**
 * Breaking changes detector
 *
 * Core detection logic for API breaking changes
 */
const endpointComparator = require("./comparators/endpoints");
const schemaComparator = require("./comparators/schemas");
const securityComparator = require("./comparators/security");
const recommendationGenerator = require("./utils/recommendations");

/**
 * Detect breaking changes between two API specifications
 * @param {Object} oldSpec - Old API specification
 * @param {Object} newSpec - New API specification
 * @returns {Object} Report of breaking changes
 */
function detectBreakingChanges(oldSpec, newSpec) {
  const report = {
    critical: [],
    warning: [],
    info: [],
    suggestions: [],
  };

  // Compare paths (endpoints)
  endpointComparator.compareEndpoints(oldSpec, newSpec, report);

  // Compare schemas (data models)
  schemaComparator.compareSchemas(oldSpec, newSpec, report);

  // Compare security
  securityComparator.compareSecurity(oldSpec, newSpec, report);

  // Generate recommendations
  recommendationGenerator.generateRecommendations(report);

  return report;
}

module.exports = {
  detectBreakingChanges,
};
