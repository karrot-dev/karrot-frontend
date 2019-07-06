<template>
  <div>
    <QTabs
      v-model="tab"
      class="markdown-input"
      align="right"
      position="top"
    >
      <QTab
        class="markdown-input-tab"
        name="edit"
        :label="$t('BUTTON.EDIT')"
        :disable="!value"
      />
      <QTab
        class="markdown-input-tab"
        name="preview"
        :label="$t('BUTTON.PREVIEW')"
        :disable="!value"
      />
    </QTabs>
    <QTabPanels
      v-model="tab"
    >
      <QTabPanel
        name="edit"
        class="q-pa-none"
      >
        <slot />
        <small
          v-if="!$q.platform.is.mobile && tab === 'edit'"
          class="row justify-end text-weight-light markdown-helper"
        >
          <b>**{{ $t('MARKDOWN_INPUT.BOLD') }}**</b>
          <i>_{{ $t('MARKDOWN_INPUT.ITALIC') }}_</i>
          <span>~~{{ $t('MARKDOWN_INPUT.STRIKE') }}~~</span>
          <span>&gt;{{ $t('MARKDOWN_INPUT.QUOTE') }}</span>
          <a
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
            rel="nofollow noopener noreferrer"
            :title="$t('MARKDOWN_INPUT.HELP')"
          >
            <QIcon name="fas fa-question-circle" />
          </a>
        </small>
      </QTabPanel>
      <QTabPanel
        name="preview"
        class="q-pa-none"
      >
        <div class="preview">
          <Markdown
            v-if="value"
            :source="value"
          />
        </div>
      </QTabPanel>
    </QTabPanels>
  </div>
</template>

<script>
import {
  QTabs,
  QTab,
  QTabPanels,
  QTabPanel,
  QIcon,
} from 'quasar'
import Markdown from '@/utils/components/Markdown'

export default {
  components: {
    QTabs,
    QTab,
    QTabPanels,
    QTabPanel,
    QIcon,
    Markdown,
  },
  props: {
    value: {
      default: '',
      type: String,
    },
  },
  data () {
    return {
      tab: 'edit',
    }
  },
}
</script>

<style scoped lang="stylus">
.preview
  border 1px solid rgba(0,0,0,.1)
  margin-top 6px
  padding 6px
  position relative
  top -6px
  background-color white
.markdown-helper
  padding-top 6px
  > *
    padding-right 10px
.markdown-input
  min-height unset
  .markdown-input-tab
    min-height unset
    >>> .q-tab__label
      font-size 12px
</style>
