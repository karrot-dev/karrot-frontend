<template>
  <q-item highlight>
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
        <router-link :to="{name: 'user', params: { userId: user.id }}">
          {{ user.displayName }}
        </router-link>
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
      </q-item-tile>
    </q-item-main>
    <q-item-side>
      <q-item-tile>
        <TrustButton
          v-if="user.membership"
          :user="user"
          :group="group"
          :membership="user.membership"
          small
          @createTrust="$emit('createTrust', arguments[0])"
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
    QItemMain,
    QItemTile,
    QItemSide,
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
