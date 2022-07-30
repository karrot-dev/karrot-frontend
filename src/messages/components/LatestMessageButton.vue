<template>
  <QBtn
    :to="Platform.is.mobile && ({ name: 'messages' })"
    flat
    dense
    round
    :title="$t('GROUP.MESSAGES')"
    @click="maybeOpen"
  >
    <QIcon
      name="fas fa-comments"
      :class="{ hasUnread: hasUnreadConversationsOrThreads }"
    />
    <QBadge
      v-if="unseenCount > 0"
      floating
      color="secondary"
    >
      {{ unseenCount > 9 ? '9+' : unseenCount }}
    </QBadge>
    <QMenu
      v-if="!Platform.is.mobile"
      v-model="showing"
      no-parent-event
      style="width: 500px"
      anchor="bottom middle"
      self="top middle"
    >
      <LatestMessages />
    </QMenu>
  </QBtn>
</template>

<script setup>
import {
  QBtn,
  QIcon,
  QBadge,
  QMenu,
  Platform,
} from 'quasar'

import { defineAsyncComponent, ref } from 'vue'
import { useStatusService } from '@/status/services'

const LatestMessages = defineAsyncComponent(() => import('@/messages/components/LatestMessages'))

const emit = defineEmits(['click'])

const {
  hasUnreadConversationsOrThreads,
  unseenCount,
} = useStatusService()

const showing = ref(false)

function maybeOpen () {
  if (!Platform.is.mobile) {
    showing.value = !showing.value
  }
  emit('click')
}
</script>

<style lang="sass" scoped>
.q-icon:not(.hasUnread)
  opacity: $topbar-opacity-low

.q-btn:hover .q-icon
  opacity: 1
</style>
