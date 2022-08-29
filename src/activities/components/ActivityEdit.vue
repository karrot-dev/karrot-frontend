<template>
  <div
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <div class="q-mb-lg">
      <b
        v-if="edit.isDisabled"
        class="text-negative"
      >
        {{ $t('ACTIVITYLIST.ACTIVITY_DISABLED') }}
      </b>
    </div>

    <form
      class="q-gutter-y-lg"
      style="max-width: 700px"
      @submit.prevent="maybeSave"
    >
      <h3 v-if="activityType && isNew">
        <QIcon
          v-bind="activityTypeIconProps"
          class="q-pr-sm"
        />
        {{ activityTypeIconProps.title }}
      </h3>
      <template v-if="canEditDate">
        <div class="row q-mt-xs">
          <QInput
            ref="qStartDate"
            v-model="startDate"
            mask="####-##-##"
            :error="hasError('date')"
            size="9"
            hide-bottom-space
            outlined
            class="q-mr-sm"
            @focus="$refs.qStartDateProxy.show()"
          >
            <template #before>
              <QIcon name="access_time" />
            </template>
            <Component
              :is="smallScreen ? 'QDialog' : 'QMenu'"
              ref="qStartDateProxy"
              no-focus
              no-refocus
              no-parent-event
              @hide="$refs.qStartDate.blur()"
            >
              <QDate
                v-model="startDate"
                :options="futureDates"
                mask="YYYY-MM-DD"
                @update:model-value="() => smallScreen && $refs.qStartDateProxy.hide()"
              />
            </Component>
          </QInput>
          <QInput
            ref="qStartTime"
            v-model="startTime"
            mask="time"
            :rules="['time']"
            size="3"
            :error="hasError('date')"
            hide-bottom-space
            outlined
            @focus="$refs.qStartTimeProxy.show()"
          >
            <Component
              :is="smallScreen ? 'QDialog' : 'QMenu'"
              ref="qStartTimeProxy"
              no-focus
              no-refocus
              no-parent-event
              @hide="$refs.qStartTime.blur()"
            >
              <QTime
                v-model="startTime"
                mask="HH:mm"
                format24h
                @update:model-value="() => smallScreen && $refs.qStartTimeProxy.hide()"
              />
            </Component>
            <template #after>
              <QBtn
                v-if="!hasDuration"
                size="xs"
                round
                flat
                icon="fas fa-plus"
                class="q-ml-xs"
                @click="toggleDuration"
              />
            </template>
          </QInput>
          <template v-if="hasDuration">
            <div
              v-t="'TO'"
              class="q-px-md self-center"
            />
            <QInput
              ref="qEndTime"
              v-model="endTime"
              mask="time"
              :rules="['time']"
              size="3"
              :error="hasError('date')"
              hide-bottom-space
              outlined
              @focus="$refs.qEndTimeProxy.show()"
            >
              <Component
                :is="smallScreen ? 'QDialog' : 'QMenu'"
                ref="qEndTimeProxy"
                no-focus
                no-refocus
                no-parent-event
                @hide="$refs.qEndTime.blur()"
              >
                <QTime
                  v-model="endTime"
                  mask="HH:mm"
                  format24h
                  @update:model-value="() => smallScreen && $refs.qEndTimeProxy.hide()"
                />
              </Component>
              <template #after>
                <QIcon
                  color="grey"
                  name="cancel"
                  class="cursor-pointer"
                  @click="toggleDuration"
                />
                <div class="text-caption q-ml-xs">
                  ({{ formattedDuration }})
                </div>
              </template>
            </QInput>
          </template>
          <div class="q-ml-lg col-12 q-field__bottom">
            <div
              v-if="hasError('date')"
              class="text-negative"
            >
              {{ firstError('date') }}
            </div>
            <div
              v-else
            >
              {{ $t('CREATEACTIVITY.TIME_HELPER') }}
            </div>
          </div>
        </div>
      </template>

      <MarkdownInput
        v-model="edit.description"
        :error="hasError('description')"
        :error-message="firstError('description')"
        :label="$t('CREATEACTIVITY.COMMENT')"
        :hint="$t('CREATEACTIVITY.COMMENT_HELPER')"
        icon="info"
        maxlength="500"
        :input-style="{ minHeight: 'auto' }"
        mentions
        outlined
        @keyup.ctrl.enter="maybeSave"
      >
        <template #after>
          <QIcon
            v-if="series ? series.description !== edit.description : false"
            name="undo"
            @click="edit.description = series.description"
          />
        </template>
      </MarkdownInput>
      <div
        v-if="seriesMeta.isDescriptionChanged"
        class="q-ml-lg col-12 q-field__bottom text-warning"
      >
        <QIcon name="warning" />
        {{ $t('CREATEACTIVITY.DIFFERS_WARNING') }}
      </div>

      <ParticipantTypesEdit
        v-model="edit.participantTypes"
        :roles="roles"
        :series="series"
        :series-meta="seriesMeta"
        @maybe-save="maybeSave"
      />

      <div
        v-if="hasNonFieldError"
        class="text-negative"
      >
        {{ firstNonFieldError }}
      </div>

      <div class="row justify-end q-gutter-sm q-mt-lg">
        <QToggle
          v-model="showPreview"
          label="Show preview"
        />
        <QSpace />
        <QBtn
          v-if="isNew"
          type="button"
          @click="$emit('cancel')"
        >
          {{ $t('BUTTON.CANCEL') }}
        </QBtn>

        <QBtn
          v-if="!isNew"
          type="button"
          :disable="!hasChanged"
          @click="doReset"
        >
          {{ $t('BUTTON.RESET') }}
        </QBtn>

        <QBtn
          v-if="!isNew && !edit.isDisabled"
          type="button"
          color="red"
          @click="disable"
        >
          {{ $t('BUTTON.DISABLE') }}
        </QBtn>

        <QBtn
          v-if="!isNew && edit.isDisabled"
          type="button"
          color="secondary"
          @click="enable"
        >
          {{ $t('BUTTON.ENABLE') }}
        </QBtn>

        <QBtn
          type="submit"
          color="primary"
          :disable="!canSave"
          :loading="isPending"
        >
          {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
        </QBtn>
      </div>

      <div v-if="showPreview">
        <ActivityItem
          :activity="previewActivity"
          :roles="roles"
        />
      </div>
    </form>
  </div>
</template>

<script>
import addDays from 'date-fns/addDays'
import addSeconds from 'date-fns/addSeconds'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import {
  QCard,
  QCardSection,
  QCardActions,
  QDate,
  QTime,
  QSlider,
  QInput,
  QBtn,
  QIcon,
  QMenu,
  QDialog,
  QToggle,
  QSelect,
  QSpace,
  Dialog,
  date,
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { defaultDuration } from '@/activities/settings'
import { formatSeconds } from '@/activities/utils'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import reactiveNow from '@/utils/reactiveNow'
import { objectDiff } from '@/utils/utils'

import ActivityItem from '@/activities/components/ActivityItem'
import ParticipantTypesEdit from '@/activities/components/ParticipantTypesEdit'
import MarkdownInput from '@/utils/components/MarkdownInput'

export default {
  name: 'ActivityEdit',
  components: {
    ParticipantTypesEdit,
    ActivityItem,
    QDate,
    QTime,
    QSlider,
    QInput,
    QBtn,
    QIcon,
    QMenu,
    QDialog,
    QToggle,
    QSelect,
    QCard,
    QCardSection,
    QCardActions,
    QSpace,
    MarkdownInput,
    QItem,
    QItemSection,
    QItemLabel,
  },
  mixins: [editMixin, statusMixin],
  props: {
    series: {
      type: Object,
      default: null,
    },
    roles: {
      type: Array,
      required: true,
    },
  },
  emits: [
    'cancel',
    'save',
  ],
  setup () {
    const { getIconProps } = useActivityTypeHelpers()
    return { getIconProps }
  },
  data () {
    return {
      showPreview: false,
    }
  },
  computed: {
    previewActivity () {
      return {
        ...this.edit,
        // fake statuses, just enough for the preview
        joinStatus: {
          pending: false,
        },
        leaveStatus: {
          pending: false,
        },
      }
    },
    roleOptions () {
      return [
        {
          label: 'Anyone',
          value: 'member',
          description: 'Anyone in the group',
        },
        {
          label: 'Newcomer',
          value: 'newcomer',
          description: 'People that haven\'t yet got any other roles',
        },
        {
          label: 'Approved',
          value: 'approved',
          description: 'People that have been trusted with approved role',
        },
        {
          label: 'Editor',
          value: 'editor',
          description: 'People that have been trusted in the group as an editor',
        },
      ]
    },
    activityType () {
      return this.value && this.value.activityType
    },
    activityTypeIconProps () {
      return this.activityType ? this.getIconProps(this.activityType) : {}
    },
    now () {
      return reactiveNow.value
    },
    canSave () {
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    canEditDate () {
      if (this.edit.series) return false
      return true
    },
    seriesMeta () {
      if (!this.edit.seriesMeta) return {}
      return this.edit.seriesMeta
    },
    date: {
      get () {
        return this.edit.date
      },
      set (val) {
        // keep the duration the same when setting the date
        const duration = differenceInSeconds(this.edit.dateEnd, this.edit.date)
        this.edit.dateEnd = addSeconds(val, duration)
        this.edit.date = val
      },
    },
    startDate: {
      get () {
        return date.formatDate(this.edit.date, 'YYYY-MM-DD')
      },
      set (val) {
        val = date.extractDate(val, 'YYYY-MM-DD')
        val = date.adjustDate(this.edit.date, { year: val.getFullYear(), month: val.getMonth() + 1, date: val.getDate() })
        this.date = val
      },
    },
    startTime: {
      get () {
        return date.formatDate(this.edit.date, 'HH:mm')
      },
      set (val) {
        val = date.extractDate(val, 'HH:mm')
        val = date.adjustDate(this.edit.date, { hours: val.getHours(), minutes: val.getMinutes() })
        this.date = val
      },
    },
    endTime: {
      get () {
        return date.formatDate(this.edit.dateEnd, 'HH:mm')
      },
      set (val) {
        if (val.length < 5) return
        val = date.extractDate(val, 'HH:mm')
        val = date.adjustDate(this.edit.date, { hours: val.getHours(), minutes: val.getMinutes() })
        if (val <= this.edit.date) {
          // if the value is in the past add a day (allows activities over midnight)
          this.edit.dateEnd = addDays(val, 1)
          return
        }

        const duration = differenceInSeconds(val, this.edit.date)
        const twentyFourHours = 24 * 60 * 60
        if (duration > twentyFourHours) {
          const cappedDuration = duration % twentyFourHours
          this.edit.dateEnd = addSeconds(this.edit.date, cappedDuration)
          return
        }

        this.edit.dateEnd = val
      },
    },
    formattedDuration () {
      return formatSeconds(differenceInSeconds(this.edit.dateEnd, this.edit.date))
    },
    hasDuration: {
      get () {
        return this.edit.hasDuration
      },
      set (val) {
        // reset to default duration when un-setting hasDuration
        if (!val) this.edit.dateEnd = addSeconds(this.edit.date, defaultDuration)
        this.edit.hasDuration = val
      },
    },
    smallScreen () {
      return this.$q.screen.width < 450 || this.$q.screen.height < 450
    },
  },
  watch: {
    'edit.maxParticipants' (val) {
      if (val === '') {
        // if we have 'unlimited' participants, val gets parsed to empty string, but the server expects null
        this.edit.maxParticipants = null
      }
    },
  },
  methods: {
    doReset () {
      this.reset()
      // TODO: reset in nested ParticipantTypesEdit
    },
    futureDates (dateString) {
      return date.extractDate(`${dateString} 23:59`, 'YYYY/MM/DD HH:mm') > this.now
    },
    toggleDuration () {
      this.hasDuration = !this.hasDuration
    },
    maybeSave () {
      if (!this.canSave) return
      this.save()
    },
    getCreateData () {
      return {
        ...this.edit,
        activityType: this.activityType.id,
      }
    },
    // Overrides mixin method to always provide start date if we have modified end date
    getPatchData () {
      const diff = objectDiff(this.value, this.edit)
      if (diff.dateEnd && !diff.date) diff.date = this.edit.date
      return diff
    },
    disable () {
      try {
        Dialog.create({
          title: this.$t('CREATEACTIVITY.DISABLE_TITLE'),
          message: this.$t('CREATEACTIVITY.ENABLE_DISABLE_MESSAGE'),
          prompt: {
            model: this.edit.description,
            type: 'text',
          },
          cancel: this.$t('BUTTON.CANCEL'),
          ok: this.$t('BUTTON.YES'),
        }).onOk(description => {
          this.$emit('save', {
            id: this.edit.id,
            description,
            isDisabled: true,
          })
        })
      }
      catch (e) {}
    },
    enable () {
      try {
        Dialog.create({
          title: this.$t('CREATEACTIVITY.ENABLE_TITLE'),
          message: this.$t('CREATEACTIVITY.ENABLE_DISABLE_MESSAGE'),
          prompt: {
            // reset if there's a series default
            model: this.series ? this.series.description : this.edit.description,
            type: 'text',
          },
          cancel: this.$t('BUTTON.CANCEL'),
          ok: this.$t('BUTTON.YES'),
        }).onOk(description => {
          this.$emit('save', {
            id: this.edit.id,
            description,
            isDisabled: false,
          })
        })
      }
      catch (e) {}
    },
  },
}
</script>

<style scoped lang="sass">
@import '~editbox'
</style>
