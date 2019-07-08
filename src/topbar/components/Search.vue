<template>
  <div>
    <QInput
      v-model="terms"
      type="search"
      :placeholder="$q.lang.label.search"
      dense
      autofocus
      class="bg-grey-5"
      :debounce="300"
      clearable
      @blur="clear"
      @keyup.esc="clear"
    >
      <template v-slot:prepend>
        <QIcon name="search" />
      </template>
    </QInput>
    <QMenu
      ref="menu"
      no-parent-event
    >
      {{ results }}
    </QMenu>
  </div>
</template>

<script>
import {
  QInput,
  QIcon,
  QMenu,
} from 'quasar'
import { mapMutations, mapGetters } from 'vuex'

export default {
  components: {
    QInput,
    QIcon,
    QMenu,
  },
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
  watch: {
    terms (val) {
      if (!val) {
        this.setTerms(null)
        return
      }
      this.setTerms(val)
      console.log(this.results)
      console.log(this.$t('GLOBAL.SEARCH_NOT_FOUND'))
    },
    results (val) {
      if (this.terms && val) {
        this.$refs.menu.show()
      }
    },
  },
  methods: {
    ...mapMutations({
      setTerms: 'search/setTerms',
      hide: 'search/hide',
    }),
    clear () {
      this.setTerms(null)
      this.$emit('clear')
    },
  },
}
</script>
