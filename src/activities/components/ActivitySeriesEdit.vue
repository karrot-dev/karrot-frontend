<template>
  <div
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <form
      class="q-gutter-y-lg"
      style="max-width: 700px"
      @submit.prevent="maybeSave"
    >
      <h3 v-if="activityTypeIconProps && isNew">
        <QIcon
          v-bind="activityTypeIconProps"
          class="q-pr-sm"
        />
        {{ activityTypeIconProps.title }}
      </h3>
      <slot />
      <QField
        stack-label
        borderless
        :label="$t('CREATEACTIVITY.FREQUENCY')"
        hide-bottom-space
      >
        <template #before>
          <QIcon name="fas fa-redo" />
        </template>
        <template #control>
          <QOptionGroup
            v-model="edit.rule.isCustom"
            inline
            type="radio"
            :options="[
              { label: $t('CREATEACTIVITY.WEEKLY'), value: false },
              { label: $t('CREATEACTIVITY.CUSTOM'), value: true },
            ]"
          />
        </template>
      </QField>

      <div class="row q-mt-xs">
        <QInput
          v-if="edit.rule.isCustom"
          ref="qStartDate"
          v-model="startDate"
          mask="####-##-##"
          :error="hasError('startDate')"
          size="9"
          outlined
          hide-bottom-space
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
          outlined
          :error="hasError('startDate')"
          hide-bottom-space
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
          <template
            v-if="!edit.rule.isCustom"
            #before
          >
            <QIcon name="access_time" />
          </template>
          <template #after>
            <QBtn
              v-if="!hasDuration"
              size="xs"
              round
              flat
              icon="fas fa-plus"
              class="q-ml-xs"
              @click.stop.prevent="toggleDuration"
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
            outlined
            :error="hasError('startDate')"
            hide-bottom-space
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
            v-if="hasError('startDate')"
            class="text-negative"
          >
            {{ firstError('startDate') }}
          </div>
          <div
            v-else
          >
            {{ edit.rule.isCustom ? $t('CREATEACTIVITY.STARTDATE_HELPER') : $t('CREATEACTIVITY.TIME_HELPER') }}
          </div>
        </div>
      </div>

      <QSelect
        v-if="!edit.rule.isCustom"
        v-model="byDay"
        multiple
        :options="dayOptions"
        :label="$t('CREATEACTIVITY.WEEKDAYS')"
        :hint="$t('CREATEACTIVITY.WEEKDAYS_HELPER')"
        :error="hasError('rule')"
        :error-message="firstError('rule')"
        outlined
        emit-value
        map-options
      >
        <template #before>
          <QIcon name="today" />
        </template>
        <template #option="scope">
          <QItem
            :key="scope.index"
            dense
            v-bind="scope.itemProps"
          >
            <QItemSection>
              <QItemLabel>{{ scope.opt.label }}</QItemLabel>
            </QItemSection>
            <QItemSection side>
              <QToggle
                :model-value="scope.selected"
                @update:model-value="scope.toggleOption(scope.opt)"
              />
            </QItemSection>
          </QItem>
        </template>
      </QSelect>

      <QInput
        v-if="edit.rule.isCustom"
        v-model="edit.rule.custom"
        type="textarea"
        :label="$t('CREATEACTIVITY.RRULE')"
        :error="hasError('rule')"
        :error-message="firstError('rule')"
        autogrow
        outlined
        :input-style="{ overflow: 'hidden' }"
        class="q-pb-xl"
        clearable
        @keyup.ctrl.enter="maybeSave"
      >
        <template #before>
          <QIcon name="code" />
        </template>
        <template #hint>
          <div style="line-height: 220%; margin-top: -5px;">
            <i18n-t
              scope="global"
              keypath="CREATEACTIVITY.RRULE_HELPER"
            >
              <template #ruleHelper>
                <a
                  v-t="'CREATEACTIVITY.RRULE_HELPER_URL'"
                  href="https://icalendar.org/rrule-tool.html"
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                  style="text-decoration: underline"
                  @click.stop
                />&nbsp;
                <QIcon
                  name="fas fa-external-link-alt"
                  class="q-mr-xs"
                />
              </template>
              <template #ruleExample>
                <br>
                <QBtn
                  :label="$t('CREATEACTIVITY.RRULE_EXAMPLE')"
                  color="grey"
                  size="sm"
                  unelevated
                  class="q-py-xs q-px-sm"
                  no-caps
                  @click.stop.prevent="edit.rule.custom = 'FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1'"
                />
              </template>
              <template #ruleExample2>
                <QBtn
                  :label="$t('CREATEACTIVITY.RRULE_EXAMPLE2')"
                  color="grey"
                  size="sm"
                  unelevated
                  class="q-py-xs q-px-sm"
                  no-caps
                  @click.stop.prevent="edit.rule.custom = 'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO'"
                />
              </template>
            </i18n-t>
          </div>
        </template>
      </QInput>

      <MarkdownInput
        v-model="edit.description"
        :error="hasError('description')"
        :error-message="firstError('description')"
        :label="$t('CREATEACTIVITY.COMMENT')"
        :hint="$t('CREATEACTIVITY.COMMENT_HELPER')"
        icon="info"
        mentions
        outlined
        maxlength="500"
        @keyup.ctrl.enter="maybeSave"
      />

      <ParticipantTypesEdit
        v-model="edit.participantTypes"
        @maybe-save="maybeSave"
      />

      <QField
        borderless
        hide-bottom-space
      >
        <QToggle
          v-model="edit.isPublic"
          :label="$t('CREATEACTIVITY.MAKE_IT_PUBLIC')"
        />
      </QField>

      <QField
        v-if="edit.isPublic"
        borderless
        stack-label
        bottom-slots
        :label="$t('CREATEACTIVITY.BANNER_IMAGE')"
      >
        <template #hint>
          <i18n-t
            scope="global"
            keypath="CREATEACTIVITY.BANNER_IMAGE_TIP"
          >
            <template #website>
              <a
                rel="noopener nofollow noreferrer"
                class="fas-after fa-after-external-link"
                target="_blank"
                href="https://www.pexels.com/search/banner/?orientation=landscape"
              >pexels.com</a>
            </template>
          </i18n-t>
        </template>
        <ChooseImage
          v-model="edit.bannerImage"
          :image-url="value.bannerImageUrls?.fullSize"
          :aspect-ratio="26/9"
          width="100%"
          :title="$t('CREATEACTIVITY.BANNER_IMAGE')"
          :dialog-title="$t('CREATEACTIVITY.SELECT_BANNER_IMAGE')"
          class="q-mt-sm"
        />
      </QField>

      <div
        v-if="hasNonFieldError"
        class="text-negative"
      >
        {{ firstNonFieldError }}
      </div>

      <div class="row justify-end q-gutter-sm q-mt-lg">
        <QToggle
          v-model="showPreview"
          :label="$t('BUTTON.PREVIEW')"
        />
        <QSpace />
        <QBtn
          v-if="canCancel"
          type="button"
          @click="$emit('cancel')"
        >
          {{ $t('BUTTON.CANCEL') }}
        </QBtn>
        <QBtn
          v-if="!isNew"
          type="button"
          :disable="!hasChanged"
          @click="reset"
        >
          {{ $t('BUTTON.RESET') }}
        </QBtn>
        <QBtn
          v-if="!isNew"
          type="button"
          color="red"
          @click="destroy"
        >
          {{ $t('BUTTON.DELETE') }}
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
          preview
          :activity="previewActivity"
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
  QTime,
  QField,
  QSlider,
  QInput,
  QBtn,
  QSelect,
  QIcon,
  QOptionGroup,
  QSeparator,
  QDialog,
  QMenu,
  QSpace,
  QItem,
  QItemSection,
  QItemLabel,
  QToggle,
  QDate,
  Dialog,
  date,
} from 'quasar'
import { rrulestr } from 'rrule' // TODO: only import this if preview needed? how big is it anyway?
import { defineAsyncComponent } from 'vue'

import activitySeriesAPI, { serializeRule } from '@/activities/api/activitySeries'
import { useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityTypeService } from '@/activities/services'
import { defaultDuration } from '@/activities/settings'
import { formatSeconds } from '@/activities/utils'
import { dayOptions } from '@/base/i18n'
import { useUserService } from '@/users/services'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import { objectDiff } from '@/utils/utils'

import ConfirmUserChangesDialog from '@/activities/components/ConfirmUserChangesDialog.vue'
import ParticipantTypesEdit from '@/activities/components/ParticipantTypesEdit.vue'
import ChooseImage from '@/utils/components/ChooseImage.vue'
import MarkdownInput from '@/utils/components/MarkdownInput.vue'

const ActivityItem = defineAsyncComponent(() => import('@/activities/components/ActivityItem.vue'))

export default {
  components: {
    ChooseImage,
    ActivityItem,
    QTime,
    QField,
    QSlider,
    QInput,
    QBtn,
    QSelect,
    QIcon,
    QOptionGroup,
    QItem,
    QItemSection,
    QItemLabel,
    QSeparator,
    QDialog,
    QMenu,
    QToggle,
    QSpace,
    QDate,
    MarkdownInput,
    ParticipantTypesEdit,
  },
  mixins: [editMixin, statusMixin],
  props: {
    canCancel: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'cancel',
    'destroy',
  ],
  setup () {
    const { getUserById } = useUserService()
    const { getActivityTypeById } = useActivityTypeService()
    const { getIconProps } = useActivityTypeHelpers()
    return {
      getUserById,
      getActivityTypeById,
      getIconProps,
    }
  },
  data () {
    return {
      showPreview: false,
    }
  },
  computed: {
    activityType () {
      return this.value && this.getActivityTypeById(this.value.activityType)
    },
    activityTypeIconProps () {
      return this.activityType ? this.getIconProps(this.activityType) : {}
    },
    dayOptions,
    canSave () {
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    ruleMode: {
      get () {
        return this.edit.rule.isCustom ? 'custom' : 'weekly'
      },
      set (v) {
        this.edit.rule.isCustom = v === 'custom'
      },
    },
    byDay: {
      get () {
        return this.edit.rule.byDay
      },
      set (v) {
        // enforce having at least one day selected
        if (v.length > 0) this.edit.rule.byDay = v
      },
    },
    hasDuration: {
      get () {
        return Boolean(this.edit.duration)
      },
      set (val) {
        if (val) {
          if (!this.edit.duration) this.edit.duration = defaultDuration
        }
        else {
          this.edit.duration = null
        }
      },
    },
    startDate: {
      get () {
        return date.formatDate(this.edit.startDate, 'YYYY-MM-DD')
      },
      set (val) {
        val = date.extractDate(val, 'YYYY-MM-DD')
        val = date.adjustDate(this.edit.startDate, { year: val.getFullYear(), month: val.getMonth() + 1, date: val.getDate() })
        this.edit.startDate = val
      },
    },
    startTime: {
      get () {
        return date.formatDate(this.edit.startDate, 'HH:mm')
      },
      set (val) {
        val = date.extractDate(val, 'HH:mm')
        val = date.adjustDate(this.edit.startDate, { hours: val.getHours(), minutes: val.getMinutes() })
        this.edit.startDate = val
      },
    },
    endTime: {
      get () {
        const endDate = addSeconds(this.edit.startDate, this.edit.duration)
        return date.formatDate(endDate, 'HH:mm')
      },
      set (val) {
        val = date.extractDate(val, 'HH:mm')
        val = date.adjustDate(this.edit.startDate, { hours: val.getHours(), minutes: val.getMinutes() })
        if (val < this.edit.startDate) {
          // if the value is in the past add a day (allows activities over midnight)
          val = addDays(val, 1)
        }
        this.edit.duration = differenceInSeconds(val, this.edit.startDate)
      },
    },
    formattedDuration () {
      return this.edit.duration && formatSeconds(this.edit.duration)
    },
    smallScreen () {
      return this.$q.screen.width < 450 || this.$q.screen.height < 450
    },
    rruleObject () {
      const { rule, startDate } = this.edit
      return rrulestr(serializeRule(rule), { dtstart: startDate })
    },
    previewActivity () {
      if (!this.showPreview) return null
      const {
        activityType,
        participantTypes,
        place,
        description,
        startDate,
        datesPreview = [],
        duration,
      } = this.edit
      const date = datesPreview[0] || this.rruleObject.after(new Date()) || startDate || new Date()
      const dateEnd = duration ? addSeconds(date, duration) : null
      return {
        activityType,
        participantTypes,
        place,
        description,
        date,
        dateEnd,
        hasDuration: Boolean(duration),
        participants: [],
      }
    },
  },
  watch: {
    // TODO: would be nice to include helpful message somewhere, but we access the activities differently now
    // isPending (val) {
    //   const hasExceptions = () => {
    //     const { activities } = this.edit
    //     return activities.some(({ seriesMeta }) => seriesMeta.isDescriptionChanged || seriesMeta.isMaxParticipantsChanged || !seriesMeta.matchesRule)
    //   }
    //   if (!val && !this.hasAnyError && hasExceptions()) {
    //     Dialog.create({
    //       title: this.$t('CREATEACTIVITY.EXCEPTIONS_TITLE'),
    //       message: this.$t('CREATEACTIVITY.EXCEPTIONS_MESSAGE', { upcomingLabel: this.$t('ACTIVITYMANAGE.UPCOMING_ACTIVITIES_IN_SERIES') }),
    //       ok: this.$t('BUTTON.YES'),
    //     })
    //   }
    // },
  },
  methods: {
    toggleDuration () {
      this.hasDuration = !this.hasDuration
    },
    async maybeSave () {
      if (!this.canSave) return
      if (this.isNew) {
        this.save()
      }
      else {
        const { participants } = await activitySeriesAPI.checkSave({ ...this.getPatchData(), id: this.value.id })
        const uniqueUsers = Array.from(new Set(participants.map(participant => participant.user)))

        Dialog.create({
          component: ConfirmUserChangesDialog,
          componentProps: {
            users: uniqueUsers,
          },
        })
          .onOk(({ updatedMessage }) => {
            if (updatedMessage) {
              this.save({ updatedMessage })
            }
            else {
              this.save()
            }

            // we saved the image, so we rely on the bannerImageUrls now
            // TODO: this causes a flickr as we don't wait for the save event to finish
            // TODO: rewrite ActivityEdit (+ series) to use composition API + mutation then we can await save...
            delete this.edit.bannerImage
          })
      }
    },
    // Overrides mixin method
    getPatchData () {
      const diff = objectDiff(this.value, this.edit)
      // Have to explicitly set this...
      if (this.edit.bannerImage === null) {
        diff.bannerImage = null
      }
      return diff
    },
    destroy () {
      Dialog.create({
        title: this.$t('ACTIVITYDELETE.DELETE_SERIES_TITLE'),
        message: this.$t('ACTIVITYDELETE.DELETE_SERIES_TEXT'),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.YES'),
      })
        .onOk(() => this.$emit('destroy', this.value.id))
    },
  },
}
</script>

<style scoped lang="sass">
@import 'editbox'
</style>
