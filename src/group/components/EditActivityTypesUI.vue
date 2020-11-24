<template>
  <div>
    <QCard>
      <QTable
        :columns="columns"
        :data="activityTypes"
        hide-pagination
        flat
      >
        <template #body="props">
          <QTr
            :key="props.key"
            :props="props"
          >
            <QTd
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              <QIcon
                v-if="col.name === 'icon'"
                size="md"
                v-bind="props.row.iconProps"
              />
              <QIcon
                v-else-if="col.name === 'feedbackIcon'"
                v-show="props.row.hasFeedback"
                size="md"
                v-bind="props.row.feedbackIconProps"
              />
              <QBtnGroup
                v-else-if="col.name === 'actions'"
                flat
              >
                <QBtn
                  size="sm"
                  flat
                  @click="editActivityTypeId === props.row.id ? stopEdit(props.row.id) : startEdit(props.row.id)"
                >
                  Edit
                </QBtn>
              </QBtnGroup>
              <template v-else-if="col.name === 'hasFeedbackWeight'">
                <span v-show="props.row.hasFeedback">
                  {{ col.value }}
                </span>
              </template>
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
                @save="save"
              />
            </QTd>
          </QTr>
        </template>

        <!--
        <template #body-cell-icon="props">
          <QTd :props="props">
            <QIcon
              size="md"
              v-bind="props.row.iconProps"
            />
          </QTd>
        </template>
        <template #body-cell-feedbackIcon="props">
          <QTd :props="props">
            <QIcon
              size="md"
              v-bind="props.row.feedbackIconProps"
            />
          </QTd>
        </template>
        <template #body-cell-actions="props">
          <QTd :props="props">
            <QBtnGroup flat>
              <QBtn
                flat
                @click="startEdit(props.row.id)"
              >
                Edit
              </QBtn>
            </QBtnGroup>
          </QTd>
        </template>
        -->
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
  QBtnGroup,
  QBtn,
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
    QBtnGroup,
    QBtn,
  },
  props: {
    activityTypes: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      editActivityTypeId: null,
    }
  },
  computed: {
    editActivityType () {
      if (!this.editActivityTypeId) return
      return this.activityTypes.find(item => item.id === this.editActivityTypeId)
    },
    // ...mapGetters({
    //   activityTypes: 'activityTypes/byCurrentGroup',
    // }),
    columns () {
      return [
        {
          name: 'name',
          label: this.$t('name'),
          field: row => row.name,
          align: 'left',
          classes: 'text-weight-bold',
        },
        {
          name: 'status',
          label: this.$t('status'),
          field: row => row.status,
          align: 'left',
        },
        {
          name: 'icon',
          label: this.$t('icon'),
          align: 'left',
        },
        {
          name: 'hasFeedback',
          label: this.$t('hasFeedback'),
          field: row => row.hasFeedback,
          align: 'left',
        },
        {
          name: 'hasFeedbackWeight',
          label: this.$t('hasFeedbackWeight'),
          field: row => row.hasFeedbackWeight,
          align: 'left',
        },
        {
          name: 'feedbackIcon',
          label: this.$t('feedbackIcon'),
          align: 'center',
        },

        {
          name: 'actions',
        },
      ]
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
  },
}
</script>
