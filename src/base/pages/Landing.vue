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
      <QImg
        :src="screenshots.pickups"
        alt="karrot"
        class="screenshot screenshot-fullwidth q-my-lg"
      />
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
      <section class="row q-my-lg q-py-lg">
        <div class="col-sm-8 q-px-lg self-center">
          <h2 v-t="`LANDING.SECTIONS.${feature}.TITLE`" />
          <p>
            <strong v-t="`LANDING.SECTIONS.${feature}.SUBTITLE`" />
          </p>
          <p v-t="`LANDING.SECTIONS.${feature}.DESCRIPTION`" />
        </div>
        <div
          class="col q-px-lg self-center"
          :class="{ swap: idx % 2 !== 0 }"
        >
          <img
            :src="screenshots[feature]"
            alt="karrot"
            class="screenshot"
          >
        </div>
      </section>

      <hr>
    </div>

    <div class="row q-py-lg">
      <div
        v-for="image in images"
        :key="image"
        class="col-sm-4 q-pa-sm"
      >
        <QImg
          :src="image"
          :ratio="1"
        />
      </div>
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
import { QImg } from 'quasar'

import logo from '@/logo/assets/carrot-logo.svg'
import screenshotPickups from './karrot-pickups.png'
import screenshotGallery from './karrot-gallery.png'
import screenshotManagePickups from './karrot-manage-pickups.png'
import screenshotOffers from './karrot-offers.png'
import imageSavedFood from './oestersund-saved-food.jpg'
import imageVolunteers from './oestersund-volunteers.jpg'
import imageFridge from './solikyl-fridge.png'
import imageSavers from './solikyl-savers.jpg'
import imageFairShare from './fsmaastricht-fairshare.jpg'
import imageSavers2 from './fsmaastricht-foodsavers.jpg'
export default {
  components: {
    QImg,
  },
  created () {
    this.logo = logo
    this.screenshots = {
      pickups: screenshotPickups,
      GROUPS: screenshotGallery,
      ACTIVITIES: screenshotManagePickups,
      OFFERS: screenshotOffers,
    }
    this.images = [
      imageSavedFood,
      imageVolunteers,
      imageFridge,
      imageSavers,
      imageFairShare,
      imageSavers2,
    ]
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

  h1
    line-height 4rem

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

.screenshot
  width 100%
  box-shadow 1px 4px 10px rgba(1, 1, 1, .8)

.screenshot-fullwidth
  @media (min-width: 1100px)
    width 1100px
    // horizontally center the oversized image
    margin-left 50%
    transform translateX(-50%)

// when narrow we don't want the left/right thing
@media (min-width: 600px)
  .swap
    order -1000

</style>
