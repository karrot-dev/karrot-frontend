<template>
  <q-item multiline>
    <q-item-side style="margin-top: 16px">
      <ProfilePicture :user="user" :size="40" />
    </q-item-side>
    <q-item-main>
      <q-item-tile>
        <q-input
          type="textarea"
          v-model="message"
          :placeholder="placeholder"
          :min-rows="2"
          :after="[{icon: 'arrow_forward', content: true, handler: this.send }]"
          :loading="status.isWaiting"
          @keyup.ctrl.enter="send"
          />
        </q-item-tile>
    </q-item-main>
  </q-item>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import { QItem, QItemMain, QInput, QBtn, QItemSide, QItemTile } from 'quasar'

export default {
  name: 'WallInput',
  components: { QItem, QInput, QBtn, QItemMain, QItemSide, QItemTile, ProfilePicture },
  props: {
    status: { required: true },
    placeholder: { default: 'placeholder' },
    user: { required: true },
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
