/**
 * Endpoint comparator
 *
 * Compares API endpoints between specifications to detect breaking changes
 */

/**
 * Compare endpoints between two API specifications
 * @param {Object} oldSpec - Old API specification
 * @param {Object} newSpec - New API specification
 * @param {Object} report - Report to update
 */
function compareEndpoints(oldSpec, newSpec, report) {
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
        !["get", "post", "put", "delete", "patch", "options", "head"].includes(
          method
        )
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
      compareParameters(
        oldPaths[path][method],
        newPaths[path][method],
        path,
        method,
        report
      );

      // Compare request body
      compareRequestBody(
        oldPaths[path][method],
        newPaths[path][method],
        path,
        method,
        report
      );

      // Compare responses
      compareResponses(
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
function compareParameters(oldOperation, newOperation, path, method, report) {
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
        impact: "Existing clients will not send this parameter and will break",
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
function compareRequestBody(oldOperation, newOperation, path, method, report) {
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
        impact: "Existing clients will not send a request body and will break",
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
        const schemaComparator = require("./schemas");
        schemaComparator.compareSchemaObjects(
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
function compareResponses(oldOperation, newOperation, path, method, report) {
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
        Object.keys(oldResponses[statusCode].content).forEach((contentType) => {
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
            const schemaComparator = require("./schemas");
            schemaComparator.compareSchemaObjects(
              oldResponses[statusCode].content[contentType].schema,
              newResponses[statusCode].content[contentType].schema,
              `response ${statusCode} schema (${contentType})`,
              path,
              method,
              report
            );
          }
        });
      }
    }
  });
}

module.exports = {
  compareEndpoints,
  compareParameters,
  compareRequestBody,
  compareResponses,
};
