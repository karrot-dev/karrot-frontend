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
      <QField
        v-if="canEditDate"
        icon="access time"
        :label="$t('CREATEPICKUP.TIME')"
        :helper="$t('CREATEPICKUP.TIME_HELPER')"
        :error="hasError('date')"
        :error-label="firstError('date')"
      >
        <QDatetime
          type="time"
          v-model="edit.date"
          :format24h="is24h"
          :display-value="$d(edit.date, 'hourMinute')"
          :disable="!canEditDate"
        />
      </QField>

      <QField
        v-if="canEditDate"
        icon="today"
        :label="$t('CREATEPICKUP.DATE')"
        :helper="$t('CREATEPICKUP.DATE_HELPER')"
        :error="hasError('date')"
        :error-label="firstError('date')"
      >
        <QDatetime
          type="date"
          v-model="edit.date"
          :min="now"
          :display-value="$d(edit.date, 'yearMonthDay')"
          :disable="!canEditDate"
        />
      </QField>

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
  QSlider,
  QOptionGroup,
  QInput,
  QBtn,
  QSelect,
  QTooltip,
  Dialog,
} from 'quasar'

import { is24h } from '@/base/i18n'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import dateFnsHelper from '@/utils/dateFnsHelper'

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
    QSlider,
    QOptionGroup,
    QInput,
    QBtn,
    QSelect,
    QTooltip,
  },
  computed: {
    is24h,
    now () {
      return dateFnsHelper.now
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
  },
  methods: {
    resetToSeriesButton (field) {
      return {
        icon: 'undo',
        condition: this.series && this.series[field] !== this.edit[field],
        handler: () => {
          this.edit[field] = this.series[field]
        },
      }
    },
    maybeSave () {
      if (!this.canSave) return
      this.save()
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
