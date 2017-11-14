<template>
  <div class="edit" :class="{ changed: hasChanged }">
    <form @submit.prevent="save">
      <q-field
        icon="access time"
        :label="$t('CREATEPICKUP.TIME')"
        :helper="$t('CREATEPICKUP.TIME_HELPER')"
        :error="hasError('time')"
        :error-label="firstError('time')"
        >
        <q-datetime type="time"
                    v-model="edit.date"
                    :format24h="is24h"
                    :display-value="$d(edit.date, 'timeShort')"/>
      </q-field>

      <q-field
        icon="today"
        :label="$t('CREATEPICKUP.DATE')"
        :helper="$t('CREATEPICKUP.DATE_HELPER')"
        :error="hasError('date')"
        :error-label="firstError('date')"
        >
        <q-datetime type="date" v-model="edit.date" :display-value="$d(edit.date, 'dateShort')"/>
      </q-field>

      <q-field
        icon="group"
        :label="$t('CREATEPICKUP.MAX_COLLECTORS')"
        :helper="$t('CREATEPICKUP.MAX_COLLECTORS_HELPER')"
        :error="hasError('maxCollectors')"
        :error-label="firstError('maxCollectors')"
        >
        <q-slider v-model="edit.maxCollectors" :min="1" :max="10" label label-always />
      </q-field>

      <q-field
        icon="info"
        :label="$t('CREATEPICKUP.COMMENT')"
        :helper="$t('CREATEPICKUP.COMMENT_HELPER')"
        >
        <q-input v-model="edit.description" type="textarea" max-length="500" />
      </q-field>

      <div class="text-negative">{{ firstError('nonFieldErrors') }}</div>

      <q-btn type="submit" color="primary" :disable="!isNew && !hasChanged" loader :value="isPending">{{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}</q-btn>
      <q-btn type="button" @click="reset" v-if="!isNew" :disable="!hasChanged">{{ $t('BUTTON.RESET') }}</q-btn>
      <q-btn type="button" @click="$emit('cancel')" v-if="isNew">{{ $t('BUTTON.CANCEL') }}</q-btn>
      <q-btn type="button" color="red" @click="destroy" v-if="!isNew" :disabled="value.collectorIds.length !== 0">{{ $t('BUTTON.DELETE') }}</q-btn>
    </form>
  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect } from 'quasar'

import { is24h } from '@/i18n'
import formMixin from '@/mixins/formMixin'
import statusMixin from '@/mixins/statusMixin'

export default {
  name: 'PickupEdit',
  mixins: [formMixin, statusMixin],
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect,
  },
  computed: {
    is24h,
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
</style>
