const oldLocation = global.location

delete global.location
global.location = {
  reload: jest.fn(),
  href: oldLocation.href,
  hash: oldLocation.hash,
}
