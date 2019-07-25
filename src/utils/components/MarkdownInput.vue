<template>
  <QInput
    :value="value"
    :label="label"
    :error="error"
    :error-message="errorMessage"
    type="textarea"
    input-style="min-height: 100px"
    autogrow
    bottom-slots
    :autocomplete="autocomplete"
    :autofocus="autofocus"
    @input="$emit('input', arguments[0])"
    @keyup="$emit('keyup', arguments[0])"
    @blur="$emit('blur')"
  >
    <template v-slot:before>
      <QIcon :name="icon" />
    </template>
    <template v-slot:hint>
      <div class="row justify-between">
        <div
          class="row markdown-helper"
        >
          <span class="text-bold">**{{ $t('MARKDOWN_INPUT.BOLD') }}**</span>
          <span class="text-italic">_{{ $t('MARKDOWN_INPUT.ITALIC') }}_</span>
          <span class="text-strike">~~{{ $t('MARKDOWN_INPUT.STRIKE') }}~~</span>
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
        <QBtn
          v-if="value"
          :label="$t('BUTTON.PREVIEW')"
          size="xs"
          color="primary"
          outline
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
  </QInput>
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
  props: {
    value: {
      default: '',
      type: String,
    },
    label: {
      default: null,
      type: String,
    },
    error: {
      default: false,
      type: Boolean,
    },
    errorMessage: {
      default: null,
      type: String,
    },
    icon: {
      default: null,
      type: String,
    },
    autofocus: {
      default: false,
      type: Boolean,
    },
    autocomplete: {
      default: true,
      type: Boolean,
    },
  },
  data () {
    return {
      show: false,
    }
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
