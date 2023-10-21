import { useQueryClient } from '@tanstack/vue-query'
import { h, ref } from 'vue'
import { getRouter } from 'vue-router-mock'

import { resetServices } from '@/utils/datastore/helpers'

import { clearMockBackend } from '>/mockBackend'

/**
 * A helper for defining storybook stories that ensures a few things:
 * - mockdata is reset
 * - we wait until the router is ready
 * - we invalidate the vue-query queries to ensure they refetch
 * - we allow async fetching of the props
 */
export function defineStory (getProps) {
  return {
    render: (_, storybookContext) => {
      return {
        setup () {
          const ready = ref(false)
          const propsRef = ref(null)
          const queryClient = useQueryClient()
          const router = getRouter()

          async function initialize () {
            // If we don't wait for the router to be ready
            // it redirects back to home page, even if we set a route
            // we wanted
            await router.isReady()

            // Ensure we don't inadvertently leave cached data around
            resetServices()

            // Reset all existing mock data
            clearMockBackend()

            // Call our user defined getProps function, which can be async :)
            propsRef.value = await getProps()

            // Tell it to fetch the data again if needed
            await queryClient.invalidateQueries()

            ready.value = true
          }

          initialize().then(() => {})

          return () => {
            if (ready.value) {
              return h(storybookContext.component, propsRef.value)
            }
            else {
              return h('h1', 'loading')
            }
          }
        },
      }
    },
  }
}
