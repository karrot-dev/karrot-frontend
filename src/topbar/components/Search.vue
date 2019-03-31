<template>
  <div class="wrapper">
    <QSearch
      v-model="terms"
      :autofocus="true"
      separator
      class="lightgrey"
      :placeholder="$t('BUTTON.SEARCH')"
      :debounce="50"
      clearable
      @blur="clear"
      @clear="clear"
      @keyup.esc="clear"
    >
      <QAutocomplete
        @search="search"
        @selected="selected"
      />
    </QSearch>
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
  computed: {
    ...mapGetters({
      results: 'search/results',
    }),
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
}
</script>

<style scoped lang="stylus">
.lightgrey
  background-color lightgrey
</style>
