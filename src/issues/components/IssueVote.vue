<template>
  <div>
    <div class="q-title q-mb-md">
      {{ $t('CONFLICT.VOTING.HEADLINE', { userName: issue.affectedUser.displayName }) }}
    </div>
    <div class="q-pb-lg">
      <div class="q-caption q-caption-opacity row inline">
        <div>{{ $t('ISSUE.VOTING.TIME_LEFT') }}</div>:
        <DateAsWords
          class="q-pl-xs"
          :date="ongoingVoting.expiresAt"
          future
          strict
          no-suffix
        />
      </div>
      <QProgress
        :percentage="progress"
        style="height: 8px"
        color="secondary"
      />
    </div>
    <div class="relative-position">
      <div
        class="content"
        :class="{showOverlay}"
      >
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
      </div>
      <div
        v-if="hasAnyError"
        class="text-negative q-pl-lg"
      >
        <i class="fas fa-exclamation-triangle"/>
        {{ anyFirstError }}
      </div>
      <template v-if="showOverlay">
        <div class="overlay absolute-full" />
        <QBtn
          class="absolute-center"
          color="primary"
          @click="setToZero()"
          v-t="'ISSUE.VOTING.BTN_START'"
        />
      </template>
    </div>
  </div>
</template>

<script>
import {
  QSlider,
  QProgress,
  QBtn,
} from 'quasar'

import DateAsWords from '@/utils/components/DateAsWords'
import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import reactiveNow from '@/utils/reactiveNow'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    QSlider,
    QProgress,
    QBtn,
    DateAsWords,
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
    progress () {
      const { expiresAt, createdAt } = this.ongoingVoting
      const duration = expiresAt - createdAt
      const elapsed = reactiveNow.value - createdAt
      return Math.min(elapsed / duration, 1) * 100
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
      // only emit 'delete' event if the vote has been saved already, otherwise just reset the sliders
      if (this.options.some(o => o.yourScore !== null)) {
        this.$emit('delete')
      }
      else {
        this.edit = this.edit.map(o => ({
          ...o,
          yourScore: null,
        }))
      }
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
.showOverlay.content
  opacity 0.3
  filter blur(3px)
</style>
