const baseConfig = require('./jest.unit-test.base.config.js');
module.exports = {
  ...baseConfig,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['.module.ts$', 'database'],
  coverageDirectory: 'test/test-results/unit-test/coverage',
};
