<template>
  <div>
    <q-card>
      <div>
        <form>
          <q-field
            icon="fas fa-fw fa-question"
            label="fuck this shit"
          >
            <MarkdownInput :value="edit.applicationAnwsers">
              <q-input
                id="group-title"
                v-model="edit.applicationAnswers"
                type="textarea"
                :min-rows="3"
                @keyup.ctrl.enter="maybeSave"
              />
            </MarkdownInput>
          </q-field>

          <div class="actionButtons">
            <q-btn
              type="button"
            >
              {{ $t('BUTTON.CANCEL') }}
            </q-btn>

            <q-btn
              type="submit"
              color="primary"
              :disable="!canSave"
              :loading="isPending"
            >
              {{ $t('BUTTON.SUBMIT') }}
            </q-btn>
          </div>
        </form>
      </div>
    </q-card>
  </div>
</template>

<script>
import { QCard, QField, QInput, QBtn } from 'quasar'
import MarkdownInput from '@/components/MarkdownInput'
import { validationMixin } from 'vuelidate'
import editMixin from '@/mixins/editMixin'
import statusMixin from '@/mixins/statusMixin'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'ApplicationForm',
  mixins: [validationMixin, editMixin, statusMixin],
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({
        applicationQuestionsText: "I've got some questions...",
        applicationAnswers: "I'd love to save food!",
      }),
    },
  },
  components: {
    QCard, QField, QInput, QBtn, MarkdownInput,
  },
  methods: {
    submitApplication (event) {
      this.save()
    },
    maybeSave (event) {
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
        maxLength: maxLength(350),
        isUnique (value) {
          if (value === '' || !this.value) return true
          return this.allGroups
            .filter(e => e.id !== this.value.id)
            .findIndex(e => e.name === value) < 0
        },
      },
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
