// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  // Optional: collect coverage from key source files
  collectCoverageFrom: [
    "src/utils/**/*.ts",
    "src/services/**/*.ts",
    "src/app/api/**/*.ts"
  ]
};
