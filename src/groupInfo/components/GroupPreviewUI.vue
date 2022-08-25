<template>
  <div v-if="group">
    <QCard class="shadow-6">
      <div
        class="photo text-white relative-position row justify-center"
        :class="{ hasPhoto: group.hasPhoto }"
      >
        <img
          v-if="group.hasPhoto"
          :src="group.photoUrls['600']"
        >
        <RandomArt
          v-else
          :seed="group.id"
          type="circles"
          class="full-height"
        />
        <div class="absolute-bottom k-media-overlay q-pa-md">
          <div
            class="ellipsis"
          >
            <span
              v-measure
              class="row group items-start text-h6"
            >
              {{ group.name }}
              <QIcon
                v-if="group.status === 'playground'"
                name="fas fa-child"
              />
            </span>
            <span class="text-subtitle2">
              {{ group.memberCount }} {{ $tc('JOINGROUP.NUM_MEMBERS', group.memberCount) }}
            </span>
          </div>
        </div>
      </div>
      <QCardSection>
        <div
          v-if="group.publicDescription"
        >
          <Markdown :source="group.publicDescription" />
        </div>
        <span
          v-else
          class="text-italic"
        >
          {{ $t('JOINGROUP.NO_PUBLIC_DESCRIPTION') }}
        </span>
      </QCardSection>
      <QSeparator />
      <QCardActions
        :class="application ? 'bg-blue text-white' : ''"
      >
        <div style="width: 100%">
          <template v-if="group.memberCount === 0 && !application">
            <QBanner class="bg-info">
              {{ $t('JOINGROUP.ARCHIVED_NOTE' ) }}
              <template #avatar>
                <QIcon
                  name="info"
                  style="font-size: 24px"
                />
              </template>
            </QBanner>
          </template>
          <template v-else-if="isLoggedIn">
            <template v-if="!group.isMember">
              <QBanner
                v-if="!application"
                class="bg-info"
              >
                {{ $t('JOINGROUP.PROFILE_NOTE' ) }}
                <template #avatar>
                  <QIcon
                    name="info"
                    style="font-size: 24px"
                  />
                </template>
              </QBanner>
              <div
                v-if="application"
                class="row q-pa-xs q-gutter-md"
              >
                <div class="col-sm-grow col-xs-12 self-center">
                  <QIcon
                    name="info"
                    color="white"
                    style="font-size: 24px"
                  />
                  {{ $t('JOINGROUP.APPLICATION_PENDING' ) }}
                </div>
                <QBtn
                  class="col-auto col-xs-grow"
                  flat
                  dense
                  :label="$t('BUTTON.OPEN')"
                  icon="fas fa-fw fa-comments"
                  @click="openApplication(application)"
                />
                <QBtn
                  class="col-auto col-xs-grow"
                  flat
                  dense
                  :label="$t('BUTTON.WITHDRAW')"
                  icon="fas fa-fw fa-trash-alt"
                  @click="withdraw"
                />
              </div>
              <QBtn
                v-if="user && !user.mailVerified"
                color="secondary"
                class="float-right q-ma-xs"
                :to="{ name: 'settings', hash: '#change-email' }"
              >
                {{ $t('JOINGROUP.VERIFY_EMAIL_ADDRESS') }}
              </QBtn>
              <QBtn
                v-if="user && user.mailVerified && !application"
                color="secondary"
                class="float-right q-ma-xs"
                :to="{ name: 'applicationForm', params: { groupPreviewId: group.id } }"
              >
                {{ $t('BUTTON.APPLY') }}
              </QBtn>
            </template>
            <QBtn
              v-else
              flat
              :to="{ name: 'group', params: { groupId: group.id } }"
            >
              <QIcon name="fas fa-home" />
              <QTooltip>
                {{ $t('GROUPINFO.MEMBER_VIEW') }}
              </QTooltip>
            </QBtn>
          </template>

          <QBtn
            v-else
            color="secondary"
            class="float-right q-ma-xs"
            :to="{ name: 'signup' }"
          >
            {{ $t('JOINGROUP.SIGNUP_OR_LOGIN') }}
          </QBtn>
        </div>
      </QCardActions>
    </QCard>
  </div>
</template>

<script>
import {
  Dialog,
  QTooltip,
  QCard,
  QCardSection,
  QSeparator,
  QCardActions,
  QBtn,
  QIcon,
  QBanner,
} from 'quasar'

import { useDetailService } from '@/messages/services'

import Markdown from '@/utils/components/Markdown'
import RandomArt from '@/utils/components/RandomArt'

export default {
  components: {
    QCard,
    QCardSection,
    QSeparator,
    QCardActions,
    QBtn,
    QIcon,
    QTooltip,
    QBanner,
    Markdown,
    RandomArt,
  },
  props: {
    group: {
      default: null,
      type: Object,
    },
    isLoggedIn: {
      default: false,
      type: Boolean,
    },
    user: {
      default: null,
      type: Object,
    },
    application: {
      default: null,
      type: Object,
    },
  },
  emits: [
    'join',
    'withdraw',
  ],
  setup () {
    const { openApplication } = useDetailService()

    return {
      openApplication,
    }
  },
  methods: {
    withdraw () {
      Dialog.create({
        title: this.$t('JOINGROUP.WITHDRAW_CONFIRMATION_HEADER'),
        message: this.$t('JOINGROUP.WITHDRAW_CONFIRMATION_TEXT', { groupName: this.group.name }),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .onOk(() => this.$emit('withdraw', this.application.id))
    },
  },
}
</script>

<style scoped lang="sass">
::v-deep(.q-banner__avatar)
  align-self: center

.q-card *
  overflow: hidden

.photo
  &.hasPhoto
    height: 350px

  &:not(.hasPhoto)
    height: 140px

  img
    width: auto
    max-width: 100%
    max-height: 100%
    margin: 0 auto

  .k-media-overlay
    background-color: rgba(0, 0, 0, 0.47)
</style>
