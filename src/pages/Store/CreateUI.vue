<template>
  <div>
    <h3><i class="fa fa-edit"></i> Create store</h3>
    <q-card>
      <store-edit :status="status" :allStores="allStores" @save="save"/>
    </q-card>
  </div>
</template>

<script>
import { QCard } from 'quasar'
import StoreEdit from '@/components/Store/StoreEdit'
export default {
  name: 'Edit',
  components: { QCard, StoreEdit },
  props: ['status', 'allStores'],
  methods: {
    save (store) {
      this.$emit('save', store)
    },
  },
}
</script>
