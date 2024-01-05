import useVuelidate from '@vuelidate/core'
import * as validators from '@vuelidate/validators'
import { computed, unref } from 'vue'

import i18n from '@/base/i18n'

const { helpers: { withMessage } } = validators

// Vuelidate does not show validation from $externalResults if you don't have
// at least one other rule for that field, you can add this as a dummy validator
const dummyRule = () => true

export function useValidation (rules, state, status) {
  const options = {}
  if (status) {
    options.$externalResults = computed(() => unref(status)?.validationErrors)
  }

  if (!rules.nonFieldErrors) {
    rules.nonFieldErrors = { dummyRule }
  }

  const v = useVuelidate(rules, state, options)

  const errors = computed(() => {
    const result = {}
    for (const k of Object.keys(v.value)) {
      if (k.startsWith('$')) continue
      if (v.value[k].$error) {
        result[k] = v.value[k].$errors[0].$message
      }
    }
    return result
  })

  async function validate () {
    if (!await v.value.$validate()) {
      // If none of them are external then we don't submit
      if (!v.value.$errors.some($error => $error.$validator === '$externalResults')) {
        return false
      }
    }
    return true
  }

  return { v, validate, errors }
}

// Our custom validators that come with the proper i18n messages
export const required = withMessage(() => i18n.t('VALIDATION.REQUIRED'), validators.required)

export function maxLength (max) {
  return withMessage(
    ({ $params }) => i18n.t('VALIDATION.MAXLENGTH', { max: $params.max + 1 }),
    validators.maxLength(max),
  )
}

export function minLength (min) {
  return withMessage(
    ({ $params }) => i18n.t('VALIDATION.MINLENGTH', { min: $params.min - 1 }),
    validators.minLength(min),
  )
}

export function isUnique (validator) {
  return withMessage(
    () => i18n.t('VALIDATION.UNIQUE'),
    validator,
  )
}
