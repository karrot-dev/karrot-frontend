<template>
  <div
    class="edit"
    :class="{ changed: hasChanged }"
  >
    <form @submit.prevent="maybeSave">
      <QField
        icon="fas fa-star"
        :label="$t('AGREEMENT.TITLE')"
        :helper="$t('AGREEMENT.TITLE_HELPER')"
      >
        <QInput
          v-model="edit.title"
          :autofocus="true"
          autocomplete="off"
          @blur="$v.edit.title.$touch"
        />
      </QField>

      <QField
        icon="fas fa-file-alt"
        :label="$t('AGREEMENT.CONTENT')"
        :helper="$t('AGREEMENT.CONTENT_HELPER')"
      >
        <QInput
          v-model="edit.content"
          type="textarea"
          rows="20"
          @blur="$v.edit.content.$touch"
          @keyup.ctrl.enter="maybeSave"
        />
      </QField>

      <QBtn
        type="submit"
        color="primary"
        :disable="!canSave"
      >
        {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
      </QBtn>

      <QCheckbox
        v-if="!isNew"
        v-model="minor"
        class="minor"
        :label="$t('AGREEMENT.MINOR_EDIT')"
      >
        <QTooltip>{{ $t('AGREEMENT.MINOR_EDIT_HELPER') }}</QTooltip>
      </QCheckbox>

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

      <QBtn
        v-if="!isNew"
        type="button"
        color="red"
        @click="maybeDestroy"
      >
        {{ $t('BUTTON.REMOVE') }}
      </QBtn>
    </form>
  </div>
</template>

<script>
import {
  QField,
  QInput,
  QBtn,
  QCheckbox,
  QTooltip,
  Dialog,
} from 'quasar'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import editMixin from '@/utils/mixins/editMixin'

export default {
  name: 'AgreementForm',
  components: {
    QField,
    QInput,
    QBtn,
    QCheckbox,
    QTooltip,
  },
  mixins: [validationMixin, editMixin],
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
