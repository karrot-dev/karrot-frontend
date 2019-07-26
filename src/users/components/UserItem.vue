<template>
  <QItem highlight>
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
        <RouterLink :to="{name: 'user', params: { userId: user.id }}">
          {{ user.displayName }}
        </RouterLink>
      </QItemLabel>
      <QItemLabel caption>
        <i18n
          path="GROUP.JOINED"
        >
          <DateAsWords
            place="relativeDate"
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
              place="userName"
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
      <QItemTile>
        <TrustButton
          v-if="user.membership"
          :user="user"
          :group="group"
          :membership="user.membership"
          small
          @createTrust="$emit('createTrust', arguments[0])"
        />
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  QItem,
  QItemSection,
  QItemLabel,
  QItemSection
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
    QItemSection
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
