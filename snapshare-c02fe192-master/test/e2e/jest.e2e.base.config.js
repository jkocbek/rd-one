const entryConfig = require('../../jest.config.js');
module.exports = {
  ...entryConfig,
  rootDir: '../../',
  globalSetup: '<rootDir>/test/e2e/utils/jest.e2e.global-setup.fn.ts',
  testRegex: '.e2e-spec.ts$',
  testPathIgnorePatterns: [
    '^(?!.*(/src/|/test/)).*', // ignore all folders that are not "src"
  ],
  moduleNameMapper: {
    '^~(.*)$': ['<rootDir>/src/$1'],
    '^test~(.*)$': ['<rootDir>/test/$1'],
  },
  reporters: ['default'],
};
