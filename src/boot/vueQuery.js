import { VueQueryPlugin } from '@tanstack/vue-query'

import queryClient from '@/base/queryClient'

export default async function ({ app }) {
  app.use(VueQueryPlugin, { queryClient })
}
