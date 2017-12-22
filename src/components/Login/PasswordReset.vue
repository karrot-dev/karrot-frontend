<template>
  <div>
    <form
      v-if="!success"
      name="passwordreset"
      @submit.prevent="$emit('submit', email)"
    >
      <div>
        <p>
          {{ $t('PASSWORDRESET.INTRO') }}
        </p>
        <div class="white-box">
          <q-field icon="fa-envelope">
            <q-input
              :autofocus="true"
              :float-label="$t('PASSWORDRESET.EMAIL')"
              type="email"
              v-model="email"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              :error="hasError('email')"
              :error-label="firstError('email')"
            />
          </q-field>
        </div>

        <div
          v-if="hasNonFieldError"
          class="error"
        >
          <i class="fa fa-exclamation-triangle"/>
          <div>
            {{ firstNonFieldError }}
          </div>
        </div>

        <div class="actions">
          <q-btn
            type="button"
            @click="$router.push({ name: 'login' })"
            flat
          >
            {{ $t('PASSWORDRESET.LOGIN') }}
          </q-btn>
          <q-btn
            type="submit"
            class="submit shadow-4"
            loader
            :value="isPending"
          >
            {{ $t('PASSWORDRESET.SUBMIT') }}
          </q-btn>
        </div>
        <div style="clear: both"/>
      </div>
    </form>
    <p v-else>
      {{ $t('PASSWORDRESET.SUCCESS') }}
    </p>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: { QField, QInput, QBtn },
  mixins: [statusMixin],
  data () {
    return {
      email: '',
    }
  },
  props: {
    success: { required: true, type: Boolean },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
</style>
