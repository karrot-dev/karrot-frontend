import { useFileDialog, createEventHook } from '@vueuse/core'
import { Dialog } from 'quasar'

import ChooseImageDialog from '@/authuser/components/Settings/ChooseImageDialog.vue'

export function useChooseImage ({
  aspectRatio,
  outputFormat,
} = {}) {
  const { open, onChange } = useFileDialog({
    multiple: false,
    accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp',
  })
  const onChooseImageHook = createEventHook()
  onChange(files => {
    Dialog.create({
      component: ChooseImageDialog,
      componentProps: {
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
