<template>
  <KSpinner v-if="isLoading" />
  <div v-else-if="agreement">
    <h1 class="q-px-lg">
      {{ agreement.title }}
    </h1>
    <QCard>
      <div class="agreement-actions z-fab">
        <QBtn
          v-if="isEditor"
          small
          round
          icon="fas fa-pencil-alt"
          color="secondary"
          :to="{ name: 'agreementEdit', params: { agreementId: agreement.id } }"
        />
      </div>
      <QCardSection>
        <QList>
          <QItem v-if="isActive">
            <QItemSection side>
              <QIcon
                name="fas fa-handshake"
                color="secondary"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel>
                <strong>{{ $t('AGREEMENT.ACTIVE') }}</strong>
              </QItemLabel>
              <QItemLabel caption>
                {{ $t('AGREEMENT.SINCE_INFO', { date: $d(agreement.activeFrom, 'yearMonthDay') }) }}
              </QItemLabel>
            </QItemSection>
          </QItem>
          <QItem v-else>
            <QItemSection side>
              <QIcon
                name="fas fa-handshake"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel>
                <strong>Inactive</strong>
              </QItemLabel>
              <QItemLabel caption>
                <template v-if="agreement.activeTo && agreement.activeTo <= new Date()">
                  {{ $t('AGREEMENT.SINCE_INFO', { date: $d(agreement.activeTo, 'yearMonthDay') }) }}
                </template>
                <template v-else-if="agreement.activeFrom >= new Date()">
                  {{ $t('AGREEMENT.BECOMES_ACTIVE_INFO', { date: $d(agreement.activeFrom, 'yearMonthDay') }) }}
                </template>
              </QItemLabel>
            </QItemSection>
          </QItem>
          <QItem v-if="agreement.reviewAt">
            <QItemSection side>
              <QIcon
                name="fa fa-sync-alt"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel caption>
                {{ $t('AGREEMENT.REVIEW_AT') }}
              </QItemLabel>
              <QItemLabel>
                {{ $d(agreement.reviewAt, 'yearMonthDay') }}
              </QItemLabel>
            </QItemSection>
          </QItem>
          <QItem v-if="lastChangedBy">
            <QItemSection side>
              <QIcon
                name="fa fa-pencil-alt"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel caption>
                {{ $t('GLOBAL.LAST_CHANGED_BY') }}
              </QItemLabel>
              <QItemLabel>
                <RouterLink
                  :to="{ name: 'user', params: { userId: lastChangedBy.id } }"
                  class="row q-mt-xs"
                >
                  <ProfilePicture
                    :user="lastChangedBy"
                    :size="16"
                  />
                  <strong class="q-pl-sm">
                    {{ lastChangedBy.displayName }}
                  </strong>
                </RouterLink>
              </QItemLabel>
            </QItemSection>
          </QItem>
        </QList>
        <template v-if="agreement.summary">
          <QBanner class="bg-yellow-2 q-pa-md q-mt-md">
            <div class="text-caption q-mb-sm">
              {{ $t('AGREEMENT.SUMMARY') }}
            </div>
            <Markdown
              :source="agreement.summary"
              style="font-size: 120%;"
            />
          </QBanner>
        </template>
      </QCardSection>
    </QCard>
    <QCard>
      <QCardSection>
        <div class="text-caption">
          {{ $t('AGREEMENT.CONTENT') }}
        </div>
        <Markdown
          :source="agreement.content"
          class="q-pa-lg"
        />
      </QCardSection>
    </QCard>
    <QCard v-if="history.length > 0">
      <QCardSection>
        <div class="text-caption q-mb-md">
          {{ $t('GROUP.HISTORY') }}
        </div>
        <HistoryList
          :history="history"
        />
      </QCardSection>
    </QCard>
  </div>
</template>

<script setup>
import {
  QCard,
  QCardSection,
  QBanner,
  QIcon,
  QBtn,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'
import { computed } from 'vue'

import { useAgreementHelpers } from '@/agreements/helpers'
import { useActiveAgreementService } from '@/agreements/services'
import { useCurrentGroupService } from '@/group/services'
import { useHistoryListQuery } from '@/history/queries'
import { useUserService } from '@/users/services'

import HistoryList from '@/history/components/HistoryList.vue'
import ProfilePicture from '@/users/components/ProfilePicture.vue'
import KSpinner from '@/utils/components/KSpinner.vue'
import Markdown from '@/utils/components/Markdown.vue'

const {
  agreementId,
  agreement,
  isLoading,
} = useActiveAgreementService()

const { getUserById } = useUserService()

const { getAgreementIsActive } = useAgreementHelpers()

const isActive = computed(() => agreement.value && getAgreementIsActive(agreement.value))

const { isEditor } = useCurrentGroupService()

const lastChangedBy = computed(() => agreement.value?.lastChangedBy && getUserById(agreement.value.lastChangedBy))

const { history } = useHistoryListQuery({ agreementId })

</script>

<style scoped lang="sass">
.agreement-actions
  position: absolute
  top: -24px
  right: 10px
</style>
