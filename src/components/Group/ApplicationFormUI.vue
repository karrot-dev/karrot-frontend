<template>
  <div>
    <q-card class="shadow-6">
      <div class="edit-box splash-md">
        <form>
          <q-field
            icon="fas fa-fw fa-question"
            :label="group.applicationQuestions"
          />
          <div>
            <MarkdownInput :value="applicationAnswers">
              <q-input
                id="group-title"
                v-model="applicationAnswers"
                type="textarea"
                :min-rows="3"
                @keyup.ctrl.enter="$emit('submit', applicationAnswers)"
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
              @click="$emit('submit', applicationAnswers)"
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

export default {
  components: {
    QCard, QField, QInput, QBtn, MarkdownInput,
  },
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      applicationAnswers: '',
    }
  },
  computed: {

  },
  methods: {

  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'

.splash-md
  color black
</style>
