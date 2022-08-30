<template>
  <div>
    <QToggle
      v-if="isUsingParticipantTypesFeature"
      v-model="advancedMode"
      label="Use advanced mode"
      class="q-mt-xs"
    />

    <template v-if="simpleParticipantType">
      <QInput
        v-model.number="simpleParticipantType.maxParticipants"
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
      >
        <template #before>
          <QIcon name="group" />
        </template>
        <QSlider
          v-if="simpleParticipantType.maxParticipants > 0 && simpleParticipantType.maxParticipants <= 10"
          v-model="simpleParticipantType.maxParticipants"
          :min="1"
          :max="10"
          label
          markers
          class="q-mx-sm self-end"
          style="min-width: 60px"
        />
        <template #after>
          <QIcon
            v-if="series ? series.maxParticipants !== simpleParticipantType.maxParticipants : false"
            name="undo"
            @click="simpleParticipantType.maxParticipants = series.maxParticipants"
          />
        </template>
      </QInput>
    </template>
    <template v-else>
      <QCard
        v-for="(participantType, idx) in visibleParticipantTypes"
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
            @keyup.ctrl.enter="$emit('maybe-save')"
          />
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
          </QSelect>
          <div class="row justify-end">
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
} from 'quasar'
import { computed } from 'vue'

import { useCurrentGroupService } from '@/group/services'
import statusMixin from '@/utils/mixins/statusMixin'

import MarkdownInput from '@/utils/components/MarkdownInput'

export default {
  components: {
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
    seriesMeta: {
      required: false,
      type: Object,
      default: () => ({}),
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
    const isUsingParticipantTypesFeature = computed(() => features.value.includes('participant-types'))
    return {
      isUsingParticipantTypesFeature,
      roles,
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
    simpleParticipantType () {
      if (!this.advancedModeValue && this.visibleParticipantTypes.length === 1) {
        return this.visibleParticipantTypes[0]
      }
      return null
    },
    visibleParticipantTypes () {
      return this.participantTypes.filter(entry => !entry._removed)
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
          .filter(participantType => participantType.id)
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
