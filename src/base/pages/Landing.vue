<template>
  <div class="landing">
    <p class="text-center">
      <img
        :src="logo"
        class="logo"
      >
    </p>
    <h1 v-t="'ABOUT_KARROT.TITLE'" />
    <p>
      <strong v-t="'ABOUT_KARROT.SUBTITLE1'" />
    </p>
    <p v-t="'ABOUT_KARROT.SUBTITLE2'" />

    <p class="text-center q-py-lg">
      <RouterLink
        v-if="!isLoggedIn"
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
      <QCarousel
        v-model="slide"
        arrows
        animated
        swipeable
        control-color="primary"
        control-type="push"
        class="screenshot q-my-lg"
      >
        <QCarouselSlide
          name="1"
          :img-src="screenshots.activities"
          draggable="false"
        >
          <div class="absolute-bottom caption">
            <h2 v-t="`ABOUT_KARROT.SECTIONS.ACTIVITIES.TITLE`" />
            <div v-t="`ABOUT_KARROT.SECTIONS.ACTIVITIES.DESCRIPTION`" />
          </div>
        </QCarouselSlide>
        <QCarouselSlide
          name="2"
          img-src="./images/screenshot-activity-chat.png"
          draggable="false"
        >
          <div class="absolute-bottom caption">
            <h2 v-t="`ABOUT_KARROT.SECTIONS.COMMUNICATION.TITLE`" />
            <div v-t="`ABOUT_KARROT.SECTIONS.COMMUNICATION.DESCRIPTION`" />
          </div>
        </QCarouselSlide>
        <QCarouselSlide
          name="3"
          img-src="./images/screenshot-custom-activity.png"
          draggable="false"
        >
          <div class="absolute-bottom caption">
            <h2 v-t="`ABOUT_KARROT.SECTIONS.ACTIVITY_TYPES.TITLE`" />
            <div v-t="`ABOUT_KARROT.SECTIONS.ACTIVITY_TYPES.DESCRIPTION`" />
          </div>
        </QCarouselSlide>
        <QCarouselSlide
          name="4"
          img-src="./images/screenshot-groups-gbg.png"
        >
          <div class="absolute-bottom caption">
            <h2 v-t="`ABOUT_KARROT.SECTIONS.GROUPS.TITLE`" />
            <div v-t="`ABOUT_KARROT.SECTIONS.GROUPS.SUBTITLE`" />
            <small v-t="`ABOUT_KARROT.SECTIONS.GROUPS.DESCRIPTION`" />
          </div>
        </QCarouselSlide>
        <QCarouselSlide
          name="5"
          img-src="./images/screenshot-offers.png"
        >
          <div class="absolute-bottom caption">
            <h2 v-t="`ABOUT_KARROT.SECTIONS.OFFERS.TITLE`" />
            <div v-t="`ABOUT_KARROT.SECTIONS.OFFERS.SUBTITLE`" />
            <small v-t="`ABOUT_KARROT.SECTIONS.OFFERS.DESCRIPTION`" />
          </div>
        </QCarouselSlide>
        <QCarouselSlide
          name="6"
          img-src="./images/screenshot-sthlm-history.png"
        >
          <div class="absolute-bottom caption">
            <h2 v-t="`ABOUT_KARROT.SECTIONS.TRANSPARENCY.TITLE`" />
            <div v-t="`ABOUT_KARROT.SECTIONS.TRANSPARENCY.DESCRIPTION`" />
          </div>
        </QCarouselSlide>
        <QCarouselSlide
          name="7"
          img-src="./images/screenshot-application-vasilis.png"
        >
          <div class="absolute-bottom caption">
            <h2 v-t="`ABOUT_KARROT.SECTIONS.APPLICATIONS.TITLE`" />
            <div v-t="`ABOUT_KARROT.SECTIONS.APPLICATIONS.DESCRIPTION`" />
          </div>
        </QCarouselSlide>
        <QCarouselSlide
          name="8"
          img-src="./images/screenshot-trust.png"
        >
          <div class="absolute-bottom caption">
            <h2 v-t="`ABOUT_KARROT.SECTIONS.TRUST.TITLE`" />
            <div v-t="`ABOUT_KARROT.SECTIONS.TRUST.DESCRIPTION`" />
          </div>
        </QCarouselSlide>
        <QCarouselSlide
          name="9"
          img-src="./images/screenshot-notifications.png"
        >
          <div class="absolute-bottom caption">
            <h2 v-t="`ABOUT_KARROT.SECTIONS.NOTIFICATIONS.TITLE`" />
            <div v-t="`ABOUT_KARROT.SECTIONS.NOTIFICATIONS.DESCRIPTION`" />
          </div>
        </QCarouselSlide>
      </QCarousel>
    </p>

    <section>
      <p v-t="'ABOUT_KARROT.VISION_INTRO'" />

      <div class="row inline-images">
        <div
          v-for="image in images"
          :key="image"
          class="col-4 q-pa-sm"
        >
          <QImg
            :src="image"
            :ratio="1"
          />
        </div>
      </div>
    </section>

    <section v-if="groupsToShow.length > 0">
      <h2 v-t="'ABOUT_KARROT.EXISTING_GROUPS'" />

      <GroupGalleryCards
        :groups="groupsToShow"
        @preview="preview(arguments[0])"
      />

      <p class="text-center q-py-lg">
        <RouterLink
          v-if="!isLoggedIn"
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
    </section>
  </div>
</template>

<script>
import {
  QImg,
  QCarousel,
  QCarouselSlide,
} from 'quasar'
import { mapGetters } from 'vuex'

import GroupGalleryCards from '@/groupInfo/components/GroupGalleryCards'
import logo from '@/logo/assets/carrot-logo.svg'
import screenshotActivities from './images/karrot-screenshot.png'

import screenshotGallery from './images/karrot-gallery.236x236.jpg'
import screenshotManageActivities from './images/karrot-manage-activities.236x236.jpg'
import screenshotOffers from './images/solikyl-offers.236x236.jpg'

import imageSavedFood from './images/oestersund-saved-food.200x200.jpg'
import imageVolunteers from './images/oestersund-volunteers.200x200.jpg'
import imageBikeworkshop from './images/bikeworkshop.200x200.jpg'
import imageSavers from './images/solikyl-savers.200x200.jpg'
import imageFairShare from './images/fsmaastricht-fairshare.200x200.jpg'
import imageSavers2 from './images/fsmaastricht-foodsavers.200x200.jpg'

import router from '@/router'

// Prefer active non-playground groups with a photo
function groupSortScore (group) {
  let score = 0
  if (!group.isInactive) score += 1
  if (group.hasPhoto) score += 1
  if (!group.isPlayground) score += 1
  return score
}

export default {
  components: {
    QImg,
    QCarousel,
    QCarouselSlide,
    GroupGalleryCards,
  },
  data () {
    return {
      slide: '1',
    }
  },
  computed: {
    ...mapGetters({
      groups: 'groups/other',
      isLoggedIn: 'auth/isLoggedIn',
    }),
    groupsToShow () {
      // We might not have enough groups to show, so this is a bit more complicated than it might have been...
      // It attempts to always show _something_
      return this.groups
        // calculate a sort score for each group
        .map(group => ({ ...group, _score: groupSortScore(group) }))
        // sort by that score
        .sort((a, b) => b._score - a._score)
        // take the best 6 entries
        .slice(0, 6)
        // sort those results by how many people they have
        .sort((a, b) => b.members.length - a.members.length)
    },
  },
  created () {
    this.logo = logo
    this.screenshots = {
      activities: screenshotActivities,
      GROUPS: screenshotGallery,
      ACTIVITIES: screenshotManageActivities,
      OFFERS: screenshotOffers,
    }
    this.images = [
      imageSavedFood,
      imageVolunteers,
      imageBikeworkshop,
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
  methods: {
    preview (groupId) {
      router.push({ name: 'groupPreview', params: { groupPreviewId: groupId } }).catch(() => {})
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.landing

  width 1050px
  max-width 100vw
  padding 40px
  margin 0 auto
  background white

  @media (min-width: 1050px)
    // extra padded when on a big enough screen
    padding 60px 100px

  section
    padding 30px 0
    margin 30px 0
    border-bottom 2px dotted $info

    &:last-child
      border none

    > h2
      margin-bottom 40px

  a
    text-decoration underline

  >>> p
    font-size 140%

  h1
    line-height 4rem

  h2
    margin-top 0

  .button
    display inline-block
    padding 10px
    margin 10px
    color white
    text-decoration none
    text-transform uppercase
    background var(--q-color-secondary)
    border-radius 3px

.inline-images
  padding 0
  margin 30px 0
  @media (min-width: 600px)
    // on wider screens, give them a bit more room to breathe
    padding 0 100px

.logo
  width 120px

.screenshot
  width 100%
  box-shadow 1px 4px 10px rgba(1, 1, 1, .8)

.screenshot-fullwidth
  @media (min-width: 1200px)
    // horizontally center the oversized image
    // (also needed an "overflow-x hidden" on the main page container, in Root)
    width 1200px
    margin-left 50%
    transform translateX(-50%)

.caption
  padding 8px
  color white
  text-align center
  background-color rgba(0, 0, 0, .3)

// on wider screens alternate the left/right ordering
@media (min-width: 600px)
  .swap
    order -1000

</style>
