<template>
  <div>
    <div class="text-bold">
      {{ $t('MEMBERSHIP_REVIEW.VOTING.HEADLINE', { userName: affectedUser.displayName }) }}
    </div>
    <div class="q-pb-md">
      <QBanner class="q-mt-sm q-mb-md bg-yellow-2">
        <template #avatar>
          <QIcon
            name="help_outline"
            size="sm"
          />
        </template>
        {{ $t('MEMBERSHIP_REVIEW.INFO.MESSAGE') }}
        <a
          v-t="'MEMBERSHIP_REVIEW.FIND_OUT_MORE'"
          href="https://community.karrot.world/t/how-does-the-conflict-resolution-feature-work/254/3"
          target="_blank"
          rel="noopener"
          style="text-decoration: underline"
        />
      </QBanner>
      <div class="text-caption k-caption-opacity row inline">
        <div>{{ $t('ISSUE.VOTING.TIME_LEFT') }}</div>:
        <DateAsWords
          class="q-pl-xs"
          :date="ongoingVoting.expiresAt"
          future
          strict
          no-suffix
        />
      </div>
      <QLinearProgress
        :value="progress"
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
          <div class="text-caption k-caption-opacity">
            {{ $t('ISSUE.VOTING.DECIDE') }}
            {{ $t('ISSUE.VOTING.ANONYMOUS') }}
          </div>
          <div
            v-for="o in edit"
            :key="o.id"
          >
            <div class="q-my-md">
              {{ getTitle(o.type) }}
            </div>
            <QSlider
              :model-value="o.yourScore || 0"
              class="k-vote-slider"
              :label-value="getLabel(o.yourScore)"
              :min="-2"
              :max="2"
              :step="1"
              label-always
              snap
              markers
              @update:model-value="val => o.yourScore = val"
            />
          </div>
        </div>
        <div class="row justify-end q-gutter-sm q-mt-sm">
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
            {{ $t('ISSUE.VOTING.BTN_START') }}
          </QBtn>
        </div>
      </div>
      <div
        v-if="hasAnyError"
        class="text-negative q-pl-lg"
      >
        <i class="fas fa-exclamation-triangle" />
        {{ anyFirstError }}
      </div>
      <template v-if="showOverlay">
        <div class="overlay absolute-full" />
        <QBtn
          v-t="'ISSUE.VOTING.BTN_START'"
          class="absolute-center q-px-md q-py-sm"
          color="primary"
          @click="setToZero()"
        />
      </template>
    </div>
  </div>
</template>

<script>

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import {
  QSlider,
  QLinearProgress,
  QBtn,
  QBanner,
  QIcon,
} from 'quasar'

import statusMixin from '@/utils/mixins/statusMixin'
import reactiveNow from '@/utils/reactiveNow'

import DateAsWords from '@/utils/components/DateAsWords'

export default {
  components: {
    QSlider,
    QLinearProgress,
    QBtn,
    DateAsWords,
    QBanner,
    QIcon,
  },
  mixins: [statusMixin],
  props: {
    issue: {
      type: Object,
      required: true,
    },
    group: {
      type: Object,
      required: true,
    },
    affectedUser: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'save',
    'delete',
  ],
  data () {
    return {
      edit: null,
      showInfo: false,
    }
  },
  computed: {
    progress () {
      const { expiresAt, createdAt } = this.ongoingVoting
      const duration = expiresAt - createdAt
      const elapsed = reactiveNow.value - createdAt
      return Math.min(elapsed / duration, 1)
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
  watch: {
    options: {
      immediate: true,
      handler (current, previous) {
        this.edit = cloneDeep(current)
      },
    },
  },
  methods: {
    getLabel (score) {
      const getTranslationId = () => {
        switch (score) {
          case 1:
            return 'SLIGHT_SUPPORT'
          case 2:
            return 'STRONG_SUPPORT'
          case -1:
            return 'SLIGHT_RESISTANCE'
          case -2:
            return 'STRONG_RESISTANCE'
          default:
            return 'NEUTRAL'
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
      return this.$t(`ISSUE.VOTING.${type.toUpperCase()}`, { userName: this.affectedUser.displayName, groupName: this.group.name })
    },
  },
}
</script>

<style scoped lang="sass">
.showOverlay.content
  filter: blur(3px)
  opacity: 0.3

.k-vote-slider
  width: 85%
  margin: 0 auto
</style>
