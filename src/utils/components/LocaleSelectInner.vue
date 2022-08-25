<template>
  <QList
    class="bg-white"
  >
    <QItem
      v-if="$q.platform.is.mobile"
      class="text-white bg-primary"
    >
      <QItemSection>
        {{ $t('LANGUAGECHOOSER.SWITCH') }}
      </QItemSection>
      <QItemSection side>
        <QBtn
          v-close-popup
          dense
          round
          flat
          color="white"
          size="sm"
        >
          <QIcon name="fas fa-times" />
        </QBtn>
      </QItemSection>
    </QItem>
    <QItem
      tag="a"
      href="https://www.transifex.com/yunity-1/karrot/dashboard/"
      target="_blank"
      rel="nofollow noopener noreferrer"
      style="min-height: 20px"
    >
      <QItemSection>
        <QItemLabel caption>
          <QIcon
            name="fas fa-external-link-alt"
            class="q-mr-xs"
          />
          <small>{{ $t('LANGUAGECHOOSER.ADD_MORE') }}</small>
        </QItemLabel>
      </QItemSection>
    </QItem>
    <QItem
      v-for="locale in localeOptions"
      :key="locale.value"
      v-close-popup
      :active="locale.value === current"
      clickable
      @click="setLocale(locale.value)"
    >
      <QItemSection>
        <QItemLabel>
          {{ locale.label }}
          <small>({{ Math.round(locale.percentage * 100) }}%)</small>
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

<script setup>
import {
  QLinearProgress,
  QIcon,
  QList,
  QItem,
  QItemLabel,
  QItemSection,
  QBtn,
} from 'quasar'

import { localeOptions } from '@/base/i18n'
import { useI18nService } from '@/base/services/i18n'

const {
  locale: current,
  setLocale,
} = useI18nService()
</script>
