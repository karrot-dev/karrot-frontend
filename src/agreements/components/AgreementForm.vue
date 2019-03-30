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
          @blur="$v.edit.title.$touch"
          autocomplete="off"
        />
      </QField>

      <QField
        icon="fas fa-file-alt"
        :label="$t('AGREEMENT.CONTENT')"
        :helper="$t('AGREEMENT.CONTENT_HELPER')"
      >
        <QInput
          v-model="edit.content"
          @blur="$v.edit.content.$touch"
          type="textarea"
          rows="20"
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
        class="minor"
        v-model="minor"
        :label="$t('AGREEMENT.MINOR_EDIT')"
      >
        <QTooltip>{{ $t('AGREEMENT.MINOR_EDIT_HELPER') }}</QTooltip>
      </QCheckbox>

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

      <QBtn
        type="button"
        color="red"
        @click="maybeDestroy"
        v-if="!isNew"
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
  mixins: [validationMixin, editMixin],
  components: {
    QField,
    QInput,
    QBtn,
    QCheckbox,
    QTooltip,
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
