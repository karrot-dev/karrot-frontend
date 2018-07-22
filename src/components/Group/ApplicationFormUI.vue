<template>
  <div class="edit-box brown-background splash-md">
    <form>
      <div class="white-box shadow-6 q-py-md q-px-sm">
        <q-item>
          <q-item-side
            icon="fas fa-fw fa-question"
          />
          <q-item-main>
            <Markdown
              :source="group.applicationQuestions"
            />
          </q-item-main>
        </q-item>
        <MarkdownInput :value="applicationAnswers">
          <q-input
            id="group-title"
            v-model="applicationAnswers"
            type="textarea"
            :min-rows="3"
            @keyup.ctrl.enter="$emit('submit', applicationAnswers)"
          />
        </MarkdownInput>
        <div
          v-if="hasAnyError"
          class="text-negative"
          style="margin-bottom: 2em"
        >
          <i class="fas fa-exclamation-triangle"/>
          {{ anyFirstError }}
        </div>
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
          @click="$emit('submit', { group: group.id, answers: applicationAnswers })"
        >
          {{ $t('BUTTON.SUBMIT') }}
        </q-btn>
      </div>
    </form>
  </div>
</template>

<script>
import { QItem, QItemSide, QItemMain, QField, QInput, QBtn } from 'quasar'
import MarkdownInput from '@/components/MarkdownInput'
import Markdown from '@/components/Markdown'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: {
    QItem, QItemSide, QItemMain, QField, QInput, QBtn, MarkdownInput, Markdown,
  },
  mixins: [statusMixin],
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
.brown-background
  background-color #4a3520
  padding 0
</style>
