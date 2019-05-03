<template>
  <QToolbar
    v-if="$q.platform.is.mobile"
  >
    <QToolbarTitle
      @click.native="$emit('click')"
    >
      {{ currentGroup && currentGroup.name }}
    </QToolbarTitle>
    <CommunityFeed
      @click.native="$emit('click')"
    />
    <LatestMessageButton
      v-if="isLoggedIn"
      @click="$emit('click')"
    />
    <NotificationButton
      v-if="isLoggedIn"
      @click="$emit('click')"
    />
    <LocaleSelect />
    <QBtn
      flat
      dense
      round
      :to="{ name: 'groupsGallery' }"
      :title="$t('TOPBAR.CHANGE_GROUP')"
      @click.native="$emit('click')"
    >
      <QIcon name="fas fa-exchange-alt" />
      <QTooltip v-t="'TOPBAR.CHANGE_GROUP'" />
    </QBtn>
  </QToolbar>
</template>

<script>
import LocaleSelect from '@/utils/components/LocaleSelect'
import CommunityFeed from '@/communityFeed/components/CommunityFeed'
import LatestMessageButton from '@/messages/components/LatestMessageButton'
import NotificationButton from '@/notifications/components/NotificationButton'

import {
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QTooltip,
} from 'quasar'

import { mapGetters } from 'vuex'

export default {
  components: {
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QTooltip,
    LocaleSelect,
    CommunityFeed,
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
