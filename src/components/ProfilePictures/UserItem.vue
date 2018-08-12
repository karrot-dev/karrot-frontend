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
          tag="div"
        >
          <DateAsWords
            place="relativeDate"
            style="display: inline"
            :date="membership.createdAt"
          />
        </i18n>
        <q-progress
          v-if="membership.trustProgress < 1"
          :percentage="membership.trustProgress * 100"
          class="q-mt-xs"
          title="Trust needed to become Editor"
        />
      </q-item-tile>
    </q-item-main>
    <q-item-side>
      <q-item-tile>
        <ProfilePicture
          v-for="u in membership.trustedBy"
          :key="u.id"
          :user="u"
        />
      </q-item-tile>
    </q-item-side>
  </q-item>
</template>

<script>
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
    membership: {
      type: Object,
      default: null,
    },
  },
  computed: {
    user () {
      return this.membership.user
    },
  },
}
</script>
