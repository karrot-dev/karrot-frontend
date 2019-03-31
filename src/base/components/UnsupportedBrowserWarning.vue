<template>
  <div
    v-if="unsupportedBrowser"
    class="browser-warning bg-warning text-white"
  >
    <i18n
      tag="span"
      path="OUTDATED_BROWSER.MESSAGE"
    >
      <a
        v-t="'OUTDATED_BROWSER.LINK'"
        place="upgradeBrowser"
        href="https://browser-update.org/update.html"
        class="outdated-link"
        rel="noopener nofollow noreferrer"
        target="_blank"
        translate="yes"
      />
    </i18n>
  </div>
</template>

<script>
export default {
  computed: {
    unsupportedBrowser () {
      const {
        cordova,
        safari,
        ie,
        versionNumber,
      } = this.$q.platform.is

      if (cordova) return false
      if (safari && versionNumber < 10) {
        return true
      }
      else if (ie && versionNumber < 11) {
        return true
      }
      return false
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.browser-warning
  width 100%
  text-align center
  padding 10px 4px
.outdated-link
  text-decoration underline
</style>
