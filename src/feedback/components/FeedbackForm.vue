<template>
  <form
    @submit.prevent="maybeSave"
  >
    <MarkdownInput
      v-model="edit.comment"
      class="q-mx-sm"
      :label="$t('ACTIVITY_FEEDBACK.COMMENT_PLACEHOLDER')"
      @keyup.ctrl.enter="maybeSave"
    />

    <AmountPicker
      v-if="hasWeight"
      v-model="edit.weight"
      class="q-ml-sm"
      style="margin-top: 40px"
    />

    <div
      v-if="hasWeight && hasMultipleParticipants"
      class="row no-wrap items-center q-mx-sm text-caption"
    >
      <QIcon
        name="info"
        size="1.5em"
        class="q-mr-sm text-grey"
      />
      <div v-t="'ACTIVITY_FEEDBACK.AMOUNT_INFO'" />
    </div>

    <div
      v-if="hasAnyError"
      class="text-negative"
      style="margin-top: 3em"
    >
      <i class="fas fa-exclamation-triangle" />
      {{ anyFirstError }}
    </div>

    <div class="row q-ma-md">
      <div class="col">
        <QBtn
          v-if="isNew"
          type="button"
          @click="dismissDialogIsVisible = !dismissDialogIsVisible"
        >
          Dismiss it
        </QBtn>
      </div>

      <div class="col col-grow">
        <div class="row justify-end q-gutter-sm">
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
            color="secondary"
            :loading="isPending"
            :disable="!canSave"
          >
            <span v-t="isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES'" />
          </QBtn>
        </div>
      </div>
    </div>
    <CustomDialog v-model="dismissDialogIsVisible">
      <template #title>
        <!-- <QIcon
          v-bind="activity.activityType.iconProps"
          size="sm"
          class="q-pr-sm"
        />
        {{ $t('ACTIVITYLIST.ITEM.JOIN_CONFIRMATION_HEADER', { activityType: activity.activityType.translatedName }) }} -->
        Headline
      </template>
      <template #message>
        text text text
        <!-- {{ $t('ACTIVITYLIST.ITEM.JOIN_CONFIRMATION_TEXT', { date: $d(activity.date, 'long') }) }} -->
      </template>
      <template #actions>
        <QBtn
          v-close-popup
          flat
          color="primary"
          :label="$t('BUTTON.CANCEL')"
        />
        <QBtn
          v-close-popup
          flat
          color="primary"
          data-autofocus
          :label="$t('BUTTON.OF_COURSE')"
          @click="$emit('dismiss', value.about)"
        />
      </template>
    </CustomDialog>
  </form>
</template>

<script>
import {
  QBtn,
  QIcon,
} from 'quasar'
import AmountPicker from './AmountPicker'
import CustomDialog from '@/activities/components/CustomDialog'
import MarkdownInput from '@/utils/components/MarkdownInput'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    CustomDialog,
    QBtn,
    QIcon,
    AmountPicker,
    MarkdownInput,
  },
  mixins: [statusMixin, editMixin],
  props: {
    hasMultipleParticipants: {
      type: Boolean,
      default: false,
    },
    hasWeight: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      dismissDialogIsVisible: false,
    }
  },
  computed: {
    canSave () {
      return this.isNew || this.hasChanged
    },
  },
  methods: {
    maybeSave () {
      if (this.canSave) {
        this.save()
      }
    },
  },
}
</script>
