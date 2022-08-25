const oldLocation = global.location

delete global.location
global.location = {
  ...oldLocation,
  reload: jest.fn(),
}
