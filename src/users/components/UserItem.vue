<template>
  <QItem>
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
        <RouterLink
          v-measure
          :to="{name: 'user', params: { userId: user.id }}"
        >
          {{ user.displayName }}
        </RouterLink>
      </QItemLabel>
      <QItemLabel caption>
        <i18n-t
          keypath="GROUP.JOINED"
        >
          <template #relativeDate>
            <DateAsWords
              style="display: inline"
              :date="membership.createdAt"
            />
          </template>
        </i18n-t>
        <template v-if="addedBy">
          ·
          <i18n-t
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
import { computed, toRefs } from 'vue'
import {
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'

import ProfilePicture from './ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'
import TrustButton from '@/users/components/TrustButton'
import { useUserService } from '@/users/services'
import { useCurrentGroupService } from '@/group/services'

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
})

const { user } = toRefs(props)
const {
  getUserById,
} = useUserService()

const {
  getMembership,
} = useCurrentGroupService()

const membership = computed(() => getMembership(user.value.id))
const addedBy = computed(() => membership.value.addedBy && getUserById(membership.value.addedBy))
</script>

<style lang="sass" scoped>
.q-item-sublabel > span
  font-weight: initial
</style>
