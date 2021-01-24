module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '.css$': '<rootDir>/jest-style-mock.js'
  }
};