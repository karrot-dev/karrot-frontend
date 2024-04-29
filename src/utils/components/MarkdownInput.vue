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
        input-class="overscroll-contain"
        :input-style="{ minHeight: '100px', ...$attrs['input-style'] }"
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
          <div class="row markdown-helper">
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

import Markdown from '@/utils/components/Markdown.vue'
import MaybeMentionable from '@/utils/components/MaybeMentionable.vue'

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
  mounted () {
    this.$refs.input.$el.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount () {
    this.$refs.input.$el.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    handleKeydown (event) {
      const { key, ctrlKey, altKey, shiftKey } = event
      if (ctrlKey && key.toLowerCase() === 'b') {
        this.applyMarkdown('**', '**')
        event.preventDefault()
      }
      else if (ctrlKey && key.toLowerCase() === 'i') {
        this.applyMarkdown('_', '_')
        event.preventDefault()
      }
      else if (ctrlKey && key.toLowerCase() === 'u') {
        this.applyMarkdown('<u>', '</u>')
        event.preventDefault()
      }
      else if ((altKey && shiftKey && key === '5') || (ctrlKey && altKey && key === '5')) {
        this.applyMarkdown('~~', '~~')
        event.preventDefault()
      }
    },
    applyMarkdown (prefix, suffix) {
      const textArea = this.$refs.input.$el
      const start = textArea.selectionStart
      const end = textArea.selectionEnd
      const selectedText = textArea.value.substring(start, end)
      const beforeText = textArea.value.substring(0, start)
      const afterText = textArea.value.substring(end)

      const newText = beforeText + prefix + selectedText + suffix + afterText
      this.$emit('update:modelValue', newText)
      this.$nextTick(() => {
        textArea.selectionStart = start + prefix.length
        textArea.selectionEnd = end + prefix.length
        textArea.focus()
      })
    },
    onApplyMentions () {
      // It loses focus when you click the mention menu without this
      const input = this.$refs.input.$el
      if (!input) return
      requestAnimationFrame(() => {
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
