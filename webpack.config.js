const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/core/api.js",
  output: {
    path: path.join(__dirname, "build-api"),
    publicPath: "/",
    filename: "api.js",
  },
  target: "node",
};
