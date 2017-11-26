<template>
  <div>
    <q-tabs class="markdown-input" inverted align="right" position="top" v-model="tab">
      <q-tab class="markdown-input-tab" default name="edit" slot="title" :label="$t('BUTTON.EDIT')"/>
      <q-tab class="markdown-input-tab" v-if="value" name="preview" slot="title" :label="$t('BUTTON.PREVIEW')"/>
      <q-tab-pane name="edit">
        <slot />
        <small v-if="!$q.platform.is.mobile && tab === 'edit'" class="row group pull-right light-paragraph">
          <b>**{{ $t('MARKDOWN_INPUT.BOLD') }}**</b>
          <i>_{{ $t('MARKDOWN_INPUT.ITALIC') }}_</i>
          <span>~~{{ $t('MARKDOWN_INPUT.STRIKE') }}~~</span>
          <span>&gt;{{ $t('MARKDOWN_INPUT.QUOTE') }}</span>
          <a href="https://guides.github.com/features/mastering-markdown/">
            <q-icon name="fa-question-circle" />
            <q-tooltip>{{ $t('MARKDOWN_INPUT.HELP') }}</q-tooltip>
          </a>
        </small>
        <div style="clear: both"/>
      </q-tab-pane>
      <q-tab-pane name="preview">
        <Markdown v-if="value" :source="value" />
      </q-tab-pane>
    </q-tabs>
  </div>
</template>

<script>
import { QTabs, QTab, QTabPane, QIcon, QTooltip } from 'quasar'
import Markdown from '@/components/Markdown'

export default {
  components: { QTabs, QTab, QTabPane, QIcon, QTooltip, Markdown },
  props: {
    value: { required: true },
  },
  data () {
    return {
      tab: 'edit',
    }
  },
}
</script>
<!-- UNSCOPED -->
<style lang="stylus">
.markdown-input > .q-tabs-head
  min-height 36px !important
</style>

<style scoped lang="stylus">
.markdown-input-tab
  min-height 20px !important
  padding 6px 10px !important
  font-size .87em !important
</style>
