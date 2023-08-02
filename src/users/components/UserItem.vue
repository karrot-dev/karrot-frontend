<template>
  <QItem
    :to="{name: 'user', params: { userId: user.id }}"
  >
    <QItemSection side>
      <ProfilePicture
        :key="user.id"
        :user="user"
        :membership="membership"
        :size="30"
        class="profilePic"
      />
    </QItemSection>
    <QItemSection>
      <QItemLabel>
        {{ user.displayName }}
      </QItemLabel>
      <QItemLabel caption>
        <i18n-t
          scope="global"
          keypath="GROUP.JOINED"
        >
          <template #relativeDate>
            <DateAsWords
              style="display: inline"
              :date="membership.createdAt"
              :future="false"
            />
          </template>
        </i18n-t>
        <template v-if="addedBy">
          ·
          <i18n-t
            scope="global"
            keypath="GROUP.ADDED_BY"
          >
            <template #userName>
              <RouterLink :to="{name: 'user', params: { userId: addedBy.id }}">
                {{ addedBy.displayName }}
              </RouterLink>
            </template>
          </i18n-t>
        </template>
        <br>
      </QItemLabel>
    </QItemSection>
    <QItemSection side>
      <TrustButton
        v-if="membership"
        :user="user"
        :membership="membership"
        small
      />
    </QItemSection>
  </QItem>
</template>

<script setup>
import { QItem, QItemLabel, QItemSection } from 'quasar'

import TrustButton from '@/users/components/TrustButton.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'

import ProfilePicture from './ProfilePicture.vue'

defineProps({
  user: {
    type: Object,
    default: null,
  },
  membership: {
    type: Object,
    default: null,
  },
  addedBy: {
    type: Object,
    default: null,
  },
})
</script>

<style lang="sass" scoped>
.q-item-sublabel > span
  font-weight: initial
</style>
