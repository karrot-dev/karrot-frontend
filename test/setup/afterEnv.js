import { faker } from '@faker-js/faker'

beforeEach(() => {
  faker.seed(500)
})

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

// We use scrollIntoView but in jsdom it doesn't make sense:
//   "We can't really implemented it since we don't do layout."
// See https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = jest.fn()
