<template>
  <QItem>
    <QItemSection side>
      <ProfilePicture
        :key="user.id"
        :user="user"
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
              :date="user.membership.createdAt"
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
        v-if="user.membership"
        :user="user"
        :group="group"
        :membership="user.membership"
        small
        @create-trust="(...args) => $emit('create-trust', ...args)"
        @revoke-trust="(...args) => $emit('revoke-trust', ...args)"
      />
    </QItemSection>
  </QItem>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'

import ProfilePicture from './ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'
import TrustButton from '@/users/components/TrustButton'

export default {
  components: {
    ProfilePicture,
    DateAsWords,
    TrustButton,
    QItem,
    QItemSection,
    QItemLabel,
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
    group: {
      type: Object,
      default: null,
    },
  },
  emits: [
    'create-trust',
    'revoke-trust',
  ],
  computed: {
    ...mapGetters({
      getUser: 'users/get',
    }),
    addedBy () {
      const addedById = this.user.membership.addedBy
      if (!addedById) return
      return this.getUser(addedById)
    },
  },
}
</script>

<style lang="sass" scoped>
.q-item-sublabel > span
  font-weight: initial
</style>
