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
        <p> {{ $t('CONFLICT.STEPPER3') }} </p>
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
            @keyup.ctrl.enter="startConflict"
          />
        </MarkdownInput>
        <div
          v-if="hasAnyError"
          class="text-negative"
          style="margin-bottom: 2em"
        >
          <i class="fas fa-exclamation-triangle"/>
          {{ anyFirstError }}
        </div>
      </QStep>
      <QStepperNavigation>
        <QBtn
          flat
          color="secondary"
          @click="$emit('cancel', $route.params.userId)"
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
          @click="$emit('startConflictResolution', { group: $route.params.groupId, affectedUser: $route.params.userId, topic: initialStatement })"
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
import statusMixin from '@/utils/mixins/statusMixin'

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
  mixins: [statusMixin],
  data () {
    return {
      setup: 'thanks',
      initialStatement: '',
    }
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
