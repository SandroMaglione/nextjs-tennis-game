module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleDirectories: ['node_modules', 'src'],
  // Same as 'tsconfig.json'
  moduleNameMapper: {
    '@utils/(.*)': '<rootDir>/utils/$1',
    '@validation/(.*)': '<rootDir>/validation/$1',
  },
};
