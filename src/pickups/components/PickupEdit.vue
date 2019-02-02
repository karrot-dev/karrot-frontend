<template>
  <div
    class="edit-box"
    :class="{ changed: hasChanged }"
  >

    <b
      v-if="edit.isDisabled"
      class="text-negative"
    >
      {{ $t('PICKUPLIST.PICKUP_DISABLED') }}
    </b>

    <form @submit.prevent="maybeSave">

      <template v-if="canEditDate">

        <QField
          icon="access time"
          :label="$t('CREATEPICKUP.TIME')"
          :helper="$t('CREATEPICKUP.TIME_HELPER')"
          :error="hasError('date')"
          :error-label="firstError('date')"
        >
          <QDatetime
            type="time"
            v-model="date"
            :format24h="is24h"
            :display-value="$d(date, 'hourMinute')"
          />
        </QField>

        <QField
          icon="today"
          :label="$t('CREATEPICKUP.DATE')"
          :helper="$t('CREATEPICKUP.DATE_HELPER')"
          :error="hasError('date')"
          :error-label="firstError('date')"
        >
          <QDatetime
            type="date"
            v-model="date"
            :min="now"
            :display-value="$d(date, 'yearMonthDay')"
          />
        </QField>

        <QField
          icon="arrow_right_alt"
          :label="$t('CREATEPICKUP.DURATION')"
          :helper="edit.hasDuration && $t('CREATEPICKUP.DURATION_HELPER')"
          :error="hasError('duration')"
          :error-label="firstError('duration')"
        >
          <QCheckbox
            v-model="hasDuration"
            :label="$t('CREATEPICKUP.ENABLE_DURATION')"
          />
          <QSelect
            v-show="edit.hasDuration"
            v-model="duration"
            :options="durationOptions"
          />
        </QField>

        <!--
        <QField
          icon="arrow_right_alt"
          :label="$t('CREATEPICKUP.DURATION')"
          :helper="$t('CREATEPICKUP.DURATION_HELPER')"
          :error="hasError('duration')"
          :error-label="firstError('duration')"
        >
          <QSelect
            v-model="duration"
            :options="durationOptions"
          />
        </QField>
        -->
      </template>

      <QField
        icon="group"
        :label="$t('CREATEPICKUP.MAX_COLLECTORS')"
        :helper="$t('CREATEPICKUP.MAX_COLLECTORS_HELPER')"
        :error="hasError('maxCollectors')"
        :error-label="firstError('maxCollectors')"
        :warning="seriesMeta.isMaxCollectorsChanged"
        :warning-label="$t('CREATEPICKUP.DIFFERS_WARNING')"
      >
        <QInput
          v-model="edit.maxCollectors"
          type="number"
          :placeholder="$t('CREATEPICKUP.UNLIMITED')"
          :after="[resetToSeriesButton('maxCollectors')]"
        />
        <QSlider
          v-if="edit.maxCollectors > 0 && edit.maxCollectors <= 10"
          v-model="edit.maxCollectors"
          :min="1"
          :max="10"
          label
          label-always
          :color="seriesMeta.isMaxCollectorsChanged ? 'warning' : ''"
        />
      </QField>

      <QField
        icon="info"
        :label="$t('CREATEPICKUP.COMMENT')"
        :helper="$t('CREATEPICKUP.COMMENT_HELPER')"
        :error="hasError('description')"
        :error-label="firstError('description')"
        :warning="seriesMeta.isDescriptionChanged"
        :warning-label="$t('CREATEPICKUP.DIFFERS_WARNING')"
      >
        <QInput
          v-model="edit.description"
          type="textarea"
          max-length="500"
          :after="[resetToSeriesButton('description')]"
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
          v-if="!isNew && !edit.isDisabled"
          type="button"
          color="red"
          @click="disable"
        >
          {{ $t('BUTTON.DISABLE') }}
        </QBtn>

        <QBtn
          v-if="!isNew && edit.isDisabled"
          type="button"
          color="secondary"
          @click="enable"
        >
          {{ $t('BUTTON.ENABLE') }}
        </QBtn>

        <QBtn
          type="button"
          @click="reset"
          v-if="!isNew"
          :disable="!hasChanged"
        >
          {{ $t('BUTTON.RESET') }}
        </QBtn>

        <QBtn
          type="button"
          @click="$emit('cancel')"
          v-if="isNew"
        >
          {{ $t('BUTTON.CANCEL') }}
        </QBtn>
      </div>
    </form>
  </div>
</template>

<script>
import {
  QDatetime,
  QField,
  QCheckbox,
  QSlider,
  QInput,
  QBtn,
  QSelect,
  Dialog,
} from 'quasar'

import { is24h } from '@/base/i18n'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import reactiveNow from '@/utils/reactiveNow'

import differenceInSeconds from 'date-fns/difference_in_seconds'
import addSeconds from 'date-fns/add_seconds'
import { defaultDuration } from '@/pickups/settings'
import { durationOptions } from '@/pickups/utils'
import { objectDiff } from '@/utils/utils'

export default {
  name: 'PickupEdit',
  mixins: [editMixin, statusMixin],
  props: {
    series: {
      type: Object,
      default: null,
    },
  },
  components: {
    QDatetime,
    QField,
    QCheckbox,
    QSlider,
    QInput,
    QBtn,
    QSelect,
  },
  computed: {
    is24h,
    durationOptions,
    now () {
      return reactiveNow.value
    },
    canSave () {
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    canEditDate () {
      if (this.edit.series) return false
      return true
    },
    seriesMeta () {
      if (!this.edit.seriesMeta) return {}
      return this.edit.seriesMeta
    },
    date: {
      get () {
        return this.edit.date
      },
      set (val) {
        // keep the duration the same when setting the date
        const duration = differenceInSeconds(this.edit.dateEnd, this.edit.date)
        this.edit.dateEnd = addSeconds(val, duration)
        this.edit.date = val
      },
    },
    duration: {
      get () {
        return differenceInSeconds(this.edit.dateEnd, this.edit.date)
      },
      set (val) {
        this.edit.dateEnd = addSeconds(this.edit.date, val)
      },
    },
    hasDuration: {
      get () {
        return this.edit.hasDuration
      },
      set (val) {
        // reset to default duration when un-setting hasDuration
        if (!val) this.edit.dateEnd = addSeconds(this.edit.date, defaultDuration)
        this.edit.hasDuration = val
      },
    },
  },
  methods: {
    resetToSeriesButton (field) {
      return {
        icon: 'undo',
        condition: this.series ? this.series[field] !== this.edit[field] : false,
        handler: () => {
          this.edit[field] = this.series[field]
        },
      }
    },
    maybeSave () {
      if (!this.canSave) return
      this.save()
    },
    // Overrides mixin method to always provide start date if we have modified end date
    getPatchData () {
      const diff = objectDiff(this.value, this.edit)
      if (diff.dateEnd && !diff.date) diff.date = this.edit.date
      return diff
    },
    async disable () {
      try {
        const description = await Dialog.create({
          title: this.$t('CREATEPICKUP.DISABLE_TITLE'),
          message: this.$t('CREATEPICKUP.ENABLE_DISABLE_MESSAGE'),
          prompt: {
            model: this.edit.description,
            type: 'text',
          },
          cancel: this.$t('BUTTON.CANCEL'),
          ok: this.$t('BUTTON.YES'),
        })
        this.$emit('save', {
          id: this.edit.id,
          description,
          isDisabled: true,
        })
      }
      catch (e) {}
    },
    async enable () {
      try {
        const description = await Dialog.create({
          title: this.$t('CREATEPICKUP.ENABLE_TITLE'),
          message: this.$t('CREATEPICKUP.ENABLE_DISABLE_MESSAGE'),
          prompt: {
            // reset if there's a series default
            model: this.series ? this.series.description : this.edit.description,
            type: 'text',
          },
          cancel: this.$t('BUTTON.CANCEL'),
          ok: this.$t('BUTTON.YES'),
        })
        this.$emit('save', {
          id: this.edit.id,
          description,
          isDisabled: false,
        })
      }
      catch (e) {}
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
.q-field-content .q-checkbox
  padding-top 6px
  padding-bottom 6px
</style>
