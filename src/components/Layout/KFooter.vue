<template>
  <div class="row generic-padding justify-around footer bg-neutral font-primary">
    <div class="column">
      <div>karrot <a v-if="release" :href="release.link">{{ release.name }}</a></div>
      <div>made with <i class="fa fa-heart"></i> by <a href="https://foodsaving.world">foodsaving worldwide</a></div>
    </div>
    <div class="column">
      <div>contribute on <a href="https://github.com/yunity/karrot-frontend"><i class="fa fa-github"></i> GitHub</a></div>
      <div>join our official group on <a href="https://www.facebook.com/groups/foodsaving.worldwide/"><i class="fa fa-facebook"></i> Facebook</a></div>
      <div><i class="fa fa-envelope"></i>
      <a href="mail:karrot@foodsaving.world" aria-label="" md-labeled-by-tooltip="md-tooltip-4">
        karrot@foodsaving.world
      </a></div>
    </div>
  </div>
</template>

<script>
import { QBtn, QIcon, QPopover, QList, QItem } from 'quasar'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    QBtn, QIcon, QPopover, QList, QItem,
  },
  computed: {
    ...mapGetters({
      about: 'about/get',
    }),
    release () {
      if (process.env.NODE_ENV === 'development') {
        return {
          link: '',
          name: 'local dev version',
        }
      }
      if (this.about.env === 'production') {
        return {
          link: 'https://github.com/yunity/karrot-frontend/blob/master/CHANGELOG.md',
          name: 'Release 3',
        }
      }
      if (this.about.env === 'development') {
        const sha = this.about.commitSHA
        return {
          link: `https://github.com/yunity/karrot-frontend/tree/${sha}`,
          name: 'beta version',
        }
      }
    },
  },
  methods: {
    ...mapActions({
      fetchAbout: 'about/fetchAbout',
    }),
  },
  mounted () {
    this.fetchAbout()
  },
}
</script>

<style scoped lang="stylus">
  .footer
    width: 100%
    max-width: 75em
    margin: 0 auto
    margin-top 10em
    height: 10em
    .column div
      margin .5em
</style>
