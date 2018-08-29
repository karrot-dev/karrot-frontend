<template>
  <q-toolbar v-if="$q.platform.is.mobile">
    <q-toolbar-title v-if="currentGroup">{{ currentGroup.name }}</q-toolbar-title>
    <CommunityFeed />
    <LatestMessageButton @click="$emit('click')" />
    <LocaleSelect />
    <q-btn
      v-if="currentGroup"
      flat
      dense
      round
      :to="{ name: 'groupsGallery' }"
      :title="$t('TOPBAR.CHANGE_GROUP')"
    >
      <q-icon name="fas fa-exchange-alt" />
      <q-tooltip v-t="'TOPBAR.CHANGE_GROUP'" />
    </q-btn>
  </q-toolbar>
</template>

<script>
import LocaleSelect from '@/components/General/LocaleSelect'
import CommunityFeed from '@/components/General/CommunityFeed'
import LatestMessageButton from '@/components/Layout/LatestMessageButton'

import { QToolbar, QToolbarTitle, QBtn, QIcon, QTooltip } from 'quasar'

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
  },
  computed: {
    ...mapGetters({
      currentGroup: 'currentGroup/value',
    }),
  },
}
</script>
