<template>
  <q-card>
    <StoreList
      class="white-background"
      :stores="stores"
      :archived="archived"
    />
  </q-card>
</template>

<script>
import StoreList from '@/components/Store/StoreList'
import { mapGetters } from 'vuex'
import { QCard } from 'quasar'

export default {
  components: {
    StoreList, QCard,
  },
  computed: {
    ...mapGetters({
      stores: 'stores/byCurrentGroup',
      archived: 'stores/byCurrentGroupArchived',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
