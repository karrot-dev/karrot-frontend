<template>
  <q-card class="no-shadow grey-border">
    <q-card-main>
      <q-list>
        <MembershipItem
          v-if="currentGroupMembership"
          :user="user"
          :membership="currentGroupMembership"
          @createTrust="$emit('createTrust', arguments[0])"
        />
        <q-collapsible
          v-if="otherMemberships.length > 0"
          icon="fas fa-users"
          :label="$tc(
            'USERDATA.OTHER_MEMBERSHIPS',
            otherMemberships.length,
            { count: otherMemberships.length, userName: user.displayName }
          )"
        >
          <MembershipItem
            v-for="membership in otherMemberships"
            :key="membership.group.id"
            :user="user"
            :membership="membership"
            @createTrust="$emit('createTrust', arguments[0])"
          />
        </q-collapsible>
      </q-list>
    </q-card-main>
  </q-card>
</template>

<script>
import MembershipItem from './MembershipItem'

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
  QCollapsible,
} from 'quasar'

export default {
  components: {
    MembershipItem,
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
    QCollapsible,
  },
  props: {
    user: { required: true, type: Object },
  },
  computed: {
    currentGroupMembership () {
      return this.user.memberships.find(m => m.group.isCurrentGroup)
    },
    otherMemberships () {
      return this.user.memberships.filter(m => !m.group.isCurrentGroup)
    },
  },
}
</script>
