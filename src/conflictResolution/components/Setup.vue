<template>
  <QCard>
    <QStepper
      ref="setup"
      vertical
      v-model="setup"
    >
      <QStep
        name="thanks"
        icon="fas fa-hand-holding-heart"
        done-icon="fas fa-hand-holding-heart"
        title="Thank you!"
      >
        <p>Thank you for being an active member of your community and caring for it!</p>
      </QStep>
      <QStep
        name="attention"
        icon="fas fa-exclamation"
        done-icon="fas fa-exclamation"
        title="Attention!"
      >
        <p>You are about to start a group-wide conflict process!</p>
      </QStep>
      <QStep
        name="consequences"
        icon="fas fa-info"
        done-icon="fas fa-info"
        title="Info"
      >
        <p>This process will start an open chat and a vote</p>
      </QStep>
      <QStep
        name="statement"
        icon="fas fa-pen-alt"
        done-icon="fas fa-pen-alt"
        title="Statement"
      >
        <p>Please tell your group why you think this conflict resolution is justified</p>
      </QStep>
      <QStepperNavigation>
        <QBtn
          v-if="setup !== 'thanks'"
          flat
          color="secondary"
          @click="$refs.setup.previous()"
        >
          Back
        </QBtn>
        <QBtn
          flat
          class="q-ml-sm"
          color="secondary"
          @click="$refs.setup.next()"
        >
          {{ setup === 'statement' ? 'Submit' : 'Next' }}
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
} from 'quasar'

export default {
  components: {
    QStep,
    QStepper,
    QStepperNavigation,
    QBtn,
    QCard,
  },
  data () {
    return {
      setup: 'thanks',
    }
  },
}
</script>
