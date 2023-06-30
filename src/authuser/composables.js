import { useFileDialog } from '@vueuse/core'
import { Dialog } from 'quasar'

import ChangePhotoDialog from '@/authuser/components/Settings/ChangePhotoDialog.vue'

export function useSetProfilePhoto () {
  const { open, onChange } = useFileDialog({
    multiple: false,
    accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp',
  })
  function chooseProfilePhoto () {
    open()
  }
  onChange(files => {
    Dialog.create({
      component: ChangePhotoDialog,
      componentProps: {
        file: files[0],
      },
    })
  })
  return {
    chooseProfilePhoto,
  }
}
