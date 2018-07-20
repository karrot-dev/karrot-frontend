<template>
  <div>
    <q-card class="shadow-6">
      <div class="edit-box splash-md">
        <form>
          <q-field
            icon="fas fa-fw fa-question"
            :label="value.applicationQuestionsText"
          />
          <div :class="{ shake: hasAnyError }">
            <MarkdownInput :value="edit.applicationAnswers">
              <q-input
                id="group-title"
                v-model="edit.applicationAnswers"
                type="textarea"
                :min-rows="3"
                @keyup.ctrl.enter="maybeSave"
              />
            </MarkdownInput>
          </div>
          <div class="actionButtons">
            <q-btn
              type="button"
              color="primary"
              class="shadow-4"
              @click="$emit('cancel', group.id)"
            >
              {{ $t('BUTTON.CANCEL') }}
            </q-btn>
            <q-btn
              type="submit"
              color="secondary"
              class="shadow-4"
              :disable="!canSave"
              :loading="isPending"
              @click="maybeSave"
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
  computed: {
    canSave () {
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
@import '~editbox'
.shake
  animation shake 0.82s cubic-bezier(.36, .07, .19, .97) both
  transform translate3d(0, 0, 0)
  backface-visibility hidden
  perspective 1000px

@keyframes shake
  10%, 90%
    transform translate3d(-1px, 0, 0)
  20%, 80%
    transform translate3d(2px, 0, 0)
  30%, 50%, 70%
    transform translate3d(-4px, 0, 0)
  40%, 60%
    transform translate3d(4px, 0, 0)

.splash-md
  color black
</style>
