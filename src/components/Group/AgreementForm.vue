<template>
  <div
    class="edit"
    :class="{ changed: hasChanged }"
  >
    <form @submit.prevent="maybeSave">
      <q-field
        icon="fas fa-star"
        :label="$t('AGREEMENT.TITLE')"
        :helper="$t('AGREEMENT.TITLE_HELPER')">
        <q-input
          v-model="edit.title"
          :autofocus="true"
          @blur="$v.edit.title.$touch"
          autocomplete="off"
        />
      </q-field>

      <q-field
        icon="fas fa-file-alt"
        :label="$t('AGREEMENT.CONTENT')"
        :helper="$t('AGREEMENT.CONTENT_HELPER')">
        <q-input
          v-model="edit.content"
          @blur="$v.edit.content.$touch"
          type="textarea"
          rows="20"
          style="min-height: 20em"
          @keyup.ctrl.enter="maybeSave"
        />
      </q-field>

      <q-btn
        type="submit"
        color="primary"
        :disable="!canSave"
      >
        {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
      </q-btn>

      <q-checkbox
        v-if="!isNew"
        class="minor"
        v-model="minor"
        :label="$t('AGREEMENT.MINOR_EDIT')"
      >
        <q-tooltip>{{ $t('AGREEMENT.MINOR_EDIT_HELPER') }}</q-tooltip>
      </q-checkbox>

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

      <q-btn
        type="button"
        color="red"
        @click="maybeDestroy"
        v-if="!isNew"
      >
        {{ $t('BUTTON.REMOVE') }}
      </q-btn>
    </form>
  </div>
</template>

<script>
import { QCard, QField, QInput, QBtn, QCheckbox, QTooltip, Dialog } from 'quasar'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import editMixin from '@/mixins/editMixin'

export default {
  name: 'AgreementForm',
  mixins: [validationMixin, editMixin],
  components: {
    QCard, QField, QInput, QBtn, QCheckbox, QTooltip,
  },
  data () {
    return {
      minor: false,
    }
  },
  computed: {
    canSave () {
      if (this.$v.edit.$error) {
        return false
      }
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
  },
  methods: {
    maybeSave (event) {
      this.$v.edit.$touch()
      if (!this.canSave) return
      if (this.isNew) {
        this.save()
      }
      else {
        if (this.minor) {
          this.save(event)
        }
        else {
          Dialog.create({
            title: this.$t('AGREEMENT.DIALOGS.REPLACE.TITLE'),
            message: this.$t('AGREEMENT.DIALOGS.REPLACE.MESSAGE'),
            cancel: this.$t('BUTTON.CANCEL'),
            ok: this.$t('AGREEMENT.DIALOGS.REPLACE.CONFIRM'),
          })
            .then(() => this.$emit('replace', this.edit))
            .catch(() => {})
        }
      }
    },
    maybeDestroy (event) {
      Dialog.create({
        title: this.$t('AGREEMENT.DIALOGS.REMOVE.TITLE'),
        message: this.$t('AGREEMENT.DIALOGS.REMOVE.MESSAGE'),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('AGREEMENT.DIALOGS.REMOVE.CONFIRM'),
      })
        .then(() => this.destroy(event))
        .catch(() => {})
    },
  },
  validations: {
    edit: {
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
