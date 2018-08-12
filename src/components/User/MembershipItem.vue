<template>
  <q-item>
    <q-item-main>
      <q-item-tile label>
        {{ group.name }}
      </q-item-tile>
      <q-item-tile sublabel>
        {{ isEditor ? 'Editor' : 'Newcomer' }}
      </q-item-tile>
    </q-item-main>
    <q-item-side>
      <q-btn
        v-if="!user.isCurrentUser"
        round
        :color="canGiveTrust ? 'primary' : (trusted ? 'positive' : 'white')"
        :title="canGiveTrust ? 'You can give trust to this user' : (trusted ? 'You trust this user' : 'You are not member of this group')"
        class="karrot-button"
      >
        <q-chip
          floating
          color="secondary"
        >
          {{ trustedBy.length }}
        </q-chip>
        <q-popover
          self="center left"
        >
          <div class="bg-primary text-white generic-padding">
            <p>{{ trustedBy.length }} people trust {{ user.displayName }} in {{ group.name }}</p>
            <div>
              <ProfilePicture
                v-for="u in trustedBy"
                :key="u.id"
                :user="u"
                :size="20"
              />
            </div>
            <template v-if="trusted">
              <small>You trust this user</small>
            </template>
            <q-btn
              v-if="canGiveTrust"
              rounded
              color="secondary"
              @click="$emit('createTrust', { userId: user.id, groupId: group.id })"
            >
              <span class="q-mr-xs">+</span>
              <img
                src="https://twemoji.maxcdn.com/2/72x72/1f955.png"
                width="20px"
              >
            </q-btn>
          </div>
        </q-popover>
      </q-btn>
    </q-item-side>
  </q-item>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'

import {
  QCard,
  QCardTitle,
  QCardActions,
  QCardMain,
  QCardMedia,
  QBtn,
  QCardSeparator,
  QList,
  QListHeader,
  QItem,
  QItemMain,
  QItemSide,
  QItemTile,
  QPopover,
  QChip,
  QTooltip,
} from 'quasar'

export default {
  components: {
    ProfilePicture,
    QCard,
    QCardTitle,
    QCardActions,
    QCardMain,
    QCardMedia,
    QBtn,
    QCardSeparator,
    QList,
    QListHeader,
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    QPopover,
    QChip,
    QTooltip,
  },
  props: {
    user: {
      default: null,
      type: Object,
    },
    membership: {
      default: () => ({}),
      type: Object,
    },
  },
  computed: {
    group () {
      return this.membership.group
    },
    trustedBy () {
      return this.membership.trustedBy
    },
    trusted () {
      return this.membership.trusted
    },
    isEditor () {
      return this.membership.isEditor
    },
    canGiveTrust () {
      return !this.trusted && this.group.isMember
    },
  },
}
</script>

<style lang="stylus" scoped>
.karrot-button >>> .q-btn-inner
  background-image url('https://twemoji.maxcdn.com/2/72x72/1f955.png')
  background-size 60%
  background-repeat no-repeat
  background-position center
  min-height 100%
  min-width 100%
</style>
