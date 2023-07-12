<template>
  <div class="bg-primary text-white q-pa-sm">
    <QToolbar
      v-if="$q.platform.is.mobile && isLoggedIn"
      class="justify-evenly"
    >
      <LatestMessageButton />
      <NotificationButton />
      <QBtn
        flat
        dense
        round
        :title="$t('TOPBAR.USERPROFILE')"
        :to="{ name: 'user', params: { userId } }"
      >
        <QIcon
          name="fas fa-user fa-fw"
        />
      </QBtn>
      <QBtn
        flat
        dense
        round
        :title="$t('SETTINGS.TITLE')"
        :to="{ name: 'settings' }"
      >
        <QIcon
          name="fas fa-cog fa-fw"
        />
      </QBtn>
    </QToolbar>
    <QToolbar>
      <QAvatar>
        <img
          v-if="currentGroup?.photoUrls?.thumbnail"
          :src="currentGroup.photoUrls.thumbnail"
        >
        <KarrotLogo
          v-else
        />
      </QAvatar>
      <QToolbarTitle>
        {{ currentGroup && currentGroup.name }}
      </QToolbarTitle>
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
  </div>
</template>

<script setup>
import {
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QAvatar,
} from 'quasar'

import { useAuthService } from '@/authuser/services'
import { useCurrentGroupService } from '@/group/services'

import KarrotLogo from '@/logo/components/KarrotLogo.vue'
import LatestMessageButton from '@/messages/components/LatestMessageButton.vue'
import NotificationButton from '@/notifications/components/NotificationButton.vue'

defineEmits(['click'])

const {
  group: currentGroup,
} = useCurrentGroupService()

const {
  isLoggedIn,
  userId,
} = useAuthService()

</script>
