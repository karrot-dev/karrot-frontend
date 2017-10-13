<template>
  <div>
    <q-search v-model="result" placeholder="Search for address">
      <q-autocomplete @search="search" @selected="selected" />
    </q-search>
  </div>
</template>

<script>
import { QSearch, QAutocomplete } from 'quasar'

import geocoding from '@/services/geocoding'

export default {
  props: ['value'],
  components: {
    QSearch, QAutocomplete,
  },
  data () {
    return {
      result: this.value,
    }
  },
  watch: {
    value (val) {
      this.result = val
    },
    result (val) {
      this.$emit('input', val)
      if (val === '') {
        this.$emit('coords', { latitude: '', longitude: '' })
      }
    },
  },
  methods: {
    async search (terms, done) {
      done((await geocoding.lookupAddress(terms)).map(result => {
        const { address } = result
        return {
          result,
          label: address,
          value: address,
        }
      }))
    },
    selected ({ result: { address, latitude, longitude } }) {
      this.$emit('input', address)
      this.$emit('coords', { latitude, longitude })
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
