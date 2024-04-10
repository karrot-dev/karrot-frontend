<template>
  <QItem
    class="rounded-borders"
    tag="a"
    :to="{ name: 'user', params: { userId: user.id } }"
  >
    <QItemSection avatar>
      <ProfilePicture
        :user="user"
        :is-link="false"
        size="42"
      />
    </QItemSection>
    <QItemSection>
      <QItemLabel>{{ user.displayName }}</QItemLabel>
      <QItemLabel caption>
        @{{ user.username }}
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>

<script setup>
import { QItem, QItemSection, QItemLabel } from 'quasar'

import ProfilePicture from '@/users/components/ProfilePicture.vue'

defineProps({
  user: {
    type: Object,
    required: true,
  },
})
</script>
