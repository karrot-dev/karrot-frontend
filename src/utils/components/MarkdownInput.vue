<template>
  <div class="relative-position q-mb-sm">
    <QInput
      ref="input"
      v-bind="$attrs"
      :value="value"
      type="textarea"
      :input-style="$attrs['input-style'] || 'min-height: 100px'"
      autogrow
      bottom-slots
      hide-hint
      v-on="$listeners"
    >
      <template
        v-if="icon"
        v-slot:before
      >
        <QIcon :name="icon" />
      </template>
      <template v-slot:hint>
        <div
          class="row markdown-helper"
        >
          <span class="text-bold">**{{ $t('MARKDOWN_INPUT.BOLD') }}**</span>
          <span class="text-italic">_{{ $t('MARKDOWN_INPUT.ITALIC') }}_</span>
          <span>~~<s>{{ $t('MARKDOWN_INPUT.STRIKE') }}</s>~~</span>
          <span>&gt;{{ $t('MARKDOWN_INPUT.QUOTE') }}</span>
          <a
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
            rel="nofollow noopener noreferrer"
            :title="$t('MARKDOWN_INPUT.HELP')"
          >
            <QIcon name="fas fa-question-circle" />
          </a>
        </div>
      </template>
      <template
        v-for="(_, slot) of $scopedSlots"
        v-slot:[slot]="scope"
      >
        <slot
          :name="slot"
          v-bind="scope"
        />
      </template>
    </QInput>
    <QBtn
      v-if="value"
      :label="$t('BUTTON.PREVIEW')"
      size="xs"
      color="primary"
      outline
      class="absolute-bottom-right bg-white"
      style="bottom: -10px"
      @click="show = true"
    >
      <QDialog v-model="show">
        <QCard class="markdown-input-preview-card">
          <QCardSection>
            <div class="text-h6">
              {{ $t('BUTTON.PREVIEW') }}
            </div>
          </QCardSection>
          <QCardSection>
            <Markdown
              v-if="value"
              :source="value"
            />
          </QCardSection>
          <QCardActions align="right">
            <QBtn
              v-close-popup
              flat
              :label="$t('BUTTON.CLOSE')"
              color="primary"
            />
          </QCardActions>
        </QCard>
      </QDialog>
    </QBtn>
  </div>
</template>

<script>
import {
  QInput,
  QIcon,
  QBtn,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
} from 'quasar'
import Markdown from '@/utils/components/Markdown'

export default {
  components: {
    QInput,
    QIcon,
    QBtn,
    QDialog,
    QCard,
    QCardSection,
    QCardActions,
    Markdown,
  },
  inheritAttrs: false,
  props: {
    value: {
      default: '',
      type: String,
    },
    icon: {
      default: null,
      type: String,
    },
  },
  data () {
    return {
      show: false,
    }
  },
  methods: {
    blur () {
      this.$refs.input.blur()
    },
    focus () {
      this.$refs.input.focus()
    },
  },
}
</script>

<style scoped lang="stylus">
.markdown-helper
  font-size .65rem
  padding-top 6px
  > *
    padding-right 10px
.markdown-input-preview-card
  min-width 60%
  max-width 700px
</style>
