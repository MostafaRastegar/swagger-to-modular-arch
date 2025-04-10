/**
 * Generators Index
 *
 * Exports all mock server generator modules for easy importing elsewhere in the application.
 */

const routesGenerator = require("./routes");
const databaseGenerator = require("./database");
const readmeGenerator = require("./readme");

module.exports = {
  ...routesGenerator,
  ...databaseGenerator,
  ...readmeGenerator,
};
