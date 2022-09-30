<template>
  <RouterLink :to="{ name: 'user', params: { userId: user.id } }">
    <QChip v-bind="$attrs">
      <ProfilePicture
        :user="user"
      />
      <strong class="q-pl-xs">
        {{ user.displayName }}
      </strong>
    </QChip>
  </RouterLink>
</template>
<script setup>
import {
  QChip,
} from 'quasar'

import ProfilePicture from '@/users/components/ProfilePicture'
defineProps({
  user: {
    type: Object,
    required: true,
  },
})
</script>
