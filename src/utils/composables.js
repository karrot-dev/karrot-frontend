import { createEventHook, useFileDialog } from '@vueuse/core'
import { Dialog } from 'quasar'
import { computed, onScopeDispose, watch } from 'vue'
import { useQueryClient } from 'vue-query'
import { useRoute, useRouter } from 'vue-router'

import { useAuthService } from '@/authuser/services'
import { socketEvents } from '@/base/services/websocket'
import { useStatusService } from '@/status/services'
import { useBreadcrumbs } from '@/topbar/services'
import { imageUploadAccept } from '@/utils/utils'

import ChooseImageDialog from '@/utils/components/ChooseImageDialog.vue'

export function useClearDataOnLogout () {
  const queryClient = useQueryClient()
  const { isLoggedIn } = useAuthService()
  // TODO: this is probably better in the auth user service...
  watch(isLoggedIn, value => {
    if (!value) {
      // Clear data for all queries
      queryClient.resetQueries([])
    }
  })
}

export function useSocketEvents () {
  return {
    /**
     * Register for socket events, automatically unsubscribes when component unmounted
     *
     * @param types Array|String
     * @param handler Function
     */
    on (types, handler) {
      if (!Array.isArray(types)) types = [types]
      for (const type of types) {
        socketEvents.on(type, handler)
      }
      onScopeDispose(() => {
        for (const type of types) {
          socketEvents.off(type, handler)
        }
      })
    },
  }
}

export function useTitleStatus () {
  const { unseenCount } = useStatusService()
  const breadcrumbs = useBreadcrumbs()

  const title = computed(() => {
    const names = breadcrumbs.value.map(breadcrumb => breadcrumb.name).reverse()
    names.push('Karrot')
    let title = names.join(' · ')

    if (unseenCount.value > 0) {
      title = `(${unseenCount.value}) ${title}`
    }

    return title
  })

  watch(title, value => {
    document.title = value
  })
}

export function useRouteParam (name) {
  const router = useRouter()
  const route = useRoute()
  return computed({
    get () {
      return route.params[name]
    },
    set (val) {
      router.push({ params: { [name]: val } })
    },
  })
}

export function useIntegerRouteParam (name) {
  const param = useRouteParam(name)
  return computed({
    get () {
      if (!param.value) return undefined
      return parseInt(param.value, 10)
    },
    set (val) {
      param.value = val
    },
  })
}

export function useChooseImage ({
  title,
  aspectRatio,
  outputFormat,
} = {}) {
  const { open, onChange } = useFileDialog({
    multiple: false,
    accept: imageUploadAccept,
  })
  const onChooseImageHook = createEventHook()
  onChange(files => {
    Dialog.create({
      component: ChooseImageDialog,
      componentProps: {
        title,
        file: files[0],
        aspectRatio,
        outputFormat,
        onChooseImage: onChooseImageHook.trigger,
      },
    })
  })
  return {
    chooseImage: open,
    onChooseImage: onChooseImageHook.on,
  }
}
