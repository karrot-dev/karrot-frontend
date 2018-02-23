<template>
  <div
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <form @submit.prevent="maybeSave">
      <q-field
        icon="fa-repeat"
        :label="$t('CREATEPICKUP.FREQUENCY')"
      >
        <q-option-group
          type="radio"
          v-model="edit.rule.isCustom"
          :options="[
            { label: $t('CREATEPICKUP.WEEKLY'), value: false },
            { label: $t('CREATEPICKUP.CUSTOM'), value: true },
          ]"
        />
      </q-field>

      <div v-if="!edit.rule.isCustom">
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
            v-model="byDay"
            :options="dayOptions"
          />
        </q-field>
      </div>

      <div v-else>
        <q-field
          icon="access time"
          :label="$t('CREATEPICKUP.STARTDATE')"
          :helper="$t('CREATEPICKUP.STARTDATE_HELPER')"
          :error="hasError('startDate')"
          :error-label="firstError('startDate')"
        >
          <q-datetime
            type="datetime"
            v-model="edit.startDate"
            :format24h="is24h"
            :display-value="$d(edit.startDate, 'long')"
          />
        </q-field>
        <q-field
          icon="code"
          :label="$t('CREATEPICKUP.RRULE')"
          :error="hasError('rule')"
          :error-label="firstError('rule')"
        >
          <q-input
            v-model="edit.rule.custom"
            type="textarea"
            @keyup.ctrl.enter="maybeSave"
          />
          <div class="q-field-bottom">
            <i18n path="CREATEPICKUP.RRULE_HELPER">
              <a
                place="ruleHelper"
                href="https://www.kanzaki.com/docs/ical/rrule.html"
                target="_blank"
                rel="noopener nofollow noreferrer"
                style="text-decoration: underline"
                v-t="'CREATEPICKUP.RRULE_HELPER_URL'"
              />
              <a
                place="ruleExample"
                href="https://jakubroztocil.github.io/rrule/#/rfc/FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1"
                target="_blank"
                rel="noopener nofollow noreferrer"
                style="text-decoration: underline"
                v-t="'CREATEPICKUP.RRULE_EXAMPLE'"
              />
              <a
                place="ruleExample2"
                href="https://jakubroztocil.github.io/rrule/#/rfc/FREQ=WEEKLY;INTERVAL=2;BYDAY=MO"
                target="_blank"
                rel="noopener nofollow noreferrer"
                style="text-decoration: underline"
                v-t="'CREATEPICKUP.RRULE_EXAMPLE2'"
              />
            </i18n>
          </div>
        </q-field>
      </div>

      <q-field
        icon="group"
        :label="$t('CREATEPICKUP.MAX_COLLECTORS')"
        :helper="$t('CREATEPICKUP.MAX_COLLECTORS_HELPER')"
        :error="hasError('maxCollectors')"
        :error-label="firstError('maxCollectors')"
      >
        <q-input
          v-model="edit.maxCollectors"
          type="number"
          :placeholder="$t('CREATEPICKUP.UNLIMITED')"
        />
        <q-slider
          v-if="edit.maxCollectors > 0 && edit.maxCollectors <= 10"
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
          @keyup.ctrl.enter="maybeSave"
        />
      </q-field>

      <div
        v-if="hasNonFieldError"
        class="text-negative"
      >
        {{ firstNonFieldError }}
      </div>

      <div class="actionButtons">
        <q-btn
          type="submit"
          color="primary"
          :disable="!canSave"
          loader
          :value="isPending"
        >
          {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
        </q-btn>
        <q-btn
          type="button"
          @click="$emit('cancel')"
          v-if="isNew"
        >
          {{ $t('BUTTON.CANCEL') }}
        </q-btn>
        <q-btn
          type="button"
          color="red"
          @click="destroy"
          v-if="!isNew"
        >
          {{ $t('BUTTON.DELETE') }}
        </q-btn>
        <q-btn
          type="button"
          @click="reset"
          :disable="!hasChanged"
        >
          {{ $t('BUTTON.RESET') }}
        </q-btn>
      </div>
    </form>
  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QInput, QBtn, QSelect, Dialog, QOptionGroup, QTabs, QTab, QTabPane } from 'quasar'
import editMixin from '@/mixins/editMixin'
import statusMixin from '@/mixins/statusMixin'

import { is24h, dayOptions } from '@/i18n'

export default {
  mixins: [editMixin, statusMixin],
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QInput, QBtn, QSelect, QOptionGroup, QTabs, QTab, QTabPane,
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
    ruleMode: {
      get () {
        return this.edit.rule.isCustom ? 'custom' : 'weekly'
      },
      set (v) {
        this.edit.rule.isCustom = v === 'custom'
      },
    },
    byDay: {
      get () {
        return this.edit.rule.byDay
      },
      set (v) {
        // enforce having at least one day selected
        if (v.length > 0) this.edit.rule.byDay = v
      },
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
@import '~editbox'
</style>
