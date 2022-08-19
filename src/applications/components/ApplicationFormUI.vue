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
          filled
          autofocus
          :placeholder="$t('CONVERSATION.REPLY_TO_MESSAGE')"
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
      <div class="row justify-end q-gutter-sm q-mt-sm">
        <QBtn
          type="button"
          color="primary"
          :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }"
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
import { useRouter } from 'vue-router'

import { useCreateApplicationMutation } from '@/applications/mutations'
import statusMixin from '@/utils/mixins/statusMixin'
import { showToast } from '@/utils/toasts'

import Markdown from '@/utils/components/Markdown'
import MarkdownInput from '@/utils/components/MarkdownInput'

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
  setup () {
    const router = useRouter()

    const {
      mutate: createApplication,
      status,
    } = useCreateApplicationMutation()

    const create = data => createApplication(data, {
      onSuccess (data) {
        showToast({
          message: 'JOINGROUP.APPLICATION_SUBMITTED',
        })
        router.push({ name: 'groupPreview', params: { groupPreviewId: data.group } }).catch(() => {})
      },
    })

    return {
      create,
      status,
    }
  },
  data () {
    return {
      applicationAnswers: '',
    }
  },
  methods: {
    apply () {
      this.create({ group: this.group.id, answers: this.applicationAnswers })
    },
  },
}
</script>

<style scoped lang="sass">
// can be removed once splash layout has scoped css
.splash-md
  color: black
</style>
