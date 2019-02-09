// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  // collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "<rootDir>/**/*.ts"
  ],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    "text",
    "text-summary"
  ],

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    "global": {
      "lines": 50
    }
  },

  // The root directory that Jest should scan for tests and modules within
  rootDir: "./src",
  
  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/*.spec.(ts|tsx)"
  ]
};