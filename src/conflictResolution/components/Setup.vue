<template>
  <QCard>
    <QStepper>
      <QStep
        icon="fas fa-hand-holding-heart"
        active-icon="fas fa-hand-holding-heart"
      >
        <p>Thank you for being an active member of your community and caring for it!</p>
      </QStep>
      <QStep
        icon="fas fa-exclamation"
      >
        <p>You are about to start a group-wide conflict process!</p>
      </QStep>
      <QStep
        icon="fas fa-info"
      >
        <p>This process will start an open chat and a vote</p>
      </QStep>
      <QStep
        icon="fas fa-pen-alt"
      >
        <p>Please tell your group why you think this conflict resolution is justified</p>
      </QStep>
      <QStepperNavigation>
        <QBtn
          flat
          color="secondary"
          label="Back"
        />
        <QBtn
          flat
          color="secondary"
          label="Next"
        />
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
}
</script>
