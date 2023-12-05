<template>
  <div v-if="v$.edit">
    <QCard
      class="no-shadow grey-border"
      style="max-width: 700px"
    >
      <div
        class="edit-box"
        :class="{ changed: hasChanged }"
      >
        <form @submit.prevent="maybeSave">
          <div
            class="row q-col-gutter-md items-center q-mb-lg "
          >
            <QIcon
              :name="placeTypeIcon ?? 'fas fa-circle'"
              size="lg"
              class="q-pt-none"
              :color="placeStatusColour ?? 'grey-4'"
            />
            <QSelect
              v-model="edit.placeType"
              :options="placeTypeOptions.filter(({ isArchived, value }) => !isArchived || edit.placeType === value)"
              map-options
              emit-value
              :label="$t('STOREEDIT.PLACE_TYPE')"
              :error="hasPlaceTypeError"
              :error-message="placeTypeError"
              outlined
              class="col"
              @blur="v$.edit.placeType.$touch"
            >
              <template #option="scope">
                <QItem
                  :key="scope.index"
                  v-bind="scope.itemProps"
                >
                  <QItemSection side>
                    <QIcon
                      :name="scope.opt.icon"
                      size="1.1em"
                      :color="placeStatusColour"
                    />
                  </QItemSection>
                  <QItemSection>
                    <QItemLabel>{{ scope.opt.label }}</QItemLabel>
                    <QItemLabel
                      v-if="scope.opt.caption"
                      caption
                    >
                      {{ scope.opt.caption }}
                    </QItemLabel>
                  </QItemSection>
                </QItem>
              </template>
              <template #selected-item="scope">
                <div class="ellipsis">
                  {{ scope.opt.label }}
                </div>
              </template>
              <template #after-options>
                <QItem
                  clickable
                  @click="createNewPlaceType"
                >
                  <QItemSection side>
                    <QIcon
                      name="fa fa-plus"
                      color="positive"
                      size="1.1em"
                    />
                  </QItemSection>
                  <QItemSection>
                    <QItemLabel class="text-italic">
                      Add new type
                    </QItemLabel>
                  </QItemSection>
                </QItem>
              </template>
            </QSelect>

            <QSelect
              v-model="edit.status"
              :options="placeStatusOptions"
              map-options
              emit-value
              :label="$t('STOREEDIT.STATUS')"
              :error="hasError('status')"
              :error-message="firstError('status')"
              outlined
              class="col"
            >
              <template #option="scope">
                <QItem
                  :key="scope.index"
                  dense
                  v-bind="scope.itemProps"
                >
                  <QItemSection side>
                    <QIcon
                      :name="placeTypeIcon"
                      :color="scope.opt.color"
                      size="1.1em"
                    />
                  </QItemSection>
                  <QItemSection>
                    <QItemLabel>{{ scope.opt.label }}</QItemLabel>
                    <QItemLabel
                      v-if="scope.opt.caption"
                      caption
                      class="ellipsis"
                      style="max-width: 200px;"
                      :title="scope.opt.caption"
                    >
                      {{ scope.opt.caption }}
                    </QItemLabel>
                  </QItemSection>
                </QItem>
              </template>
              <template #selected-item="scope">
                <div class="ellipsis">
                  {{ scope.opt.label }}
                </div>
              </template>
              <template #after-options>
                <QItem
                  clickable
                  @click="createNewPlaceStatus"
                >
                  <QItemSection side>
                    <QIcon
                      name="fa fa-plus"
                      color="positive"
                      size="1.1em"
                    />
                  </QItemSection>
                  <QItemSection>
                    <QItemLabel class="text-italic">
                      Add new status
                    </QItemLabel>
                  </QItemSection>
                </QItem>
              </template>
            </QSelect>
          </div>

          <QInput
            v-model="edit.name"
            :autofocus="!$q.platform.has.touch"
            :error="hasNameError"
            :error-message="nameError"
            :label="$t('STOREEDIT.NAME')"
            autocomplete="off"
            outlined
            class="q-mb-lg"
            @blur="v$.edit.name.$touch"
          />

          <MarkdownInput
            v-model="edit.description"
            :label="$t('STOREEDIT.DESCRIPTION')"
            :error="hasError('description')"
            :error-message="firstError('description')"
            outlined
            mentions
            class="q-mb-lg"
            @keyup.ctrl.enter="maybeSave"
          />

          <QSelect
            v-model="edit.defaultView"
            :options="[
              {label: $t('GROUP.ACTIVITIES'), value: 'activities'},
              {label: $t('GROUP.WALL'), value: 'wall'}
            ]"
            map-options
            emit-value
            :label="$t('STOREEDIT.DEFAULT_VIEW')"
            outlined
            :hint="$t('STOREEDIT.DEFAULT_VIEW_HINT')"
            class="q-mb-lg"
          />

          <AddressPicker
            v-model="edit"
            :color="placeStatusColour"
            :font-icon="placeTypeIcon"
            :label="$t('STOREEDIT.ADDRESS')"
            :error="hasAddressError"
            :error-message="addressError"
            :default-map-center="defaultMapCenter"
            outlined
            class="q-mb-lg"
          />

          <div>
            <QField
              borderless
              :hint="$t('STOREEDIT.WEEKS_IN_ADVANCE')"
              stack-label
              hide-bottom-space
              :error="hasError('weeksInAdvance')"
              :error-message="firstError('weeksInAdvance')"
            >
              <template #control>
                <QSlider
                  v-model="edit.weeksInAdvance"
                  :min="1"
                  :max="10"
                  label
                  label-always
                  markers
                  class="q-mt-lg q-mx-md"
                />
              </template>
            </QField>
            <div
              v-if="!isNew && value.weeksInAdvance > edit.weeksInAdvance"
              class="q-ml-lg col-12 q-field__bottom text-warning"
            >
              <QIcon
                name="warning"
                class="vertical-center"
              />
              {{ $t('STOREEDIT.WEEKS_IN_ADVANCE_WARNING') }}
            </div>
          </div>

          <div
            v-if="hasNonFieldError || hasError('group')"
            class="text-negative"
          >
            {{ firstNonFieldError || firstError('group') }}
          </div>

          <div class="row justify-end q-gutter-sm q-mt-md">
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
              @click="reset"
            >
              {{ $t('BUTTON.RESET') }}
            </QBtn>
            <QBtn
              v-if="!isNew"
              type="button"
              color="red"
              @click="archive"
            >
              {{ $t('BUTTON.ARCHIVE') }}
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
        </form>
      </div>
    </QCard>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'
import { generateKeyBetween } from 'fractional-indexing'
import {
  QCard,
  QField,
  QSlider,
  QInput,
  QBtn,
  QSelect,
  QIcon,
  QItem,
  QItemSection,
  QItemLabel,
  Dialog,
} from 'quasar'
import { computed } from 'vue'

import { useCurrentGroupService } from '@/group/services'
import { usePlaceStatuses, usePlaceStatusHelpers, usePlaceTypeHelpers } from '@/places/helpers'
import { optionsFor } from '@/places/placeStatus'
import { usePlaceStatusService, usePlaceTypeService } from '@/places/services'
import { openEditDialog } from '@/utils/forms'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'

import PlaceStatusForm from '@/group/components/PlaceStatusForm.vue'
import PlaceTypeForm from '@/group/components/PlaceTypeForm.vue'
import AddressPicker from '@/maps/components/AddressPicker.vue'
import MarkdownInput from '@/utils/components/MarkdownInput.vue'

export default {
  name: 'PlaceEdit',
  components: {
    QCard,
    QField,
    QSlider,
    QInput,
    QBtn,
    QSelect,
    QIcon,
    QItem,
    QItemSection,
    QItemLabel,
    MarkdownInput,
    AddressPicker,
  },
  mixins: [editMixin, statusMixin],
  props: {
    value: {
      required: false,
      type: Object,
      default: () => ({
        name: undefined,
        description: undefined,
        weeksInAdvance: 4,
        latitude: undefined,
        longitude: undefined,
        address: undefined,
        status: undefined,
        defaultView: 'activities',
      }),
    },
    currentGroup: {
      required: false,
      type: Object,
      default: () => ({}),
    },
    allPlaces: { required: true, type: Array },
  },
  emits: [
    'cancel',
    'save',
  ],
  setup () {
    const { groupId } = useCurrentGroupService()

    const { getPlaceTypesByGroup, getPlaceTypeById } = usePlaceTypeService()
    const { getPlaceStatusById } = usePlaceStatusService()

    const placeTypeHelpers = usePlaceTypeHelpers()
    const placeStatusHelpers = usePlaceStatusHelpers()

    const placeTypes = computed(() => getPlaceTypesByGroup(groupId).sort(placeTypeHelpers.sortByTranslatedName))

    const placeTypeOptions = computed(() => placeTypes.value.map(placeType => ({
      value: placeType.id,
      label: placeTypeHelpers.getTranslatedName(placeType),
      caption: placeType.description,
      icon: placeType.icon,
      isArchived: placeType.isArchived,
    })))

    const placeStatuses = usePlaceStatuses(groupId)

    const placeStatusOptions = computed(() => placeStatuses.value.filter(placeStatus => !placeStatus.isArchived).map(placeStatus => ({
      value: placeStatus.id,
      label: placeStatusHelpers.getTranslatedName(placeStatus),
      caption: placeStatus.description,
      color: placeStatusHelpers.getColorName(placeStatus),
      icon: 'fas fa-circle',
    })))

    function generateNextOrder () {
      return generateKeyBetween(placeStatuses.value[placeStatuses.value.length - 1]?.order || null, null)
    }

    function createNewPlaceType () {
      openEditDialog(PlaceTypeForm, {
        placeType: {
          name: undefined,
          icon: 'fas fa-map-marker',
          description: undefined,
          isVisible: true,
        },
      })
    }

    function createNewPlaceStatus () {
      openEditDialog(PlaceStatusForm, {
        placeStatus: {
          name: undefined,
          colour: undefined,
          description: undefined,
          order: generateNextOrder(),
          isVisible: true,
        },
      })
    }

    return {
      v$: useVuelidate(),
      placeTypeOptions,
      getPlaceTypeById,
      placeStatusOptions,
      getPlaceStatusById,
      getPlaceStatusColorName: placeStatusHelpers.getColorName,
      createNewPlaceType,
      createNewPlaceStatus,
    }
  },
  computed: {
    canSave () {
      if (this.v$.edit.$error) {
        return false
      }
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    hasNameError () {
      return !!this.nameError
    },
    nameError () {
      if (this.v$.edit.name.$error) {
        const m = this.v$.edit.name
        if (m.required.$invalid) return this.$t('VALIDATION.REQUIRED')
        if (m.minLength.$invalid) return this.$t('VALIDATION.MINLENGTH', { min: 2 })
        if (m.maxLength.$invalid) return this.$t('VALIDATION.MAXLENGTH', { max: 81 })
        if (m.isUnique.$invalid) return this.$t('VALIDATION.UNIQUE')
      }
      return this.firstError('name')
    },
    hasPlaceTypeError () {
      return !!this.placeTypeError
    },
    placeTypeError () {
      if (this.v$.edit.placeType.$error) {
        if (this.v$.edit.placeType.required.$invalid) return this.$t('VALIDATION.REQUIRED')
      }
      return this.firstError('placeType')
    },
    hasAddressError () {
      return !!this.addressError
    },
    addressError () {
      for (const field of ['address', 'latitude', 'longitude']) {
        if (this.hasError(field)) return this.firstError(field)
      }
      return null
    },
    placeTypeIcon () {
      return this.edit.placeType ? this.getPlaceTypeById(this.edit.placeType)?.icon : 'fas fa-circle'
    },
    placeStatusColour () {
      return this.edit.status ? this.getPlaceStatusColorName(this.getPlaceStatusById(this.edit.status)) : 'grey'
    },
    markerColor () {
      if (this.edit) return optionsFor(this.edit).color
      return null
    },
    defaultMapCenter () {
      const { latitude: lat, longitude: lng } = this.edit.group || this.currentGroup || {}
      if (lat && lng) return { lat, lng }
      return null
    },
  },
  watch: {
    '$route.query' (val) {
      if (val) this.setLocation(val)
    },
  },
  mounted () {
    if (this.$route && this.$route.query) this.setLocation(this.$route.query)
  },
  methods: {
    setLocation ({ lat, lng }) {
      if (this.isNew) {
        if (!isNaN(lat) && !isNaN(lng)) {
          this.edit.latitude = lat
          this.edit.longitude = lng
        }
        else {
          this.edit.latitude = undefined
          this.edit.longitude = undefined
        }
      }
    },
    maybeSave () {
      this.v$.edit.$touch()
      if (!this.canSave) return
      this.v$.edit.$reset()
      this.save()
    },
    archive () {
      Dialog.create({
        title: this.$t('STOREEDIT.DIALOGS.ARCHIVE.TITLE'),
        message: this.$t('STOREEDIT.DIALOGS.ARCHIVE.MESSAGE'),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('STOREEDIT.DIALOGS.ARCHIVE.CONFIRM'),
      })
        .onOk(() => this.$emit('save', { id: this.value.id, isArchived: true }))
    },
  },
  validations: {
    edit: {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(80),
        isUnique (value) {
          if (value === '') return true
          return !this.allPlaces
            .filter(e => e.id !== this.edit.id)
            .find(e => e.name === value)
        },
      },
      placeType: {
        required,
      },
    },
  },
}
</script>

<style scoped lang="sass">
@import 'editbox'
</style>
