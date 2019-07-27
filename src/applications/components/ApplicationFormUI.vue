<template>
  <div
    v-if="group"
    class="edit-box bg-primary splash-md"
    style="padding: 0"
  >
    <p
      v-if="$q.platform.is.mobile"
      class="text-white"
    >
      {{ $t('APPLICATION.FORM_TITLE', { groupName: group.name }) }}
    </p>
    <form @submit.prevent="apply">
      <div class="white-box bg-white shadow-6 q-py-md q-px-sm">
        <QItem>
          <QItemSection side>
            <QIcon name="fas fa-fw fa-question" />
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
          <i class="fas fa-exclamation-triangle" />
          {{ anyFirstError }}
        </div>
      </div>
      <div class="actionButtons">
        <QBtn
          type="button"
          color="primary"
          class="shadow-4"
          @click="$emit('cancel', group.id)"
        >
          {{ $t('BUTTON.CANCEL') }}
        </QBtn>
        <QBtn
          type="submit"
          color="secondary"
          class="shadow-4"
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
@import '~editbox'

// can be removed once splash layout has scoped css
.splash-md
  color black
</style>
