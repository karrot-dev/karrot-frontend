<template>
  <div
    class="k-about"
    @click.native="$emit('close')"
  >
    <div class="layout-padding">
      <div class="k-logo-container">
        <RouterLink :to="'/'">
          <KarrotLogo />
        </RouterLink>
        <h4 v-t="'GLOBAL.ABOUT_KARROT'" />
      </div>

      <QList
        no-border
        link
      >
        <QItem
          link
          tag="a"
          rel="nofollow noopener noreferrer"
          href="https://community.foodsaving.world"
        >
          <QItemSide>
            <i class="fab fa-fw fa-discourse" />
          </QItemSide>
          <QItemMain
            label="Community"
            :sublabel="$t('GLOBAL.COMMUNITY_NOTE')"
          />
        </QItem>

        <QItem
          link
          tag="a"
          rel="nofollow noopener noreferrer"
          href="https://github.com/yunity/karrot-frontend"
        >
          <QItemSide>
            <i class="fab fa-fw fa-github" />
          </QItemSide>
          <QItemMain
            :label="$t('GLOBAL.GITHUB_NOTE')"
            :sublabel="$t('SIDENAV.GIT_SUB')"
          />
        </QItem>

        <QItem
          link
          tag="a"
          rel="nofollow noopener noreferrer"
          href="https://foodsaving.world"
        >
          <QItemSide>
            <i class="fas fa-fw fa-globe" />
          </QItemSide>
          <QItemMain
            label="Info"
            :sublabel="$t('SIDENAV.INFO_SUB')"
          />
        </QItem>

        <QItem
          link
          tag="a"
          rel="nofollow noopener noreferrer"
          href="https://blog.karrot.world"
        >
          <QItemSide>
            <i class="far fa-newspaper" />
          </QItemSide>
          <QItemMain
            label="Blog"
            :sublabel="$t('SIDENAV.BLOG_SUB')"
          />
        </QItem>

        <QItem
          link
          tag="a"
          rel="nofollow noopener noreferrer"
          href="mailto:karrot@foodsaving.world"
        >
          <QItemSide>
            <i class="fas fa-fw fa-envelope" />
          </QItemSide>
          <QItemMain
            label="karrot@foodsaving.world"
          />
        </QItem>
      </QList>

      <div class="text-center k-about-footer">
        karrot
        <a
          v-if="release"
          :href="release.link"
          target="_blank"
          rel="noopener"
        >
          {{ release.name }}
        </a>
        <br><br>
        made with
        <i class="fas fa-heart love" />
        by
        <a
          href="https://foodsaving.world"
          target="_blank"
          rel="noopener"
        >
          foodsaving worldwide
        </a>
      </div>
    </div>

    <div class="row justify-end generic-padding">
      <QBtn
        flat
        :label="$t('BUTTON.CLOSE')"
        @click="$emit('close')"
      />
    </div>
  </div>
</template>

<script>
import KarrotLogo from '@/logo/components/KarrotLogo'
import {
  QBtn,
  QList,
  QItem,
  QItemSide,
  QItemMain,
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: {
    KarrotLogo,
    QBtn,
    QList,
    QItem,
    QItemSide,
    QItemMain,
  },
  computed: {
    ...mapGetters({
      deployed: 'about/deployed',
    }),
    release () {
      if (__ENV.DEV) {
        return {
          link: '',
          name: 'local dev',
        }
      }
      if (this.deployed) {
        if (this.deployed.env === 'production') {
          return {
            link: 'https://github.com/yunity/karrot-frontend/blob/master/CHANGELOG.md',
            name: this.deployed.date,
          }
        }
        if (this.deployed.env === 'development') {
          return {
            link: `https://github.com/yunity/karrot-frontend/tree/${this.deployed.commitSHA}`,
            name: this.deployed.date,
          }
        }
      }
      return {
        link: '',
        name: '',
      }
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.k-logo-container
  height 75px
  margin-bottom 15px
  > div
    height 80px
    filter: drop-shadow(0px 1px 1px rgba(0,0,0,.7) )
  h4
    display inline-block
    position relative
    bottom 15px
    padding-left 15px
.k-about-footer
  margin-top 50px
.love
  color red
</style>
