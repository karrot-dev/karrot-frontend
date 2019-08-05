<template>
  <QList
    v-close-popup
  >
    <QItem
      tag="a"
      href="https://www.transifex.com/yunity-1/karrot/dashboard/"
      target="_blank"
      rel="nofollow noopener noreferrer"
      class="q-pt-xs"
      style="min-height: 20px"
    >
      <QItemSection>
        <QItemLabel caption>
          <QIcon name="fas fa-external-link-alt" />
          <small>{{ $t('LANGUAGECHOOSER.ADD_MORE') }}</small>
        </QItemLabel>
      </QItemSection>
    </QItem>
    <QItem
      v-for="locale in localeOptions"
      :key="locale.value"
      :class="{ active: locale.value === current }"
      @click.native="setLocale(locale.value)"
    >
      <QItemSection>
        <QItemLabel>
          {{ locale.label }}
          <small>({{ locale.percentage }}%)</small>
        </QItemLabel>
        <QItemLabel caption>
          <QLinearProgress
            v-if="locale.percentage < 1"
            :value="locale.percentage"
          />
        </QItemLabel>
      </QItemSection>
    </QItem>
  </QList>
</template>

<script>
import {
  QLinearProgress,
  QIcon,
  QList,
  QItem,
  QItemLabel,
  QItemSection,
} from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import { localeOptions } from '@/base/i18n'

export default {
  components: {
    QLinearProgress,
    QIcon,
    QList,
    QItem,
    QItemLabel,
    QItemSection,
  },
  data () {
    return {
      localeOptions,
    }
  },
  computed: {
    ...mapGetters({
      current: 'i18n/locale',
    }),
  },
  methods: {
    ...mapActions({
      setLocale: 'i18n/setLocale',
    }),
  },
}
</script>

<style scoped lang="stylus">
.q-item
  cursor pointer
  &.active
    cursor default
</style>
