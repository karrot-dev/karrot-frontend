<template>
  <div>
    <div class="row">
      <QToggle
        v-if="isFeatureEnabled || isUsingAdvanced"
        v-model="advancedMode"
        label="Use participant types"
        class="q-mt-xs"
      />
      <QSpace />
      <QBtn
        v-if="participantTypesChanged"
        label="Revert to series values"
        color="warning"
        flat
        icon="undo"
        @click="revertParticipantTypes"
      />
    </div>

    <template v-if="simple">
      <QInput
        v-model.number="simple.participantType.maxParticipants"
        type="number"
        stack-label
        outlined
        class="q-my-md"
        :label="$t('CREATEACTIVITY.MAX_PARTICIPANTS')"
        :hint="$t('CREATEACTIVITY.MAX_PARTICIPANTS_HELPER')"
        :placeholder="$t('CREATEACTIVITY.UNLIMITED')"
        :error="hasError('maxParticipants')"
        :error-message="firstError('maxParticipants')"
        input-style="max-width: 100px"
        :bg-color="simple.changed.maxParticipants ? 'orange-1' : null"
      >
        <template #before>
          <QIcon name="group" />
        </template>
        <QSlider
          v-if="simple.participantType.maxParticipants > 0 && simple.participantType.maxParticipants <= 10"
          v-model="simple.participantType.maxParticipants"
          :min="1"
          :max="10"
          label
          markers
          class="q-mx-sm self-end"
          style="min-width: 60px"
        />
        <template #after>
          <QBtn
            v-if="simple.changed.maxParticipants"
            icon="undo"
            unelevated
            dense
            @click="simple.participantType.maxParticipants = simple.seriesParticipantType.maxParticipants"
          />
        </template>
      </QInput>
    </template>
    <template v-else>
      <QCard
        v-for="({ participantType, seriesParticipantType, changed, users }, idx) in entries"
        :key="participantType.id || `new-${idx}`"
        flat
        bordered
        class="participant-type"
      >
        <QCardSection>
          <div class="text-h6">
            Participant type {{ idx + 1 }}
          </div>
        </QCardSection>
        <QCardSection>
          <MarkdownInput
            v-model="participantType.description"
            :error="hasError('description')"
            :error-message="firstError('description')"
            :label="$t('CREATEACTIVITY.COMMENT')"
            :hint="$t('CREATEACTIVITY.COMMENT_HELPER')"
            maxlength="500"
            :input-style="{ minHeight: 'auto' }"
            outlined
            :bg-color="changed.description ? 'orange-1' : null"
            @keyup.ctrl.enter="$emit('maybe-save')"
          >
            <template #after>
              <QBtn
                v-if="changed.description"
                icon="undo"
                unelevated
                dense
                @click="participantType.description = seriesParticipantType.description"
              />
            </template>
          </MarkdownInput>
          <QInput
            v-model.number="participantType.maxParticipants"
            type="number"
            stack-label
            outlined
            class="q-my-md"
            :label="$t('CREATEACTIVITY.MAX_PARTICIPANTS')"
            :hint="$t('CREATEACTIVITY.MAX_PARTICIPANTS_HELPER')"
            :placeholder="$t('CREATEACTIVITY.UNLIMITED')"
            :error="hasError('maxParticipants')"
            :error-message="firstError('maxParticipants')"
            :input-style="{ maxWidth: '100px' }"
            :bg-color="changed.maxParticipants ? 'orange-1' : null"
          >
            <QSlider
              v-if="participantType.maxParticipants > 0 && participantType.maxParticipants <= 10"
              v-model="participantType.maxParticipants"
              :min="1"
              :max="10"
              label
              markers
              class="q-mx-sm self-end"
              style="min-width: 60px"
            />
            <template #after>
              <QBtn
                v-if="changed.maxParticipants"
                icon="undo"
                unelevated
                dense
                @click="participantType.maxParticipants = seriesParticipantType.maxParticipants"
              />
            </template>
            <!--
            TODO: how to do this max participants changed in the context of participant types?
            <template #after>
              <QIcon
                v-if="series ? series.maxParticipants !== edit.maxParticipants : false"
                name="undo"
                @click="edit.maxParticipants = series.maxParticipants"
              />
            </template>
            -->
          </QInput>
          <!--
          <div
            v-if="seriesMeta.isMaxParticipantsChanged"
            class="q-ml-lg col-12 q-field__bottom text-warning"
          >
            <QIcon name="warning" />
            {{ $t('CREATEACTIVITY.DIFFERS_WARNING') }}
          </div>
          -->
          <QSelect
            v-model="participantType.role"
            map-options
            emit-value
            label="Open for"
            :options="roleOptions"
            :error="hasError('role')"
            :error-message="firstError('role')"
            outlined
            :behavior="smallScreen ? 'dialog' : 'menu'"
            :bg-color="changed.role ? 'orange-1' : null"
          >
            <template #option="{ itemProps, opt: { label, description } }">
              <QItem v-bind="itemProps">
                <QItemSection>
                  <QItemLabel>
                    {{ label }}
                  </QItemLabel>
                  <QItemLabel caption>
                    {{ description }}
                  </QItemLabel>
                </QItemSection>
              </QItem>
            </template>
            <template #after>
              <QBtn
                v-if="changed.role"
                icon="undo"
                unelevated
                dense
                @click="participantType.role = seriesParticipantType.role"
              />
            </template>
          </QSelect>
          <div class="row">
            <ProfilePicture
              v-for="user in users"
              :key="user.id"
              :user="user"
              :size="32"
            />
            <QSpace />
            <QBtn
              label="Remove participant type"
              :disable="visibleParticipantTypes.length === 1"
              @click="removeSlots(participantType)"
            />
          </div>
        </QCardSection>
      </QCard>
    </template>

    <div
      v-if="advancedMode"
      class="row justify-end"
    >
      <QBtn
        color="positive"
        label="Add participant type"
        @click="addParticipantType()"
      />
    </div>
  </div>
</template>
<script>
import deepEqual from 'deep-equal'
import {
  QCard,
  QCardSection,
  QSlider,
  QInput,
  QBtn,
  QIcon,
  QToggle,
  QSelect,
  Dialog,
  QItem,
  QItemSection,
  QItemLabel,
  QSpace,
} from 'quasar'
import { computed } from 'vue'

import { useCurrentGroupService } from '@/group/services'
import { useUserService } from '@/users/services'
import statusMixin from '@/utils/mixins/statusMixin'
import { withoutKeys } from '@/utils/utils'

import ProfilePicture from '@/users/components/ProfilePicture'
import MarkdownInput from '@/utils/components/MarkdownInput'

export default {
  components: {
    ProfilePicture,
    QSlider,
    QInput,
    QBtn,
    QIcon,
    QToggle,
    QSelect,
    QCard,
    QCardSection,
    MarkdownInput,
    QItem,
    QItemSection,
    QItemLabel,
    QSpace,
  },
  mixins: [statusMixin],
  props: {
    modelValue: {
      required: true,
      type: Array,
    },
    series: {
      type: Object,
      default: null,
    },
    participants: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    'update:modelValue',
    'maybe-save',
  ],
  setup () {
    const {
      features,
      roles,
    } = useCurrentGroupService()
    const { getUserById } = useUserService()
    const isFeatureEnabled = computed(() => features.value.includes('participant-types'))
    return {
      isFeatureEnabled,
      roles,
      getUserById,
    }
  },
  data () {
    return {
      participantTypes: [],
      advancedModeValue: null,
    }
  },
  computed: {
    advancedMode: {
      get () {
        return this.advancedModeValue
      },
      set (val) {
        if (!val && this.isUsingAdvanced) {
          Dialog.create({
            title: 'Remove advanced participant types?',
            cancel: this.$t('BUTTON.CANCEL'),
            ok: this.$t('BUTTON.YES'),
          }).onOk(description => {
            this.resetAdvancedMode()
            this.advancedModeValue = false
          })
          return false
        }
        this.advancedModeValue = val
      },
    },
    isUsingAdvanced () {
      // Anything that is using an "advanced" feature
      return Boolean(
        this.visibleParticipantTypes.length > 1 ||
        this.visibleParticipantTypes[0].description ||
        this.visibleParticipantTypes[0].role !== 'member')
    },
    simple () {
      if (!this.advancedModeValue && this.visibleParticipantTypes.length === 1) {
        return this.entries[0]
      }
      return null
    },
    visibleParticipantTypes () {
      return this.participantTypes.filter(entry => !entry._removed)
    },
    entries () {
      // gives us the activity participant type along with useful extra info
      return this.visibleParticipantTypes.map(participantType => {
        const users = this.usersForType(participantType.id)
        if (this.series) {
          const seriesParticipantType = this.series.participantTypes.find(spt => spt.id === participantType.seriesParticipantType)
          const changed = {}
          if (seriesParticipantType) {
            for (const key of Object.keys(participantType)) {
              if (key === 'id') continue
              if (Object.hasOwn(seriesParticipantType, key) && participantType[key] !== seriesParticipantType[key]) {
                changed[key] = true
              }
            }
          }
          return {
            participantType,
            seriesParticipantType,
            changed,
            users,
          }
        }
        return {
          participantType,
          changed: {},
          users,
        }
      })
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
        /* Not adding this role yet until we have a way to trust for a specific role...
        {
          label: 'Approved',
          value: 'approved',
          description: 'People that have been trusted with approved role',
        },
         */
        {
          label: 'Editor',
          value: 'editor',
          description: 'People that have been trusted in the group as an editor',
        },
      ]
    },
    smallScreen () {
      return this.$q.screen.width < 450 || this.$q.screen.height < 450
    },
    participantTypesChanged () {
      if (!this.series) return false
      const removeKeys = withoutKeys('id', 'seriesParticipantType')
      const a = this.series.participantTypes.map(removeKeys)
      const b = this.participantTypes.map(removeKeys).filter(pt => !pt._removed)
      return !deepEqual(a, b)
    },
  },
  watch: {
    modelValue: {
      handler (val) {
        this.participantTypes = val
      },
      immediate: true,
    },
  },
  created () {
    this.advancedModeValue = this.isUsingAdvanced
  },
  methods: {
    usersForType (id) {
      if (!this.participantTypes) return []
      return this.participants
        .filter(participant => participant.participantType === id)
        .map(participant => this.getUserById(participant.user))
    },
    addParticipantType () {
      this.participantTypes.push({
        role: this.roles[0],
        maxParticipants: 2,
      })
    },
    removeSlots (participantType) {
      if (participantType.id) {
        participantType._removed = true
      }
      else {
        const idx = this.participantTypes.indexOf(participantType)
        this.participantTypes.splice(idx, 1)
      }
    },
    resetAdvancedMode () {
      const updatedParticipantTypes = [
        // A fresh new entry
        {
          role: this.roles[0],
          maxParticipants: 2,
        },
        // Already marked removed
        ...this.participantTypes.filter(participantType => participantType._removed),
        // Ones we need to mark as removed
        ...this.participantTypes
          .filter(participantType => !participantType._removed && participantType.id)
          .map(participantType => ({ ...participantType, _removed: true })),
      ]
      this.$emit('update:modelValue', updatedParticipantTypes)
    },
    // For reverting them to the series values, a bit fiddly!
    revertParticipantTypes () {
      if (!this.series) return
      // Copy values from the series participant types
      const seriesParticipantTypes = this.series.participantTypes.map(seriesParticipantType => {
        const seriesParticipantTypeValues = withoutKeys('id')(seriesParticipantType)
        // We may have an entry we can reuse
        const existingParticipantType = this.participantTypes.find(pt => pt.seriesParticipantType === seriesParticipantType.id)
        if (existingParticipantType) {
          if (existingParticipantType._removed) {
            delete existingParticipantType._removed
          }
          // revert the values
          return Object.assign(
            existingParticipantType,
            seriesParticipantTypeValues,
          )
        }
        return {
          ...seriesParticipantTypeValues,
          seriesParticipantType: seriesParticipantType.id,
        }
      })

      const updatedParticipantTypes = [
        ...seriesParticipantTypes,
        // Keep any here that we still have to remove
        ...this.participantTypes.filter(participantType => participantType._removed),
        // Also, remove any with ids, but no seriesParticipantType...
        ...this.participantTypes
          .filter(participantType => !participantType._removed && participantType.id && !participantType.seriesParticipantType)
          .map(participantType => ({ ...participantType, _removed: true })),
      ]
      this.$emit('update:modelValue', updatedParticipantTypes)
    },
  },
}
</script>

<style scoped lang="sass">
.participant-type
  background-color: rgba(255, 255, 255, 0.4)
</style>
