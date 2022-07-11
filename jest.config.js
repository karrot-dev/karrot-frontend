const esModules = ['quasar', 'quasar/lang', 'lodash-es', 'leaflet'].join('|')

module.exports = {
  roots: [
    '<rootDir>/src/',
  ],
  globals: {
    __DEV__: true,
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    pretendToBeVisual: true,
  },
  collectCoverage: true,
  coverageDirectory: './coverage/',
  coverageReporters: [
    'json',
    'lcov',
  ],
  // Needed in JS codebases too because of feature flags
  coveragePathIgnorePatterns: ['/node_modules/', '.d.ts$'],
  testMatch: [
    '<rootDir>/src/**/*.spec.js',
  ],
  moduleDirectories: [
    'node_modules',
    '<rootDir>/src',
  ],
  moduleFileExtensions: ['vue', 'js', 'json'],
  moduleNameMapper: {
    '^quasar$': 'quasar/dist/quasar.esm.prod.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/fileMock.js',
    '\\.(css|less|styl|stylus|sass|scss)$': '<rootDir>/test/styleMock.js',
    '@/(.*)$': '<rootDir>/src/$1',
    '>/(.*)$': '<rootDir>/test/$1',
  },
  transform: {
    '.*\\.vue$': '@vue/vue3-jest',
    '.*\\.js$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: [`node_modules/(?!(${esModules}))`],
  snapshotSerializers: ['jest-serializer-vue'],
  setupFiles: [
    '<rootDir>/test/setup/env.js',
    '<rootDir>/test/setup/unhandledPromiseRejectionHandler.js',
    '<rootDir>/test/setup/mockRandom.js',
    '<rootDir>/test/setup/mockScroll.js',
    '<rootDir>/test/setup/mockUserAgent.js',
    '<rootDir>/test/setup/mockLocation.js',
    'jest-canvas-mock',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/test/setup/afterEnv.js',
  ],
}
