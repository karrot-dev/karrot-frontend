<template>
  <QCard
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <form
      class="q-gutter-y-lg"
      style="max-width: 700px"
      @submit.prevent="maybeSave"
    >
      <h3>
        <QIcon
          name="fas fa-handshake"
          class="q-pr-md"
          color="grey"
        />
        <template v-if="isNew">
          {{ $t('AGREEMENT.NEW') }}
        </template>
        <template v-else>
          {{ $t('AGREEMENT.EDIT') }}
        </template>
      </h3>

      <QInput
        v-model="edit.title"
        :autofocus="!$q.platform.has.touch"
        v-bind="titleError"
        :label="$t('AGREEMENT.TITLE')"
        :hint="$t('AGREEMENT.TITLE_HELPER')"
        outlined
        class="q-mb-lg"
        @blur="v$.edit.title.$touch"
      />

      <QInput
        ref="qActiveFrom"
        v-model="activeFrom"
        mask="####-##-##"
        :error="hasError('activeFrom')"
        size="9"
        hide-bottom-space
        label="Active from"
        outlined
        class="q-mr-sm"
        @focus="$refs.qActiveFromProxy.show()"
      >
        <Component
          :is="smallScreen ? 'QDialog' : 'QMenu'"
          ref="qActiveFromProxy"
          no-focus
          no-refocus
          no-parent-event
          @hide="$refs.qActiveFrom.blur()"
        >
          <QDate
            v-model="activeFrom"
            mask="YYYY-MM-DD"
            @update:model-value="() => smallScreen && $refs.qActiveFromProxy.hide()"
          />
        </Component>
      </QInput>

      <QInput
        ref="qReviewAt"
        v-model="reviewAt"
        mask="####-##-##"
        :error="hasError('reviewAt')"
        size="9"
        hide-bottom-space
        :label="`${$t('AGREEMENT.REVIEW_DATE')} (${$t('VALIDATION.OPTIONAL')})`"
        outlined
        clearable
        class="q-mr-sm"
        @focus="focusReviewAt"
        @clear="() => $refs.qReviewAtProxy.hide()"
      >
        <Component
          :is="smallScreen ? 'QDialog' : 'QMenu'"
          ref="qReviewAtProxy"
          no-focus
          no-refocus
          no-parent-event
          @hide="$refs.qReviewAt.blur()"
        >
          <QDate
            v-model="reviewAt"
            mask="YYYY-MM-DD"
            @update:model-value="() => smallScreen && $refs.qReviewAtProxy.hide()"
          />
        </Component>
      </QInput>

      <MarkdownInput
        v-model="edit.summary"
        :error="hasError('summary')"
        :error-message="firstError('summary')"
        :label="`${$t('AGREEMENT.SUMMARY')} (${$t('VALIDATION.OPTIONAL')})`"
        outlined
        class="q-mb-lg"
        @keyup.ctrl.enter="maybeSave"
      />

      <MarkdownInput
        v-model="edit.content"
        :error="hasError('content')"
        :error-message="firstError('content')"
        :label="$t('AGREEMENT.CONTENT')"
        outlined
        class="q-mb-lg"
        @keyup.ctrl.enter="maybeSave"
      />

      <div class="row justify-end q-gutter-sm q-mt-sm">
        <QBtn
          type="button"
          @click="$emit('cancel')"
        >
          {{ $t('BUTTON.CANCEL') }}
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
  </QCard>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { maxLength, required } from '@vuelidate/validators'
import {
  QCard,
  QIcon,
  QInput,
  QBtn,
  QDialog,
  date,
  QMenu,
  QDate,
} from 'quasar'

import editMixin from '@/utils/mixins/editMixin'
import statusMixin, { mapErrors } from '@/utils/mixins/statusMixin'

import MarkdownInput from '@/utils/components/MarkdownInput'

export default {
  components: {
    QCard,
    QIcon,
    QInput,
    QBtn,
    QDialog,
    QMenu,
    QDate,
    MarkdownInput,
  },
  mixins: [editMixin, statusMixin],
  props: {
    value: {
      type: Object,
      default: () => ({
        title: undefined,
        summary: undefined,
        content: undefined,
        activeFrom: new Date(),
        reviewAt: undefined,
      }),
    },
  },
  emits: [
    'save',
    'cancel',
  ],
  setup () {
    return {
      v$: useVuelidate(),
    }
  },
  computed: {
    ...mapErrors({
      title: [
        ['required', 'VALIDATION.REQUIRED'],
        ['maxLength', 'VALIDATION.MAXLENGTH', { max: 241 }],
      ],
      summary: [],
      content: [
        ['required', 'VALIDATION.REQUIRED'],
      ],
    }),
    canSave () {
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    smallScreen () {
      return this.$q.screen.width < 450 || this.$q.screen.height < 450
    },
    activeFrom: {
      get () {
        return date.formatDate(this.edit.activeFrom, 'YYYY-MM-DD')
      },
      set (val) {
        if (val) {
          val = date.extractDate(val, 'YYYY-MM-DD')
          val = date.adjustDate(this.edit.activeFrom, { year: val.getFullYear(), month: val.getMonth() + 1, date: val.getDate() })
        }
        this.edit.activeFrom = val
      },
    },
    reviewAt: {
      get () {
        return date.formatDate(this.edit.reviewAt, 'YYYY-MM-DD')
      },
      set (val) {
        if (val) {
          val = date.extractDate(val, 'YYYY-MM-DD')
          val = date.adjustDate(this.edit.reviewAt, { year: val.getFullYear(), month: val.getMonth() + 1, date: val.getDate() })
        }
        this.edit.reviewAt = val || null
      },
    },
  },
  methods: {
    maybeSave () {
      if (!this.canSave) return
      this.save()
    },
    focusReviewAt (evt) {
      // If it's a button, it's the "clear" button
      // so we don't want to pop open the calendar
      if (evt.target.nodeName !== 'BUTTON') {
        this.$refs.qReviewAtProxy.show()
      }
    },
  },
  validations: {
    edit: {
      title: {
        required,
        maxLength: maxLength(240),
      },
      content: {
        required,
      },
    },
  },
}
</script>

<style scoped lang="sass">
@import '~editbox'
</style>
