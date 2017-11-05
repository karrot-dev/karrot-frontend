<template>
  <div class="edit" :class="{ changed: hasChanged }">

    <q-field
      icon="fa-star"
      :label="$t('USERDETAIL.DISPLAY_NAME')">
      <q-input v-model="userEdit.displayName"/>
    </q-field>

    <q-field
      icon="info"
      :label="$t('USERDETAIL.DESCRIPTION')">
      <MarkdownInput :value="userEdit.description">
        <q-input v-model="userEdit.description" type="textarea" :min-rows="1" :max-height="100" />
      </MarkdownInput>
    </q-field>

    <q-field
      icon="fa-map"
      :label="$t('USERDATA.WHERE_FROM')">
      <address-picker v-model="userEdit" :map="true"/>
    </q-field>

    <q-btn color="primary" @click="save" :disable="!hasChanged">{{ $t('BUTTON.SAVE_CHANGES') }}</q-btn>
    <q-btn @click="reset" :disable="!hasChanged">{{ $t('BUTTON.RESET') }}</q-btn>

  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QInput, QBtn, QSelect } from 'quasar'
import AddressPicker from '@/components/Address/AddressPicker'
import MarkdownInput from '@/components/MarkdownInput'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  props: {
    user: { required: true },
  },
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QInput, QBtn, QSelect, AddressPicker, MarkdownInput,
  },
  data () {
    return {
      userEdit: cloneDeep(this.user),
    }
  },
  watch: {
    user () {
      this.reset()
    },
  },
  computed: {
    hasChanged () {
      return !deepEqual(this.user, this.userEdit)
    },
  },
  methods: {
    reset () {
      this.userEdit = cloneDeep(this.user)
    },
    save (event) {
      this.$emit('save', { ...objectDiff(this.user, this.userEdit), id: this.user.id }, event)
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
</style>
