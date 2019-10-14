<template>
  <div>
    <QCard
      v-for="item in items"
      :key="item.id"
      class="item relative-position inline-block"
      :style="itemStyle"
      @click="visit(item.id)"
    >
      <div
        class="photo text-white relative-position row justify-center"
      >
        <img :src="item.photoUrls.fullSize">
      </div>
      <QCardSection class="fixed-height smaller-text">
        <QAvatar>
          <img
            v-if="item.user.photoUrls !== undefined"
            :src="item.user.photoUrls.thumbnail"
          >
        </QAvatar>
        <router-link :to="{ name: 'sharingDetail', params: { itemId: item.id } }">
          {{ item.name }}
        </router-link>
      </QCardSection>
    </QCard>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { QAvatar, QCard, QCardSection } from 'quasar'

export default {
  components: {
    QAvatar,
    QCard,
    QCardSection,
  },
  computed: {
    ...mapGetters({
      items: 'sharingItems/all',
    }),
    itemStyle () {
      return {
        width: '200px',
      }
    },
  },
  methods: {
    visit (id) {
      this.$router.push({ name: 'sharingDetail', params: { itemId: id } })
    },
  },
}
</script>

<style scoped lang="stylus">
.item
  cursor pointer
.photo
  height 160px
  overflow hidden
  img
    height 100%
    margin 0 auto
</style>
