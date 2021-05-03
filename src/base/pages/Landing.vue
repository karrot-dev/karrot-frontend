<template>
  <div class="landing sdw">
    <div class="hero-wrapper section-padding row items-center q-pb-xl">
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

    <div class="section-padding">
      <p v-t="'ABOUT_KARROT.SUBTITLE1'" />
      <p v-t="'ABOUT_KARROT.SUBTITLE2'" />
    </div>

    <!-- FIXME: delete, if new screens are ok -->
    <!-- <div class="text-center q-my-xl">
      <QImg
        :src="screenshots.activities"
        alt="karrot"
        class="sdw3 screenshot-fullwidth"
      />
    </div> -->

    <div class="app-screenshots">
      <div class="outer-wrapper">
        <div class="inner-wrapper">
          <div class="browser">
            <div class="top-bar row items-center">
              <div class="traffic-light" />
              <div class="traffic-light" />
              <div class="traffic-light" />
            </div>
            <QImg
              :sizes="screenshotsMain.browser.sources.sizes"
              :srcset="screenshotsMain.browser.sources.srcset"
              :src="screenshotsMain.browser.sources.src"
              :alt="screenshotsMain.browser.alt"
              :ratio="1322 / 863"
              class="browser-content"
              no-default-spinner
              position="50% var(--app-screenshots-browser-img-position-y)"
              :img-style="{
                width: 'calc(100% - var(--app-screenshots-browser-img-offset))',
                'background-size': 'var(--app-screenshots-browser-img-bg-sizing)'
              }"
            />
          </div>
          <div class="phone-wrapper">
            <div class="device-outer">
              <div class="device-content">
                <QImg
                  :sizes="screenshotsMain.phone.sources.sizes"
                  :srcset="screenshotsMain.phone.sources.srcset"
                  :src="screenshotsMain.phone.sources.src"
                  :alt="screenshotsMain.phone.alt"
                  no-default-spinner
                />
              </div>
              <div class="device-frame" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-padding">
      <section>
        <p v-t="'ABOUT_KARROT.VISION_INTRO'" />

        <div class="row inline-images q-col-gutter-md q-mt-lg q-mb-xl">
          <div
            v-for="(image, idx) in images"
            :key="`inline-image-${idx}`"
            class="col-4"
          >
            <QImg
              :sizes="image.sources.sizes"
              :srcset="image.sources.srcset"
              :src="image.sources.src"
              :ratio="1"
              :alt="image.alt"
              class="img sdw"
            />
          </div>
        </div>
      </section>

      <section>
        <div
          v-for="(feature, idx) in features"
          :key="feature"
          class="feature"
          :class="[ idx === 0 ? 'q-mb-lg q-pb-lg' : 'q-my-lg q-py-lg', { swap: idx % 2 !== 0 }]"
        >
          <div class="feature__content">
            <h2 v-t="`ABOUT_KARROT.SECTIONS.${feature}.TITLE`" />
            <p v-t="`ABOUT_KARROT.SECTIONS.${feature}.SUBTITLE`" />
            <p v-t="`ABOUT_KARROT.SECTIONS.${feature}.DESCRIPTION`" />
          </div>
          <!-- TODO: create proper alt tags per image -->
          <img
            :src="screenshots[feature]"
            alt="karrot"
            class="feature__img sdw2"
          >
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
import { getImgSources, presets } from '@/utils/srcsetUtils'

// FIXME: delete, if new screens are ok
import screenshotActivities from './images/karrot-screenshot.png'
import screenshotMobile from './images/karrot-mobile.jpg'

import screenshotGallery from './images/karrot-gallery-map.236x236.jpg'
import screenshotManageActivities from './images/karrot-custom-activities.236x236.jpg'
import screenshotOffers from './images/screenshot-offers.236x236.jpg'

import router from '@/router'

const SCREENSHOTS_BASE_PATH = 'base/pages/images/'

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
      activities: screenshotActivities, // FIXME: delete, if new screens are ok
      mobile: screenshotMobile, // FIXME: delete, if new screens are ok
      GROUPS: screenshotGallery,
      ACTIVITIES: screenshotManageActivities,
      OFFERS: screenshotOffers,
    }
    this.screenshotsMain = {
      browser: {
        alt: 'karrot browser screenshot',
        sources: getImgSources({
          baseFileName: 'karrot-screenshot-browser',
          physicalWidth: 1776,
          basePath: SCREENSHOTS_BASE_PATH,
          preset: presets.WELCOME_SCREENSHOTS_BROWSER,
        }),
      },
      phone: {
        alt: 'karrot mobile screenshot',
        sources: getImgSources({
          baseFileName: 'karrot-screenshot-phone',
          physicalWidth: 490,
          basePath: SCREENSHOTS_BASE_PATH,
          preset: presets.WELCOME_SCREENSHOTS_PHONE,
        }),
      },
    }
    this.imagesOptions = {
      basePath: SCREENSHOTS_BASE_PATH,
      preset: presets.WELCOME_IMGS,
    }
    this.images = [
      {
        alt: 'oestersund saved food',
        sources: getImgSources({
          baseFileName: 'oestersund-saved-food',
          physicalWidth: 500,
          ...this.imagesOptions,
        }),
      },
      {
        alt: 'oestersund volunteers',
        sources: getImgSources({
          baseFileName: 'oestersund-volunteers',
          physicalWidth: 435,
          ...this.imagesOptions,
        }),
      },
      {
        alt: 'bike workshop',
        sources: getImgSources({
          baseFileName: 'bike-workshop',
          physicalWidth: 600,
          ...this.imagesOptions,
        }),
      },
      {
        alt: 'solikyl savers',
        sources: getImgSources({
          baseFileName: 'solikyl-savers',
          physicalWidth: 450,
          ...this.imagesOptions,
        }),
      },
      {
        alt: 'maastricht fairshare',
        sources: getImgSources({
          baseFileName: 'fsmaastricht-fairshare',
          physicalWidth: 480,
          ...this.imagesOptions,
        }),
      },
      {
        alt: 'maastricht foodsavers',
        sources: getImgSources({
          baseFileName: 'fsmaastricht-foodsavers',
          physicalWidth: 600,
          ...this.imagesOptions,
        }),
      },
      // NOTE: only for testing responsive sizes
      // {
      //   alt: 'responsive srcset test',
      //   sources: getImgSources({
      //     baseFileName: 'responsive-test',
      //     physicalWidth: 600,
      //     ...this.imagesOptions,
      //   }),
      // },
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
  --landing-padding-top 30px
  --section-padding-x 20px
  --app-screenshots-padding 25px 0 25px var(--section-padding-x)
  --app-screenshots-box-sdw 0 3px 22px -3px rgba(0, 0, 0, 0.2)
  --app-screenshots-devices-bg-color #FFF5D9
  --app-screenshots-outer-wrapper-width 150%
  --app-screenshots-browser-top-bar-position absolute
  --app-screenshots-browser-top-bar-height 18px
  --app-screenshots-browser-top-bar-border-radius 10px
  --app-screenshots-browser-traffic-light-size 6px
  --app-screenshots-browser-traffic-light-margin 3px
  --app-screenshots-browser-width 132%
  --app-screenshots-browser-img-bg-sizing contain
  --app-screenshots-browser-img-position-y var(--app-screenshots-browser-top-bar-height)
  --app-screenshots-browser-img-offset 25px
  --app-screenshots-phone-position relative
  --app-screenshots-phone-width 43%
  --app-screenshots-phone-right unset
  --app-screenshots-phone-bottom unset

  @media (min-width: 410px)
    --h1-fontsize 2.375rem // 38px

  @media (min-width: 500px)
    --landing-padding-top 45px
    --section-padding-x 40px
    --app-screenshots-browser-top-bar-height 24px
    --app-screenshots-browser-top-bar-border-radius 13px
    --app-screenshots-browser-traffic-light-size 8px
    --app-screenshots-browser-traffic-light-margin 4px
    --app-screenshots-browser-img-offset 34px

  @media (min-width: 600px)
    --h1-fontsize 2.75rem // 44px
    --h2-fontsize 1.875rem // 30px
    --h1-letterspacing -0.025em

  @media (min-width: 700px)
    --app-screenshots-padding 55px 120px 65px var(--section-padding-x)
    --app-screenshots-outer-wrapper-width 100%
    --app-screenshots-browser-top-bar-position relative
    --app-screenshots-browser-top-bar-height 34px
    --app-screenshots-browser-top-bar-border-radius 15px
    --app-screenshots-browser-traffic-light-size 10px
    --app-screenshots-browser-traffic-light-margin 6px
    --app-screenshots-browser-width 100%
    --app-screenshots-browser-img-bg-sizing cover
    --app-screenshots-browser-img-position-y 50%
    --app-screenshots-browser-img-offset 0px
    --app-screenshots-phone-position absolute
    --app-screenshots-phone-width 32.5%
    --app-screenshots-phone-right -105px
    --app-screenshots-phone-bottom -27px

  @media (min-width: 850px)
    --h1-fontsize 3.125rem // 50px
    --app-screenshots-phone-width 31.023%

  @media (min-width: 1050px)
    --landing-padding-top 60px
    --section-padding-x 100px
    --app-screenshots-padding 55px 120px 65px 50px

.sdw,
>>> .groupPreviewCard
  box-shadow 0 2px 15px rgba(84, 70, 35, 0.07), 0 1px 3px rgba(84, 70, 35, 0.15)

.sdw2
  box-shadow 0 2.8px 2.2px rgba(0, 0, 0, 0.014), 0 6.7px 5.3px rgba(0, 0, 0, 0.02), 0 12.5px 10px rgba(0, 0, 0, 0.025), 0 22.3px 17.9px rgba(0, 0, 0, 0.03), 0 41.8px 33.4px rgba(0, 0, 0, 0.036), 0 100px 80px rgba(0, 0, 0, 0.05)

.sdw3
  // box-shadow 0 1.9px 2.2px -5px rgba(0, 0, 0, 0.034), 0 4.5px 5.3px -5px rgba(0, 0, 0, 0.048), 0 8.5px 10px -5px rgba(0, 0, 0, 0.06), 0 15.2px 17.9px -5px rgba(0, 0, 0, 0.072), 0 28.4px 33.4px -5px rgba(0, 0, 0, 0.086), 0 68px 80px -5px rgba(0, 0, 0, 0.12)
  box-shadow 0 0.4px 4.5px -5px rgba(0, 0, 0, 0.066), 0 1.4px 8.7px -5px rgba(0, 0, 0, 0.094), 0 3px 12.6px -5px rgba(0, 0, 0, 0.108), 0 5.5px 16.8px -5px rgba(0, 0, 0, 0.121), 0 9.4px 23.2px -5px rgba(0, 0, 0, 0.14), 0 17px 37px -5px rgba(0, 0, 0, 0.18)

.section-padding
  padding-right var(--section-padding-x)
  padding-left var(--section-padding-x)

.landing
  width 1050px
  max-width 100vw
  padding var(--landing-padding-top) 0 40px
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

  // FIXME: delete, if new screens are ok
  // .screenshot-fullwidth
  //   width 100%

  //   @media (min-width: 1200px)
  //     // horizontally center the oversized image
  //     // (also needed an "overflow-x hidden" on the main page container, in Root)
  //     width 1200px
  //     margin-left 50%
  //     transform translateX(-50%)

  .app-screenshots
    padding var(--app-screenshots-padding)
    margin-top 40px
    overflow hidden
    background $boldYellow

    .outer-wrapper
      width var(--app-screenshots-outer-wrapper-width)

      .inner-wrapper
        position relative
        display flex
        flex-direction row-reverse

        .browser
          position relative
          width var(--app-screenshots-browser-width)
          background var(--app-screenshots-devices-bg-color)
          // slightly bigger border-radius then top-bar and browser-content
          // to make sure, box-shadow doesn't create a harsh line at the shadow start
          border-radius calc(var(--app-screenshots-browser-top-bar-border-radius) + 2px)
          box-shadow var(--app-screenshots-box-sdw)

          .top-bar
            position var(--app-screenshots-browser-top-bar-position)
            height var(--app-screenshots-browser-top-bar-height)
            padding 0
            background var(--app-screenshots-devices-bg-color)
            border-radius var(--app-screenshots-browser-top-bar-border-radius) var(--app-screenshots-browser-top-bar-border-radius) 0 0

            .traffic-light
              width var(--app-screenshots-browser-traffic-light-size)
              height var(--app-screenshots-browser-traffic-light-size)
              margin-left var(--app-screenshots-browser-traffic-light-margin)
              border-radius 50%

              &:nth-child(1)
                margin-left 16px
                margin-left calc(var(--app-screenshots-browser-traffic-light-size) + 5px)
                background #FF5E58

              &:nth-child(2)
                background #FFBF30

              &:nth-child(3)
                background #27C840

          .browser-content
            border-radius 0 0 var(--app-screenshots-browser-top-bar-border-radius) var(--app-screenshots-browser-top-bar-border-radius)

        .phone-wrapper
          position var(--app-screenshots-phone-position)
          right var(--app-screenshots-phone-right)
          bottom var(--app-screenshots-phone-bottom)
          z-index 1
          width var(--app-screenshots-phone-width)
          margin-right 20px

          .device-outer
            position relative
            width 100%
            filter drop-shadow(0 3px 14px rgba(0, 0, 0, 0.2))
            transform translateZ(0)

            .device-content
              position absolute
              top 2.7%
              left 5.8%
              width 88.4%
              height 94.6%
              overflow hidden
              background var(--app-screenshots-devices-bg-color)
              border-radius 10px
              // prevent 1px gaps between frame and screenshot in some resolutions
              box-shadow 0px 0px 0px 1px #3f3a2d

            .device-frame
              position relative
              z-index 2
              width 100%
              height 0
              padding-bottom 200%
              background-image url('./images/iphone-x-frame.svg')
              background-repeat no-repeat
              background-position center
              background-size cover

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

  .feature
    display grid
    grid-template-columns 1fr
    grid-gap 15px
    align-items center
    justify-items end

    .feature__img
      width 100%
      min-width 220px
      @media (min-width: 600px)
        max-width 260px

    @media (min-width: 600px)
      grid-template-columns 1.35fr 0.65fr
      grid-gap 48px

      &.swap
        grid-template-columns 0.65fr 1.35fr

        .feature__img
          order -1000
</style>
