<template>
  <div>
    <q-search v-model="result" placeholder="Search for address">
      <q-autocomplete @search="search" @selected="selected" />
    </q-search>
  </div>
</template>

<script>
import { QSearch, QAutocomplete } from 'quasar'

export default {
  props: [],
  components: {
    QSearch, QAutocomplete,
  },
  data () {
    return {
      result: null,
    }
  },
  methods: {
    search (terms, done) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${terms}`)
        .then(d => d.json())
        .then(d => {
          const list = d.map(e => {
            return {
              label: e.displayName,
              value: e.displayName,
              obj: e,
            }
          })
          done(list)
        })
    },
    selected (item) {
      console.log('selected', item.obj)
    },

  },
}
</script>

<style scoped lang="stylus">
</style>
