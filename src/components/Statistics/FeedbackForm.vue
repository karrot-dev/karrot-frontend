<template>
  <form
    @submit.prevent="maybeSave"
  >
    <MarkdownInput :value="edit.comment">
      <q-input
        v-model="edit.comment"
        type="textarea"
        :placeholder="$t('PICKUP_FEEDBACK.COMMENT_PLACEHOLDER')"
        autocomplete="off"
        :min-rows="1"
        @keyup.ctrl.enter="maybeSave"
      />
    </MarkdownInput>

    <AmountPicker
      v-model="edit.weight"
      style="margin-top: 40px"
    />

    <div
      v-if="hasAnyError"
      class="text-negative"
      style="margin-top: 3em"
    >
      <i class="fas fa-exclamation-triangle"/>
      {{ anyFirstError }}
    </div>

    <div class="row justify-end generic-margin group">
      <q-btn
        type="button"
        @click="reset"
        v-if="!isNew"
        :disable="!hasChanged"
      >
        {{ $t('BUTTON.RESET') }}
      </q-btn>
      <q-btn
        type="submit"
        color="secondary"
        :loading="isPending"
        :disable="!canSave"
        v-t="isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES'"
      />
    </div>
  </form>
</template>

<script>
import { QCard, QField, QInput, QBtn, QSelect } from 'quasar'
import AmountPicker from './AmountPicker'
import MarkdownInput from '@/components/MarkdownInput'
import editMixin from '@/mixins/editMixin'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: { QCard, QField, QInput, QBtn, QSelect, AmountPicker, MarkdownInput },
  mixins: [statusMixin, editMixin],
  computed: {
    canSave () {
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
  },
  methods: {
    maybeSave () {
      if (!this.canSave) return
      this.save()
    },
  },
}
</script>
