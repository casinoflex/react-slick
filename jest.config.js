module.exports = {
  collectCoverage: true,
  coverageReporters: ["text", "cobertura"],
  collectCoverageFrom: ["src/**/*"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/test-setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "e2e-tests"],
  moduleNameMapper: {
    "@casinoflex/react-slick": "<rootDir>/src/index.js"
  }
};
