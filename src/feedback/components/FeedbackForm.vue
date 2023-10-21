<template>
  <form
    @submit.prevent="maybeSave"
  >
    <div
      v-if="fellowParticipants.length > 0"
      class="q-mx-sm q-mt-md"
    >
      <div v-t="'ACTIVITY_FEEDBACK.TOGETHER_WITH'" />
      <div class="q-mt-sm row">
        <ProfilePicture
          v-for="user in fellowParticipants"
          :key="user.id"
          :user="user"
          :size="35"
          class="q-ml-xs"
          :dimmed="isNoShow(user.id)"
        />
        <QBtn
          flat
          no-caps
          class="q-ml-xs text-weight-regular"
          @click="isNoShowDialogVisible = true"
        >
          Someone didn't show up?
        </QBtn>
      </div>
    </div>
    <MarkdownInput
      v-model="edit.comment"
      outlined
      class="q-mx-md q-mt-md"
      :label="$t('ACTIVITY_FEEDBACK.COMMENT_PLACEHOLDER')"
      @keyup.ctrl.enter="maybeSave"
    />

    <AmountPicker
      v-if="hasWeight"
      v-model="edit.weight"
      class="q-mx-md q-mt-xl q-mb-lg"
    />

    <div
      v-if="hasWeight && hasMultipleParticipants"
      class="row no-wrap items-center q-mx-sm q-mt-sm text-caption"
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
      class="text-negative q-mx-md"
      style="margin-top: 1.5em"
    >
      <i class="fas fa-exclamation-triangle" />
      {{ anyFirstError }}
    </div>

    <div class="row q-ma-md">
      <div class="col">
        <QBtn
          v-if="isNew"
          type="button"
          @click="isDismissFeedbackDialogVisible = !isDismissFeedbackDialogVisible"
        >
          {{ $t('ACTIVITY_FEEDBACK.DISMISS_LABEL') }}
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
    <CustomDialog v-model="isDismissFeedbackDialogVisible">
      <template #title>
        {{ $t('ACTIVITY_FEEDBACK.DISMISS_TITLE') }}
      </template>
      <template #message>
        {{ $t('ACTIVITY_FEEDBACK.DISMISS_MESSAGE') }}
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
          autofocus
          flat
          color="primary"
          :label="$t('BUTTON.OF_COURSE')"
          @click="$emit('dismissFeedback', value.about)"
        />
      </template>
    </CustomDialog>
    <CustomDialog
      v-model="isNoShowDialogVisible"
      width="auto"
    >
      <template #title>
        Who didn't show up?
      </template>
      <template #message>
        <QList>
          <QItem
            v-for="user in fellowParticipants"
            :key="user.id"
            class="q-pl-none"
            clickable
            @click="toggleNoShow(user.id)"
          >
            <QItemSection side>
              <QCheckbox
                :model-value="isNoShow(user.id)"
                @update:model-value="value => setNoShow(user.id, value)"
              />
            </QItemSection>
            <QItemSection side>
              <ProfilePicture
                :user="user"
                :size="35"
                class="q-ml-xs"
                :is-link="false"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel>
                {{ user.displayName }}
              </QItemLabel>
            </QItemSection>
          </QItem>
        </QList>
      </template>
      <template #actions>
        <QBtn
          v-close-popup
          flat
          label="OK"
        />
      </template>
    </CustomDialog>
  </form>
</template>

<script>
import {
  QBtn, QCheckbox,
  QIcon, QItem, QItemLabel, QItemSection, QList,
} from 'quasar'
import { computed } from 'vue'

import { useAuthHelpers } from '@/authuser/helpers'
import { useUserService } from '@/users/services'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'

import ProfilePicture from '@/users/components/ProfilePicture.vue'
import CustomDialog from '@/utils/components/CustomDialog.vue'
import MarkdownInput from '@/utils/components/MarkdownInput.vue'

import AmountPicker from './AmountPicker.vue'

export default {
  components: {
    QItemLabel,
    QCheckbox,
    QItemSection,
    QItem,
    QList,
    ProfilePicture,
    CustomDialog,
    QBtn,
    QIcon,
    AmountPicker,
    MarkdownInput,
  },
  mixins: [statusMixin, editMixin],
  props: {
    activity: {
      type: Object,
      default: null,
    },
    hasMultipleParticipants: {
      type: Boolean,
      default: false,
    },
    hasWeight: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'dismissFeedback',
  ],
  setup (props) {
    const { getUserById } = useUserService()
    const { getIsCurrentUser } = useAuthHelpers()
    const fellowParticipants = computed(() => props.activity
      ? props.activity.participants
        .map(({ user }) => getUserById(user))
        .filter(u => !getIsCurrentUser(u))
      : [])
    return {
      fellowParticipants,
    }
  },
  data () {
    return {
      isDismissFeedbackDialogVisible: false,
      isNoShowDialogVisible: false,
    }
  },
  computed: {
    canSave () {
      return this.isNew || this.hasChanged
    },
  },
  methods: {
    isNoShow (userId) {
      return Boolean(this.edit.noShows?.some(noShow => noShow.user === userId))
    },
    setNoShow (userId, value) {
      if (value) {
        if (!this.isNoShow(userId)) {
          if (!this.edit.noShows) this.edit.noShows = []
          this.edit.noShows.push({ user: userId })
        }
      }
      else {
        if (this.edit.noShows) {
          this.edit.noShows = this.edit.noShows.filter(noShow => noShow.user !== userId)
        }
      }
    },
    toggleNoShow (userId) {
      this.setNoShow(userId, !this.isNoShow(userId))
    },
    maybeSave () {
      if (this.canSave) {
        this.save()
      }
    },
  },
}
</script>
