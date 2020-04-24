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

    <section>
      <div
        v-for="(feature, idx) in features"
        :key="feature"
        class="q-my-md"
      >
        <div class="row q-my-lg q-py-lg">
          <div class="col-sm-8 q-px-lg self-center">
            <h2 v-t="`ABOUT_KARROT.SECTIONS.${feature}.TITLE`" />
            <p>
              <strong v-t="`ABOUT_KARROT.SECTIONS.${feature}.SUBTITLE`" />
            </p>
            <p v-t="`ABOUT_KARROT.SECTIONS.${feature}.DESCRIPTION`" />
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
        </div>
      </div>
    </section>

    <section v-if="groupsToShow.length > 0">
      <h2 v-t="'ABOUT_KARROT.EXISTING_GROUPS'" />

      <GroupGalleryCards
        :groups="groupsToShow"
        :is-logged-in="false"
        @preview="preview(arguments[0])"
      />

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
    </section>

    <section>
      <h2 v-t="'ABOUT_KARROT.SECTIONS.DEMOCRATIC.TITLE'" />
      <p v-t="'ABOUT_KARROT.SECTIONS.DEMOCRATIC.DESCRIPTION'" />
      <i18n
        path="ABOUT_KARROT.SECTIONS.DEMOCRATIC.DESCRIPTION2"
        tag="p"
      >
        <a
          slot="code"
          v-t="'ABOUT_KARROT.LINKS.CODE'"
          href="https://github.com/yunity/karrot-frontend"
        />
      </i18n>
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
                v-t="'ABOUT_KARROT.LINKS.CODE'"
                href="https://github.com/yunity/karrot-frontend"
              />
              <a
                slot="forum"
                v-t="'ABOUT_KARROT.LINKS.FORUM'"
                href="https://community.foodsaving.world"
              />
              <a
                slot="chat"
                v-t="'ABOUT_KARROT.LINKS.CHAT'"
                href="https://slackin.yunity.org"
              />
              <a
                slot="translations"
                v-t="'ABOUT_KARROT.LINKS.TRANSLATIONS'"
                href="https://www.transifex.com/yunity-1/karrot/frontend/"
              />
            </i18n>
          </p>
        </li>
      </ul>

      <p class="text-center">
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
    </section>
  </div>
</template>

<script>
import { QImg } from 'quasar'
import { mapGetters } from 'vuex'

import GroupGalleryCards from '@/groupInfo/components/GroupGalleryCards'
import logo from '@/logo/assets/carrot-logo.svg'
import screenshotPickups from './images/karrot-screenshot.png'

import screenshotGallery from './images/karrot-gallery.236x236.jpg'
import screenshotManagePickups from './images/karrot-manage-pickups.236x236.jpg'
import screenshotOffers from './images/karrot-offers.236x236.jpg'

import imageSavedFood from './images/oestersund-saved-food.200x200.jpg'
import imageVolunteers from './images/oestersund-volunteers.200x200.jpg'
import imageBikeworkshop from './images/bikeworkshop.200x200.jpg'
import imageSavers from './images/solikyl-savers.200x200.jpg'
import imageFairShare from './images/fsmaastricht-fairshare.200x200.jpg'
import imageSavers2 from './images/fsmaastricht-foodsavers.200x200.jpg'

import router from '@/base/router'

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
    GroupGalleryCards,
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
      pickups: screenshotPickups,
      GROUPS: screenshotGallery,
      ACTIVITIES: screenshotManagePickups,
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

// on wider screens alternate the left/right ordering
@media (min-width: 600px)
  .swap
    order -1000

</style>
