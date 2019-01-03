<template>
  <div>
    <QSpinnerDots
      v-if="isPending"
      size="40"
    />
    <template v-else>
      <QList
        v-if="invitations.length > 0"
        class="no-border"
      >
        <QListHeader>
          {{ $t('GROUP.INVITED_LIST') }}
        </QListHeader>
        <QItem
          v-for="invite in invitations"
          :key="invite.id"
        >
          <QItemMain>
            <QItemTile label>
              {{ invite.email }}
            </QItemTile>
            <QItemTile sublabel>
              <DateAsWords :date="invite.createdAt" />
            </QItemTile>
          </QItemMain>
          <QItemSide right>
            <ProfilePicture
              :user="invite.invitedBy"
              :size="25"
            />
          </QItemSide>
        </QItem>
      </QList>
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
