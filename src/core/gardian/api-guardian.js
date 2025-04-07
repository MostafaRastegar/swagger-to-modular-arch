/**
 * API Guardian - Breaking Changes Detector
 *
 * Detects breaking changes between two versions of an API specification
 * Provides detailed reports and recommendations for maintaining backward compatibility
 */
const fs = require("fs");
const path = require("path");
const { parseSwaggerFile } = require("../parsers/swaggerParser");

/**
 * Main class for API Guardian functionality
 */
class APIGuardian {
  /**
   * Create a new API Guardian instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      reportLevel: "all", // 'all', 'critical', 'warning', 'info'
      outputFormat: "markdown", // 'markdown', 'json'
      ...options,
    };
  }

  /**
   * Compare two API specifications for breaking changes
   * @param {string} oldSpecPath - Path to the old API spec
   * @param {string} newSpecPath - Path to the new API spec
   * @returns {Object} Report of breaking changes
   */
  compareSpecs(oldSpecPath, newSpecPath) {
    console.log(`Comparing API specifications:`);
    console.log(`  Old: ${oldSpecPath}`);
    console.log(`  New: ${newSpecPath}`);

    // Parse specifications
    const oldSpec = parseSwaggerFile(oldSpecPath);
    const newSpec = parseSwaggerFile(newSpecPath);

    // Detect breaking changes
    const report = this.detectBreakingChanges(oldSpec, newSpec);

    // Generate summary
    this.generateSummary(report);

    return report;
  }

  /**
   * Detect breaking changes between two API specifications
   * @param {Object} oldSpec - Old API specification
   * @param {Object} newSpec - New API specification
   * @returns {Object} Report of breaking changes
   */
  detectBreakingChanges(oldSpec, newSpec) {
    const report = {
      critical: [],
      warning: [],
      info: [],
      suggestions: [],
    };

    // Compare paths (endpoints)
    this.compareEndpoints(oldSpec, newSpec, report);

    // Compare schemas (data models)
    this.compareSchemas(oldSpec, newSpec, report);

    // Compare security
    this.compareSecurity(oldSpec, newSpec, report);

    // Generate recommendations
    this.generateRecommendations(report);

    return report;
  }

  /**
   * Compare endpoints between two API specifications
   * @param {Object} oldSpec - Old API specification
   * @param {Object} newSpec - New API specification
   * @param {Object} report - Report to update
   */
  compareEndpoints(oldSpec, newSpec, report) {
    const oldPaths = oldSpec.paths || {};
    const newPaths = newSpec.paths || {};

    // Check for removed endpoints
    Object.keys(oldPaths).forEach((path) => {
      if (!newPaths[path]) {
        report.critical.push({
          type: "ENDPOINT_REMOVED",
          path,
          message: `Endpoint removed: ${path}`,
          impact: "Clients using this endpoint will break",
          recommendation: `Consider keeping the endpoint and marking it as deprecated, or create a new versioned path (e.g., /v2${path})`,
        });
        return;
      }

      // Check for method changes
      Object.keys(oldPaths[path]).forEach((method) => {
        if (
          ![
            "get",
            "post",
            "put",
            "delete",
            "patch",
            "options",
            "head",
          ].includes(method)
        )
          return;

        if (!newPaths[path][method]) {
          report.critical.push({
            type: "METHOD_REMOVED",
            path,
            method: method.toUpperCase(),
            message: `HTTP method ${method.toUpperCase()} removed from ${path}`,
            impact: "Clients using this method will break",
            recommendation: `Consider keeping the method and marking it as deprecated`,
          });
          return;
        }

        // Compare parameters
        this.compareParameters(
          oldPaths[path][method],
          newPaths[path][method],
          path,
          method,
          report
        );

        // Compare request body
        this.compareRequestBody(
          oldPaths[path][method],
          newPaths[path][method],
          path,
          method,
          report
        );

        // Compare responses
        this.compareResponses(
          oldPaths[path][method],
          newPaths[path][method],
          path,
          method,
          report
        );
      });
    });

    // Check for added endpoints (not breaking, but informational)
    Object.keys(newPaths).forEach((path) => {
      if (!oldPaths[path]) {
        report.info.push({
          type: "ENDPOINT_ADDED",
          path,
          message: `New endpoint added: ${path}`,
        });
      }
    });
  }

  /**
   * Compare parameters between two operations
   * @param {Object} oldOperation - Old operation
   * @param {Object} newOperation - New operation
   * @param {string} path - API path
   * @param {string} method - HTTP method
   * @param {Object} report - Report to update
   */
  compareParameters(oldOperation, newOperation, path, method, report) {
    const oldParams = oldOperation.parameters || [];
    const newParams = newOperation.parameters || [];

    // Check for removed parameters
    oldParams.forEach((oldParam) => {
      const newParam = newParams.find(
        (p) => p.name === oldParam.name && p.in === oldParam.in
      );

      if (!newParam) {
        if (oldParam.required) {
          report.critical.push({
            type: "REQUIRED_PARAM_REMOVED",
            path,
            method: method.toUpperCase(),
            param: oldParam.name,
            paramIn: oldParam.in,
            message: `Required parameter '${oldParam.name}' (${
              oldParam.in
            }) removed from ${method.toUpperCase()} ${path}`,
            impact: "Clients sending this parameter will break",
            recommendation: `Consider keeping the parameter or making it optional with backward compatible defaults`,
          });
        } else {
          report.warning.push({
            type: "OPTIONAL_PARAM_REMOVED",
            path,
            method: method.toUpperCase(),
            param: oldParam.name,
            paramIn: oldParam.in,
            message: `Optional parameter '${oldParam.name}' (${
              oldParam.in
            }) removed from ${method.toUpperCase()} ${path}`,
            impact:
              "Clients sending this parameter may break if they rely on its behavior",
            recommendation: `Consider keeping the parameter for backward compatibility`,
          });
        }
        return;
      }

      // Check if parameter became required
      if (!oldParam.required && newParam.required) {
        report.critical.push({
          type: "PARAM_BECAME_REQUIRED",
          path,
          method: method.toUpperCase(),
          param: oldParam.name,
          paramIn: oldParam.in,
          message: `Parameter '${oldParam.name}' (${
            oldParam.in
          }) became required in ${method.toUpperCase()} ${path}`,
          impact: "Clients not sending this parameter will break",
          recommendation: `Consider keeping the parameter optional with backward compatible defaults`,
        });
      }

      // Check for type changes
      if (
        oldParam.schema &&
        newParam.schema &&
        oldParam.schema.type !== newParam.schema.type
      ) {
        report.critical.push({
          type: "PARAM_TYPE_CHANGED",
          path,
          method: method.toUpperCase(),
          param: oldParam.name,
          paramIn: oldParam.in,
          oldType: oldParam.schema.type,
          newType: newParam.schema.type,
          message: `Parameter '${oldParam.name}' (${
            oldParam.in
          }) type changed from '${oldParam.schema.type}' to '${
            newParam.schema.type
          }' in ${method.toUpperCase()} ${path}`,
          impact: "Clients sending data of the old type will break",
          recommendation: `Consider keeping the parameter type the same, or adding a new parameter with a different name`,
        });
      }
    });

    // Check for added required parameters
    newParams.forEach((newParam) => {
      const oldParam = oldParams.find(
        (p) => p.name === newParam.name && p.in === newParam.in
      );

      if (!oldParam && newParam.required) {
        report.critical.push({
          type: "REQUIRED_PARAM_ADDED",
          path,
          method: method.toUpperCase(),
          param: newParam.name,
          paramIn: newParam.in,
          message: `New required parameter '${newParam.name}' (${
            newParam.in
          }) added to ${method.toUpperCase()} ${path}`,
          impact:
            "Existing clients will not send this parameter and will break",
          recommendation: `Consider making the parameter optional with backward compatible defaults`,
        });
      }
    });
  }

  /**
   * Compare request bodies between two operations
   * @param {Object} oldOperation - Old operation
   * @param {Object} newOperation - New operation
   * @param {string} path - API path
   * @param {string} method - HTTP method
   * @param {Object} report - Report to update
   */
  compareRequestBody(oldOperation, newOperation, path, method, report) {
    const oldBody = oldOperation.requestBody;
    const newBody = newOperation.requestBody;

    // If no request bodies in either, nothing to compare
    if (!oldBody && !newBody) return;

    // If request body removed, report it
    if (oldBody && !newBody) {
      report.warning.push({
        type: "REQUEST_BODY_REMOVED",
        path,
        method: method.toUpperCase(),
        message: `Request body removed from ${method.toUpperCase()} ${path}`,
        impact: "Clients sending request bodies will be affected",
        recommendation: `Consider keeping the request body and ignoring extra fields`,
      });
      return;
    }

    // If request body added, check if it's required
    if (!oldBody && newBody) {
      if (newBody.required) {
        report.critical.push({
          type: "REQUIRED_REQUEST_BODY_ADDED",
          path,
          method: method.toUpperCase(),
          message: `Required request body added to ${method.toUpperCase()} ${path}`,
          impact:
            "Existing clients will not send a request body and will break",
          recommendation: `Consider making the request body optional with backward compatible defaults`,
        });
      } else {
        report.info.push({
          type: "OPTIONAL_REQUEST_BODY_ADDED",
          path,
          method: method.toUpperCase(),
          message: `Optional request body added to ${method.toUpperCase()} ${path}`,
        });
      }
      return;
    }

    // If both have bodies, compare content types and schemas
    if (oldBody.content && newBody.content) {
      // Check for removed content types
      Object.keys(oldBody.content).forEach((contentType) => {
        if (!newBody.content[contentType]) {
          report.warning.push({
            type: "CONTENT_TYPE_REMOVED",
            path,
            method: method.toUpperCase(),
            contentType,
            message: `Content type '${contentType}' removed from request body in ${method.toUpperCase()} ${path}`,
            impact: "Clients sending this content type will break",
            recommendation: `Consider keeping support for this content type`,
          });
        }
      });

      // Compare schemas for same content types
      Object.keys(oldBody.content).forEach((contentType) => {
        if (newBody.content[contentType]) {
          this.compareSchemaObjects(
            oldBody.content[contentType].schema,
            newBody.content[contentType].schema,
            `request body schema (${contentType})`,
            path,
            method,
            report
          );
        }
      });
    }

    // Check if previously optional body became required
    if (oldBody && !oldBody.required && newBody.required) {
      report.critical.push({
        type: "REQUEST_BODY_BECAME_REQUIRED",
        path,
        method: method.toUpperCase(),
        message: `Request body became required in ${method.toUpperCase()} ${path}`,
        impact: "Clients not sending a request body will break",
        recommendation: `Consider keeping the request body optional with backward compatible defaults`,
      });
    }
  }

  /**
   * Compare responses between two operations
   * @param {Object} oldOperation - Old operation
   * @param {Object} newOperation - New operation
   * @param {string} path - API path
   * @param {string} method - HTTP method
   * @param {Object} report - Report to update
   */
  compareResponses(oldOperation, newOperation, path, method, report) {
    const oldResponses = oldOperation.responses || {};
    const newResponses = newOperation.responses || {};

    // Check for removed success response codes
    Object.keys(oldResponses).forEach((statusCode) => {
      // Focus on success status codes
      if (!statusCode.startsWith("2")) return;

      if (!newResponses[statusCode]) {
        report.warning.push({
          type: "SUCCESS_RESPONSE_REMOVED",
          path,
          method: method.toUpperCase(),
          statusCode,
          message: `Success response ${statusCode} removed from ${method.toUpperCase()} ${path}`,
          impact: "Clients expecting this status code may break",
          recommendation: `Consider keeping this status code if clients rely on it`,
        });
      } else {
        // Compare response schemas
        if (
          oldResponses[statusCode].content &&
          newResponses[statusCode].content
        ) {
          Object.keys(oldResponses[statusCode].content).forEach(
            (contentType) => {
              if (!newResponses[statusCode].content[contentType]) {
                report.warning.push({
                  type: "RESPONSE_CONTENT_TYPE_REMOVED",
                  path,
                  method: method.toUpperCase(),
                  statusCode,
                  contentType,
                  message: `Content type '${contentType}' removed from response ${statusCode} in ${method.toUpperCase()} ${path}`,
                  impact: "Clients expecting this content type will break",
                  recommendation: `Consider keeping support for this content type`,
                });
              } else {
                this.compareSchemaObjects(
                  oldResponses[statusCode].content[contentType].schema,
                  newResponses[statusCode].content[contentType].schema,
                  `response ${statusCode} schema (${contentType})`,
                  path,
                  method,
                  report
                );
              }
            }
          );
        }
      }
    });
  }

  /**
   * Compare schemas between two API specifications
   * @param {Object} oldSpec - Old API specification
   * @param {Object} newSpec - New API specification
   * @param {Object} report - Report to update
   */
  compareSchemas(oldSpec, newSpec, report) {
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
        this.compareSchemaObjects(
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
  compareSchemaObjects(oldSchema, newSchema, context, path, method, report) {
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
          this.compareSchemaObjects(
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
      this.compareSchemaObjects(
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

  /**
   * Compare security definitions between two API specifications
   * @param {Object} oldSpec - Old API specification
   * @param {Object} newSpec - New API specification
   * @param {Object} report - Report to update
   */
  compareSecurity(oldSpec, newSpec, report) {
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
          // Handle both OpenAPI 2.0 and 3.0 formats
          const oldScopes =
            oldSecurity[securityName].flows?.implicit?.scopes ||
            oldSecurity[securityName].flows?.password?.scopes ||
            oldSecurity[securityName].flows?.clientCredentials?.scopes ||
            oldSecurity[securityName].flows?.authorizationCode?.scopes ||
            oldSecurity[securityName].scopes ||
            {};

          const newScopes =
            newSecurity[securityName].flows?.implicit?.scopes ||
            newSecurity[securityName].flows?.password?.scopes ||
            newSecurity[securityName].flows?.clientCredentials?.scopes ||
            newSecurity[securityName].flows?.authorizationCode?.scopes ||
            newSecurity[securityName].scopes ||
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
      }
    });
  }

  /**
   * Generate recommendations for addressing breaking changes
   * @param {Object} report - Report to update with recommendations
   */
  generateRecommendations(report) {
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
  }

  /**
   * Generate a summary of breaking changes
   * @param {Object} report - Report to summarize
   */
  generateSummary(report) {
    const criticalCount = report.critical.length;
    const warningCount = report.warning.length;
    const infoCount = report.info.length;

    console.log("\n===== API Guardian Report Summary =====");
    console.log(`Critical Breaking Changes: ${criticalCount}`);
    console.log(`Warnings: ${warningCount}`);
    console.log(`Info: ${infoCount}`);

    if (criticalCount > 0) {
      console.log(
        "\nCritical breaking changes detected! These changes will likely break existing clients."
      );
    } else if (warningCount > 0) {
      console.log(
        "\nPotential compatibility issues detected. Review warnings to ensure backward compatibility."
      );
    } else {
      console.log(
        "\nNo breaking changes detected. API changes appear to be backward compatible."
      );
    }

    if (report.suggestions.length > 0) {
      console.log("\nRecommendations available in the full report.");
    }
  }

  /**
   * Generate a detailed report in the specified format
   * @param {Object} report - Report to format
   * @param {string} outputPath - Path to save the report (optional)
   * @returns {string} Formatted report
   */
  generateReport(report, outputPath = null) {
    let formattedReport = "";

    if (this.options.outputFormat === "markdown") {
      formattedReport = this.generateMarkdownReport(report);
    } else if (this.options.outputFormat === "json") {
      formattedReport = JSON.stringify(report, null, 2);
    }

    if (outputPath) {
      fs.writeFileSync(outputPath, formattedReport);
      console.log(`Report saved to ${outputPath}`);
    }

    return formattedReport;
  }

  /**
   * Generate a Markdown report
   * @param {Object} report - Report to format
   * @returns {string} Markdown report
   */
  generateMarkdownReport(report) {
    let output = "# API Guardian Breaking Changes Report\n\n";

    // Add summary
    output += "## Summary\n\n";
    output += `- Critical Breaking Changes: ${report.critical.length}\n`;
    output += `- Warnings: ${report.warning.length}\n`;
    output += `- Informational Changes: ${report.info.length}\n\n`;

    // Add critical changes
    if (
      report.critical.length > 0 &&
      (this.options.reportLevel === "all" ||
        this.options.reportLevel === "critical")
    ) {
      output += "## Critical Breaking Changes\n\n";
      report.critical.forEach((change, index) => {
        output += `### ${index + 1}. ${change.message}\n\n`;
        if (change.impact) output += `**Impact**: ${change.impact}\n\n`;
        if (change.recommendation)
          output += `**Recommendation**: ${change.recommendation}\n\n`;
        output += `**Type**: \`${change.type}\`\n\n`;
        if (change.path) output += `**Path**: \`${change.path}\`\n\n`;
        if (change.method) output += `**Method**: ${change.method}\n\n`;
        output += "---\n\n";
      });
    }

    // Add warnings
    if (
      report.warning.length > 0 &&
      (this.options.reportLevel === "all" ||
        this.options.reportLevel === "warning")
    ) {
      output += "## Warnings\n\n";
      report.warning.forEach((change, index) => {
        output += `### ${index + 1}. ${change.message}\n\n`;
        if (change.impact) output += `**Impact**: ${change.impact}\n\n`;
        if (change.recommendation)
          output += `**Recommendation**: ${change.recommendation}\n\n`;
        output += `**Type**: \`${change.type}\`\n\n`;
        if (change.path) output += `**Path**: \`${change.path}\`\n\n`;
        if (change.method) output += `**Method**: ${change.method}\n\n`;
        output += "---\n\n";
      });
    }

    // Add info changes
    if (
      report.info.length > 0 &&
      (this.options.reportLevel === "all" ||
        this.options.reportLevel === "info")
    ) {
      output += "## Informational Changes\n\n";
      report.info.forEach((change, index) => {
        output += `### ${index + 1}. ${change.message}\n\n`;
        output += `**Type**: \`${change.type}\`\n\n`;
        if (change.path) output += `**Path**: \`${change.path}\`\n\n`;
        if (change.method) output += `**Method**: ${change.method}\n\n`;
        output += "---\n\n";
      });
    }

    // Add recommendations
    if (report.suggestions.length > 0) {
      output += "## Recommendations\n\n";
      report.suggestions.forEach((suggestion, index) => {
        output += `### ${suggestion.title}\n\n`;
        output += `${suggestion.description}\n\n`;

        if (suggestion.options && suggestion.options.length > 0) {
          output += "**Options:**\n\n";
          suggestion.options.forEach((option) => {
            output += `- ${option}\n`;
          });
          output += "\n";
        }

        output += "---\n\n";
      });
    }

    return output;
  }

  /**
   * Check if there are any critical breaking changes
   * @param {Object} report - Report to check
   * @returns {boolean} True if critical changes exist
   */
  hasCriticalChanges(report) {
    return report.critical.length > 0;
  }
}

module.exports = APIGuardian;
