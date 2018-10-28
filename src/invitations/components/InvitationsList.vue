<template>
  <div>
    <q-spinner-dots
      v-if="isPending"
      size="40"
    />
    <template v-else>
      <q-list
        v-if="invitations.length > 0"
        class="no-border"
      >
        <q-list-header>
          {{ $t('GROUP.INVITED_LIST') }}
        </q-list-header>
        <q-item
          v-for="invite in invitations"
          :key="invite.id"
        >
          <q-item-main>
            <q-item-tile label>
              {{ invite.email }}
            </q-item-tile>
            <q-item-tile sublabel>
              <DateAsWords :date="invite.createdAt" />
            </q-item-tile>
          </q-item-main>
          <q-item-side right>
            <ProfilePicture
              :user="invite.invitedBy"
              :size="25"
            />
          </q-item-side>
        </q-item>
      </q-list>
    </template>
  </div>
</template>

<script>
import { QSpinnerDots, QList, QItem, QItemSide, QItemMain, QItemTile, QListHeader } from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'
import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'

export default {
  components: { QSpinnerDots, QList, QItem, QItemSide, QItemMain, QItemTile, QListHeader, ProfilePicture, DateAsWords },
  mixins: [statusMixin],
  props: {
    invitations: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
