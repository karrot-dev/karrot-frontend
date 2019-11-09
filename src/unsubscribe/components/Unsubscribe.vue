<template>
  <div
    class="edit-box bg-primary splash-md"
  >
    <div
      v-if="hasInvalidToken"
      class="bg-white shadow-6 q-py-md q-px-sm"
    >
      <h2>
        <QIcon
          name="fas fa-sad-tear"
          class="q-mx-sm"
        />
        {{ $t('GLOBAL.INVALID_LINK') }}
      </h2>
    </div>
    <div
      v-else-if="hasSuccess"
      class="bg-white shadow-6 q-py-md q-px-sm"
    >
      <h2>
        <QIcon
          name="fas fa-smile-beam"
          class="q-mx-sm"
        />
        {{ $t('UNSUBSCRIBE.SUCCESS') }}
      </h2>
    </div>
    <form
      v-else
      @submit.prevent="$emit('save', choice)"
    >
      <div class="bg-white shadow-6 q-py-md q-px-sm">
        <QOptionGroup
          v-model="choice"
          class="q-ma-sm"
          type="radio"
          :options="options"
        />
      </div>
      <div
        v-if="hasError"
        class="bg-white text-warning q-py-md q-px-sm"
      >
        <i class="fas fa-exclamation-triangle" />
        {{ $t('GLOBAL.GENERIC_ERROR') }}
      </div>
      <div class="actions bg-white">
        <QBtn
          type="submit"
          class="submit shadow-4"
          flat
        >
          {{ $t('BUTTON.UNSUBSCRIBE') }}
        </QBtn>
      </div>
    </form>
  </div>
</template>
<script>
import {
  QOptionGroup,
  QIcon,
  QBtn,
} from 'quasar'

export default {
  components: {
    QOptionGroup,
    QIcon,
    QBtn,
  },
  props: {
    tokenData: {
      type: Object,
      default: () => ({}),
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    hasSuccess: {
      type: Boolean,
      default: false,
    },
    hasInvalidToken: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      choice: null,
    }
  },
  computed: {
    options () {
      const options = []
      if (this.tokenData.conversationId) {
        options.push({
          label: this.$t('UNSUBSCRIBE.FROM_CONVERSATION'),
          value: 'conversation',
          color: 'secondary',
        })
      }
      else if (this.tokenData.threadId) {
        options.push({
          label: this.$t('UNSUBSCRIBE.FROM_THREAD'),
          value: 'thread',
          color: 'secondary',
        })
      }
      if (this.tokenData.notificationType) {
        const notificationType = this.$t(`GROUP.NOTIFICATION_TYPES.${this.tokenData.notificationType}.NAME`)
        options.push({
          label: this.$t('UNSUBSCRIBE.FROM_NOTIFICATION_TYPE', { notificationType }),
          value: 'notification_type',
          color: 'amber',
        })
      }
      if (this.tokenData.groupId) {
        options.push({
          label: this.$t('UNSUBSCRIBE.FROM_GROUP', { groupName: this.tokenData.groupName }),
          value: 'group',
          color: 'red',
        })
      }
      return options
    },
  },
  mounted () {
    this.ensureDefaultChoice()
  },
  methods: {
    ensureDefaultChoice () {
      if (this.choice || this.options.length === 0) return
      this.choice = this.options[0].value
    },
  },
}
</script>

<style scoped lang="stylus">
  .edit-box
    color #0c0c0c
</style>
