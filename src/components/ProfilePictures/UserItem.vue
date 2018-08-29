<template>
  <q-item
    link
    highlight
    :to="{name: 'user', params: { userId: user.id }}"
  >
    <q-item-side>
      <ProfilePicture
        :key="user.id"
        :user="user"
        :size="30"
        class="profilePic"
      />
    </q-item-side>
    <q-item-main>
      <q-item-tile label>
        {{ user.displayName }}
      </q-item-tile>
      <q-item-tile sublabel>
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
            <router-link
              place="userName"
              :to="{name: 'user', params: { userId: addedBy.id }}"
            >
              {{ addedBy.displayName }}
            </router-link>
          </i18n>
        </template>
        <br>
        <q-progress
          v-if="user.membership.trustProgress < 1"
          :percentage="user.membership.trustProgress * 100"
          class="q-mt-xs"
          :title="$t('USERDATA.TRUST_PROGRESS_TEXT', { trustNeeded })"
        />
      </q-item-tile>
    </q-item-main>
    <q-item-side>
      <q-item-tile>
        <ProfilePicture
          v-for="u in user.membership.trustedBy"
          :key="u.id"
          :user="getUser(u)"
        />
      </q-item-tile>
    </q-item-side>
  </q-item>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  QItem,
  QItemMain,
  QItemTile,
  QItemSide,
  QProgress,
} from 'quasar'

import ProfilePicture from './ProfilePicture'
import DateAsWords from '@/components/General/DateAsWords'

export default {
  components: {
    ProfilePicture,
    DateAsWords,
    QItem,
    QItemMain,
    QItemTile,
    QItemSide,
    QProgress,
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapGetters({
      getUser: 'users/get',
    }),
    trustNeeded () {
      const { trustedBy, trustThresholdForNewcomer } = this.user.membership
      return trustThresholdForNewcomer - trustedBy.length
    },
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
