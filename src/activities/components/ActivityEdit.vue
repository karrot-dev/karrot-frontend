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
          <div class="col-12 q-field__bottom">
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
        maxlength="5000"
        :input-style="{ minHeight: 'auto' }"
        mentions
        outlined
        :bg-color="series && series.description !== edit.description ? 'orange-1' : null"
        @keyup.ctrl.enter="maybeSave"
      >
        <template #after>
          <QBtn
            v-if="series ? series.description !== edit.description : false"
            icon="undo"
            unelevated
            dense
            @click="edit.description = series.description"
          />
        </template>
      </MarkdownInput>
      <div
        v-if="series && series.description !== edit.description"
        class="q-ml-lg col-12 q-field__bottom text-warning"
      >
        <QIcon name="warning" />
        {{ $t('CREATEACTIVITY.DIFFERS_WARNING') }}
      </div>

      <ParticipantTypesEdit
        v-model="edit.participantTypes"
        :series="series"
        :participants="value.participants"
        @maybe-save="maybeSave"
      />

      <template v-if="!series">
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
          label="Banner image"
        >
          <template #hint>
            Tip: You can get free banners images from <a
              rel="noopener nofollow noreferrer"
              class="fas-after fa-after-external-link"
              target="_blank"
              href="https://www.pexels.com/search/banner/?orientation=landscape"
            >pexels.com</a>
          </template>
          <ImageUpload
            ref="imageUpload"
            v-model="edit.bannerImage"
            :urls="value.bannerImageUrls"
            class="q-mt-sm"
          />
        </QField>
      </template>

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
  QField,
} from 'quasar'

import activityAPI from '@/activities/api/activities'
import { useActivityHelpers, useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityTypeService } from '@/activities/services'
import { defaultDuration } from '@/activities/settings'
import { formatSeconds } from '@/activities/utils'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import reactiveNow from '@/utils/reactiveNow'
import { objectDiff } from '@/utils/utils'

import ActivityItem from '@/activities/components/ActivityItem'
import ConfirmChangesDialog from '@/activities/components/ConfirmChangesDialog'
import ParticipantTypesEdit from '@/activities/components/ParticipantTypesEdit'
import ImageUpload from '@/utils/components/ImageUpload'
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
    QField,
    ImageUpload,
  },
  mixins: [editMixin, statusMixin],
  props: {
    series: {
      type: Object,
      default: null,
    },
  },
  emits: [
    'cancel',
    'save',
  ],
  setup () {
    const { roleOptions } = useActivityHelpers()
    const { getActivityTypeById } = useActivityTypeService()
    const { getIconProps } = useActivityTypeHelpers()
    return {
      roleOptions,
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
    debug () {
      return require('util').inspect({
        bannerImage: this.edit.bannerImage,
      })
    },
    previewActivity () {
      return {
        ...this.edit,
        participants: [],
      }
    },
    activityType () {
      return this.value && this.getActivityTypeById(this.value.activityType)
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
  methods: {
    doReset () {
      if (this.$refs.imageUpload) {
        this.$refs.imageUpload.reset()
      }
      this.reset()
    },
    futureDates (dateString) {
      return date.extractDate(`${dateString} 23:59`, 'YYYY/MM/DD HH:mm') > this.now
    },
    toggleDuration () {
      this.hasDuration = !this.hasDuration
    },
    async maybeSave () {
      if (!this.canSave) return
      if (this.isNew) {
        this.save()
      }
      else {
        const { users } = await activityAPI.checkSave({ ...this.getPatchData(), id: this.value.id })
        Dialog.create({
          component: ConfirmChangesDialog,
          componentProps: {
            users,
          },
        })
          .onOk(async ({ updatedMessage }) => {
            if (updatedMessage) {
              await this.save({ updatedMessage })
            }
            else {
              await this.save()
            }
            // reset
            if (this.$refs.imageUpload) {
              this.$refs.imageUpload.reset()
            }
            // remove any undefined props, otherwise our "is changed" logic will include them
            // (edit.bannerImage can be set to undefined when it is not present on the original value)
            for (const key of Object.keys(this.edit)) {
              if (this.edit[key] === undefined) {
                delete this.edit[key]
              }
            }
          })
      }
    },
    // Overrides mixin method
    getPatchData () {
      const diff = objectDiff(this.value, this.edit)
      // Always provide start date if we have modified end date
      if (diff.dateEnd && !diff.date) diff.date = this.edit.date
      // Have to explicitly set this...
      if (this.edit.bannerImage === null) {
        diff.bannerImage = null
      }
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
