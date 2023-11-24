<template>
  <div>
    <component :is="$q.platform.is.mobile ? 'div' : 'QCard'">
      <QTable
        :columns="columns"
        :rows="filteredActivityTypes"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
        flat
      >
        <template #top-left>
          <QToggle
            v-model="showArchived"
            :label="$t('ACTIVITY_TYPES.SHOW_ARCHIVED')"
          />
        </template>
        <template #top-right>
          <QBtn
            round
            color="green"
            icon="fas fa-plus"
            :title="$t('ACTIVITY_TYPES.ADD')"
            @click="createNewActivityType()"
          />
        </template>
        <template #body="props">
          <QTr
            :key="props.key"
            :props="props"
            class="cursor-pointer"
            @click="toggleEdit(props.row)"
          >
            <QTd
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              :auto-width="col.autoWidth"
            >
              <QIcon
                v-if="col.name === 'icon'"
                size="md"
                v-bind="getIconProps(props.row)"
              />
              <QIcon
                v-else-if="col.name === 'feedback'"
                v-show="props.row.hasFeedback"
                size="md"
                v-bind="getFeedbackIconProps(props.row)"
              />
              <template v-else-if="col.name === 'feedbackWeight'">
                <span v-show="props.row.hasFeedback && props.row.hasFeedbackWeight">
                  <QIcon
                    size="xs"
                    name="fas fa-check"
                  />
                </span>
              </template>
              <QBadge
                v-else-if="col.name === 'status'"
                :color="colourForStatus(col.value)"
              >
                {{ col.value }}
              </QBadge>
              <template v-else>
                {{ col.value }}
              </template>
            </QTd>
          </QTr>
          <QTr
            v-if="props.row.id === editActivityTypeId"
            :key="`${props.key}-expand`"
            :props="props"
          >
            <QTd
              colspan="100%"
              style="padding: 0;"
            >
              <!-- TODO: maybe need to reset save status as we reuse this for different types? -->
              <ActivityTypeForm
                :value="editActivityType"
                :activity-types="activityTypes"
                :status="saveStatus"
                @save="saveDialog"
                @cancel="cancelActivityType"
              />
            </QTd>
          </QTr>
        </template>
      </QTable>
      <ActivityTypeForm
        v-if="newActivityType"
        :value="newActivityType"
        :activity-types="activityTypes"
        :status="createStatus"
        :class="$q.platform.is.mobile ? '' : 'q-ma-md'"
        @save="saveNewActivityType"
        @cancel="cancelNewActivityType"
      />
    </component>
  </div>
</template>

<script>
import {
  QBtn,
  QCard,
  QTable,
  QTr,
  QTd,
  QIcon,
  QToggle,
  QBadge,
  Dialog,
} from 'quasar'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { useCreateActivityTypeMutation, useSaveActivityTypeMutation } from '@/activities/mutations'
import { useCurrentGroupService } from '@/group/services'

import ActivityTypeForm from '@/group/components/ActivityTypeForm.vue'

export default {
  components: {
    ActivityTypeForm,
    QBtn,
    QCard,
    QTr,
    QTable,
    QTd,
    QIcon,
    QToggle,
    QBadge,
  },
  props: {
    activityTypes: {
      type: Array,
      required: true,
    },
  },
  setup () {
    const { groupId } = useCurrentGroupService()

    const {
      mutateAsync: create,
      status: createStatus,
      reset: resetCreate,
    } = useCreateActivityTypeMutation({ groupId })

    const {
      mutateAsync: save,
      status: saveStatus,
      reset: resetSave,
    } = useSaveActivityTypeMutation()

    const {
      getTranslatedName,
      getIconProps,
      getFeedbackIconProps,
    } = useActivityTypeHelpers()

    return {
      create,
      createStatus,
      resetCreate,

      save,
      saveStatus,
      resetSave,

      getTranslatedName,
      getIconProps,
      getFeedbackIconProps,
    }
  },
  data () {
    return {
      showArchived: false,
      editActivityTypeId: null,
      newActivityType: null,
    }
  },
  computed: {
    editActivityType () {
      if (!this.editActivityTypeId) return
      return this.activityTypes.find(item => item.id === this.editActivityTypeId)
    },
    filteredActivityTypes () {
      if (this.showArchived) return this.activityTypes
      return this.activityTypes.filter(activityType => !activityType.isArchived)
    },
    columns () {
      return [
        {
          name: 'icon',
          align: 'center',
          autoWidth: true,
        },
        {
          name: 'name',
          label: this.$t('ACTIVITY_TYPES.NAME'),
          field: row => this.getTranslatedName(row),
          align: 'left',
          classes: 'text-weight-bold',
        },
        {
          name: 'feedback',
          label: this.$t('ACTIVITY_TYPES.FEEDBACK'),
          align: 'center',
          autoWidth: true,
        },
        {
          name: 'feedbackWeight',
          label: this.$t('ACTIVITY_TYPES.FEEDBACK_WEIGHT'),
          field: row => row.hasFeedbackWeight,
          align: 'center',
          autoWidth: true,
          hideOnMobile: true,
        },
        this.showArchived && { // don't need to see status unless we're viewing all ...
          name: 'status',
          label: this.$t('ACTIVITY_TYPES.STATUS'),
          field: row => row.isArchived ? 'archived' : 'active',
          align: 'left',
          autoWidth: true,
        },
      ].filter(Boolean).filter(col => !(this.$q.platform.is.mobile && col.hideOnMobile))
    },
  },
  methods: {
    toggleEdit (activityType) {
      if (this.editActivityTypeId === activityType.id) {
        this.editActivityTypeId = null
      }
      else {
        this.editActivityTypeId = activityType.id
      }
    },
    saveDialog (activityType) {
      Dialog.create({
        title: this.$t('HISTORY.CONFIRM_CHANGES'),
        message: this.$t('HISTORY.CONFIRM_CHANGES_HINT'),
        prompt: {
          model: '',
          type: 'text',
        },
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.SAVE_CHANGES'),
      })
        .onOk(async updatedMessage => {
          if (updatedMessage) {
            await this.save({ updatedMessage, ...activityType })
          }
          else {
            await this.save(activityType)
          }
          this.editActivityTypeId = null // hide the edit form
        })
    },
    colourForStatus (status) {
      return {
        active: 'green',
        archived: 'grey',
      }[status] || 'primary'
    },
    createNewActivityType () {
      this.newActivityType = {
        name: '',
        nameIsTranslatable: true,
        colour: '455a64', // blue-grey / 8
        status: 'active',
        icon: 'fas fa-asterisk',
        feedbackIcon: 'fas fa-reply',
        hasFeedback: false,
        hasFeedbackWeight: false,
      }
    },
    async saveNewActivityType (activityType) {
      await this.create(activityType)
      this.newActivityType = null // hide the new form
    },
    cancelNewActivityType () {
      this.newActivityType = null
      this.resetCreate()
    },
    cancelActivityType () {
      this.editActivityTypeId = null
      this.resetSave()
    },
  },
}
</script>
