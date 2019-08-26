<template>
  <QToolbar
    v-if="$q.platform.is.mobile"
    class="bg-primary text-white"
  >
    <QToolbarTitle
      @click="$emit('click')"
    >
      {{ currentGroup && currentGroup.name }}
    </QToolbarTitle>
    <LatestMessageButton
      v-if="isLoggedIn"
      style="font-size: 10px"
      class="q-mr-xs"
      @click="$emit('click')"
    />
    <NotificationButton
      v-if="isLoggedIn"
      style="font-size: 10px"
      class="q-mr-xs"
      @click="$emit('click')"
    />
    <QBtn
      flat
      dense
      round
      :to="{ name: 'groupsGallery' }"
      :title="$t('TOPBAR.CHANGE_GROUP')"
      size="sm"
      @click="$emit('click')"
    >
      <QIcon name="fas fa-exchange-alt" />
    </QBtn>
  </QToolbar>
</template>

<script>
import LatestMessageButton from '@/messages/components/LatestMessageButton'
import NotificationButton from '@/notifications/components/NotificationButton'

import {
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
} from 'quasar'

import { mapGetters } from 'vuex'

export default {
  components: {
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    LatestMessageButton,
    NotificationButton,
  },
  computed: {
    ...mapGetters({
      currentGroup: 'currentGroup/value',
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },
}
</script>
