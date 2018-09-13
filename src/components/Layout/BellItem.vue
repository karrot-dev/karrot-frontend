<template>
  <q-item
    link
    class="isUnread"
    @click.native="$emit('open')"
  >
    <q-item-main>
      <q-item-tile
        label
      >
        {{ bellText }}
      </q-item-tile>
      <q-item-tile
        sublabel
      >
        {{ bell.type }}, {{ bell.payload }}
      </q-item-tile>
    </q-item-main>
  </q-item>
</template>

<script>
import {
  QItem,
  QItemMain,
  QItemTile,
  QItemSide,
  QChip,
  QIcon,
} from 'quasar'
import DateAsWords from '@/components/General/DateAsWords'

export default {
  components: {
    QItem,
    QItemMain,
    QItemTile,
    QItemSide,
    QChip,
    QIcon,
    DateAsWords,
  },
  props: {
    bell: {
      type: Object,
      default: null,
    },
  },
  computed: {
    bellText () {
      switch (this.bell.type) {
        case 'new_applicant': return this.bell.application && this.$t('BELLS.NEW_APPLICANT', {userName: this.bell.application.user.displayName, groupName: this.bell.application.group.name})
        case 'user_became_editor': return this.$t('BELLS.YOU_BECAME_EDITOR', {groupName: this.bell.group.name})
      }
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.isUnread
  background linear-gradient(to right, $lightGreen, $lighterGreen)
  &:hover
    background alpha($grey, 0.5)
</style>
