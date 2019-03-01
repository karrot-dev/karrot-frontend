<template>
  <div
    class="relative-position"
    :class="{showOverlay}"
  >
    <div class="q-title q-mb-md">
      {{ $t('CONFLICT.VOTING.HEADLINE', { userName: issue.affectedUser.displayName }) }}
    </div>
    <div class="q-subheading q-mb-lg">
      {{ $t('ISSUE.VOTING.DAYS_LEFT', { count: days }) }}
      <QProgress
        :percentage="progress"
        style="height: 8px"
        color="secondary"
      />
    </div>
    <div class="content">
      <div>
        <div
          v-for="o in edit"
          :key="o.id"
        >
          <div class="q-mt-md">
            {{ getTitle(o.type) }}
          </div>
          <QSlider
            style="width: 85%; margin: 0 auto"
            v-model="o.yourScore"
            :label-value="getLabel(o.yourScore)"
            :min="-2"
            :max="2"
            :step="1"
            label-always
            snap
            markers
          />
        </div>
      </div>
      <div class="row justify-end group">
        <QBtn
          v-if="canDelete"
          color="negative"
          @click="deleteVote"
        >
          {{ $t('ISSUE.VOTING.BTN_DELETE') }}
        </QBtn>
        <QBtn
          type="submit"
          color="secondary"
          :loading="isPending"
          :disable="!hasChanged"
          @click="$emit('save', results)"
        >
          {{ $t('BUTTON.SUBMIT') }}
        </QBtn>
      </div>
      <div
        v-if="hasAnyError"
        class="text-negative q-pl-lg"
      >
        <i class="fas fa-exclamation-triangle"/>
        {{ anyFirstError }}
      </div>
    </div>
    <QBtn
      v-if="showOverlay"
      class="absolute-center"
      color="primary"
      @click="setToZero()"
      v-t="'ISSUE.VOTING.BTN_START'"
    />
  </div>
</template>

<script>
import {
  QSlider,
  QProgress,
  QBtn,
} from 'quasar'

import distanceInWordsStrict from 'date-fns/distance_in_words_strict'
import differenceInHours from 'date-fns/difference_in_hours'
import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import reactiveNow from '@/utils/reactiveNow'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    QSlider,
    QProgress,
    QBtn,
  },
  mixins: [statusMixin],
  props: {
    issue: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      edit: null,
    }
  },
  watch: {
    options: {
      immediate: true,
      handler (current, previous) {
        this.edit = cloneDeep(current)
      },
    },
  },
  computed: {
    days () {
      return distanceInWordsStrict(this.ongoingVoting.expiresAt, reactiveNow.value)
    },
    progress () {
      return 100 - (differenceInHours(this.ongoingVoting.expiresAt, reactiveNow.value) / 168 * 100)
    },
    showOverlay () {
      if (!this.edit) return
      return this.edit.some(o => o.yourScore === null)
    },
    results () {
      return this.edit.map(o => ({
        score: o.yourScore,
        option: o.id,
      }))
    },
    ongoingVoting () {
      return this.issue.votings.find(v => !v.acceptedOption)
    },
    options () {
      return this.ongoingVoting.options
    },
    hasChanged () {
      return !deepEqual(this.options, this.edit)
    },
    canDelete () {
      return this.options.some(o => o.yourScore !== null)
    },
  },
  methods: {
    getLabel (score) {
      const getTranslationId = () => {
        switch (score) {
          default:
            return 'NEUTRAL'
          case 1:
            return 'AGREE'
          case 2:
            return 'STRONGLY_AGREE'
          case -1:
            return 'DISAGREE'
          case -2:
            return 'STRONGLY_DISAGREE'
        }
      }
      return this.$t(`ISSUE.VOTING.SCORE_LABELS.${getTranslationId()}`)
    },
    async deleteVote () {
      this.$emit('delete')
      this.edit = this.edit.map(o => ({
        ...o,
        yourScore: null,
      }))
    },
    setToZero () {
      this.edit = this.edit.map(o => ({
        ...o,
        yourScore: 0,
      }))
    },
    getTitle (type) {
      return this.$t(`ISSUE.VOTING.${type.toUpperCase()}`, { userName: this.issue.affectedUser.displayName, groupName: this.issue.group.name })
    },
  },
}
</script>

<style scoped lang="stylus">
.showOverlay .content
  opacity 0.3
  filter blur(3px)
</style>
