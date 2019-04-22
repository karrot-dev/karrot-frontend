<template>
  <form
    @submit.prevent="maybeSave"
  >
    <MarkdownInput :value="edit.comment">
      <QInput
        v-model="edit.comment"
        type="textarea"
        :placeholder="$t('PICKUP_FEEDBACK.COMMENT_PLACEHOLDER')"
        autocomplete="off"
        rows="1"
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
      <i class="fas fa-exclamation-triangle" />
      {{ anyFirstError }}
    </div>

    <div class="row justify-end generic-margin group">
      <QBtn
        v-if="!isNew"
        type="button"
        :disable="!hasChanged"
        @click="reset"
      >
        {{ $t('BUTTON.RESET') }}
      </QBtn>
      <QBtn
        v-t="isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES'"
        type="submit"
        color="secondary"
        :loading="isPending"
        :disable="!canSave"
      />
    </div>
  </form>
</template>

<script>
import {
  QInput,
  QBtn,
} from 'quasar'
import AmountPicker from './AmountPicker'
import MarkdownInput from '@/utils/components/MarkdownInput'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    QInput,
    QBtn,
    AmountPicker,
    MarkdownInput,
  },
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
