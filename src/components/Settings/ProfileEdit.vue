<template>
  <div
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <form @submit.prevent="maybeSave">
      <q-field
        icon="fas fa-star"
        :label="$t('USERDETAIL.DISPLAY_NAME')"
        :error="hasDisplayNameError"
        :error-label="displayNameError"
      >
        <q-input
          v-model="edit.displayName"
          @blur="$v.edit.displayName.$touch"
        />
      </q-field>

      <q-field
        icon="info"
        :label="$t('USERDETAIL.DESCRIPTION')"
        :error="hasError('description')"
        :error-label="firstError('description')"
      >
        <MarkdownInput :value="edit.description">
          <q-input
            v-model="edit.description"
            type="textarea"
            rows="1"
            @keyup.ctrl.enter="maybeSave"
          />
        </MarkdownInput>
      </q-field>

      <q-field
        icon="fas fa-phone"
        :label="$t('USERDATA.MOBILE_NUMBER')"
        :error="hasError('mobileNumber')"
        :error-label="firstError('mobileNumber')"
      >
        <q-input
          type="tel"
          v-model="edit.mobileNumber"
        />
      </q-field>

      <q-field
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
          :disable="!hasChanged"
          :loading="isPending"
        >
          {{ $t('BUTTON.SAVE_CHANGES') }}
        </q-btn>

        <q-btn
          type="button"
          @click="reset"
          :disable="!hasChanged"
        >
          {{ $t('BUTTON.RESET') }}
        </q-btn>
      </div>
    </form>
  </div>
</template>

<script>
import { QDatetime, QField, QSlider, QInput, QBtn, QSelect } from 'quasar'
import AddressPicker from '@/components/Address/AddressPicker'
import MarkdownInput from '@/components/MarkdownInput'
import editMixin from '@/mixins/editMixin'
import statusMixin from '@/mixins/statusMixin'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  components: {
    QDatetime, QField, QSlider, QInput, QBtn, QSelect, AddressPicker, MarkdownInput,
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
