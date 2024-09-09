const entryConfig = require('../../jest.config.js');
module.exports = {
  ...entryConfig,
  rootDir: '../../src',
  testRegex: '.spec.ts$',
  moduleNameMapper: {
    '^~(.*)$': ['<rootDir>/$1'],
  },
  reporters: ['default'],
};
