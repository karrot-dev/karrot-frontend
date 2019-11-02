<template>
  <QToolbar
    v-if="item"
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
</template>

<script>
import { mapGetters } from 'vuex'
import { QBtn, QToolbar, QToolbarTitle } from 'quasar'

export default {
  components: {
    QBtn,
    QToolbar,
    QToolbarTitle,
  },
  computed: {
    ...mapGetters({
      item: 'offers/current',
    }),
  },
  methods: {
    close () {
      this.$router.push({ name: 'groupOffers' })
    },
  },
}
</script>
