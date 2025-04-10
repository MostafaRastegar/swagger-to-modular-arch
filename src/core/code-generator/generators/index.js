/**
 * Generators Index
 *
 * Exports all generator modules for easy importing elsewhere in the application.
 */

const endpointGenerator = require("./endpoint");
const interfaceGenerator = require("./interface");
const serviceGenerator = require("./service");
const presentationGenerator = require("./presentation");
const distributedGenerator = require("./distributed");

module.exports = {
  ...endpointGenerator,
  ...interfaceGenerator,
  ...serviceGenerator,
  ...presentationGenerator,
  ...distributedGenerator,
};
