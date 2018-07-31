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
            :date="user.membershipInCurrentGroup.createdAt"
          />
        </i18n>
        <q-progress
          v-if="user.membershipInCurrentGroup.newcomerProgress < 100"
          :percentage="user.membershipInCurrentGroup.newcomerProgress"
          class="q-mt-xs"
          title="Trust needed to become Editor"
        />
      </q-item-tile>
    </q-item-main>
    <q-item-side>
      <q-item-tile>
        <ProfilePicture
          v-for="user in user.trust.map(t => t.givenBy)"
          :key="user.id"
          :user="user"
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
    user: {
      type: Object,
      default: null,
    },
  },
}
</script>
