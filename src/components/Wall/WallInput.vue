<template>
  <q-card>
    <q-card-main>
      <form name="wallinput" @submit.prevent="send">
        <q-input v-model="message" />
        <q-btn type="submit">Send</q-btn>
      </form>
    </q-card-main>
  </q-card>
</template>

<script>
import { QCard, QCardMain, QInput, QBtn } from 'quasar'

export default {
  components: { QCard, QInput, QBtn, QCardMain },
  data () {
    return {
      message: '',
    }
  },
  methods: {
    send () {
      this.$emit('send', this.message)
      this.message = ''
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
