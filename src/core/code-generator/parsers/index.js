/**
 * Parsers Index
 *
 * Exports all parser modules for easy importing elsewhere in the application.
 */

const swaggerParser = require("./swagger");
const schemaParser = require("./schema");

module.exports = {
  ...swaggerParser,
  ...schemaParser,
};
