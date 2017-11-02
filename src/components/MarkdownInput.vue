<template>
  <div>
    <q-tabs inverted align="right" position="bottom" v-model="tab">
      <q-tab default name="edit" slot="title" :label="$t('BUTTON.EDIT')" :hidden="tab === 'edit'" />
      <q-tab v-if="value" name="preview" slot="title" :label="$t('BUTTON.PREVIEW')" :hidden="tab === 'preview'" />
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

