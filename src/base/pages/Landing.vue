<template>
  <div class="landing bg-white q-pa-lg">
    <p class="text-center">
      <img
        :src="logo"
        class="logo"
      >
    </p>
    <h1 v-t="'LANDING.TITLE'" />
    <p>
      <strong v-t="'LANDING.SUBTITLE1'" />
    </p>
    <p v-t="'LANDING.SUBTITLE2'" />
    <p class="text-center q-py-lg">
      <RouterLink
        v-t="'SIGNUP.TITLE'"
        class="button"
        :to="{ name: 'signup' }"
      />
      <RouterLink
        v-t="'JOINGROUP.BROWSE_GROUPS'"
        class="button"
        :to="{ name: 'groupsGallery' }"
      />
    </p>
    <p class="text-center">
      <img
        :src="screenshots.pickups"
        alt="karrot"
        class="screenshot screenshot-fullwidth q-my-lg"
      >
    </p>

    <p v-t="'LANDING.VISION1'" />
    <p v-t="'LANDING.VISION2'" />
    <p v-t="'LANDING.VISION3'" />
    <i18n
      path="LANDING.ACTION"
      tag="p"
    >
      <a
        slot="startAGroup"
        v-t="'LANDING.ACTION_START_A_GROUP'"
        href="/#/group/create"
      />
    </i18n>

    <hr>

    <div
      v-for="(feature, idx) in features"
      :key="feature"
    >
      <LandingFeature
        :t="`LANDING.SECTIONS.${feature}`"
        :image-src="screenshots[feature]"
        :side="idx % 2 === 0 ? 'left' : 'right'"
      />

      <hr>
    </div>

    <p class="text-center q-py-lg">
      <RouterLink
        v-t="'SIGNUP.TITLE'"
        class="button"
        :to="{ name: 'signup' }"
      />
      <RouterLink
        v-t="'JOINGROUP.BROWSE_GROUPS'"
        class="button"
        :to="{ name: 'groupsGallery' }"
      />
    </p>

    <hr>

    <section class="q-my-lg q-py-lg">
      <h2 v-t="'LANDING.SECTIONS.DEMOCRATIC.TITLE'" />
      <p v-t="'LANDING.SECTIONS.DEMOCRATIC.DESCRIPTION'" />
      <i18n
        path="LANDING.SECTIONS.DEMOCRATIC.DESCRIPTION2"
        tag="p"
      >
        <a
          slot="code"
          v-t="'LANDING.LINKS.CODE'"
          href="https://github.com/yunity/karrot-frontend"
        />
      </i18n>
    </section>

    <p>
      <em v-t="'LANDING.AND_MORE'" />
    </p>
    <ul>
      <li
        v-for="item in more"
        :key="item"
      >
        <p>
          <strong v-t="`LANDING.SECTIONS.${item}.TITLE`" />:
          <i18n
            :path="`LANDING.SECTIONS.${item}.DESCRIPTION`"
            tag="span"
          >
            <a
              slot="code"
              v-t="'LANDING.LINKS.CODE'"
              href="https://github.com/yunity/karrot-frontend"
            />
            <a
              slot="forum"
              v-t="'LANDING.LINKS.FORUM'"
              href="https://community.foodsaving.world"
            />
            <a
              slot="chat"
              v-t="'LANDING.LINKS.CHAT'"
              href="https://slackin.yunity.org"
            />
            <a
              slot="translations"
              v-t="'LANDING.LINKS.TRANSLATIONS'"
              href="https://www.transifex.com/yunity-1/karrot/frontend/"
            />
          </i18n>
        </p>
      </li>
    </ul>

    <hr>

    <p class="text-center q-py-lg">
      <RouterLink
        v-t="'SIGNUP.TITLE'"
        class="button"
        :to="{ name: 'signup' }"
      />
      <RouterLink
        v-t="'JOINGROUP.BROWSE_GROUPS'"
        class="button"
        :to="{ name: 'groupsGallery' }"
      />
    </p>
  </div>
</template>

<script>
import logo from '@/logo/assets/carrot-logo.svg'
import screenshotPickups from './karrot-pickups.png'
import screenshotGallery from './karrot-gallery.png'
import screenshotManagePickups from './karrot-manage-pickups.png'
import screenshotOffers from './karrot-offers.png'
import LandingFeature from '@/base/components/LandingFeature'
export default {
  components: { LandingFeature },
  created () {
    this.logo = logo
    this.screenshots = {
      pickups: screenshotPickups,
      GROUPS: screenshotGallery,
      ACTIVITIES: screenshotManagePickups,
      OFFERS: screenshotOffers,
    }
    this.features = [
      'GROUPS',
      'ACTIVITIES',
      'OFFERS',
    ]
    this.more = [
      'COMMUNICATION',
      'TRUST',
      'MAPS',
      'TRANSPARENCY',
      'NOTIFICATIONS',
      'TRANSLATIONS',
      'OPENSOURCE',
      'TEAM',
    ]
  },
}
</script>

<style scoped lang="stylus">
.landing
  width 900px
  max-width 100vw
  margin 0 auto

  a
    text-decoration underline

  >>> p
    font-size 140%

  h2
    margin-top 0

  hr
    margin 20px 0
    border 0
    border-bottom 1px dashed #ddd

  .button
    padding 10px
    margin 0 10px
    color white
    text-decoration none
    text-transform uppercase
    background var(--q-color-secondary)
    border-radius 3px

.logo
  width 120px

.screenshot-fullwidth
  @media (min-width: 1100px)
    width 1100px
    // horizontally center the oversized image
    margin-left 50%
    transform translateX(-50%)

</style>
