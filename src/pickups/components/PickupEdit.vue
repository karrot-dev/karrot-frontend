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
          :label="$t('CREATEPICKUP.TIME')"
          :helper="$t('CREATEPICKUP.TIME_HELPER')"
          :error="hasError('date')"
          :error-message="firstError('date')"
        >
          <template v-slot:prepend>
            <QIcon name="access time" />
          </template>
          <div class="row">
            <QDate
              v-model="date"
              type="time"
              :format24h="is24h"
              :display-value="$d(date, 'hourMinute')"
            />
            <template v-if="edit.hasDuration">
              <div
                v-t="'TO'"
                class="q-pa-sm"
              />
              <QDate
                v-model="dateEnd"
                type="time"
                no-parent-field
                :format24h="is24h"
                :display-value="$d(edit.dateEnd, 'hourMinute') + ' (' + formattedDuration + ')'"
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
          :label="$t('CREATEPICKUP.DATE')"
          :helper="$t('CREATEPICKUP.DATE_HELPER')"
          :error="hasError('date')"
          :error-message="firstError('date')"
        >
          <template v-slot:prepend>
            <QIcon name="today" />
          </template>
          <QDate
            v-model="date"
            type="date"
            :min="now"
            :display-value="$d(date, 'yearMonthDay')"
          />
        </QField>
      </template>

      <QField
        icon="group"
        :label="$t('CREATEPICKUP.MAX_COLLECTORS')"
        :helper="$t('CREATEPICKUP.MAX_COLLECTORS_HELPER')"
        :error="hasError('maxCollectors')"
        :error-message="firstError('maxCollectors')"
        :warning="seriesMeta.isMaxCollectorsChanged"
        :warning-label="$t('CREATEPICKUP.DIFFERS_WARNING')"
      >
        <QInput
          v-model="edit.maxCollectors"
          type="number"
          :placeholder="$t('CREATEPICKUP.UNLIMITED')"
        >
          <template v-slot:after>
            <QIcon
              v-if="series ? series.maxCollectors !== edit.maxCollectors : false"
              name="undo"
              @click="edit.maxCollectors = series.maxCollectors"
            />
          </template>
        </QInput>
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

      <QInput
        v-model="edit.description"
        :label="$t('CREATEPICKUP.COMMENT')"
        :helper="$t('CREATEPICKUP.COMMENT_HELPER')"
        :error="hasError('description')"
        :error-message="firstError('description')"
        :warning="seriesMeta.isDescriptionChanged"
        :warning-label="$t('CREATEPICKUP.DIFFERS_WARNING')"
        type="textarea"
        max-length="500"
        @keyup.ctrl.enter="maybeSave"
      >
        <template v-slot:prepend>
          <QIcon name="info" />
        </template>
        <template v-slot:after>
          <QIcon
            v-if="series ? series.description !== edit.description : false"
            name="undo"
            @click="edit.description = series.description"
          />
        </template>
      </QInput>

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
          v-if="!isNew"
          type="button"
          :disable="!hasChanged"
          @click="reset"
        >
          {{ $t('BUTTON.RESET') }}
        </QBtn>

        <QBtn
          v-if="isNew"
          type="button"
          @click="$emit('cancel')"
        >
          {{ $t('BUTTON.CANCEL') }}
        </QBtn>
      </div>
    </form>
  </div>
</template>

<script>
import {
  QDate,
  QField,
  QSlider,
  QInput,
  QBtn,
  Dialog,
} from 'quasar'

import { is24h } from '@/base/i18n'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import reactiveNow from '@/utils/reactiveNow'

import differenceInSeconds from 'date-fns/difference_in_seconds'
import addSeconds from 'date-fns/add_seconds'
import addDays from 'date-fns/add_days'
import { defaultDuration } from '@/pickups/settings'
import { formatSeconds } from '@/pickups/utils'
import { objectDiff } from '@/utils/utils'

export default {
  name: 'PickupEdit',
  components: {
    QDate,
    QField,
    QSlider,
    QInput,
    QBtn,
  },
  mixins: [editMixin, statusMixin],
  props: {
    series: {
      type: Object,
      default: null,
    },
  },
  computed: {
    is24h,
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
    dateEnd: {
      get () {
        return this.edit.dateEnd
      },
      set (val) {
        if (val <= this.edit.date) {
          // if the value is in the past add a day (allows pickups over midnight)
          this.edit.dateEnd = addDays(val, 1)
          return
        }

        const duration = differenceInSeconds(val, this.edit.date)
        const twentyFourHours = 24 * 60 * 60
        if (duration > twentyFourHours) {
          const cappedDuration = duration % twentyFourHours
          this.edit.dateEnd = addSeconds(this.edit.date, cappedDuration)
          return
        }

        this.edit.dateEnd = val
      },
    },
    formattedDuration () {
      return formatSeconds(differenceInSeconds(this.edit.dateEnd, this.edit.date))
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
    toggleDuration () {
      this.hasDuration = !this.hasDuration
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
</style>
