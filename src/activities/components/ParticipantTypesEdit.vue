<template>
  <div>
    <QToggle
      v-model="advancedMode"
      label="Advanced participant types"
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
            icon="info"
            maxlength="500"
            input-style="min-height: auto;"
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
            input-style="max-width: 100px"
          >
            <template #before>
              <QIcon name="group" />
            </template>
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
            <template #after>
              <QIcon
                v-if="series ? series.maxParticipants !== edit.maxParticipants : false"
                name="undo"
                @click="edit.maxParticipants = series.maxParticipants"
              />
            </template>
            -->
          </QInput>
          <div
            v-if="seriesMeta.isMaxParticipantsChanged"
            class="q-ml-lg col-12 q-field__bottom text-warning"
          >
            <QIcon name="warning" />
            {{ $t('CREATEACTIVITY.DIFFERS_WARNING') }}
          </div>
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
            <template #before>
              <QIcon name="fas fa-key" />
            </template>
            <template #option="{ itemProps, itemEvents, opt: { label, description } }">
              <QItem
                v-bind="itemProps"
                v-on="itemEvents"
              >
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

import MarkdownInput from '@/utils/components/MarkdownInput'
import statusMixin from '@/utils/mixins/statusMixin'

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
    roles: {
      type: Array,
      required: true,
    },
  },
  emits: [
    'input',
    'maybe-save',
  ],
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
            title: 'Are you sure?',
            message: 'Your customizations will be lost',
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
        {
          label: 'Approved',
          value: 'approved',
          description: 'People that have been trusted with approved role',
        },
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
      this.participantTypes = [
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
      // TODO: not sure if this is needed, but I think so as we re-assign the value (or could just modify array...)
      this.$emit('input', this.participantTypes)
    },
  },
}
</script>
