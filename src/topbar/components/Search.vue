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
      @click="show"
      @focus="show"
      @blur="hide"
      @keyup.esc="close"
    >
      <template v-slot:prepend>
        <QIcon name="search" />
      </template>
      <QMenu
        ref="menu"
        no-parent-event
        fit
      >
        <QList>
          <QItem
            v-for="(result, idx) in results"
            :key="idx"
            v-close-popup
            clickable
          >
            <QItemSection
              v-if="result.icon"
              side
            >
              <QIcon :name="result.icon" />
            </QItemSection>
            <QItemSection
              v-if="result.user"
              side
            >
              <ProfilePicture
                :user="result.user"
                :is-link="false"
                :size="25"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel>
                {{ result.label }}
              </QItemLabel>
              <QItemLabel caption>
                {{ result.sublabel }}
              </QItemLabel>
            </QItemSection>
          </QItem>
          <QItem
            v-if="results.length < 1"
          >
            <QItemSection>
              <QItemLabel>
                {{ $t('GLOBAL.SEARCH_NOT_FOUND') }}
              </QItemLabel>
            </QItemSection>
          </QItem>
        </QList>
      </QMenu>
    </QInput>
  </div>
</template>

<script>
import ProfilePicture from '@/users/components/ProfilePicture'

import {
  QInput,
  QIcon,
  QMenu,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'
import { mapMutations, mapGetters } from 'vuex'

export default {
  components: {
    ProfilePicture,
    QInput,
    QIcon,
    QMenu,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
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
        this.hide()
        return
      }
      this.setTerms(val)
    },
  },
  methods: {
    ...mapMutations({
      setTerms: 'search/setTerms',
      hide: 'search/hide',
    }),
    close () {
      this.hide()
      this.setTerms(null)
      this.$emit('clear')
    },
    show () {
      this.$refs.menu.show()
    },
    hide () {
      this.$refs.menu.hide()
    },
  },
}
</script>
