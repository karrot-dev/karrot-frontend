<template>
  <QCard>
    <div
      class="edit-box"
      :class="{ changed: hasChanged }"
    >
      <form @submit.prevent="maybeSave">
        <QInput
          id="offer-name"
          v-model="edit.name"
          :label="$t('OFFER.NAME')"
          :hint="$t('OFFER.NAME_HELPER')"
          :error="hasNameError"
          :error-message="nameError"
          :autofocus="!$q.platform.has.touch"
          autocomplete="off"
          @blur="$v.edit.name.$touch"
        >
          <template v-slot:before>
            <QIcon name="fas fa-fw fa-star" />
          </template>
        </QInput>

        <MarkdownInput
          v-model="edit.description"
          icon="fas fa-fw fa-address-card"
          :label="$t('OFFER.DESCRIPTION')"
          :hint="$t('OFFER.DESCRIPTION_HELPER')"
          :error="hasError('description')"
          :error-message="firstError('description')"
          @keyup.ctrl.enter="maybeSave"
        />

        <MultiCroppa v-model="edit.images" />

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
  </QCard>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import { QBtn, QCard, QIcon, QInput } from 'quasar'
import MarkdownInput from '@/utils/components/MarkdownInput'
import MultiCroppa from '@/offers/components/MultiCroppa'

export default {
  components: {
    MarkdownInput,
    MultiCroppa,
    QBtn,
    QCard,
    QInput,
    QIcon,
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
  },
  computed: {
    canSave () {
      if (this.$v.edit.$error) {
        return false
      }
      return this.isNew || this.hasChanged
    },
    hasNameError () {
      return !!this.nameError
    },
    nameError () {
      if (this.$v.edit.name.$error) {
        const m = this.$v.edit.name
        if (!m.required) return this.$t('VALIDATION.REQUIRED')
        if (!m.minLength) return this.$t('VALIDATION.MINLENGTH', { min: 4 })
        if (!m.maxLength) return this.$t('VALIDATION.MAXLENGTH', { max: 81 })
        if (!m.isUnique) return this.$t('VALIDATION.UNIQUE')
      }
      return this.firstError('name')
    },
    statusOptions () {
      const statusOptions = {
        active: {
          label: 'OFFERSTATUS.ACTIVE',
          color: 'positive',
          icon: 'fas fa-circle',
          selectable: true,
          sort: 1,
        },
        accepted: {
          label: 'OFFERSTATUS.ACCEPTED',
          color: 'blue',
          icon: 'fas fa-circle',
          selectable: true,
          sort: 2,
        },
        disabled: {
          label: 'OFFERSTATUS.DISABLED',
          color: 'grey',
          icon: 'fas fa-circle',
          selectable: true,
          sort: 3,
        },
      }
      for (const key of Object.keys(statusOptions)) {
        statusOptions[key].key = key
      }
      const statusList = Object.values(statusOptions)
      return statusList
        .filter(s => s.selectable)
        .map(s => ({
          value: s.key,
          label: this.$t(s.label),
          color: s.color,
          icon: s.icon,
        }))
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
      name: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(80),
      },
      description: {
        required,
      },
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
