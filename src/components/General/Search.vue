<template>
  <div class="wrapper">
    <q-search
      :autofocus="true"
      separator
      class="lightgrey"
      v-model="terms"
      placeholder="Search"
      @blur="hideIfEmpty"
      >
      <q-autocomplete @search="search" @selected="selected" />
    </q-search>
  </div>
</template>

<script>
import { QSearch, QAutocomplete } from 'quasar'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { QSearch, QAutocomplete },
  data () {
    return {
      terms: null,
    }
  },
  methods: {
    ...mapActions({
      setTerms: 'search/setTerms',
      hideIfEmpty: 'search/hideIfEmpty',
    }),
    search (terms, done) {
      this.setTerms(terms)
      done(this.results)
    },
    selected (item) {
      this.terms = item.label
      this.$router.push(item.value)
    },
  },
  computed: {
    ...mapGetters({
      results: 'search/results',
    }),
  },
}
</script>

<style scoped lang="stylus">
.lightgrey
  background-color lightgrey
</style>
