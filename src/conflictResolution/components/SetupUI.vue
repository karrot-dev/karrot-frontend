<template>
  <QCard>
    <QStepper
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
        <p>... for caring about your community!</p>
        <p>It is important to openly address conflicts and you obviously know this. People like you are the ones that keep a community healthy, that is highly appreciated!</p>
      </QStep>
      <QStep
        name="attention"
        icon="fas fa-exclamation"
        done-icon="fas fa-exclamation"
        :title="$t('ATTENTION')"
      >
        <p>You are about to start a group-wide conflict process!</p>
        <p>This will involve all of your group's editors to try and find the best way to proceed regarding this conflict.</p>
      </QStep>
      <QStep
        name="consequences"
        icon="fas fa-info"
        done-icon="fas fa-info"
        :title="$t('INFO')"
      >
        <p>This process will start an open chat and a vote.</p>
        <p>Every message in the chat will be visible for every editor in the group - including the ppp!</p>
        <p>The voting will last for 7 days during which all voters will still be able to change their minds and vote differently as many times as they want.</p>
      </QStep>
      <QStep
        name="statement"
        icon="fas fa-pen-alt"
        done-icon="fas fa-pen-alt"
        :title="$t('CONFLICT.STATEMENT')"
      >
        <p>Please make an initial statement for the open group chat!</p>
        <p>Tell your group why you think this process is justified and needed.</p>
        <MarkdownInput :value="initialStatement">
          <QInput
            id="initial-statement"
            v-model="initialStatement"
            type="textarea"
            rows="6"
            @keyup.ctrl.enter="startConflict"
          />
        </MarkdownInput>
      </QStep>
      <QStepperNavigation>
        <QBtn
          flat
          color="secondary"
          @click="$emit('cancel', user.id)"
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
          @click="startConflict"
        >
          {{ $t('BUTTON.SUBMIT') }}
        </QBtn>
      </QStepperNavigation>
    </QStepper>
  </QCard>
</template>

<script>
import {
  QStepper,
  QStep,
  QStepperNavigation,
  QBtn,
  QCard,
  QInput,
} from 'quasar'
import MarkdownInput from '@/utils/components/MarkdownInput'

export default {
  components: {
    QStep,
    QStepper,
    QStepperNavigation,
    QBtn,
    QCard,
    QInput,
    MarkdownInput,
  },
  props: {
    user: {
      required: true,
      type: Object,
    },
    group: {
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
    startConflict () {
      this.$emit('startConflictResolution', { affectedUser: this.user.id, group: this.group.id, topic: this.initialStatement })
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
