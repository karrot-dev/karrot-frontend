<template>
  <div class="edit" :class="{ changed: hasChanged }">
    <form @submit.prevent="save">
      <q-field
        icon="fa-star"
        :label="$t('AGREEMENT.TITLE')"
        :helper="$t('AGREEMENT.TITLE_HELPER')">
        <q-input
          v-model="agreementEdit.title"
          :autofocus="true"
          @blur="$v.agreementEdit.title.$touch"
          autocomplete="off"
        />
      </q-field>

      <q-field
        icon="fa-file-text-o"
        :label="$t('AGREEMENT.CONTENT')"
        :helper="$t('AGREEMENT.CONTENT_HELPER')">
        <q-input
          v-model="agreementEdit.content"
          @blur="$v.agreementEdit.content.$touch"
          type="textarea"
          :min-rows="20"
          />
      </q-field>

      <q-btn type="submit" color="primary" :disable="!canSave">
        {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
      </q-btn>

      <q-checkbox v-if="!isNew" class="minor" v-model="minor" :label="$t('AGREEMENT.MINOR_EDIT')">
        <q-tooltip>{{ $t('AGREEMENT.MINOR_EDIT_HELPER') }}</q-tooltip>
      </q-checkbox>

      <q-btn type="button" @click="reset" v-if="!isNew" :disable="!hasChanged">
        {{ $t('BUTTON.RESET') }}
      </q-btn>
      <q-btn type="button" @click="$emit('cancel')" v-if="isNew">
        {{ $t('BUTTON.CANCEL') }}
      </q-btn>
      <q-btn type="button" color="red" @click="$emit('remove', agreement.id)" v-if="!isNew">
        {{ $t('BUTTON.REMOVE') }}
      </q-btn>
    </form>
  </div>
</template>

<script>
import { QCard, QField, QInput, QBtn, QCheckbox, QTooltip, Dialog } from 'quasar'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  name: 'AgreementForm',
  mixins: [validationMixin],
  props: {
    agreement: {
      required: false,
      default () {
        return {
          title: undefined,
          content: undefined,
        }
      },
    },
  },
  components: {
    QCard, QField, QInput, QBtn, QCheckbox, QTooltip,
  },
  data () {
    return {
      agreementEdit: cloneDeep(this.agreement),
      minor: false,
    }
  },
  watch: {
    agreement () {
      this.reset()
    },
  },
  computed: {
    isNew () {
      return !this.agreement.id
    },
    hasChanged () {
      return !this.isNew && !deepEqual(this.agreement, this.agreementEdit)
    },
    canSave () {
      if (this.$v.agreementEdit.$error) {
        return false
      }
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
  },
  methods: {
    reset () {
      this.agreementEdit = cloneDeep(this.agreement)
    },
    save (event) {
      this.$v.agreementEdit.$touch()
      if (!this.canSave) return
      if (this.isNew) {
        this.$emit('save', this.agreementEdit, event)
      }
      else {
        if (!this.minor) {
          Dialog.create({
            title: this.$t('AGREEMENT.DIALOGS.REPLACE.TITLE'),
            message: this.$t('AGREEMENT.DIALOGS.REPLACE.MESSAGE'),
            buttons: [
              this.$t('BUTTON.CANCEL'),
              {
                label: this.$t('AGREEMENT.DIALOGS.REPLACE.CONFIRM'),
                handler: () => {
                  this.$emit('replace', { ...this.agreementEdit, id: this.agreement.id }, event)
                },
              },
            ],
          })
        }
        else {
          this.$emit('save', { ...objectDiff(this.agreement, this.agreementEdit), id: this.agreement.id }, event)
        }
      }
    },
  },
  validations: {
    agreementEdit: {
      title: {
        required,
      },
      content: {
        required,
      },
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.edit
  width 100%
  padding 20px
  &.changed
    background-color $yellow-1
.minor
  margin-right 10px
  margin-left 10px
</style>
