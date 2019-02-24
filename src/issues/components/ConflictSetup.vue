<template>
  <div>
    <h3
      class="q-pl-lg q-mb-sm"
      v-t="'CONFLICT.SETUP_HEADER'"
    />
    <div>
      <QStepper
        class="no-shadow"
        ref="setup"
        v-model="setup"
        contractable
      >
        <QStep
          name="thanks"
          icon="fas fa-hand-holding-heart"
          done-icon="fas fa-hand-holding-heart"
          :title="$t('THANKS')"
        >
          <p> {{ $t('CONFLICT.STEPPER1') }} </p>
        </QStep>
        <QStep
          name="attention"
          icon="fas fa-exclamation"
          done-icon="fas fa-exclamation"
          :title="$t('ATTENTION')"
        >
          <p> {{ $t('CONFLICT.STEPPER2') }} </p>
        </QStep>
        <QStep
          name="consequences"
          icon="fas fa-info"
          done-icon="fas fa-info"
          :title="$t('INFO')"
        >
          <p> {{ $t('CONFLICT.STEPPER3', { votingDuration: currentGroup && currentGroup.issueVotingDurationDays }) }} </p>
        </QStep>
        <QStep
          name="statement"
          icon="fas fa-pen-alt"
          done-icon="fas fa-pen-alt"
          :title="$t('CONFLICT.STATEMENT')"
        >
          <p> {{ $t('CONFLICT.STEPPER4') }} </p>
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
            v-if="setup !== 'thanks'"
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
        <i class="fas fa-exclamation-triangle"/>
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
      setup: 'thanks',
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
