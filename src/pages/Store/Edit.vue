<template>
  <div>
    <h3><i class="fa fa-edit"></i> Edit store</h3>
    <q-card>
      <store-edit :store="store" :status="status" :allStores="allStores" :serverError="serverError" @save="save"/>
    </q-card>
  </div>
</template>

<script>
import { QCard } from 'quasar'
import StoreEdit from '@/components/Store/StoreEdit'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Edit',
  components: { QCard, StoreEdit },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
      status: 'stores/status',
      allStores: 'stores/all',
      serverError: 'stores/error',
    }),
  },
  methods: {
    ...mapActions({
      save: 'stores/save',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
