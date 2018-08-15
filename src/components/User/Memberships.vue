<template>
  <q-card class="no-shadow grey-border">
    <q-card-main>
      <q-list>
        <MembershipItem
          v-if="currentGroup"
          :user="user"
          :group="currentGroup"
          :membership="currentGroup.membership"
          @createTrust="$emit('createTrust', arguments[0])"
        />
        <q-collapsible
          v-if="otherGroups.length > 0"
          icon="fas fa-users"
          :label="$tc(
            'USERDATA.OTHER_MEMBERSHIPS',
            otherGroups.length,
            { count: otherGroups.length, userName: user.displayName }
          )"
        >
          <MembershipItem
            v-for="group in otherGroups"
            :key="group.id"
            :user="user"
            :group="group"
            :membership="group.membership"
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
    currentGroup () {
      return this.user.groups.find(g => g.isCurrentGroup)
    },
    otherGroups () {
      return this.user.groups.filter(g => !g.isCurrentGroup)
    },
  },
}
</script>
