<template>
  <div class="row justify-between footer">
      <div>karrot <a v-if="release" :href="release.link">{{ release.name }}</a></div> |
      <div>made with <i class="fa fa-heart"></i> by <a href="https://yunity.org">yunity</a></div> |
      <div>contribute on <a href="https://github.com/yunity/karrot-frontend"><i class="fa fa-github"></i> GitHub</a></div> |
      <div>join our official group on <a href="https://www.facebook.com/groups/foodsaving.worldwide/"><i class="fa fa-facebook"></i> Facebook</a></div> |
      <div><i class="fa fa-envelope"></i>
      <a href="mail:fstool@yunity.org" aria-label="" md-labeled-by-tooltip="md-tooltip-4">
        fstool@yunity.org
      </a></div>
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
          name: 'local development',
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
          name: 'development',
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
    width: 95%
    max-width: 75em
    margin: 0 auto
</style>
