const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("api.yaml");

const options = {
  customSiteTitle: " API Doc",
};

module.exports = {
  swaggerServe: swaggerUI.serve,
  swaggerSetup: swaggerUI.setup(swaggerJSDocs),
};

// module.exports = {
//   swaggerServe: swaggerUI.serve,
//   swaggerSetup: swaggerUI.setup(swaggerJSDocs, options),
// };
