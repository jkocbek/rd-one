process.env.STAGE = 'test';

module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.ts-node.json',
        isolatedModules: true,
      },
    ],
  },
  testEnvironment: 'node',
  testTimeout: 30000, // 30 seconds
};
