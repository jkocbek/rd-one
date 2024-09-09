const baseConfig = require('./jest.e2e.base.config');
module.exports = {
  ...baseConfig,
  collectCoverageFrom: ['<rootDir>/src/**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['.module.ts$', 'database'],
  coverageDirectory: '<rootDir>/test-results/e2e/coverage',
};
