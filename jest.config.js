const isDebug = process.env.DEBUG === 'true';

module.exports = {
  verbose: true,
  silent: !isDebug,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testTimeout: 60000,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*\\.(test|spec))\\.tsx?$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/demo/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
