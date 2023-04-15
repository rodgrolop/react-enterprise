module.exports = {
  roots: ["<rootDir>/src"],
  testRegex: "(/.*\\.test)\\.(ts|tsx)$",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
