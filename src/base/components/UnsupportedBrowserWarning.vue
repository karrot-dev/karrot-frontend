<template>
  <div
    v-if="unsupportedBrowser"
    class="browser-warning"
  >
    <i18n
      tag="span"
      path="OUTDATED_BROWSER.MESSAGE"
    >
      <a
        place="upgradeBrowser"
        href="https://browser-update.org/update.html"
        class="outdated-link"
        rel="noopener nofollow noreferrer"
        target="_blank"
        translate="yes"
        v-t="'OUTDATED_BROWSER.LINK'"
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
      if (safari && versionNumber < 9.1) {
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
  background-color $warning
  width 100%
  text-align center
  padding 10px 4px
.outdated-link
  color #0000EE
  text-decoration underline
</style>
