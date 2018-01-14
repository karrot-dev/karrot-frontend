<template>
  <form
    @submit.prevent="save"
    style="padding: 0 1.5em"
  >
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
        type="submit"
        color="secondary"
        loader
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
}
</script>

<style scoped lang="stylus">
</style>
