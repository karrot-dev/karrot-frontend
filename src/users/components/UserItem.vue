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
        <i18n
          path="GROUP.JOINED"
        >
          <DateAsWords
            slot="relativeDate"
            style="display: inline"
            :date="user.membership.createdAt"
          />
        </i18n>
        <template v-if="addedBy">
          ·
          <i18n
            path="GROUP.ADDED_BY"
          >
            <RouterLink
              slot="userName"
              :to="{name: 'user', params: { userId: addedBy.id }}"
            >
              {{ addedBy.displayName }}
            </RouterLink>
          </i18n>
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
        @create-trust="$emit('create-trust', arguments[0])"
        @revoke-trust="$emit('revoke-trust', arguments[0])"
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

<style lang="stylus" scoped>
.q-item-sublabel > span
  font-weight initial
</style>
