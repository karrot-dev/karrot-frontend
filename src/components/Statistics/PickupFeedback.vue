<template>
  <q-card
    class="no-shadow generic-padding grey-border"
    style="width: 100%"
  >
    <div class="row no-wrap image-and-text">
      <div class="image-and-text-left gt-sm">
        <img
          style="width: 100%;"
          :src="cartImg">
      </div>
      <div class="image-and-text-right">
        <h4>{{ $t('PICKUP_FEEDBACK.HEADER') }}</h4>
        <p v-if="select">{{ getDateWithStore(select) }}
          <q-btn
            @click="select = false"
            flat>
            {{ $t("PICKUP_FEEDBACK.OTHER") }}
          </q-btn>
        </p>
      </div>
    </div>
    <q-field
      v-if="!select"
      style="margin-top: 2em; padding: 0 .5em"
      icon="fa-shopping-basket"
      :label="$t('PICKUP_FEEDBACK.SELECT_PICKUP')">
      <q-select
        v-model="select"
        :options="feedbackOptions"
      />
    </q-field>
    <form
      v-else
      @submit.prevent="save"
      style="padding: 0 1.5em"
    >
      <AmountPicker v-model="feedback.weight"/>
      <q-field
        style="margin-top: 2em; padding: 0 .5em"
        icon="fa-star"
        :label="$t('PICKUP_FEEDBACK.COMMENT')"
        :error="hasError('comment')"
        :error-label="firstError('comment')"
      >
        <q-input
          v-model="feedback.comment"
          type="textarea"
          :placeholder="$t('PICKUP_FEEDBACK.COMMENT_PLACEHOLDER')"
          autocomplete="off"
          :min-rows="2"
        />
      </q-field>
      <div class="row justify-end generic-margin group">
        <q-btn
          type="submit"
          color="primary"
          v-t="'BUTTON.CREATE'"
        />
      </div>
      <h4
        v-if="select"
        v-t="{ path: 'PICKUP_FEEDBACK.PREVIOUS', args: { store: select.store.name } }"
      />
      <FeedbackList :feedback="feedbackForStore" />
    </form>

    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      <i class="fa fa-exclamation-triangle"/>
      {{ firstNonFieldError }}
    </div>
  </q-card>
</template>

<script>
import { QCard, QField, QInput, QBtn, QSelect } from 'quasar'
import AmountPicker from './AmountPicker'
import FeedbackList from './FeedbackList'
import cartImg from 'assets/people/cart.png'
import statusMixin from '@/mixins/statusMixin'

function first (a) {
  return a && a[0]
}

export default {
  components: { QCard, QField, QInput, QBtn, QSelect, AmountPicker, FeedbackList },
  mixins: [statusMixin],
  props: {
    pickups: { required: true, type: Array },
    existingFeedback: { required: true, type: Array },
  },
  data () {
    return {
      feedback: {
        weight: 1,
        comment: '',
      },
      cartImg,
      select: first(this.pickups),
    }
  },
  methods: {
    save () {
      this.feedback.about = this.select.id
      this.$emit('save', this.feedback)
    },
    getDateWithStore (pickup) {
      return `${this.$d(pickup.date, 'long')} (${pickup.store.name})`
    },
  },
  watch: {
    pickups (val) {
      this.select = first(val)
    },
  },
  computed: {
    feedbackOptions () {
      if (!this.pickups) return []
      return this.pickups.map((e) => {
        return {
          label: this.getDateWithStore(e),
          value: e,
        }
      })
    },
    feedbackForStore () {
      if (!this.select) return []
      return this.existingFeedback.filter(e => e.about && e.about.store.id === this.select.store.id)
    },
  },
}
</script>

<style scoped lang="stylus">
.image-and-text
  margin-bottom 3.5em
  .image-and-text-left
    width 30%
    max-width 10em
    margin auto
    padding 1em
  .image-and-text-right
    width: 70%
    margin 0 auto
</style>
