<template>
  <div
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <form @submit.prevent="save">
      <q-field
        icon="fa-star"
        :label="$t('USERDETAIL.DISPLAY_NAME')"
        :error="hasError('displayName')"
        :error-label="firstError('displayName')"
      >
        <q-input v-model="edit.displayName"/>
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
            :min-rows="1"
          />
        </MarkdownInput>
      </q-field>

      <q-field
        icon="fa-map"
        :label="$t('USERDATA.WHERE_FROM')"
        :error="hasAddressError"
        :error-label="addressError"
      >
        <address-picker
          v-model="edit"
          :map="true"
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
          loader
          :value="isPending"
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
import { QDatetime, QInlineDatetime, QField, QSlider, QInput, QBtn, QSelect } from 'quasar'
import AddressPicker from '@/components/Address/AddressPicker'
import MarkdownInput from '@/components/MarkdownInput'
import editMixin from '@/mixins/editMixin'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QInput, QBtn, QSelect, AddressPicker, MarkdownInput,
  },
  mixins: [statusMixin, editMixin],
  computed: {
    hasAddressError () {
      return !!this.addressError
    },
    addressError () {
      for (let field of ['address', 'latitude', 'longitude']) {
        if (this.hasError(field)) return this.firstError(field)
      }
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
