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
          alt="karrot logo"
          class="hero-logo"
        >
      </div>
    </div>

    <p v-t="'ABOUT_KARROT.SUBTITLE1'" />
    <p v-t="'ABOUT_KARROT.SUBTITLE2'" />

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
              :sizes="appScreenshots.browser.sources.sizes"
              :srcset="appScreenshots.browser.sources.srcset"
              :src="appScreenshots.browser.sources.src"
              :alt="appScreenshots.browser.alt"
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
                  :sizes="appScreenshots.phone.sources.sizes"
                  :srcset="appScreenshots.phone.sources.srcset"
                  :src="appScreenshots.phone.sources.src"
                  :alt="appScreenshots.phone.alt"
                  :ratio="750 / 1624"
                  no-default-spinner
                />
              </div>
              <div class="device-frame" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <section>
      <p v-t="'ABOUT_KARROT.VISION_INTRO'" />

      <div class="row random-images q-col-gutter-md q-mt-lg q-mb-xl">
        <div
          v-for="(image, idx) in randomImages"
          :key="`random-image-${idx}`"
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
        v-for="(feature, idx) in featureScreenshots"
        :key="feature.ident"
        class="feature"
        :class="[ idx === 0 ? 'q-mb-lg q-pb-lg' : 'q-my-lg q-py-lg', { swap: idx % 2 !== 0 }]"
        :style="{ '--feature-offset-extend': `${feature.extendOffsetPx}px`}"
      >
        <div class="feature__content">
          <h2 v-t="`ABOUT_KARROT.SECTIONS.${feature.ident}.TITLE`" />
          <p v-t="`ABOUT_KARROT.SECTIONS.${feature.ident}.SUBTITLE`" />
          <p v-t="`ABOUT_KARROT.SECTIONS.${feature.ident}.DESCRIPTION`" />
        </div>
        <div class="feature__img">
          <QImg
            :sizes="feature.sources.sizes"
            :srcset="feature.sources.srcset"
            :src="feature.sources.src"
            :ratio="feature.sources.physicalWidth / feature.sources.physicalHeight"
            :alt="$t(`ABOUT_KARROT.SECTIONS.${feature.ident}.TITLE`)"
          />
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
            alt="karrot logo"
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
import { getImgSources, presets } from '@/utils/srcsetUtils'

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
    this.appScreenshots = {
      browser: {
        alt: 'karrot browser screenshot',
        sources: getImgSources({
          baseFileName: 'karrot-screenshot-browser',
          physicalWidth: 1776,
          basePath: SCREENSHOTS_BASE_PATH,
          preset: presets.LANDINGPAGE_APP_SCREENSHOTS_BROWSER,
        }),
      },
      phone: {
        alt: 'karrot mobile screenshot',
        sources: getImgSources({
          baseFileName: 'karrot-screenshot-phone',
          physicalWidth: 490,
          basePath: SCREENSHOTS_BASE_PATH,
          preset: presets.LANDINGPAGE_APP_SCREENSHOTS_PHONE,
        }),
      },
    }
    this.randomImagesOptions = {
      basePath: SCREENSHOTS_BASE_PATH,
      preset: presets.LANDINGPAGE_RANDOM_IMGS,
    }
    this.randomImages = [
      {
        alt: 'oestersund saved food',
        sources: getImgSources({
          baseFileName: 'oestersund-saved-food',
          physicalWidth: 500,
          ...this.randomImagesOptions,
        }),
      },
      {
        alt: 'oestersund volunteers',
        sources: getImgSources({
          baseFileName: 'oestersund-volunteers',
          physicalWidth: 435,
          ...this.randomImagesOptions,
        }),
      },
      {
        alt: 'bike workshop',
        sources: getImgSources({
          baseFileName: 'bike-workshop',
          physicalWidth: 600,
          ...this.randomImagesOptions,
        }),
      },
      {
        alt: 'solikyl savers',
        sources: getImgSources({
          baseFileName: 'solikyl-savers',
          physicalWidth: 450,
          ...this.randomImagesOptions,
        }),
      },
      {
        alt: 'maastricht fairshare',
        sources: getImgSources({
          baseFileName: 'fsmaastricht-fairshare',
          physicalWidth: 480,
          ...this.randomImagesOptions,
        }),
      },
      {
        alt: 'maastricht foodsavers',
        sources: getImgSources({
          baseFileName: 'fsmaastricht-foodsavers',
          physicalWidth: 600,
          ...this.randomImagesOptions,
        }),
      },
      // NOTE: only for testing responsive sizes
      // {
      //   alt: 'responsive srcset test',
      //   sources: getImgSources({
      //     baseFileName: 'responsive-test',
      //     physicalWidth: 600,
      //     ...this.randomImagesOptions,
      //   }),
      // },
    ]
    this.featureScreenshotsOptions = {
      basePath: SCREENSHOTS_BASE_PATH,
      preset: presets.LANDINGPAGE_FEATURE_SCREENSHOTS,
    }
    this.featureScreenshots = [
      {
        ident: 'GROUPS',
        extendOffsetPx: '8',
        sources: getImgSources({
          baseFileName: 'karrot-feature-groups',
          physicalWidth: 978,
          physicalHeight: 978,
          ...this.featureScreenshotsOptions,
        }),
      },
      {
        ident: 'ACTIVITIES',
        extendOffsetPx: '0',
        sources: getImgSources({
          baseFileName: 'karrot-feature-activities',
          physicalWidth: 978,
          physicalHeight: 852,
          ...this.featureScreenshotsOptions,
        }),
      },
      {
        ident: 'OFFERS',
        extendOffsetPx: '8',
        sources: getImgSources({
          baseFileName: 'karrot-feature-offers',
          physicalWidth: 978,
          physicalHeight: 936,
          ...this.featureScreenshotsOptions,
        }),
      },
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
  --landing-padding-x 20px
  --app-screenshots-padding 25px 0 25px var(--landing-padding-x)
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
    --landing-padding-x 40px
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
    --app-screenshots-padding 55px 120px 65px var(--landing-padding-x)
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
    --landing-padding-x 100px
    --app-screenshots-padding 55px 120px 65px 50px

.sdw,
>>> .groupPreviewCard
  box-shadow 0 2px 15px rgba(84, 70, 35, 0.07), 0 1px 3px rgba(84, 70, 35, 0.15)

.landing
  width 1050px
  max-width 100vw
  padding var(--landing-padding-top) var(--landing-padding-x) 40px
  margin 0 auto
  overflow hidden
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
    margin 40px calc(var(--landing-padding-x) * -1) 0
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

  .random-images
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
      min-width 270px
      padding 15px
      border-radius 4px
      box-shadow 0 2px 8px rgba(84, 70, 35, 0.15), 0 1px 3px rgba(84, 70, 35, 0.15)
      @media (min-width: 1050px)
        max-width 384px

    @media (min-width: 600px)
      --feature-offset-extend 0px
      // make feature look cut-off at the side
      // use 'extendOffsetPx' on the vue image object to further shift a feature out of view
      // NOTE: all images on the same side should have the same extend value
      --feature-offset calc(var(--landing-padding-x) * -1 - 15px - var(--feature-offset-extend))
      grid-template-areas 'left right'
      grid-template-columns 1.15fr 0.85fr
      grid-gap calc(60px + var(--feature-offset-extend))
      margin-right var(--feature-offset)

      .feature__content
        grid-area left

      .feature__img
        grid-area right

      &.swap
        grid-template-columns 0.85fr 1.15fr
        margin-right 0
        margin-left var(--feature-offset)

        .feature__content
          grid-area right

        .feature__img
          grid-area left
</style>
