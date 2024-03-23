<template>
  <KarrotSlot
    name="about"
    @close="$emit('close')"
  >
    <div
      class="bg-white q-pa-md"
    >
      <div class="k-logo-container row no-wrap items-center">
        <RouterLink
          :to="'/'"
          class="logo self-start"
        >
          <KarrotLogo />
        </RouterLink>
        <h4
          v-t="'GLOBAL.ABOUT_KARROT'"
          class="col q-ma-none q-pl-md"
        />
      </div>
      <QList class="q-mt-md">
        <QItem
          tag="a"
          rel="noopener noreferrer"
          href="https://community.karrot.world/t/how-to-get-involved-onboarding-into-the-karrot-team/661"
          target="_blank"
        >
          <QItemSection side>
            <QIcon name="fas fa-users" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>
              <!-- this is in English because so far people working on Karrot are communicating in English only-->
              How to Get Involved
            </QItemLabel>
          </QItemSection>
        </QItem>

        <QItem
          tag="a"
          rel="noopener noreferrer"
          href="https://codeberg.com/karrot/karrot-frontend"
          target="_blank"
        >
          <QItemSection side>
            <QIcon name="fab fa-fw fa-github" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>
              {{ $t('GLOBAL.GITHUB_NOTE') }}
            </QItemLabel>
            <QItemLabel caption>
              {{ $t('SIDENAV.GIT_SUB') }}
            </QItemLabel>
          </QItemSection>
        </QItem>

        <QItem
          tag="a"
          rel="noopener noreferrer"
          href="https://fosstodon.org/@karrot"
          target="_blank"
        >
          <QItemSection side>
            <QIcon name="fab fa-fw fa-mastodon" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>
              Mastodon
            </QItemLabel>
          </QItemSection>
        </QItem>

        <QItem
          tag="a"
          rel="noopener noreferrer"
          href="https://foodsaving.world"
          target="_blank"
        >
          <QItemSection side>
            <QIcon name="fas fa-fw fa-globe" />
          </QItemSection>

          <QItemSection>
            <QItemLabel>
              Info
            </QItemLabel>
            <QItemLabel caption>
              {{ $t('SIDENAV.INFO_SUB') }}
            </QItemLabel>
          </QItemSection>
        </QItem>

        <QItem
          tag="a"
          rel="noopener noreferrer"
          href="mailto:info@karrot.world"
        >
          <QItemSection side>
            <QIcon name="fas fa-fw fa-envelope" />
          </QItemSection>

          <QItemSection>
            <QItemLabel>
              info@karrot.world
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QList>

      <div class="text-center k-about-footer">
        karrot
        <template v-if="release">
          <a
            v-if="release.href"
            :href="release.href"
            target="_blank"
            rel="noopener"
          >
            {{ release.name }}
          </a>
          <span v-else>
            {{ release.name }}
          </span>
        </template>
        <br><br>
        made with
        <i class="fas fa-heart text-red" />
        by
        <a
          href="https://foodsaving.world"
          target="_blank"
          rel="noopener"
        >
          foodsaving worldwide
        </a>
      </div>

      <div class="row justify-end q-mt-sm">
        <QBtn
          flat
          :label="$t('BUTTON.CLOSE')"
          @click="$emit('close')"
        />
      </div>
    </div>
  </KarrotSlot>
</template>

<script setup>
import {
  QBtn,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
} from 'quasar'
import { computed } from 'vue'

import KarrotSlot from '@/base/components/KarrotSlot.vue'
import KarrotLogo from '@/logo/components/KarrotLogo.vue'

defineEmits(['close'])

const release = computed(() => {
  console.log('kc', process.env.KARROT_COMMIT)
  if (/^v[0-9]/.test(process.env.KARROT_VERSION)) {
    // A tag!
    return {
      name: process.env.KARROT_VERSION,
      href: `https://codeberg.org/karrot/karrot/releases/tag/${process.env.KARROT_VERSION}`,
    }
  }
  else if (process.env.KARROT_COMMIT !== 'unknown') {
    // A commit
    return {
      name: process.env.KARROT_VERSION || process.env.KARROT_COMMIT.substring(0, 10),
      href: `https://codeberg.org/karrot/karrot-frontend/commit/${process.env.KARROT_COMMIT}`,
    }
  }
  // Something else!
  return {
    name: process.env.KARROT_VERSION || 'unknown',
  }
})
</script>

<style scoped lang="sass">
.k-logo-container
  height: 75px

  .logo
    width: 62px
    height: 62px

  > div
    height: 80px
    filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, .7))

.k-about-footer
  margin-top: 50px
</style>
