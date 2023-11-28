<template>
  <QTable
    :columns="columns"
    :rows="filteredPlaceTypes"
    hide-pagination
    :pagination="{ rowsPerPage: 0 }"
    flat
  >
    <template #top-left>
      <QToggle
        v-model="showArchived"
        :label="$t('PLACE_TYPES.SHOW_ARCHIVED')"
      />
    </template>
    <template #top-right>
      <QBtn
        round
        color="green"
        icon="fas fa-plus"
        :title="$t('PLACE_TYPES.ADD')"
        @click="createNewPlaceType()"
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
            color="positive"
            v-bind="getIconProps(props.row)"
          />
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
        v-if="props.row.id === editPlaceTypeId"
        :key="`${props.key}-expand`"
        :props="props"
      >
        <QTd
          colspan="100%"
          style="padding: 0;"
        >
          <!-- TODO: maybe need to reset save status as we reuse this for different types? -->
          <PlaceTypeForm
            :value="editPlaceType"
            :place-types="placeTypes"
            :status="saveStatus"
            @save="saveDialog"
            @cancel="cancelPlaceType"
          />
        </QTd>
      </QTr>
    </template>
  </QTable>
  <PlaceTypeForm
    v-if="newPlaceType"
    :value="newPlaceType"
    :place-types="placeTypes"
    :status="createStatus"
    :class="$q.platform.is.mobile ? '' : 'q-ma-md'"
    @save="saveNewPlaceType"
    @cancel="cancelNewPlaceType"
  />
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

import { useCurrentGroupService } from '@/group/services'
import { usePlaceTypeHelpers } from '@/places/helpers'
import { useCreatePlaceTypeMutation, useSavePlaceTypeMutation } from '@/places/mutations'

import PlaceTypeForm from '@/group/components/PlaceTypeForm.vue'

export default {
  components: {
    PlaceTypeForm,
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
    placeTypes: {
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
    } = useCreatePlaceTypeMutation({ groupId })

    const {
      mutateAsync: save,
      status: saveStatus,
      reset: resetSave,
    } = useSavePlaceTypeMutation()

    const {
      getTranslatedName,
      getIconProps,
    } = usePlaceTypeHelpers()

    return {
      create,
      createStatus,
      resetCreate,

      save,
      saveStatus,
      resetSave,

      getTranslatedName,
      getIconProps,
    }
  },
  data () {
    return {
      showArchived: false,
      editPlaceTypeId: null,
      newPlaceType: null,
    }
  },
  computed: {
    editPlaceType () {
      if (!this.editPlaceTypeId) return
      return this.placeTypes.find(item => item.id === this.editPlaceTypeId)
    },
    filteredPlaceTypes () {
      if (this.showArchived) return this.placeTypes
      return this.placeTypes.filter(placeType => !placeType.isArchived)
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
          label: this.$t('PLACE_TYPES.NAME'),
          field: row => this.getTranslatedName(row),
          align: 'left',
          classes: 'text-weight-bold',
        },
        this.showArchived && { // don't need to see status unless we're viewing all ...
          name: 'status',
          label: this.$t('PLACE_TYPES.STATUS'),
          field: row => row.isArchived ? 'archived' : 'active',
          align: 'left',
          autoWidth: true,
        },
      ].filter(Boolean).filter(col => !(this.$q.platform.is.mobile && col.hideOnMobile))
    },
  },
  methods: {
    toggleEdit (placeType) {
      if (this.editPlaceTypeId === placeType.id) {
        this.editPlaceTypeId = null
      }
      else {
        this.editPlaceTypeId = placeType.id
      }
    },
    saveDialog (placeType) {
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
            await this.save({ updatedMessage, ...placeType })
          }
          else {
            await this.save(placeType)
          }
          this.editPlaceTypeId = null // hide the edit form
        })
    },
    colourForStatus (status) {
      return {
        active: 'green',
        archived: 'grey',
      }[status] || 'primary'
    },
    createNewPlaceType () {
      this.newPlaceType = {
        name: '',
        nameIsTranslatable: true,
        icon: 'fas fa-circle',
      }
    },
    async saveNewPlaceType (placeType) {
      await this.create(placeType)
      this.newPlaceType = null // hide the new form
    },
    cancelNewPlaceType () {
      this.newPlaceType = null
      this.resetCreate()
    },
    cancelPlaceType () {
      this.editPlaceTypeId = null
      this.resetSave()
    },
  },
}
</script>
