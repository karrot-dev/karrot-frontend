<template>
  <QCard>
    <StoreList
      class="white-background"
      :group-id="groupId"
      :stores="stores"
      :archived="archived"
    />
  </QCard>
</template>

<script>
import StoreList from '@/stores/components/StoreList'
import { mapGetters } from 'vuex'
import { QCard } from 'quasar'

export default {
  components: {
    StoreList, QCard,
  },
  computed: {
    ...mapGetters({
      groupId: 'currentGroup/id',
      stores: 'stores/byCurrentGroup',
      archived: 'stores/byCurrentGroupArchived',
    }),
  },
}
</script>
