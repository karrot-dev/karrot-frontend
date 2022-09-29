<template>
  <QList class="history-diff">
    <QItem class="bg-accent text-white">
      <QItemSection side>
        <QIcon
          color="white"
          name="fas fa-pencil-alt"
        />
      </QItemSection>
      <QItemSection>
        {{ $t('HISTORY.CONTENT_CHANGES') }}
      </QItemSection>
    </QItem>
    <div
      class="q-pa-md"
    >
      <div
        v-for="patch in patches"
        :key="patch.field"
      >
        <div class="q-mb-sm">
          <template v-if="typus.startsWith('AGREEMENT')">
            {{ $t(`AGREEMENT.${patch.field.toUpperCase()}`) }}
          </template>
          <template v-else>
            {{ patch.field }}
          </template>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <div v-html="patch.html" />
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </div>
  </QList>
</template>
<script setup>
import { computed } from '@vue/compat'
import { createPatch } from 'diff'
import * as Diff2html from 'diff2html'
import {
  QList,
  QItem,
  QItemSection,
  QIcon,
} from 'quasar'
import 'diff2html/bundles/css/diff2html.min.css'

const props = defineProps({
  typus: {
    type: String,
    required: true,
  },
  changes: {
    type: Object,
    required: true,
  },
})

const patches = computed(() => {
  return Object.keys(props.changes).map(key => {
    const change = props.changes[key]
    if (change.before === change.after) return null
    return {
      field: key,
      html: Diff2html.html(createPatch(key, change.before, change.after)),
    }
  }).filter(Boolean)
})
</script>

<style scoped lang="sass">
.history-diff
  ::v-deep(.d2h-file-list-wrapper),
  ::v-deep(.d2h-file-header)
    display: none

  ::v-deep(..d2h-file-wrapper)
    border: none

</style>
