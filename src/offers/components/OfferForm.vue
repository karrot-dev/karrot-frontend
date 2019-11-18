<template>
  <FormContainer>
    <KSpinner v-if="fetching" />
    <div
      v-else
      class="edit-box"
      :class="{ changed: hasChanged }"
    >
      <form @submit.prevent="maybeSave">
        <QInput
          v-model="edit.name"
          :label="$t('OFFER.NAME')"
          :hint="$t('OFFER.NAME_HELPER')"
          v-bind="nameError"
          :autofocus="!$q.platform.has.touch"
          autocomplete="off"
          @blur="$v.edit.name.$touch"
        >
          <template #before>
            <QIcon name="fas fa-fw fa-star" />
          </template>
        </QInput>

        <MarkdownInput
          v-model="edit.description"
          icon="fas fa-fw fa-address-card"
          :label="$t('OFFER.DESCRIPTION')"
          :hint="$t('OFFER.DESCRIPTION_HELPER')"
          v-bind="descriptionError"
          @keyup.ctrl.enter="maybeSave"
        />

        <QField
          v-model="edit.images"
          v-bind="imagesError"
        >
          <template #before>
            <QIcon name="fas fa-fw fa-star" />
          </template>
          <template #control>
            <MultiCroppa v-model="edit.images" />
          </template>
        </QField>

        <div class="row justify-end q-gutter-sm q-mt-sm">
          <QBtn
            v-if="!isNew"
            type="button"
            :disable="!hasChanged"
            @click="reset"
          >
            {{ $t('BUTTON.RESET') }}
          </QBtn>

          <QBtn
            type="submit"
            color="primary"
            :disable="!canSave"
            :loading="isPending"
          >
            {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
          </QBtn>
        </div>
      </form>
    </div>
  </FormContainer>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import { QBtn, QField, QIcon, QInput } from 'quasar'
import MarkdownInput from '@/utils/components/MarkdownInput'
import MultiCroppa from '@/offers/components/MultiCroppa'
import KSpinner from '@/utils/components/KSpinner'
import FormContainer from '@/offers/components/FormContainer'

const NAME_MIN_LENGTH = 5
const NAME_MAX_LENGTH = 80

const NO_ERROR = {
  error: false,
  errorMessage: '',
}

function mapErrors (config) {
  const computed = {}
  for (const property of Object.keys(config)) {
    const rules = config[property]
    computed[`${property}Error`] = function () {
      const checkServerErrors = () => {
        const firstServerError = this.firstError(property)
        if (!firstServerError) return NO_ERROR
        return {
          error: true,
          errorMessage: firstServerError,
        }
      }
      const vuelidate = this.$v.edit[property]
      if (vuelidate === undefined || !vuelidate.$error) return checkServerErrors()
      const ruleWithError = rules.find(([ruleName]) => !vuelidate[ruleName])
      if (!ruleWithError) return checkServerErrors()
      const [, i18nKey, i18nParams] = ruleWithError
      return {
        error: true,
        errorMessage: this.$t(i18nKey, i18nParams),
      }
    }
  }
  return computed
}

export default {
  components: {
    MarkdownInput,
    MultiCroppa,
    FormContainer,
    QBtn,
    QField,
    QInput,
    QIcon,
    KSpinner,
  },
  mixins: [validationMixin, editMixin, statusMixin],
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({
        name: undefined,
        description: undefined,
        status: 'active',
        images: [],
      }),
    },
    fetching: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    canSave () {
      if (this.$v.edit.$error) {
        return false
      }
      return this.isNew || this.hasChanged
    },
    ...mapErrors({
      name: [
        ['required', 'VALIDATION.REQUIRED'],
        ['minLength', 'VALIDATION.MINLENGTH', { min: NAME_MIN_LENGTH - 1 }],
        ['maxLength', 'VALIDATION.MAXLENGTH', { max: NAME_MAX_LENGTH + 1 }],
      ],
      description: [
        ['required', 'VALIDATION.REQUIRED'],
      ],
      images: [
        ['required', 'VALIDATION.IMAGE_REQUIRED'],
      ],
    }),
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
      name: {
        required,
        minLength: minLength(NAME_MIN_LENGTH),
        maxLength: maxLength(NAME_MAX_LENGTH),
      },
      description: {
        required,
      },
      images: {
        required: images => images.filter(image => !image._removed).length > 0,
      },
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
