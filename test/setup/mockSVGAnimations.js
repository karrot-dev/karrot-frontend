import { vi } from 'vitest'

// Quasar calls this in QInfiniteScroll
// jsdom doesn't define (un)pauseAnimations
Object.assign(global.SVGSVGElement.prototype, {
  pauseAnimations: vi.fn(),
  unpauseAnimations: vi.fn(),
})
