<template>
  <div class="wrapper">
    <q-search
      :autofocus="true"
      separator
      class="lightgrey"
      v-model="terms"
      :placeholder="$t('BUTTON.SEARCH')"
      :debounce="50"
      clearable
      @blur="clear"
      @clear="clear"
      @keyup.esc="clear"
    >
      <q-autocomplete
        @search="search"
        @selected="selected"
      />
    </q-search>
  </div>
</template>

<script>
import { QSearch, QAutocomplete } from 'quasar'
import { mapMutations, mapGetters } from 'vuex'

export default {
  components: { QSearch, QAutocomplete },
  data () {
    return {
      terms: null,
    }
  },
  methods: {
    ...mapMutations({
      setTerms: 'search/setTerms',
      hide: 'search/hide',
    }),
    search (terms, done) {
      if (!terms) done([])
      this.setTerms(terms)
      if (!this.results.length) {
        done([{ label: this.$t('GLOBAL.SEARCH_NOT_FOUND') }])
      }
      else {
        done(this.results)
      }
    },
    selected (item) {
      if (this.results.length !== 0) {
        this.terms = item.label
        this.hide()
        this.$router.push(item.value)
      }
    },
    clear () {
      this.setTerms(null)
      this.$emit('clear')
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
