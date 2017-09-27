<template>
  <div>
    <div>
      <h4>{{ $t('PASSWORDRESET.TITLE') }}</h4>
    </div>
    <form v-if="!status.success" name="passwordreset" @submit.prevent="$emit('submit', email)">
      <div>
        <p>
          {{ $t('PASSWORDRESET.INTRO') }}
        </p>
        <div>
          <q-field icon="fa-envelope">
            <q-input
            :autofocus="true"
            :float-label="$t('PASSWORDRESET.EMAIL')"
            type="email"
            v-model="email"
            autocorrect="off" autocapitalize="off" spellcheck="false"
            />
          </q-field>
        </div>
        <div v-if="status.error">
          Error!
        </div>
        <div>
          <q-btn type="submit" class="submit shadow-4" :loader="status.isWaiting">
            {{ $t('PASSWORDRESET.SUBMIT') }}
          </q-btn>
        </div>
        <div style="clear: both"/>
      </div>
    </form>
    <p v-if="status.success">
      {{ $t('PASSWORDRESET.SUCCESS') }}
    </p>
    <q-btn @click="$router.push({ name: 'login' })"flat>
      {{ $t('PASSWORDRESET.LOGIN') }}
    </q-btn>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'

export default {
  components: { QField, QInput, QBtn },
  data () {
    return {
      email: '',
    }
  },
  props: {
    status: {
      required: true,
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
</style>
