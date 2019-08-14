<template>
  <form
    @submit.prevent="maybeSave"
  >
    <MarkdownInput
      v-model="edit.comment"
      class="q-mr-sm"
      :label="$t('PICKUP_FEEDBACK.COMMENT_PLACEHOLDER')"
      @keyup.ctrl.enter="maybeSave"
    />

    <AmountPicker
      v-if="!isBikeKitchen && !isGeneralPurpose"
      v-model="edit.weight"
      class="q-ml-sm"
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

    <div class="row justify-end q-ma-md q-gutter-sm">
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
  QBtn,
} from 'quasar'
import AmountPicker from './AmountPicker'
import MarkdownInput from '@/utils/components/MarkdownInput'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    QBtn,
    AmountPicker,
    MarkdownInput,
  },
  mixins: [statusMixin, editMixin],
  props: {
    isBikeKitchen: {
      type: Boolean,
      default: false,
    },
    isGeneralPurpose: {
      type: Boolean,
      default: false,
    },
  },
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
