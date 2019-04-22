<template>
  <div>
    <h3
      v-t="{ path: 'CONFLICT.SETUP_HEADER', args: { user: user.displayName } }"
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
          <p><strong>{{ $t('CONFLICT.STEPPER1a') }}</strong></p>
          <p>{{ $t('CONFLICT.STEPPER1b') }}</p>
        </QStep>
        <QStep
          name="thanks"
          icon="fas fa-hand-holding-heart"
          done-icon="fas fa-hand-holding-heart"
          :title="$t('THANKS')"
        >
          <p><strong> {{ $t('CONFLICT.STEPPER2a') }}</strong></p>
          <p>{{ $t('CONFLICT.STEPPER2b') }}</p>
        </QStep>
        <QStep
          name="consequences"
          icon="fas fa-info"
          done-icon="fas fa-info"
          :title="$t('INFO')"
        >
          <p><strong> {{ $t('CONFLICT.STEPPER3a') }} </strong></p>
          <p>{{ $t('CONFLICT.STEPPER3b') }}</p>
          <p>{{ $t('CONFLICT.STEPPER3c', { userName: user.displayName }) }}</p>
          <p>{{ $t('CONFLICT.STEPPER3d', { votingDuration: currentGroup && currentGroup.issueVotingDurationDays }) }}</p>
          <a
            v-t="'CONFLICT.FIND_OUT_MORE'"
            href="https://community.foodsaving.world/t/how-does-the-conflict-resolution-feature-work/254"
            target="_blank"
            rel="noopener"
            style="text-decoration: underline"
          />
        </QStep>
        <QStep
          name="statement"
          icon="fas fa-pen-alt"
          done-icon="fas fa-pen-alt"
          :title="$t('CONFLICT.STATEMENT')"
        >
          <p><strong> {{ $t('CONFLICT.STEPPER4a') }} </strong></p>
          <p>{{ $t('CONFLICT.STEPPER4b', { userName: user.displayName }) }}</p>
          <MarkdownInput :value="initialStatement">
            <QInput
              id="initial-statement"
              v-model="initialStatement"
              type="textarea"
              rows="6"
              @keyup.ctrl.enter="submit"
            />
          </MarkdownInput>
        </QStep>
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
            flat
            color="secondary"
            :loading="isPending"
            @click="submit"
          >
            {{ $t('BUTTON.SUBMIT') }}
          </QBtn>
        </QStepperNavigation>
      </QStepper>
      <div
        v-if="hasAnyError"
        class="text-negative q-pl-lg"
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
  QInput,
} from 'quasar'
import MarkdownInput from '@/utils/components/MarkdownInput'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    QStep,
    QStepper,
    QStepperNavigation,
    QBtn,
    QInput,
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
  data () {
    return {
      setup: 'attention',
      initialStatement: '',
    }
  },
  methods: {
    submit () {
      this.$emit('startConflictResolution', {
        group: this.currentGroup && this.currentGroup.id,
        affectedUser: this.user && this.user.id,
        topic: this.initialStatement,
      })
    },
  },
}
</script>

<style scoped lang="stylus">
.q-step
  min-height 200px
.q-stepper
  max-width 700px
</style>
