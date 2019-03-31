<template>
  <div>
    <div class="float-right">
      <QBtn
        flat
        round
        dense
        icon="help_outline"
        @click="showInfo = true"
      >
        <QDialog
          v-if="showInfo"
          v-model="showInfo"
          :title="$t('CONFLICT.INFO.TITLE')"
          :ok="$t('BUTTON.CLOSE')"
        >
          <template slot="message">
            <p v-t="'CONFLICT.INFO.MESSAGE'" />
            <a
              v-t="'CONFLICT.FIND_OUT_MORE'"
              href="https://community.foodsaving.world/t/how-does-the-conflict-resolution-feature-work/254/3"
              target="_blank"
              rel="noopener"
              style="text-decoration: underline"
            />
          </template>
        </QDialog>
      </QBtn>
    </div>
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
              v-model="o.yourScore"
              class="k-vote-slider"
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
        <div class="q-caption q-caption-opacity q-my-xs">
          {{ $t('ISSUE.VOTING.ANONYMOUS') }}
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
            {{ $t('ISSUE.VOTING.SAVE') }}
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
          class="absolute-center"
          color="primary"
          @click="setToZero()"
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
  QDialog,
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
    QDialog,
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
      showInfo: false,
    }
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
          default:
            return 'NEUTRAL'
          case 1:
            return 'SLIGHT_SUPPORT'
          case 2:
            return 'STRONG_SUPPORT'
          case -1:
            return 'SLIGHT_RESISTANCE'
          case -2:
            return 'STRONG_RESISTANCE'
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
.k-vote-slider
  width 85%
  margin 0 auto
</style>
