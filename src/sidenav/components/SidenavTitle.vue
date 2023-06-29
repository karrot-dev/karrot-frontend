<template>
  <div class="bg-primary text-white q-pa-sm">
    <QToolbar
      v-if="$q.platform.is.mobile"
      class="justify-evenly"
    >
      <LatestMessageButton
        v-if="isLoggedIn"
        @click="$emit('click')"
      />
      <NotificationButton
        v-if="isLoggedIn"
        @click="$emit('click')"
      />
      <QBtn
        flat
        dense
        round
        :to="{name: 'settings'}"
      >
        <QIcon
          name="fas fa-cog fa-fw"
          label="$t('SETTINGS.TITLE')"
        />
      </QBtn>
    </QToolbar>
    <QToolbar>
      <QAvatar>
        <img
          v-if="currentGroup && currentGroup.photoUrls"
          :src="currentGroup.photoUrls.thumbnail"
        >
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

import LatestMessageButton from '@/messages/components/LatestMessageButton.vue'
import NotificationButton from '@/notifications/components/NotificationButton.vue'

defineEmits(['click'])

const {
  group: currentGroup,
} = useCurrentGroupService()

const {
  isLoggedIn,
} = useAuthService()

</script>
