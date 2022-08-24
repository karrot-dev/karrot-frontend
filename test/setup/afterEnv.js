global.console = {
  ...console,
  // uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  // error: jest.fn(),
}

// TODO: this is a hacky way to resolve "ReferenceError: _vue is not defined" errors
// It only happens in <script setup> components
// <script> components used to also have the error but adding this snippet to jest config resolved it:
// customExportConditions: ['node', 'node-addons'],
global._vue = require('vue')
