<template>
  <div v-if="item">
    <QToolbar
      class="bg-secondary text-white"
    >
      <QToolbarTitle
        class="column"
      >
        <div>{{ item.name }}</div>
      </QToolbarTitle>
      <QBtn
        v-if="!$q.platform.is.mobile"
        flat
        round
        dense
        icon="close"
        :title="$t('BUTTON.CLOSE')"
        @click="close()"
      />
    </QToolbar>
    <div class="photo">
      <img
        :src="item.photoUrls.fullSize"
        class="full-width"
      >
    </div>
    <QChip>
      <QAvatar
        color="red"
        text-color="white"
      >
        3
      </QAvatar>
      Requests
    </QChip>
    <div class="q-ma-md">
      <Markdown :source="item.description" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { QAvatar, QBtn, QChip, QToolbar, QToolbarTitle } from 'quasar'
import Markdown from '@/utils/components/Markdown'

export default {
  components: {
    Markdown,
    QAvatar,
    QBtn,
    QChip,
    QToolbar,
    QToolbarTitle,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      item: 'offerItems/current',
    }),
  },
  methods: {
    close () {
      this.$router.push({ name: 'groupOffers' })
    },
  },
}
</script>

<style scoped lang="stylus">
  .photo
    width 100%
</style>
