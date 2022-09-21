<template>
  <div>
    <h3
      v-t="{ path: 'MEMBERSHIP_REVIEW.SETUP_HEADER', args: { user: user.displayName } }"
      class="q-pl-lg q-mb-sm"
    />
    <div>
      <QStepper
        ref="setup"
        v-model="setup"
        class="no-shadow"
        contractable
      >
        <QStep
          name="attention"
          icon="fas fa-exclamation"
          done-icon="fas fa-exclamation"
          :title="$t('ATTENTION')"
        >
          <p><strong>{{ $t('MEMBERSHIP_REVIEW.STEPPER1a', { userName: user.displayName }) }}</strong></p>
          <p>{{ $t('MEMBERSHIP_REVIEW.STEPPER1b') }}</p>
        </QStep>
        <QStep
          name="thanks"
          icon="fas fa-hand-holding-heart"
          done-icon="fas fa-hand-holding-heart"
          :title="$t('THANKS')"
        >
          <p><strong> {{ $t('MEMBERSHIP_REVIEW.STEPPER2a') }}</strong></p>
          <p>{{ $t('MEMBERSHIP_REVIEW.STEPPER2b') }}</p>
        </QStep>
        <QStep
          name="consequences"
          icon="fas fa-info"
          done-icon="fas fa-info"
          :title="$t('INFO')"
        >
          <p><strong> {{ $t('MEMBERSHIP_REVIEW.STEPPER3a') }} </strong></p>
          <p>{{ $t('MEMBERSHIP_REVIEW.STEPPER3b') }}</p>
          <p>{{ $t('MEMBERSHIP_REVIEW.STEPPER3c', { userName: user.displayName }) }}</p>
          <p>{{ $t('MEMBERSHIP_REVIEW.STEPPER3d', { votingDuration: currentGroup && currentGroup.issueVotingDurationDays }) }}</p>
          <a
            v-t="'MEMBERSHIP_REVIEW.FIND_OUT_MORE'"
            href="https://community.karrot.world/t/how-does-the-conflict-resolution-feature-work/254"
            target="_blank"
            rel="noopener"
            style="text-decoration: underline"
          />
        </QStep>
        <QStep
          name="statement"
          icon="fas fa-pen-alt"
          done-icon="fas fa-pen-alt"
          :title="$t('MEMBERSHIP_REVIEW.STATEMENT')"
        >
          <p><strong> {{ $t('MEMBERSHIP_REVIEW.STEPPER4a') }} </strong></p>
          <p>{{ $t('MEMBERSHIP_REVIEW.STEPPER4b', { userName: user.displayName }) }}</p>
          <MarkdownInput
            v-model="initialStatement"
            data-testid="topic"
            outlined
            @keyup.ctrl.enter="submit"
          />
        </QStep>
        <template #navigation>
          <QStepperNavigation>
            <QBtn
              flat
              color="secondary"
              @click="$emit('close')"
            >
              {{ $t('BUTTON.CANCEL') }}
            </QBtn>
            <QBtn
              v-if="setup !== 'attention'"
              flat
              color="secondary"
              @click="$refs.setup.previous()"
            >
              {{ $t('BUTTON.BACK') }}
            </QBtn>
            <QBtn
              v-if="setup !== 'statement'"
              flat
              color="secondary"
              @click="$refs.setup.next()"
            >
              {{ $t('BUTTON.NEXT') }}
            </QBtn>
            <QBtn
              v-if="setup == 'statement'"
              :disable="initialStatement === ''"
              flat
              color="secondary"
              :loading="isPending"
              @click="submit"
            >
              {{ $t('BUTTON.SUBMIT') }}
            </QBtn>
          </QStepperNavigation>
        </template>
      </QStepper>
      <div
        v-if="hasAnyError"
        class="text-negative q-pl-lg q-mb-md"
      >
        <i class="fas fa-exclamation-triangle" />
        {{ anyFirstError }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  QStepper,
  QStep,
  QStepperNavigation,
  QBtn,
} from 'quasar'

import statusMixin from '@/utils/mixins/statusMixin'

import MarkdownInput from '@/utils/components/MarkdownInput'

export default {
  components: {
    QStep,
    QStepper,
    QStepperNavigation,
    QBtn,
    MarkdownInput,
  },
  mixins: [statusMixin],
  props: {
    currentGroup: {
      type: Object,
      default: null,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  emits: [
    'close',
    'start-conflict-resolution',
  ],
  data () {
    return {
      setup: 'attention',
      initialStatement: '',
    }
  },
  methods: {
    submit () {
      this.$emit('start-conflict-resolution', {
        group: this.currentGroup && this.currentGroup.id,
        affectedUser: this.user && this.user.id,
        topic: this.initialStatement,
      })
    },
  },
}
</script>

<style scoped lang="sass">
.q-step
  min-height: 200px

.q-stepper
  max-width: 700px
</style>
