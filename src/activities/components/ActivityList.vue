<template>
  <div>
    <div
      v-if="filter && activities.length > 0"
      class="row no-wrap items-center justify-between bg-white q-px-sm q-py-xs q-gutter-sm"
    >
      <QSelect
        v-model="type"
        :options="typeOptions"
        emit-value
        map-options
        outlined
        hide-bottom-space
        dense
      >
        <template #option="{ index, opt, itemProps }">
          <QItem
            :key="index"
            v-bind="itemProps"
          >
            <QItemSection avatar>
              <QIcon
                v-if="opt.activityType"
                :name="opt.activityType.icon"
                :color="opt.activityType.colorName"
                :title="opt.activityType.translatedName"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel>
                {{ opt.label }}
              </QItemLabel>
            </QItemSection>
          </QItem>
        </template>
      </QSelect>
      <QSelect
        v-model="slots"
        :options="slotsOptions"
        emit-value
        map-options
        outlined
        hide-bottom-space
        dense
      />
      <div class="text-caption q-ml-xs col text-right">
        {{ filteredActivities.length }} / {{ activities.length }}
      </div>
    </div>
    <div
      v-if="displayedActivitiesGroupedByDate.length"
      class="row no-wrap items-center justify-end q-px-sm q-mt-sm"
    >
      <QBtn
        v-if="icsUrl"
        color="secondary"
        icon="event"
        padding="4px 13px"
        rounded
        size="sm"
        unelevated
        :label="$t('ACTIVITYLIST.ICS_DIALOG.TITLE')"
        @click="icsDialog = true"
      />
      <CustomDialog
        v-model="icsDialog"
        width="500px"
        actions-align="between"
        @show="$store.dispatch('activities/fetchICSAuthToken')"
      >
        <template #title>
          {{ $t('ACTIVITYLIST.ICS_DIALOG.TITLE') }}
        </template>
        <template #message>
          <p>
            {{ $t('ACTIVITYLIST.ICS_DIALOG.INTRO') }}
          </p>

          <QList>
            <QItem class="q-pl-none">
              <QItemSection
                avatar
                top
              >
                <QAvatar
                  color="primary"
                  text-color="white"
                  icon="file_download"
                />
              </QItemSection>

              <QItemSection>
                <QItemLabel>{{ $t('ACTIVITYLIST.ICS_DIALOG.DOWNLOAD_TITLE') }}</QItemLabel>
                <QItemLabel caption>
                  {{ $t('ACTIVITYLIST.ICS_DIALOG.DOWNLOAD_TEXT') }}
                </QItemLabel>
                <QItemLabel>
                  <QBtn
                    color="primary"
                    class="q-mt-xs"
                    type="a"
                    :href="icsUrl"
                    :label="$t('ACTIVITYLIST.ICS_DIALOG.DOWNLOAD_BUTTON_LABEL')"
                  />
                </QItemLabel>
              </QItemSection>
            </QItem>

            <QSeparator
              spaced
              style="margin-left: 56px;"
            />

            <QItem class="q-pl-none">
              <QItemSection
                avatar
                top
              >
                <QAvatar
                  color="primary"
                  text-color="white"
                  icon="sync"
                />
              </QItemSection>

              <QItemSection>
                <QItemLabel>{{ $t('ACTIVITYLIST.ICS_DIALOG.SUBSCRIBE_TITLE') }}</QItemLabel>
                <QItemLabel caption>
                  {{ $t('ACTIVITYLIST.ICS_DIALOG.SUBSCRIBE_TEXT') }}
                </QItemLabel>
                <QItemLabel>
                  <QField
                    filled
                    class="q-mt-xs"
                  >
                    <template #append>
                      <QBtn
                        flat
                        rounded
                        icon="fas fa-copy"
                        @click="copyLink"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                        >
                          {{ $t('URL_CLICK_TO_COPY') }}
                        </q-tooltip>
                      </QBtn>
                    </template>
                    <template #control>
                      <!-- https://css-tricks.com/snippets/css/prevent-long-urls-from-breaking-out-of-container/ -->
                      <div
                        class="self-center full-width no-outline"
                        style="word-break: break-word; overflow-wrap: break-word;"
                      >
                        {{ icsUrl }}
                      </div>
                    </template>
                  </QField>
                </QItemLabel>
                <QItemLabel caption>
                  {{ $t('ACTIVITYLIST.ICS_DIALOG.TOKEN_NOTICE') }}
                </QItemLabel>
                <QItemLabel>
                  <QBtn
                    icon="sync"
                    size="sm"
                    class="q-mt-sm"
                    :label="$t('ACTIVITYLIST.ICS_DIALOG.RESET_TOKEN')"
                    @click="$store.dispatch('activities/refreshICSAuthToken')"
                  />
                </QItemLabel>
              </QItemSection>
            </QItem>
          </QList>

          <QInnerLoading :showing="tokenPending" />
        </template>
        <template #actions>
          <a
            rel="noopener noreferrer"
            href="https://fileinfo.com/extension/ics"
            target="_blank"
            class="text-secondary q-pl-sm"
          >
            <QIcon
              name="link"
              size="xs"
              class="q-mr-xs"
            />
            {{ $t('ACTIVITYLIST.ICS_DIALOG.MORE_INFOS') }}
          </a>
          <QBtn
            v-close-popup
            flat
            color="primary"
            autofocus
            :label="$t('BUTTON.CLOSE')"
          />
        </template>
      </CustomDialog>
    </div>
    <KSpinner v-show="pending" />
    <div
      v-if="!pending && noActivitiesDueToFilters"
      class="q-pa-md"
    >
      <QBanner
        class="bg-white"
        inline-actions
      >
        <template #avatar>
          <QIcon
            name="fas fa-info-circle"
            color="grey"
          />
        </template>
        <h5 class="q-ma-xs">
          {{ $t('ACTIVITYLIST.NONE_DUE_TO_FILTER') }}
        </h5>
        <template #action>
          <QBtn
            flat
            @click="clearFilters()"
          >
            {{ $t('GLOBAL.CLEAR_FILTERS') }}
          </QBtn>
        </template>
      </QBanner>
    </div>
    <template
      v-for="(day, index) in displayedActivitiesGroupedByDate"
    >
      <div
        v-if="!dense"
        :key="`day-${index}`"
        class="q-px-sm q-pt-lg full-width text-center text-bold"
        style="color: rgba(0, 0, 0, 0.7);"
      >
        {{ day.date }}
      </div>
      <ActivityItem
        v-for="activity in day.activities"
        :key="activity.id"
        v-measure
        :dense="dense"
        :activity="activity"
        :place-link="placeLink"
        @join="(...args) => $emit('join', ...args)"
        @leave="(...args) => $emit('leave', ...args)"
        @detail="(...args) => $emit('detail', ...args)"
      />
    </template>
  </div>
</template>

<script>
import ActivityItem from './ActivityItem'
import KSpinner from '@/utils/components/KSpinner'
import CustomDialog from '@/utils/components/CustomDialog'
import bindRoute from '@/utils/mixins/bindRoute'

import {
  copyToClipboard,
  QAvatar,
  QField,
  QSelect,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
  QList,
  QBanner,
  QBtn,
  QSeparator,
  QInnerLoading,
} from 'quasar'

export default {
  components: {
    CustomDialog,
    QAvatar,
    ActivityItem,
    KSpinner,
    QField,
    QSelect,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon,
    QList,
    QBanner,
    QBtn,
    QSeparator,
    QInnerLoading,
  },
  mixins: [
    bindRoute({
      slots: 'all',
      type: 'all',
    }),
  ],
  props: {
    activities: {
      type: Array,
      required: true,
    },
    placeLink: {
      type: Boolean,
      default: false,
    },
    pending: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    filter: {
      type: Boolean,
      default: false,
    },
    filterActivityTypes: {
      type: Array,
      default: () => [],
    },
    icsUrl: {
      type: String,
      default: null,
    },
    tokenPending: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'join',
    'leave',
    'detail',
  ],
  data () {
    return {
      icsDialog: false,
      types: [],
    }
  },
  computed: {
    activityTypes () {
      const activityTypes = this.filterActivityTypes.slice()
      const archivedTypes = {}

      for (const activityType of activityTypes) {
        if (activityType.status === 'archived') {
          archivedTypes[activityType.id] = false
        }
      }

      for (const activity of this.activities) {
        if (activity.activityType.id in archivedTypes) {
          const id = activity.activityType.id
          archivedTypes[id] = true
        }
      }

      for (const archivedTypeId in archivedTypes) {
        if (archivedTypes[archivedTypeId] === false) {
          // For any archived types with zero activities in view, remove the type from the filter
          for (const [index, activityType] of activityTypes.entries()) {
            if (parseInt(activityType.id) === parseInt(archivedTypeId)) {
              // delete archived type from the filter
              activityTypes.splice(index, 1)
              break
            }
          }
        }
      }

      return activityTypes
    },
    slotsOptions () {
      return [
        {
          label: this.$t('ACTIVITYLIST.FILTER.ALL'),
          value: 'all',
        },
        {
          label: this.$t('ACTIVITYLIST.FILTER.FREE'),
          value: 'free',
        },
        {
          label: this.$t('ACTIVITYLIST.FILTER.EMPTY'),
          value: 'empty',
        },
      ]
    },
    typeOptions () {
      if (!this.filter) return []
      return [
        {
          label: this.$t('ACTIVITYLIST.FILTER.ALL_TYPES'),
          value: 'all',
        },
        ...this.activityTypes.map(activityType => {
          return {
            label: activityType.translatedName,
            value: String(activityType.id),
            activityType,
          }
        }),
      ]
    },
    filteredActivities () {
      if (!this.activities) return []
      return this.activities
        .filter(this.slotFilter)
        .filter(this.typeFilter)
    },
    displayedActivitiesGroupedByDate () {
      const result = []
      let dateIterated = ''
      for (const activity of this.filteredActivities) {
        const dateWithDayName = this.$d(activity.date, 'dateWithDayName')
        if (dateWithDayName !== dateIterated) {
          result.push({ date: dateWithDayName, activities: [] })
        }
        result[result.length - 1].activities.push(activity)
        dateIterated = dateWithDayName
      }
      return result
    },
    noActivitiesDueToFilters () {
      return this.activities.length > 0 && this.filteredActivities.length === 0
    },
  },
  watch: {
    slots (val, old) {
      // keep selection valid, revert to old value or default
      const options = this.slotsOptions.map(o => o.value)
      if (!options.includes(val)) {
        if (options.includes(old)) {
          this.slots = old
        }
        else {
          this.slots = options[0]
        }
      }
    },
  },
  methods: {
    slotFilter (activity) {
      if (this.slots === 'free') return !activity.isFull && !activity.isDisabled
      if (this.slots === 'empty') return activity.isEmpty && !activity.isDisabled
      return true
    },
    typeFilter (activity) {
      if (this.type === 'all') return true
      return activity.activityType && String(activity.activityType.id) === this.type
    },
    clearFilters () {
      this.slots = 'all'
      this.type = 'all'
    },
    copyLink () {
      return copyToClipboard(this.icsUrl).then(() => {
        this.$store.dispatch('toasts/show', {
          message: 'URL_COPIED_TOAST',
        }, { root: true })
      })
    },
  },
}
</script>
