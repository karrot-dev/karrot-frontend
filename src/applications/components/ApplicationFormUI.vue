<template>
  <div
    v-if="group"
    class="bg-primary splash-md"
  >
    <p
      v-if="$q.platform.is.mobile"
      class="text-white"
    >
      {{ $t('APPLICATION.FORM_TITLE', { groupName: group.name }) }}
    </p>
    <form @submit.prevent="apply">
      <div class="bg-white q-pt-sm q-pb-md q-px-sm rounded-borders">
        <QItem>
          <QItemSection side>
            <QIcon :name="$icon('question_fw')" />
          </QItemSection>
          <QItemSection>
            <Markdown
              :source="group.applicationQuestions"
            />
          </QItemSection>
        </QItem>
        <MarkdownInput
          v-model="applicationAnswers"
          @keyup.ctrl.enter="apply"
        />
        <div
          v-if="hasAnyError"
          class="text-negative"
          style="margin-bottom: 2em"
        >
          <i :class="$icon(exclamation_triangle)" />
          {{ anyFirstError }}
        </div>
      </div>
      <div class="row justify-end q-gutter-sm q-mt-sm">
        <QBtn
          type="button"
          color="primary"
          @click="$emit('cancel', group.id)"
        >
          {{ $t('BUTTON.CANCEL') }}
        </QBtn>
        <QBtn
          type="submit"
          color="secondary"
        >
          {{ $t('BUTTON.SUBMIT') }}
        </QBtn>
      </div>
    </form>
  </div>
</template>

<script>
import {
  QItem,
  QItemSection,
  QBtn,
  QIcon,
} from 'quasar'
import MarkdownInput from '@/utils/components/MarkdownInput'
import Markdown from '@/utils/components/Markdown'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    QItem,
    QItemSection,
    QBtn,
    QIcon,
    MarkdownInput,
    Markdown,
  },
  mixins: [statusMixin],
  props: {
    group: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      applicationAnswers: '',
    }
  },
  methods: {
    apply () {
      this.$emit('apply', { group: this.group.id, answers: this.applicationAnswers })
    },
  },
}
</script>

<style scoped lang="stylus">
// can be removed once splash layout has scoped css
.splash-md
  color black
</style>
