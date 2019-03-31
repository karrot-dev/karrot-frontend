<template>
  <div
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <form @submit.prevent="maybeSave">
      <QField
        icon="fas fa-star"
        :label="$t('USERDETAIL.DISPLAY_NAME')"
        :error="hasDisplayNameError"
        :error-label="displayNameError"
      >
        <QInput
          v-model="edit.displayName"
          @blur="$v.edit.displayName.$touch"
        />
      </QField>

      <QField
        icon="info"
        :label="$t('USERDETAIL.DESCRIPTION')"
        :error="hasError('description')"
        :error-label="firstError('description')"
      >
        <MarkdownInput :value="edit.description">
          <QInput
            v-model="edit.description"
            type="textarea"
            rows="1"
            @keyup.ctrl.enter="maybeSave"
          />
        </MarkdownInput>
      </QField>

      <QField
        icon="fas fa-phone"
        :label="$t('USERDATA.MOBILE_NUMBER')"
        :error="hasError('mobileNumber')"
        :error-label="firstError('mobileNumber')"
      >
        <QInput
          v-model="edit.mobileNumber"
          type="tel"
        />
      </QField>

      <QField
        icon="fas fa-map-marker"
        :label="$t('USERDATA.WHERE_FROM')"
        :error="hasAddressError"
        :error-label="addressError"
      >
        <AddressPicker
          v-model="edit"
          color="positive"
          font-icon="fas fa-user"
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
          :disable="!hasChanged"
          :loading="isPending"
        >
          {{ $t('BUTTON.SAVE_CHANGES') }}
        </QBtn>

        <QBtn
          type="button"
          :disable="!hasChanged"
          @click="reset"
        >
          {{ $t('BUTTON.RESET') }}
        </QBtn>
      </div>
    </form>
  </div>
</template>

<script>
import {
  QField,
  QInput,
  QBtn,
} from 'quasar'
import AddressPicker from '@/maps/components/AddressPicker'
import MarkdownInput from '@/utils/components/MarkdownInput'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  components: {
    QField,
    QInput,
    QBtn,
    AddressPicker,
    MarkdownInput,
  },
  mixins: [statusMixin, editMixin, validationMixin],
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
    hasAddressError () {
      return !!this.addressError
    },
    addressError () {
      for (let field of ['address', 'latitude', 'longitude']) {
        if (this.hasError(field)) return this.firstError(field)
      }
      return null
    },
    hasDisplayNameError () {
      return !!this.displayNameError
    },
    displayNameError () {
      if (this.$v.edit.displayName.$error) {
        const m = this.$v.edit.displayName
        if (!m.required) return this.$t('VALIDATION.REQUIRED')
        if (!m.minLength) return this.$t('VALIDATION.MINLENGTH', { min: 2 })
        if (!m.maxLength) return this.$t('VALIDATION.MAXLENGTH', { max: 81 })
      }
      return this.firstError('displayName')
    },
  },
  methods: {
    maybeSave () {
      this.$v.edit.$touch()
      if (!this.canSave) return
      this.$v.edit.$reset()
      this.save()
    },
  },
  validations: {
    edit: {
      displayName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(80),
      },
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'

.q-field
  margin 3em 0
</style>
