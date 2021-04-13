<template>
  <div class="landing sdw">
    <div class="hero-wrapper row items-center q-pb-xl">
      <div class="col">
        <div class="row">
          <h1 v-t="'ABOUT_KARROT.TITLE'" />
        </div>
        <KLandingButtons align-left-on-bigger-screens />
      </div>
      <div class="col-auto text-center">
        <img
          :src="logo"
          alt="Karrot Logo"
          class="hero-logo"
        >
      </div>
    </div>

    <p v-t="'ABOUT_KARROT.SUBTITLE1'" />
    <p v-t="'ABOUT_KARROT.SUBTITLE2'" />

    <div class="text-center q-my-xl">
      <QImg
        :src="screenshots.activities"
        alt="karrot"
        class="screenshot sdw3 screenshot-fullwidth"
      />
    </div>

    <section>
      <p v-t="'ABOUT_KARROT.VISION_INTRO'" />

      <div class="row inline-images q-col-gutter-md q-mt-lg q-mb-xl">
        <div
          v-for="image in images"
          :key="image"
          class="col-4"
        >
          <!-- TODO: create proper alt tags per image -->
          <QImg
            :src="image"
            :ratio="1"
            alt=""
            class="img sdw"
          />
        </div>
      </div>
    </section>

    <section>
      <div
        v-for="(feature, idx) in features"
        :key="feature"
      >
        <div
          class="row"
          :class="[ idx === 0 ? 'q-mb-lg q-pb-lg' : 'q-my-lg q-py-lg']"
        >
          <div
            class="col-sm-8 self-center"
            :class="[ idx % 2 !== 0 ? 'feature_text-right' : 'feature_text-left' ]"
          >
            <h2 v-t="`ABOUT_KARROT.SECTIONS.${feature}.TITLE`" />
            <p v-t="`ABOUT_KARROT.SECTIONS.${feature}.SUBTITLE`" />
            <p v-t="`ABOUT_KARROT.SECTIONS.${feature}.DESCRIPTION`" />
          </div>
          <div
            class="col self-center feature_img"
            :class="[ idx % 2 !== 0 ? 'swap feature_img-left' : 'feature_img-right' ]"
          >
            <img
              :src="screenshots[feature]"
              alt="karrot"
              class="screenshot sdw2"
            >
          </div>
        </div>
      </div>
    </section>

    <section v-if="groupsToShow.length > 0">
      <h2 v-t="'ABOUT_KARROT.EXISTING_GROUPS'" />

      <GroupGalleryCards
        :groups="groupsToShow"
        class="q-mt-xl"
        @preview="preview(arguments[0])"
      />

      <div class="text-center q-pt-xs q-pb-xl">
        <KLandingButtons />
      </div>
    </section>

    <section>
      <h2 v-t="'ABOUT_KARROT.SECTIONS.DEMOCRATIC.TITLE'" />
      <p v-t="'ABOUT_KARROT.SECTIONS.DEMOCRATIC.DESCRIPTION'" />
      <p v-t="'ABOUT_KARROT.SECTIONS.DEMOCRATIC.DESCRIPTION2'" />

      <p class="text-center q-mt-lg q-pt-sm">
        <QBtn
          unelevated
          @click="toggleAbout"
        >
          <img
            :src="logo"
            alt="Karrot Logo"
            class="about-logo"
          >
          {{ $t("GLOBAL.ABOUT_KARROT") }}
        </QBtn>
        <QDialog v-model="showAbout">
          <KAbout @close="toggleAbout" />
        </QDialog>
      </p>
    </section>

    <section>
      <p>
        <em v-t="'ABOUT_KARROT.AND_MORE'" />
      </p>
      <ul>
        <li
          v-for="item in more"
          :key="item"
        >
          <p>
            <strong v-t="`ABOUT_KARROT.SECTIONS.${item}.TITLE`" />:
            <i18n
              :path="`ABOUT_KARROT.SECTIONS.${item}.DESCRIPTION`"
              tag="span"
            >
              <a
                slot="code"
                href="https://github.com/yunity/karrot-frontend"
              >GitHub</a>
              <a
                slot="forum"
                v-t="'ABOUT_KARROT.LINKS.FORUM'"
                href="https://community.foodsaving.world"
              />
              <a
                slot="chat"
                v-t="'ABOUT_KARROT.LINKS.CHAT'"
                href="https://chat.foodsaving.world/channel/karrot-dev"
              />
              <a
                slot="translations"
                href="https://www.transifex.com/yunity-1/karrot/frontend/"
              >Transifex</a>
            </i18n>
          </p>
        </li>
      </ul>

      <div class="text-center q-pt-sm">
        <KLandingButtons />
      </div>
    </section>
  </div>
</template>

<script>
import {
  QDialog,
  QImg,
  QBtn,
} from 'quasar'
import { mapGetters } from 'vuex'

import GroupGalleryCards from '@/groupInfo/components/GroupGalleryCards'
import KAbout from '@/base/components/KAbout'
import KLandingButtons from '@/base/components/KLandingButtons'
import logo from '@/logo/assets/carrot-logo.svg'
import screenshotActivities from './images/karrot-screenshot.png'

import screenshotGallery from './images/karrot-gallery-map.236x236.jpg'
import screenshotManageActivities from './images/karrot-custom-activities.236x236.jpg'
import screenshotOffers from './images/screenshot-offers.236x236.jpg'

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
    QBtn,
    QDialog,
    GroupGalleryCards,
    KAbout,
    KLandingButtons,
  },
  data () {
    return {
      showAbout: false,
    }
  },
  computed: {
    ...mapGetters({
      groups: 'groups/other',
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
    toggleAbout () {
      this.showAbout = !this.showAbout
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

>>>
  --h1-fontsize 1.75rem // 28px
  --h1-letterspacing -0.005em
  --h2-fontsize 1.375rem // 22px
  --landing-padding 30px 20px 40px

  @media (min-width: 410px)
    --h1-fontsize 2.375rem // 38px

  @media (min-width: 500px)
    --landing-padding 45px 40px 40px

  @media (min-width: 600px)
    --h1-fontsize 2.75rem // 44px
    --h2-fontsize 1.875rem // 30px
    --h1-letterspacing -0.025em

  @media (min-width: 850px)
    --h1-fontsize 3.125rem // 50px

  @media (min-width: 1050px)
    --landing-padding 60px 100px 40px

.sdw,
>>> .groupPreviewCard
  box-shadow 0 2px 15px rgba(84, 70, 35, 0.07), 0 1px 3px rgba(84, 70, 35, 0.15)

.sdw2
  box-shadow 0 2.8px 2.2px rgba(0, 0, 0, 0.014), 0 6.7px 5.3px rgba(0, 0, 0, 0.02), 0 12.5px 10px rgba(0, 0, 0, 0.025), 0 22.3px 17.9px rgba(0, 0, 0, 0.03), 0 41.8px 33.4px rgba(0, 0, 0, 0.036), 0 100px 80px rgba(0, 0, 0, 0.05)

.sdw3
  // box-shadow 0 1.9px 2.2px -5px rgba(0, 0, 0, 0.034), 0 4.5px 5.3px -5px rgba(0, 0, 0, 0.048), 0 8.5px 10px -5px rgba(0, 0, 0, 0.06), 0 15.2px 17.9px -5px rgba(0, 0, 0, 0.072), 0 28.4px 33.4px -5px rgba(0, 0, 0, 0.086), 0 68px 80px -5px rgba(0, 0, 0, 0.12)
  box-shadow 0 0.4px 4.5px -5px rgba(0, 0, 0, 0.066), 0 1.4px 8.7px -5px rgba(0, 0, 0, 0.094), 0 3px 12.6px -5px rgba(0, 0, 0, 0.108), 0 5.5px 16.8px -5px rgba(0, 0, 0, 0.121), 0 9.4px 23.2px -5px rgba(0, 0, 0, 0.14), 0 17px 37px -5px rgba(0, 0, 0, 0.18)

.landing
  width 1050px
  max-width 100vw
  padding var(--landing-padding)
  margin 0 auto
  color #111111
  background white

  .hero-wrapper
    flex-direction column-reverse
    @media (min-width: 600px)
      flex-direction row

    h1
      margin 16px 0 0
      font-size var(--h1-fontsize)
      font-weight 600
      line-height 1.2
      text-align center
      letter-spacing var(--h1-letterspacing)

      @media (min-width: 600px)
        margin 0
        text-align left

    .hero-logo
      width 20vw
      min-width 120px
      max-width 120px
      @media (min-width: 600px)
        min-width 160px
        max-width 200px
        padding-left 10px
      @media (min-width: 850px)
        margin-right 45px
      @media (min-width: 1050px)
        margin-right 25px

  section
    padding 30px 0
    margin 30px 0
    border-bottom 2px dotted $info

    &:last-child
      margin-bottom 0
      border none

    a
      text-decoration underline
      text-underline-offset 2px

  >>> p
    margin 8px 0
    font-size 1.0625rem // 17px
    color rgba(0, 0, 0, 0.74)

    @media (min-width: 600px)
      margin 11px 0
      font-size 1.25rem // 20px

  h2
    margin 0 0 15px
    font-size var(--h2-fontsize)
    font-weight 800
    line-height 1.3
    letter-spacing var(--h2-letterspacing)

  .about-logo
    width 50px
    height 50px
    padding-bottom 8px
    margin-right 10px

  .inline-images
    @media (min-width: 600px)
      // on wider screens, give them a bit more room to breathe
      padding 0 40px

    .img
      border-radius 4px

  .screenshot
    width 100%

  .screenshot-fullwidth
    @media (min-width: 1200px)
      // horizontally center the oversized image
      // (also needed an "overflow-x hidden" on the main page container, in Root)
      width 1200px
      margin-left 50%
      transform translateX(-50%)

  .feature_img
    padding-top 11px
    @media (min-width: 600px)
      padding-top 0

  @media (min-width: 600px)
    // on wider screens alternate the left/right ordering
    .swap
      order -1000

    .feature_text-left,
    .feature_img-left
      padding-right 24px

    .feature_text-right,
    .feature_img-right
      padding-left 24px

</style>
