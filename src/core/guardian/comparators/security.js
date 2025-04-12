/**
 * Security comparator
 *
 * Compares security definitions between specifications to detect breaking changes
 */

/**
 * Compare security definitions between two API specifications
 * @param {Object} oldSpec - Old API specification
 * @param {Object} newSpec - New API specification
 * @param {Object} report - Report to update
 */
function compareSecurity(oldSpec, newSpec, report) {
  const oldSecurity =
    oldSpec.securityDefinitions || oldSpec.components?.securitySchemes || {};
  const newSecurity =
    newSpec.securityDefinitions || newSpec.components?.securitySchemes || {};

  // Check for removed security definitions
  Object.keys(oldSecurity).forEach((securityName) => {
    if (!newSecurity[securityName]) {
      report.critical.push({
        type: "SECURITY_SCHEME_REMOVED",
        scheme: securityName,
        message: `Security scheme '${securityName}' removed`,
        impact: "Clients using this authentication method will break",
        recommendation: `Consider keeping the security scheme and introducing a new one alongside it`,
      });
    } else {
      // Check for security scheme type changes
      if (oldSecurity[securityName].type !== newSecurity[securityName].type) {
        report.critical.push({
          type: "SECURITY_SCHEME_TYPE_CHANGED",
          scheme: securityName,
          oldType: oldSecurity[securityName].type,
          newType: newSecurity[securityName].type,
          message: `Security scheme '${securityName}' type changed from '${oldSecurity[securityName].type}' to '${newSecurity[securityName].type}'`,
          impact: "Clients using this authentication method will break",
          recommendation: `Consider keeping the original security scheme type and introducing a new scheme with a different name`,
        });
      }

      // Check for OAuth2 scope changes
      if (
        oldSecurity[securityName].type === "oauth2" &&
        newSecurity[securityName].type === "oauth2"
      ) {
        compareOAuth2Scopes(
          oldSecurity[securityName],
          newSecurity[securityName],
          securityName,
          report
        );
      }
    }
  });
}

/**
 * Compare OAuth2 scopes between security schemes
 * @param {Object} oldSecurity - Old security scheme
 * @param {Object} newSecurity - New security scheme
 * @param {string} securityName - Security scheme name
 * @param {Object} report - Report to update
 */
function compareOAuth2Scopes(oldSecurity, newSecurity, securityName, report) {
  // Handle both OpenAPI 2.0 and 3.0 formats
  const oldScopes =
    oldSecurity.flows?.implicit?.scopes ||
    oldSecurity.flows?.password?.scopes ||
    oldSecurity.flows?.clientCredentials?.scopes ||
    oldSecurity.flows?.authorizationCode?.scopes ||
    oldSecurity.scopes ||
    {};

  const newScopes =
    newSecurity.flows?.implicit?.scopes ||
    newSecurity.flows?.password?.scopes ||
    newSecurity.flows?.clientCredentials?.scopes ||
    newSecurity.flows?.authorizationCode?.scopes ||
    newSecurity.scopes ||
    {};

  Object.keys(oldScopes).forEach((scope) => {
    if (!newScopes[scope]) {
      report.critical.push({
        type: "OAUTH2_SCOPE_REMOVED",
        scheme: securityName,
        scope,
        message: `OAuth2 scope '${scope}' removed from security scheme '${securityName}'`,
        impact: "Clients using this scope will break",
        recommendation: `Consider keeping the scope even if it's deprecated`,
      });
    }
  });
}

module.exports = {
  compareSecurity,
  compareOAuth2Scopes,
};
