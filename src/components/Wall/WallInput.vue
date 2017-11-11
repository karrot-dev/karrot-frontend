<template>
  <q-item>
    <q-item-main>
      <form name="wallinput" @submit.prevent="send">
        <q-input
          type="textarea"
          v-model="message"
          :placeholder="placeholder"
          :min-rows="3"
          :after="[{icon: 'arrow_forward', content: true, handler: this.send }]"
          :loading="status.isWaiting"
          />
      </form>
    </q-item-main>
  </q-item>
</template>

<script>
import { QItem, QItemMain, QInput, QBtn } from 'quasar'

export default {
  name: 'WallInput',
  components: { QItem, QInput, QBtn, QItemMain },
  props: {
    status: { required: true },
    placeholder: { default: 'placeholder' },
  },
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
