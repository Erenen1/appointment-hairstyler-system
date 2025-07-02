module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/app.ts',
    '!src/swagger/**',
    '!src/types/**',
    '!src/routes/swagger.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],
  globalTeardown: '<rootDir>/tests/setup/jest.teardown.ts',
  testTimeout: 30000,
  maxWorkers: 1, // Sequelize connection issues için
  forceExit: true,
  detectOpenHandles: true,
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
}; 