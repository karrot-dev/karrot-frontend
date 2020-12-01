<template>
  <div>
    <QCard>
      <QTable
        :columns="columns"
        :data="filteredActivityTypes"
        hide-pagination
        flat
      >
        <template #top-left>
          <QToggle
            v-model="showArchived"
            label="Show archived"
          />
        </template>
        <template #body="props">
          <QTr
            :key="props.key"
            :props="props"
            class="cursor-pointer"
            @click="editActivityTypeId === props.row.id ? stopEdit(props.row.id) : startEdit(props.row.id)"
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
                v-bind="props.row.iconProps"
              />
              <QIcon
                v-else-if="col.name === 'feedback'"
                v-show="props.row.hasFeedback"
                size="md"
                v-bind="props.row.feedbackIconProps"
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
                :color="colorForStatus(col.value)"
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
            <QTd colspan="100%">
              <ActivityTypeForm
                :value="editActivityType"
                :activity-types="activityTypes"
                @save="save"
              />
            </QTd>
          </QTr>
        </template>
      </QTable>
    </QCard>
  </div>
</template>

<script>
import {
  QCard,
  QTable,
  QTr,
  QTd,
  QIcon,
  QToggle,
  QBadge,
} from 'quasar'
import ActivityTypeForm from '@/group/components/ActivityTypeForm'

export default {
  components: {
    ActivityTypeForm,
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
  data () {
    return {
      showArchived: false,
      editActivityTypeId: null,
    }
  },
  computed: {
    editActivityType () {
      if (!this.editActivityTypeId) return
      return this.activityTypes.find(item => item.id === this.editActivityTypeId)
    },
    filteredActivityTypes () {
      if (this.showArchived) return this.activityTypes
      return this.activityTypes.filter(activityType => activityType.status !== 'archived')
    },
    columns () {
      return [
        this.showArchived && { // don't need to see status unless we're viewing all ...
          name: 'status',
          label: this.$t('status'),
          field: row => row.status,
          align: 'left',
          autoWidth: true,
        },
        {
          name: 'icon',
          align: 'right',
          autoWidth: true,
        },
        {
          name: 'name',
          label: this.$t('name'),
          field: row => row.name,
          align: 'left',
          classes: 'text-weight-bold',
        },
        {
          name: 'feedback',
          label: this.$t('feedback'),
          align: 'left',
          autoWidth: true,
        },
        {
          name: 'feedbackWeight',
          label: this.$t('feedbackWeight'),
          field: row => row.hasFeedbackWeight,
          align: 'left',
          autoWidth: true,
        },
      ].filter(Boolean)
    },
  },
  methods: {
    startEdit (id) {
      this.editActivityTypeId = id
    },
    stopEdit (id) {
      // Maybe check if they have changed anything... or pass it to the form, or something...
      if (id === this.editActivityTypeId) { // we might have switched directly to another one already (if clicking on another edit button)
        this.editActivityTypeId = null
      }
    },
    save (activityType) {
      this.$emit('save', activityType)
    },
    colorForStatus (status) {
      return {
        active: 'green',
        archived: 'grey',
      }[status] || 'primary'
    },
  },
}
</script>
