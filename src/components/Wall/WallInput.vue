<template>
  <q-card>
    <q-card-main>
      <form name="wallinput" @submit.prevent="send">
        <q-input
          type="textarea"
          v-model="message"
          placeholder="Write a message..."
          :min-rows="3"
          :after="[{icon: 'arrow_forward', content: true, handler: this.send }]"
          @keyup.ctrl.enter="send"
          />
      </form>
    </q-card-main>
  </q-card>
</template>

<script>
import { QCard, QCardMain, QInput, QBtn } from 'quasar'

export default {
  name: 'WallInput',
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
