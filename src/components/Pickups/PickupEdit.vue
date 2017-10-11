<template>
  <div class="edit" :class="{ changed: hasChanged }">

    <q-field
      icon="access time"
      :label="$t('CREATEPICKUP.TIME')"
      :helper="$t('CREATEPICKUP.TIME_HELPER')">
      <q-datetime type="time"
                  v-model="pickupEdit.date"
                  :format24h="is24h"
                  :display-value="$d(pickupEdit.date, 'timeShort')"/>
    </q-field>

    <q-field
      icon="today"
      :label="$t('CREATEPICKUP.DATE')"
      :helper="$t('CREATEPICKUP.DATE_HELPER')">
      <q-datetime type="date" v-model="pickupEdit.date" :display-value="$d(pickupEdit.date, 'dateShort')"/>
    </q-field>

    <q-field
      icon="group"
      :label="$t('CREATEPICKUP.MAX_COLLECTORS')"
      :helper="$t('CREATEPICKUP.MAX_COLLECTORS_HELPER')">
      <q-slider v-model="pickupEdit.maxCollectors" :min="1" :max="10" label label-always />
    </q-field>

    <q-field
      icon="info"
      :label="$t('CREATEPICKUP.COMMENT')":helper="$t('CREATEPICKUP.COMMENT_HELPER')">
      <q-input v-model="pickupEdit.description" type="textarea" :min-rows="1" :max-height="100" />
    </q-field>

    <q-btn color="primary" @click="save" :disable="!hasChanged">{{ $t('BUTTON.SAVE_CHANGES') }}</q-btn>
    <q-btn @click="reset" :disable="!hasChanged">{{ $t('BUTTON.RESET') }}</q-btn>

  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect } from 'quasar'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'
import { is24h } from '@/i18n'

export default {
  name: 'PickupEdit',
  props: {
    pickup: { required: true },
  },
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect,
  },
  data () {
    return {
      pickupEdit: cloneDeep(this.pickup),
    }
  },
  watch: {
    pickup () {
      this.reset()
    },
  },
  computed: {
    is24h,
    hasChanged () {
      return !deepEqual(this.pickup, this.pickupEdit)
    },
  },
  methods: {
    reset () {
      this.pickupEdit = cloneDeep(this.pickup)
    },
    save (event) {
      this.$emit('save', { ...objectDiff(this.pickup, this.pickupEdit), id: this.pickup.id }, event)
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
button.selected
  background-color $grey-4
.edit
  width 100%
  padding 20px
  background-color $grey-1
  &.changed
    background-color $yellow-1
</style>
