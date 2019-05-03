<template>
  <div
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <form @submit.prevent="maybeSave">
      <QField
        icon="fas fa-redo"
        :label="$t('CREATEPICKUP.FREQUENCY')"
      >
        <QOptionGroup
          v-model="edit.rule.isCustom"
          type="radio"
          :options="[
            { label: $t('CREATEPICKUP.WEEKLY'), value: false },
            { label: $t('CREATEPICKUP.CUSTOM'), value: true },
          ]"
        />
      </QField>

      <div v-if="!edit.rule.isCustom">
        <QField
          icon="access time"
          :label="$t('CREATEPICKUP.TIME')"
          :helper="$t('CREATEPICKUP.TIME_HELPER')"
          :error="hasError('startDate')"
          :error-label="firstError('startDate')"
        >
          <div class="row">
            <QDatetime
              v-model="edit.startDate"
              type="time"
              :format24h="is24h"
              :display-value="$d(edit.startDate, 'hourMinute')"
            />
            <template v-if="hasDuration">
              <div
                v-t="'TO'"
                class="q-pa-sm"
              />
              <QDatetime
                v-model="endDate"
                type="time"
                no-parent-field
                :format24h="is24h"
                :display-value="$d(endDate, 'hourMinute') + ' (' + formattedDuration + ')'"
                :after="[{ icon: 'cancel', handler: toggleDuration }]"
              />
            </template>
            <QBtn
              v-else
              class="q-ml-sm q-mt-sm no-shadow"
              size="xs"
              round
              color="grey"
              icon="fas fa-plus"
              @click.stop.prevent="toggleDuration"
            />
          </div>
        </QField>
        <QField
          icon="today"
          :label="$t('CREATEPICKUP.WEEKDAYS')"
          :helper="$t('CREATEPICKUP.WEEKDAYS_HELPER')"
          :error="hasError('rule')"
          :error-label="firstError('rule')"
        >
          <QSelect
            v-model="byDay"
            multiple
            toggle
            :options="dayOptions"
          />
        </QField>
      </div>

      <div v-else>
        <QField
          icon="access time"
          :label="$t('CREATEPICKUP.STARTDATE')"
          :helper="$t('CREATEPICKUP.STARTDATE_HELPER')"
          :error="hasError('startDate')"
          :error-label="firstError('startDate')"
        >
          <QDatetime
            v-model="edit.startDate"
            type="datetime"
            :format24h="is24h"
            :display-value="$d(edit.startDate, 'long')"
          />
        </QField>
        <QField
          icon="code"
          :label="$t('CREATEPICKUP.RRULE')"
          :error="hasError('rule')"
          :error-label="firstError('rule')"
        >
          <QInput
            v-model="edit.rule.custom"
            type="textarea"
            @keyup.ctrl.enter="maybeSave"
          />
          <div class="q-field-bottom">
            <i18n path="CREATEPICKUP.RRULE_HELPER">
              <a
                v-t="'CREATEPICKUP.RRULE_HELPER_URL'"
                place="ruleHelper"
                href="https://www.kanzaki.com/docs/ical/rrule.html"
                target="_blank"
                rel="noopener nofollow noreferrer"
                style="text-decoration: underline"
              />
              <a
                v-t="'CREATEPICKUP.RRULE_EXAMPLE'"
                place="ruleExample"
                href="https://jakubroztocil.github.io/rrule/#/rfc/FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1"
                target="_blank"
                rel="noopener nofollow noreferrer"
                style="text-decoration: underline"
              />
              <a
                v-t="'CREATEPICKUP.RRULE_EXAMPLE2'"
                place="ruleExample2"
                href="https://jakubroztocil.github.io/rrule/#/rfc/FREQ=WEEKLY;INTERVAL=2;BYDAY=MO"
                target="_blank"
                rel="noopener nofollow noreferrer"
                style="text-decoration: underline"
              />
            </i18n>
          </div>
        </QField>
      </div>

      <QField
        icon="group"
        :label="$t('CREATEPICKUP.MAX_COLLECTORS')"
        :helper="$t('CREATEPICKUP.MAX_COLLECTORS_HELPER')"
        :error="hasError('maxCollectors')"
        :error-label="firstError('maxCollectors')"
      >
        <QInput
          v-model="edit.maxCollectors"
          type="number"
          :placeholder="$t('CREATEPICKUP.UNLIMITED')"
        />
        <QSlider
          v-if="edit.maxCollectors > 0 && edit.maxCollectors <= 10"
          v-model="edit.maxCollectors"
          :min="1"
          :max="10"
          label
          label-always
        />
      </QField>

      <QField
        icon="info"
        :label="$t('CREATEPICKUP.COMMENT')"
        :helper="$t('CREATEPICKUP.COMMENT_HELPER')"
        :error="hasError('description')"
        :error-label="firstError('description')"
      >
        <QInput
          v-model="edit.description"
          type="textarea"
          max-length="500"
          @keyup.ctrl.enter="maybeSave"
        />
      </QField>

      <div
        v-if="hasNonFieldError"
        class="text-negative"
      >
        {{ firstNonFieldError }}
      </div>

      <div class="actionButtons">
        <QBtn
          type="submit"
          color="primary"
          :disable="!canSave"
          :loading="isPending"
        >
          {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
        </QBtn>
        <QBtn
          v-if="isNew"
          type="button"
          @click="$emit('cancel')"
        >
          {{ $t('BUTTON.CANCEL') }}
        </QBtn>
        <QBtn
          v-if="!isNew"
          type="button"
          color="red"
          @click="destroy"
        >
          {{ $t('BUTTON.DELETE') }}
        </QBtn>
        <QBtn
          type="button"
          :disable="!hasChanged"
          @click="reset"
        >
          {{ $t('BUTTON.RESET') }}
        </QBtn>
      </div>
    </form>
  </div>
</template>

<script>
import {
  QDatetime,
  QField,
  QSlider,
  QInput,
  QBtn,
  QSelect,
  Dialog,
  QOptionGroup,
} from 'quasar'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'

import { is24h, dayOptions } from '@/base/i18n'

import { defaultDuration } from '@/pickups/settings'
import { formatSeconds } from '@/pickups/utils'

import addSeconds from 'date-fns/add_seconds'
import addDays from 'date-fns/add_days'
import differenceInSeconds from 'date-fns/difference_in_seconds'

export default {
  components: {
    QDatetime,
    QField,
    QSlider,
    QInput,
    QBtn,
    QSelect,
    QOptionGroup,
  },
  mixins: [editMixin, statusMixin],
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
    hasDuration: {
      get () {
        return Boolean(this.edit.duration)
      },
      set (val) {
        if (val) {
          if (!this.edit.duration) this.edit.duration = defaultDuration
        }
        else {
          this.edit.duration = null
        }
      },
    },
    endDate: {
      get () {
        return addSeconds(this.edit.startDate, this.edit.duration)
      },
      set (val) {
        if (val < this.edit.startDate) {
          // if the value is in the past add a day (allows pickups over midnight)
          val = addDays(val, 1)
        }
        this.edit.duration = differenceInSeconds(val, this.edit.startDate)
      },
    },
    formattedDuration () {
      return this.edit.duration && formatSeconds(this.edit.duration)
    },
  },
  watch: {
    isPending (val) {
      const hasExceptions = () => {
        const { pickups } = this.edit
        return pickups.some(({ seriesMeta }) => seriesMeta.isDescriptionChanged || seriesMeta.isMaxCollectorsChanged || !seriesMeta.matchesRule)
      }
      if (!val && !this.hasAnyError && hasExceptions()) {
        Dialog.create({
          title: this.$t('CREATEPICKUP.EXCEPTIONS_TITLE'),
          message: this.$t('CREATEPICKUP.EXCEPTIONS_MESSAGE', { upcomingLabel: this.$t('PICKUPMANAGE.UPCOMING_PICKUPS_IN_SERIES') }),
          ok: this.$t('BUTTON.YES'),
        }).catch(() => {})
      }
    },
  },
  methods: {
    toggleDuration () {
      this.hasDuration = !this.hasDuration
    },
    maybeSave () {
      if (!this.canSave) return
      this.save()
    },
    destroy (event) {
      Dialog.create({
        title: this.$t('PICKUPDELETE.DELETE_SERIES_TITLE'),
        message: this.$t('PICKUPDELETE.DELETE_SERIES_TEXT'),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.YES'),
      })
        .then(() => this.$emit('destroy', this.value.id, event))
        .catch(() => {})
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
