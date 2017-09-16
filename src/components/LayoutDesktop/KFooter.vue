<template>
  <div class="row justify-between footer">
      <div>karrot <a :href="releaseLink">{{ releaseName }}</a></div> |
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
import misc from '@/services/misc'

export default {
  components: {
    QBtn, QIcon, QPopover, QList, QItem
  },
  data () {
    return {
      releaseLink: 'https://github.com/yunity/karrot-frontend/blob/master/CHANGELOG.md',
      releaseName: 'Release 3'
    }
  },
  async mounted () {
    try {
      // about.json exists on deployment
      const about = await misc.about()
      this.releaseLink = `https://github.com/yunity/karrot-frontend/tree/${about.commitSHA}`
      this.releaseName = 'development'
    } catch (e) {
      if (DEV) {
        // local development
        this.releaseLink = ''
        this.releaseName = 'local development'
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  .footer
    width: 95%
    max-width: 75em
    margin: 0 auto
</style>
https://github.com/yunity/karrot-frontend/tree/
