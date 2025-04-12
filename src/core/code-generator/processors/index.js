/**
 * Processors Index
 *
 * Exports all processor modules for easy importing elsewhere in the application.
 */

const tagProcessor = require("./tag-processor");

module.exports = {
  ...tagProcessor,
};
