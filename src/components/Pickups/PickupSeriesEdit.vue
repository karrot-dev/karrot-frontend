<template>
  <div
    class="edit"
    :class="{ changed: hasChanged }"
  >
    <form @submit.prevent="maybeSave">
      <q-field
        icon="access time"
        :label="$t('CREATEPICKUP.TIME')"
        :helper="$t('CREATEPICKUP.TIME_HELPER')"
        :error="hasError('startDate')"
        :error-label="firstError('startDate')"
      >
        <q-datetime
          type="time"
          v-model="edit.startDate"
          :format24h="is24h"
          :display-value="$d(edit.startDate, 'timeShort')"
        />
      </q-field>

      <q-field
        icon="today"
        :label="$t('CREATEPICKUP.WEEKDAYS')"
        :helper="$t('CREATEPICKUP.WEEKDAYS_HELPER')"
        :error="hasError('rule')"
        :error-label="firstError('rule')"
      >
        <q-select
          multiple
          toggle
          v-model="edit.rule.byDay"
          :options="dayOptions"
        />
      </q-field>

      <q-field
        icon="group"
        :label="$t('CREATEPICKUP.MAX_COLLECTORS')"
        :helper="$t('CREATEPICKUP.MAX_COLLECTORS_HELPER')"
        :error="hasError('maxCollectors')"
        :error-label="firstError('maxCollectors')"
      >
        <q-slider
          v-model="edit.maxCollectors"
          :min="1"
          :max="10"
          label
          label-always
        />
      </q-field>

      <q-field
        icon="info"
        :label="$t('CREATEPICKUP.COMMENT')"
        :helper="$t('CREATEPICKUP.COMMENT_HELPER')"
        :error="hasError('description')"
        :error-label="firstError('description')"
      >
        <q-input
          v-model="edit.description"
          type="textarea"
          max-length="500"
        />
      </q-field>

      <div
        v-if="hasNonFieldError"
        class="text-negative"
      >
        {{ firstNonFieldError }}
      </div>

      <div
        class="row"
        v-if="!isNew"
      >
        <div class="col-6 actionButton">
          <q-btn
            type="button"
            class="full-width"
            @click="reset"
            :disable="!hasChanged"
          >
            {{ $t('BUTTON.RESET') }}
          </q-btn>
        </div>
        <div class="col-6 actionButton">
          <q-btn
            type="button"
            class="full-width"
            color="red"
            @click="destroy"
            v-if="!isNew"
          >
            {{ $t('BUTTON.DELETE') }}
          </q-btn>
        </div>
      </div>
      <q-btn
        type="button"
        class="full-width actionButton"
        @click="$emit('cancel')"
        v-if="isNew"
      >
        {{ $t('BUTTON.CANCEL') }}
      </q-btn>
      <q-btn
        type="submit"
        class="full-width actionButton"
        color="primary"
        :disable="!canSave"
        loader
        :value="isPending"
      >
        {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
      </q-btn>
    </form>
  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QInput, QBtn, QSelect, Dialog } from 'quasar'
import editMixin from '@/mixins/editMixin'
import statusMixin from '@/mixins/statusMixin'

import { is24h, dayOptions } from '@/i18n'

export default {
  mixins: [editMixin, statusMixin],
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QInput, QBtn, QSelect,
  },
  watch: {
    // enforce having at least one day selected
    'edit.rule.byDay' (byDay) {
      if (byDay.length === 0) {
        this.edit.rule.byDay.push(...this.lastByDay)
      }
      else {
        this.lastByDay = [...byDay]
      }
    },
  },
  computed: {
    dayOptions,
    is24h,
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
    destroy (event) {
      Dialog.create({
        title: this.$t('PICKUPDELETE.DELETE_SERIES_TITLE'),
        message: this.$t('PICKUPDELETE.DELETE_SERIES_TEXT'),
        buttons: [
          this.$t('BUTTON.CANCEL'),
          {
            label: this.$t('BUTTON.YES'),
            handler: () => {
              this.$emit('destroy', this.value.id, event)
            },
          },
        ],
      })
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.edit
  width 100%
  padding 20px
  background-color $grey-1
  &.changed
    background-color $yellow-1
  .actionButton
    padding: 3px
</style>
