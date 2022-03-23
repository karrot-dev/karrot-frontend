<template>
  <div class="landing sdw">
    <div class="hero-wrapper row items-center q-pb-xl">
      <div class="col">
        <h1 v-t="'ABOUT_KARROT.TITLE'" />
        <KLandingButtons align-left-on-bigger-screens />
      </div>
      <div class="col-auto text-center">
        <img
          :src="logo"
          :alt="$t('GLOBAL.LOGO_ALT')"
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
              :sizes="images.browser.sizes"
              :srcset="images.browser.srcset"
              :src="images.browser.src"
              :ratio="images.browser.ratio"
              :alt="images.browser.alt"
              class="browser-content"
              no-spinner
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
                  :sizes="images.phone.sizes"
                  :srcset="images.phone.srcset"
                  :src="images.phone.src"
                  :ratio="images.phone.ratio"
                  :alt="images.phone.alt"
                  no-spinner
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
          v-for="(image, idx) in images.randomImgs"
          :key="`random-image-${idx}`"
          class="col-4"
        >
          <QImg
            :sizes="image.sizes"
            :srcset="image.srcset"
            :src="image.src"
            :ratio="image.ratio"
            :alt="image.alt"
            class="img sdw"
          />
        </div>
      </div>
    </section>

    <section>
      <div
        v-for="(feature, idx) in images.features"
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
            :sizes="feature.sizes"
            :srcset="feature.srcset"
            :src="feature.src"
            :ratio="feature.ratio"
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
        @preview="arg => preview(arg)"
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
            :alt="$t('GLOBAL.LOGO_ALT')"
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
            <i18n-t
              :keypath="`ABOUT_KARROT.SECTIONS.${item}.DESCRIPTION`"
              tag="span"
            >
              <template #code>
                <a
                  href="https://github.com/yunity/karrot-frontend"
                >GitHub</a>
              </template>
              <template #forum>
                <a
                  v-t="'ABOUT_KARROT.LINKS.FORUM'"
                  href="https://community.karrot.world"
                />
              </template>
              <template #chat>
                <a
                  v-t="'ABOUT_KARROT.LINKS.CHAT'"
                  href="https://chat.karrot.world/channel/karrot-dev"
                />
              </template>
              <template #translations>
                <a
                  href="https://www.transifex.com/yunity-1/karrot/frontend/"
                >Transifex</a>
              </template>
            </i18n-t>
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
import { dirNames, dirs } from '@/base/images-config.mjs'
import generatedImages from '@/base/images.json'

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
        .sort((a, b) => b.memberCount - a.memberCount)
    },
  },
  created () {
    this.logo = logo
    this.images = this.getImages()
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
    getImages () {
      Object.values(dirNames).forEach(dirName => {
        generatedImages[dirName] = this.enrichImages(dirName)
      })

      return {
        browser: generatedImages[dirNames.APP_SCREENSHOTS_BROWSER][0],
        phone: generatedImages[dirNames.APP_SCREENSHOTS_PHONE][0],
        features: generatedImages[dirNames.FEATURE_SCREENSHOTS],
        randomImgs: generatedImages[dirNames.RANDOM_IMGS],
      }
    },
    enrichImages (dirName) {
      const widths = dirs[dirName].widths
      const images = generatedImages[dirName].map(img => {
        const srcset = widths.reduce((acc, curr, index) => {
          const divider = index < widths.length - 1 ? ', ' : ''
          const currWidth = curr.toString()
          const entry = this.requireImage({
            fileName: img.baseFileName,
            ext: img.ext,
            width: currWidth,
            dirName,
          }) + ` ${currWidth}w`
          return acc + entry + divider
        }, '')

        const enrichedImg = {
          ...img,
          alt: img.baseFileName.replace(/-/g, ' '),
          sizes: dirs[dirName].sizes.replace(/\s+/g, ''), // remove whitespaces and line-breaks
          srcset,
          src: this.requireImage({
            fileName: img.baseFileName,
            ext: img.ext,
            width: dirs[dirName].maxWidth.toString(),
            dirName,
          }),
        }

        if (img.baseFileName === 'karrot-feature-groups') {
          enrichedImg.ident = 'GROUPS'
          enrichedImg.extendOffsetPx = '8'
        }
        else if (img.baseFileName === 'karrot-feature-activities') {
          enrichedImg.ident = 'ACTIVITIES'
          enrichedImg.extendOffsetPx = '0'
        }
        else if (img.baseFileName === 'karrot-feature-offers') {
          enrichedImg.ident = 'OFFERS'
          enrichedImg.extendOffsetPx = '8'
        }

        return enrichedImg
      })

      let sortingArr

      if (dirName === dirNames.FEATURE_SCREENSHOTS) {
        sortingArr = [
          'karrot-feature-groups',
          'karrot-feature-activities',
          'karrot-feature-offers',
        ]
      }
      else if (dirName === dirNames.RANDOM_IMGS) {
        sortingArr = [
          'oestersund-saved-food',
          'oestersund-volunteers',
          'bike-workshop',
          'solikyl-savers',
          'fsmaastricht-fairshare',
          'fsmaastricht-foodsavers',
        ]
      }

      if (sortingArr) {
        images.sort((a, b) => {
          const indexA = sortingArr.indexOf(a.baseFileName)
          const indexB = sortingArr.indexOf(b.baseFileName)
          if (indexA < indexB) {
            return -1
          }
          else if (indexA > indexB) {
            return 1
          }
          else {
            return 0
          }
        })
      }

      return images
    },
    requireImage ({ fileName, ext, width, dirName } = {}) {
      // use "?disableinline" to disable inlining of small images as base64 which would result in a huge js-chunk
      // see: https://github.com/karrot-dev/karrot-frontend/issues/2370
      return require(`@/base/pages/images/${dirName}/${fileName}-${width}${ext}?disableinline`)
    },
  },
}
</script>

<style scoped lang="sass">
$box-shadow-color: rgb(84, 84, 84)

.landing
  --h1-fontsize: 1.75rem
  --h1-letterspacing: -0.005em
  --h2-fontsize: 1.375rem
  --paragraph-fontsize: 1.0625rem
  --landing-padding-top: 30px
  --landing-padding-x: 20px
  --img-border-radius: 4px
  --app-screenshots-padding: 25px 0 25px var(--landing-padding-x)
  --app-screenshots-box-sdw: 0 3px 22px -3px rgba(0, 0, 0, 0.2)
  --app-screenshots-devices-bg-color: #FFF5D9
  --app-screenshots-outer-wrapper-width: 150%
  --app-screenshots-browser-top-bar-position: absolute
  --app-screenshots-browser-top-bar-height: 18px
  --app-screenshots-browser-top-bar-border-radius: 10px
  --app-screenshots-browser-traffic-light-size: 6px
  --app-screenshots-browser-traffic-light-margin: 3px
  --app-screenshots-browser-width: 132%
  --app-screenshots-browser-img-bg-sizing: contain
  --app-screenshots-browser-img-position-y: var(--app-screenshots-browser-top-bar-height)
  --app-screenshots-browser-img-offset: 25px
  --app-screenshots-phone-position: relative
  --app-screenshots-phone-width: 43%
  --app-screenshots-phone-right: unset
  --app-screenshots-phone-bottom: unset

  @media (min-width: 410px)
    --h1-fontsize: 2.375rem

  @media (min-width: 500px)
    --landing-padding-top: 45px
    --landing-padding-x: 40px
    --app-screenshots-browser-top-bar-height: 24px
    --app-screenshots-browser-top-bar-border-radius: 13px
    --app-screenshots-browser-traffic-light-size: 8px
    --app-screenshots-browser-traffic-light-margin: 4px
    --app-screenshots-browser-img-offset: 34px

  @media (min-width: 600px)
    --h1-fontsize: 2.75rem
    --h1-letterspacing: -0.025em
    --h2-fontsize: 1.875rem
    --paragraph-fontsize: 1.25rem

  @media (min-width: 700px)
    --app-screenshots-padding: 55px 120px 65px var(--landing-padding-x)
    --app-screenshots-outer-wrapper-width: 100%
    --app-screenshots-browser-top-bar-position: relative
    --app-screenshots-browser-top-bar-height: 34px
    --app-screenshots-browser-top-bar-border-radius: 15px
    --app-screenshots-browser-traffic-light-size: 10px
    --app-screenshots-browser-traffic-light-margin: 6px
    --app-screenshots-browser-width: 100%
    --app-screenshots-browser-img-bg-sizing: cover
    --app-screenshots-browser-img-position-y: 50%
    --app-screenshots-browser-img-offset: 0px
    --app-screenshots-phone-position: absolute
    --app-screenshots-phone-width: 32.5%
    --app-screenshots-phone-right: -105px
    --app-screenshots-phone-bottom: -27px

  @media (min-width: 850px)
    --h1-fontsize: 3.125rem
    --app-screenshots-phone-width: 31.023%

  @media (min-width: 1050px)
    --landing-padding-top: 60px
    --landing-padding-x: 100px
    --app-screenshots-padding: 55px 120px 65px 50px

.sdw,
::v-deep(.groupPreviewCard)
  box-shadow: 0 2px 15px rgba($box-shadow-color, 0.07), 0 1px 3px rgba($box-shadow-color, 0.15)

.landing
  width: 1050px
  max-width: 100vw
  padding: var(--landing-padding-top) var(--landing-padding-x) 40px
  margin: 0 auto
  overflow: hidden
  color: #111111
  background: white

  .hero-wrapper
    flex-direction: column-reverse
    @media (min-width: 600px)
      flex-direction: row

    h1
      margin: 16px 0 0
      font-size: var(--h1-fontsize)
      font-weight: 600
      line-height: 1.2
      text-align: center
      letter-spacing: var(--h1-letterspacing)

      @media (min-width: 600px)
        margin: 0
        text-align: left

    .hero-logo
      width: 20vw
      min-width: 120px
      max-width: 120px
      @media (min-width: 600px)
        min-width: 160px
        max-width: 200px
        padding-left: 10px
      @media (min-width: 850px)
        margin-right: 45px
      @media (min-width: 1050px)
        margin-right: 25px

  .app-screenshots
    padding: var(--app-screenshots-padding)
    margin: 40px calc(var(--landing-padding-x) * -1) 0
    overflow: hidden
    background: $boldYellow

    .outer-wrapper
      width: var(--app-screenshots-outer-wrapper-width)

      .inner-wrapper
        position: relative
        display: flex
        flex-direction: row-reverse

        .browser
          position: relative
          width: var(--app-screenshots-browser-width)
          background: var(--app-screenshots-devices-bg-color)
          // slightly bigger border-radius then top-bar and browser-content
          // to make sure, box-shadow doesn't create a harsh line at the shadow start
          border-radius: calc(var(--app-screenshots-browser-top-bar-border-radius) + 2px)
          box-shadow: var(--app-screenshots-box-sdw)

          .top-bar
            position: var(--app-screenshots-browser-top-bar-position)
            height: var(--app-screenshots-browser-top-bar-height)
            padding: 0
            background: var(--app-screenshots-devices-bg-color)
            border-radius: var(--app-screenshots-browser-top-bar-border-radius) var(--app-screenshots-browser-top-bar-border-radius) 0 0

            .traffic-light
              width: var(--app-screenshots-browser-traffic-light-size)
              height: var(--app-screenshots-browser-traffic-light-size)
              margin-left: var(--app-screenshots-browser-traffic-light-margin)
              border-radius: 50%

              &:nth-child(1)
                margin-left: 16px
                margin-left: calc(var(--app-screenshots-browser-traffic-light-size) + 5px)
                background: #FF5E58

              &:nth-child(2)
                background: #FFBF30

              &:nth-child(3)
                background: #27C840

          .browser-content
            border-radius: 0 0 var(--app-screenshots-browser-top-bar-border-radius) var(--app-screenshots-browser-top-bar-border-radius)

        .phone-wrapper
          position: var(--app-screenshots-phone-position)
          right: var(--app-screenshots-phone-right)
          bottom: var(--app-screenshots-phone-bottom)
          z-index: 1
          width: var(--app-screenshots-phone-width)
          margin-right: 20px

          .device-outer
            position: relative
            width: 100%
            filter: drop-shadow(0 3px 14px rgba(0, 0, 0, 0.2))
            transform: translateZ(0)

            .device-content
              position: absolute
              top: 2.7%
              left: 5.8%
              width: 88.4%
              height: 94.6%
              overflow: hidden
              background: var(--app-screenshots-devices-bg-color)
              border-radius: 10px
              // prevent 1px gaps between frame and screenshot in some resolutions
              box-shadow: 0px 0px 0px 1px #3f3a2d // same color as iPhone frame

            .device-frame
              position: relative
              z-index: 2
              width: 100%
              height: 0
              padding-bottom: 200%
              background-image: url('../assets/iphone-x-frame.svg')
              background-repeat: no-repeat
              background-position: center
              background-size: cover

  section
    padding: 30px 0
    margin: 30px 0
    border-bottom: 2px dotted $info

    &:last-child
      margin-bottom: 0
      border: none

    a
      text-decoration: underline
      text-underline-offset: 2px

  p
    margin: 8px 0
    font-size: var(--paragraph-fontsize)
    color: rgba(0, 0, 0, 0.74)

    @media (min-width: 600px)
      margin: 11px 0

  h2
    margin: 0 0 15px
    font-size: var(--h2-fontsize)
    font-weight: 800
    line-height: 1.3
    letter-spacing: var(--h2-letterspacing)

  .about-logo
    width: 50px
    height: 50px
    padding-bottom: 8px
    margin-right: 10px

  .random-images
    @media (min-width: 600px)
      // on wider screens, give them a bit more room to breathe
      padding: 0 40px

    .img
      border-radius: var(--img-border-radius)

  .feature
    display: grid
    grid-template-columns: 1fr
    grid-gap: 15px
    align-items: center
    justify-items: end

    .feature__img
      width: 100%
      min-width: 270px
      padding: 15px
      border-radius: var(--img-border-radius)
      box-shadow: 0 2px 8px rgba($box-shadow-color, 0.15), 0 1px 3px rgba($box-shadow-color, 0.15)
      @media (min-width: 1050px)
        max-width: 384px

    @media (min-width: 600px)
      --feature-offset-extend: 0px
      // make feature look cut-off at the side
      // use 'extendOffsetPx' on the vue image object to further shift a feature out of view
      // NOTE: all images on the same side should have the same extend value
      --feature-offset: calc(var(--landing-padding-x) * -1 - 15px - var(--feature-offset-extend))
      grid-template-areas: 'left right'
      grid-template-columns: 1.15fr 0.85fr
      grid-gap: calc(60px + var(--feature-offset-extend))
      margin-right: var(--feature-offset)

      .feature__content
        grid-area: left

      .feature__img
        grid-area: right

      &.swap
        grid-template-columns: 0.85fr 1.15fr
        margin-right: 0
        margin-left: var(--feature-offset)

        .feature__content
          grid-area: right

        .feature__img
          grid-area: left
</style>
