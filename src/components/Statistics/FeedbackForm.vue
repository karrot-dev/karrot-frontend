<template>
  <form @submit.prevent="maybeSave">
    <AmountPicker v-model="edit.weight"/>
    <q-field
      style="margin-top: 2em; padding: 0 .5em"
      icon="fa-star"
      :label="$t('PICKUP_FEEDBACK.COMMENT')"
      :error="hasError('comment')"
      :error-label="firstError('comment')"
    >
      <q-input
        v-model="edit.comment"
        type="textarea"
        :placeholder="$t('PICKUP_FEEDBACK.COMMENT_PLACEHOLDER')"
        autocomplete="off"
        :min-rows="2"
        @keyup.ctrl.enter="maybeSave"
      />
    </q-field>

    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      <i class="fa fa-exclamation-triangle"/>
      {{ firstNonFieldError }}
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
        :value="isPending"
        v-t="isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES'"
      />
    </div>
  </form>
</template>

<script>
import { QCard, QField, QInput, QBtn, QSelect } from 'quasar'
import AmountPicker from './AmountPicker'
import editMixin from '@/mixins/editMixin'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: { QCard, QField, QInput, QBtn, QSelect, AmountPicker },
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

<style scoped lang="stylus">
</style>
