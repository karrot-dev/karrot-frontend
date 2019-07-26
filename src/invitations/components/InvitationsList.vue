<template>
  <div>
    <KSpinner v-if="isPending" />
    <template v-else>
      <QList
        v-if="invitations.length > 0"
        class="no-border"
      >
        <QItemLabel header>
          {{ $t('GROUP.INVITED_LIST') }}
        </QItemLabel>
        <QItem
          v-for="invite in invitations"
          :key="invite.id"
        >
          <QItemMain>
            <QItemLabel>
              {{ invite.email }}
            </QItemLabel>
            <QItemLabel caption>
              <DateAsWords :date="invite.createdAt" />
            </QItemLabel>
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
  QItemLabel,
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
    QItemLabel,
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
