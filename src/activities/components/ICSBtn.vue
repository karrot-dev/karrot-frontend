<template>
  <QBtn
    v-if="icsUrl"
    color="secondary"
    icon="event"
    padding="4px 13px"
    rounded
    size="sm"
    unelevated
    :label="$t('ACTIVITYLIST.ICS_DIALOG.TITLE')"
    @click="icsDialog = true"
  />
  <CustomDialog
    v-model="icsDialog"
    width="500px"
    actions-align="between"
  >
    <template #title>
      {{ $t('ACTIVITYLIST.ICS_DIALOG.TITLE') }}
    </template>
    <template #message>
      <p>
        {{ $t('ACTIVITYLIST.ICS_DIALOG.INTRO') }}
      </p>

      <QList>
        <QItem class="q-pl-none">
          <QItemSection
            avatar
            top
          >
            <QAvatar
              color="primary"
              text-color="white"
              icon="file_download"
            />
          </QItemSection>

          <QItemSection>
            <QItemLabel>{{ $t('ACTIVITYLIST.ICS_DIALOG.DOWNLOAD_TITLE') }}</QItemLabel>
            <QItemLabel caption>
              {{ $t('ACTIVITYLIST.ICS_DIALOG.DOWNLOAD_TEXT') }}
            </QItemLabel>
            <QItemLabel>
              <QBtn
                color="primary"
                class="q-mt-xs"
                type="a"
                :href="icsUrl"
                :label="$t('ACTIVITYLIST.ICS_DIALOG.DOWNLOAD_BUTTON_LABEL')"
              />
            </QItemLabel>
          </QItemSection>
        </QItem>

        <QSeparator
          spaced
          style="margin-left: 56px;"
        />

        <QItem class="q-pl-none">
          <QItemSection
            avatar
            top
          >
            <QAvatar
              color="primary"
              text-color="white"
              icon="sync"
            />
          </QItemSection>

          <QItemSection>
            <QItemLabel>{{ $t('ACTIVITYLIST.ICS_DIALOG.SUBSCRIBE_TITLE') }}</QItemLabel>
            <QItemLabel caption>
              {{ $t('ACTIVITYLIST.ICS_DIALOG.SUBSCRIBE_TEXT') }}
            </QItemLabel>
            <QItemLabel>
              <QField
                filled
                class="q-mt-xs"
              >
                <template #append>
                  <QBtn
                    flat
                    rounded
                    icon="fas fa-copy"
                    @click="copyLink"
                  >
                    <q-tooltip
                      anchor="top middle"
                      self="bottom middle"
                    >
                      {{ $t('URL_CLICK_TO_COPY') }}
                    </q-tooltip>
                  </QBtn>
                </template>
                <template #control>
                  <!-- https://css-tricks.com/snippets/css/prevent-long-urls-from-breaking-out-of-container/ -->
                  <div
                    class="self-center full-width no-outline"
                    style="word-break: break-word; overflow-wrap: break-word;"
                  >
                    {{ icsUrl }}
                  </div>
                </template>
              </QField>
            </QItemLabel>
            <QItemLabel caption>
              {{ $t('ACTIVITYLIST.ICS_DIALOG.TOKEN_NOTICE') }}
            </QItemLabel>
            <QItemLabel>
              <QBtn
                icon="sync"
                size="sm"
                class="q-mt-sm"
                :label="$t('ACTIVITYLIST.ICS_DIALOG.RESET_TOKEN')"
                @click="refreshICSAuthToken"
              />
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QList>

      <QInnerLoading :showing="isLoading || isRefreshing" />
    </template>
    <template #actions>
      <a
        rel="noopener noreferrer"
        href="https://fileinfo.com/extension/ics"
        target="_blank"
        class="text-secondary q-pl-sm"
      >
        <QIcon
          name="link"
          size="xs"
          class="q-mr-xs"
        />
        {{ $t('ACTIVITYLIST.ICS_DIALOG.MORE_INFOS') }}
      </a>
      <QBtn
        v-close-popup
        flat
        color="primary"
        autofocus
        :label="$t('BUTTON.CLOSE')"
      />
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  copyToClipboard,
  QAvatar,
  QField,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
  QList,
  QBtn,
  QSeparator,
  QInnerLoading,
} from 'quasar'

import CustomDialog from '@/utils/components/CustomDialog'
import activities from '@/activities/api/activities'
import { useICSTokenQuery } from '@/activities/queries'
import { useICSRefreshTokenMutation } from '@/activities/mutations'
import { useToastService } from '@/alerts/services'

const props = defineProps({
  group: {
    type: Number,
    default: null,
  },
  joined: {
    type: Boolean,
    default: null,
  },
})

const icsDialog = ref(false)

const { showToast } = useToastService()

const {
  isLoading,
  token,
} = useICSTokenQuery({
  enabled: icsDialog,
})

const {
  mutate: refreshICSAuthToken,
  isLoading: isRefreshing,
} = useICSRefreshTokenMutation()

const icsUrl = computed(() => {
  return activities.icsUrl({
    group: props.group,
    joined: props.joined,
    token: token.value,
  })
})

function copyLink () {
  return copyToClipboard(icsUrl.value).then(() => {
    showToast({
      message: 'URL_COPIED_TOAST',
    })
  })
}

</script>
