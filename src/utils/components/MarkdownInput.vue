<template>
  <MaybeMentionable
    :disable="!mentions"
    @apply="onApplyMentions"
  >
    <div class="relative-position q-mb-sm">
      <QInput
        ref="input"
        v-bind="$attrs"
        :model-value="modelValue"
        type="textarea"
        :input-style="$attrs['input-style'] || 'min-height: 100px'"
        autogrow
        bottom-slots
        hide-hint
      >
        <template
          v-if="icon"
          #before
        >
          <QIcon :name="icon" />
        </template>
        <template #hint>
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
          v-for="(_, slotName) in $slots"
          #[slotName]="slotData"
        >
          <slot
            :name="slotName"
            v-bind="slotData || {}"
          />
        </template>
      </QInput>
      <QBtn
        v-if="modelValue"
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
                v-if="modelValue"
                :source="modelValue"
                :mentions="mentions"
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
  </MaybeMentionable>
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
import MaybeMentionable from '@/utils/components/MaybeMentionable'

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
    MaybeMentionable,
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      default: '',
      type: String,
    },
    icon: {
      default: null,
      type: String,
    },
    mentions: {
      default: false,
      type: Boolean,
    },
  },
  data () {
    return {
      show: false,
    }
  },
  methods: {
    onApplyMentions () {
      // It loses focus when you click the mention menu without this
      const input = this.$refs.input
      if (!input) return
      setImmediate(() => {
        input.focus()
      })
    },
    blur () {
      this.$refs.input.blur()
    },
    focus () {
      this.$refs.input.focus()
    },
  },
}
</script>

<style scoped lang="sass">
.markdown-helper
  padding-top: 6px
  font-size: .65rem

  > *
    padding-right: 10px

.markdown-input-preview-card
  min-width: 60%
  max-width: 700px
</style>
