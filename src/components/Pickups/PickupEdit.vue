<template>
  <div
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <form @submit.prevent="maybeSave">
      <q-field
        icon="access time"
        :label="$t('CREATEPICKUP.TIME')"
        :helper="$t('CREATEPICKUP.TIME_HELPER')"
        :error="hasError('date')"
        :error-label="firstError('date')"
      >
        <q-datetime
          type="time"
          v-model="edit.date"
          :format24h="is24h"
          :display-value="$d(edit.date, 'timeShort')"
        />
      </q-field>

      <q-field
        icon="today"
        :label="$t('CREATEPICKUP.DATE')"
        :helper="$t('CREATEPICKUP.DATE_HELPER')"
        :error="hasError('date')"
        :error-label="firstError('date')"
      >
        <q-datetime
          type="date"
          v-model="edit.date"
          :min="now"
          :display-value="$d(edit.date, 'dateShort')"
        />
      </q-field>

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
          color="red"
          @click="destroy"
          v-if="!isNew"
          :disable="!canDestroy"
        >
          <q-tooltip
            v-if="!canDestroy"
            v-t="'CREATEPICKUP.DELETION_FORBIDDEN_HELPER'"
          />
          {{ $t('BUTTON.DELETE') }}
        </q-btn>

        <q-btn
          type="button"
          @click="reset"
          v-if="!isNew"
          :disable="!hasChanged"
        >
          {{ $t('BUTTON.RESET') }}
        </q-btn>

        <q-btn
          type="button"
          @click="$emit('cancel')"
          v-if="isNew"
        >
          {{ $t('BUTTON.CANCEL') }}
        </q-btn>
      </div>
    </form>
  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect, QTooltip } from 'quasar'

import { is24h } from '@/i18n'
import editMixin from '@/mixins/editMixin'
import statusMixin from '@/mixins/statusMixin'
import dateFnsHelper from '@/services/dateFnsHelper'

export default {
  name: 'PickupEdit',
  mixins: [editMixin, statusMixin],
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect, QTooltip,
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
    canDestroy () {
      return this.edit.isEmpty
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
