<template>
  <div>
    <q-card>
      <div>
        <form>
          <q-field
            icon="fas fa-fw fa-question"
            :label="$t('GROUP.APPLICATION_QUESTIONS')"
            :value="applicationQuestions"
          >
            <MarkdownInput>
              <q-input
                v-model="applicationAnswers"
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

export default {
  name: 'ApplicationForm',
  mixins: [validationMixin, editMixin, statusMixin],
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({
        applicationQuestions: "I've got some questions...",
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
  },
}
</script>

<style scoped lang="stylus">
</style>
