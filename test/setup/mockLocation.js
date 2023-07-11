import { vi } from 'vitest'

const oldLocation = global.location

delete global.location
global.location = {
  ...oldLocation,
  reload: vi.fn(),
}
