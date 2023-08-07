import { afterEach, beforeEach } from 'vitest'

import { resetMockBackend, setupMockBackend } from '>/mockBackend/index'

/**
 * Creates a fake backend that can be used in tests.
 *
 * Internally holds a mini db of entries that each backend
 * module can use how it wishes, so things that cross-reference each
 * other can work.
 */
export function useMockBackend () {
  beforeEach(setupMockBackend)
  afterEach(resetMockBackend)
}
