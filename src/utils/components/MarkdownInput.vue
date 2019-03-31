<template>
  <div>
    <QTabs
      v-model="tab"
      class="markdown-input"
      inverted
      align="right"
      position="top"
    >
      <QTab
        slot="title"
        class="markdown-input-tab"
        default
        name="edit"
        :label="$t('BUTTON.EDIT')"
        :disable="!value"
      />
      <QTab
        slot="title"
        class="markdown-input-tab"
        name="preview"
        :label="$t('BUTTON.PREVIEW')"
        :disable="!value"
      />
      <QTabPane name="edit">
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
      </QTabPane>
      <QTabPane name="preview">
        <div class="preview">
          <Markdown
            v-if="value"
            :source="value"
          />
        </div>
      </QTabPane>
    </QTabs>
  </div>
</template>

<script>
import { QTabs, QTab, QTabPane, QIcon } from 'quasar'
import Markdown from '@/utils/components/Markdown'

export default {
  components: { QTabs, QTab, QTabPane, QIcon, Markdown },
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
  padding 6px
  position relative
  top -6px
  background-color white
.markdown-helper
  padding-top 6px
  > *
    padding-right 10px
.markdown-input >>>
  .q-tab
    min-height 20px
    padding 6px 10px
    font-size .87em
  .q-tabs-head
    min-height 36px
    background none
  .q-tabs-panes
    border none
    .q-tab-pane
      border none
      padding 6px 0px
</style>
