<template>
  <ChooseImage
    v-if="user?.id && editable"
    :title="t('USERDATA.SET_PHOTO')"
    :dialog-title="t('USERDATA.SET_PHOTO')"
    :image-url="photo"
    :on-change="savePhoto"
    :enabled="editable"
    :aspect-ratio="1"
    :width="size"
  >
    <img
      v-if="hasPhoto"
      :src="photo"
      class="fit"
    >
    <RandomArt
      v-else
      :text="user.displayName"
      :seed="user.id"
      class="block overflow-hidden fit"
    />
  </ChooseImage>
  <div
    v-else-if="user?.id"
    class="profile-picture relative-position rounded-borders overflow-hidden"
    :style="pictureStyle"
  >
    <component
      :is="isLink ? RouterLink : 'span'"
      v-bind="isLink ? {
        to: { name: 'user', params: { userId: user.id } },
        title: tooltip,
      } : {}"
    >
      <img
        v-if="hasPhoto"
        :src="photo"
        class="fit"
      >
      <RandomArt
        v-else
        :text="user.displayName"
        :seed="user.id"
        class="block overflow-hidden fit"
      />
    </component>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import { useSaveUserMutation } from '@/authuser/mutations'
import { showToast } from '@/utils/toasts'

import ChooseImage from '@/utils/components/ChooseImage.vue'
import RandomArt from '@/utils/components/RandomArt.vue'

const {
  mutateAsync: saveUser,
} = useSaveUserMutation()

const { t } = useI18n()

async function savePhoto ({ image }) {
  await saveUser({ photo: image })
  showToast({
    message: 'NOTIFICATIONS.CHANGES_SAVED',
    config: {
      timeout: 2000,
      icon: 'thumb_up',
    },
  })
}

const props = defineProps({
  user: { default: null, type: Object },
  membership: { default: null, type: Object },
  size: { default: 20, type: Number },
  isLink: { default: true, type: Boolean },
  editable: { default: false, type: Boolean },
})

const tooltip = computed(() => {
  if (props.user.displayName === '?') {
    return t('PROFILE.INACCESSIBLE_OR_DELETED')
  }
  if (!props.membership || props.membership.roles.includes('editor')) {
    return props.user.displayName
  }
  const role = t('USERDATA.NEWCOMER')
  return `${props.user.displayName} (${role})`
})

const pictureStyle = computed(() => ({
  width: props.size + 'px',
  height: props.size + 'px',
}))

const hasPhoto = computed(() => Boolean(photo.value))

const photo = computed(() => {
  if (props.user?.photoUrls) {
    const p = props.user.photoUrls
    return props.size > 120 ? p['600'] : p.thumbnail
  }
  return null
})
</script>

<style scoped lang="sass">
.change-photo
  visibility: hidden
  background-color: rgba(100, 100, 100, 0.8)
  gap: 12px
  z-index: 1

.profile-picture:hover .change-photo
  visibility: visible
</style>
