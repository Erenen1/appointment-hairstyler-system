module.exports = {
  verbose: true,
  testEnvironment: "node",
  preset: "ts-jest",
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  testMatch: [
    '<rootDir>/src/modules/**/test/*.test.ts',
    '<rootDir>/tests/**/**/*.test.ts',
    '<rootDir>/tests/**/*.test.ts',
  ],
};