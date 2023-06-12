<template>
  <div
    v-if="v$.edit"
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <form @submit.prevent="maybeSave">
      <QInput
        v-model="edit.displayName"
        :label="$t('USERDETAIL.DISPLAY_NAME')"
        :error="hasDisplayNameError"
        :error-message="displayNameError"
        @blur="v$.edit.displayName.$touch"
      >
        <template #before>
          <QIcon name="fas fa-star" />
        </template>
      </QInput>

      <MarkdownInput
        v-model="edit.description"
        icon="info"
        :label="$t('USERDETAIL.DESCRIPTION')"
        :error="hasError('description')"
        :error-message="firstError('description')"
        @keyup.ctrl.enter="maybeSave"
      />

      <QInput
        v-model="edit.mobileNumber"
        type="tel"
        :label="$t('USERDATA.MOBILE_NUMBER')"
        :error="hasError('mobileNumber')"
        :error-message="firstError('mobileNumber')"
      >
        <template #before>
          <QIcon name="fas fa-phone" />
        </template>
      </QInput>

      <AddressPicker
        v-model="edit"
        color="positive"
        font-icon="fas fa-user"
        :default-map-center="defaultMapCenter"
        :label="$t('USERDATA.WHERE_FROM')"
        :error="hasAddressError"
        :error-message="addressError"
        icon="fas fa-map-marker"
      />

      <div
        v-if="hasNonFieldError"
        class="text-negative"
      >
        {{ firstNonFieldError }}
      </div>

      <div class="row justify-end q-gutter-sm q-mt-sm">
        <QBtn
          type="button"
          :disable="!hasChanged"
          @click="reset"
        >
          {{ $t('BUTTON.RESET') }}
        </QBtn>
        <QBtn
          type="submit"
          color="primary"
          :disable="!hasChanged"
          :loading="isPending"
          data-testid="save-profile"
        >
          {{ $t('BUTTON.SAVE_CHANGES') }}
        </QBtn>
      </div>
    </form>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'
import {
  QIcon,
  QInput,
  QBtn,
} from 'quasar'

import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'

import AddressPicker from '@/maps/components/AddressPicker.vue'
import MarkdownInput from '@/utils/components/MarkdownInput.vue'

export default {
  components: {
    QIcon,
    QInput,
    QBtn,
    AddressPicker,
    MarkdownInput,
  },
  mixins: [statusMixin, editMixin],
  props: {
    defaultMapCenter: {
      default: null,
      type: Object,
    },
  },
  setup () {
    return {
      v$: useVuelidate(),
    }
  },
  computed: {
    canSave () {
      if (this.v$.edit.$error) {
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
      for (const field of ['address', 'latitude', 'longitude']) {
        if (this.hasError(field)) return this.firstError(field)
      }
      return null
    },
    hasDisplayNameError () {
      return !!this.displayNameError
    },
    displayNameError () {
      if (this.v$.edit.displayName.$error) {
        const m = this.v$.edit.displayName
        if (m.required.$invalid) return this.$t('VALIDATION.REQUIRED')
        if (m.minLength.$invalid) return this.$t('VALIDATION.MINLENGTH', { min: 2 })
        if (m.maxLength.$invalid) return this.$t('VALIDATION.MAXLENGTH', { max: 81 })
      }
      return this.firstError('displayName')
    },
  },
  methods: {
    maybeSave () {
      this.v$.edit.$touch()
      if (!this.canSave) return
      this.v$.edit.$reset()
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

<style scoped lang="sass">
@import 'editbox'

.q-field
  margin: 3em 0
</style>
