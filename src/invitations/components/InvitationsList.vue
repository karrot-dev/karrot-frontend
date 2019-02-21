<template>
  <div>
    <KSpinner v-if="isPending" />
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
import {
  QList,
  QItem,
  QItemSide,
  QItemMain,
  QItemTile,
  QListHeader,
} from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'
import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'
import KSpinner from '@/utils/components/KSpinner'

export default {
  components: {
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QListHeader,
    ProfilePicture,
    DateAsWords,
    KSpinner,
  },
  mixins: [statusMixin],
  props: {
    invitations: {
      type: Array,
      required: true,
    },
  },
}
</script>
