<template>
  <div v-if="agreement">
    <h1 class="q-px-lg">
      {{ agreement.title }}
    </h1>
    <QCard>
      <div class="agreement-actions z-max">
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
                <strong>Active</strong>
              </QItemLabel>
              <QItemLabel caption>
                since {{ $d(agreement.activeFrom, 'yearMonthDay') }}
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
                  since {{ $d(agreement.activeTo, 'yearMonthDay') }}
                </template>
                <template v-else-if="agreement.activeFrom >= new Date()">
                  becomes active {{ $d(agreement.activeFrom, 'yearMonthDay') }}
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
                Review date
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
                Last changed by
              </QItemLabel>
              <QItemLabel>
                <RouterLink :to="{ name: 'user', params: { userId: lastChangedBy.id } }">
                  <ProfilePicture
                    :user="lastChangedBy"
                    :size="16"
                    style="position: relative; top: 2px;"
                  />
                  <strong class="q-pl-xs">
                    {{ lastChangedBy.displayName }}
                  </strong>
                </RouterLink>
                <!--
                <ProfileChip
                  :user="lastChangedBy"
                  style="margin-left: -3px;"
                />
                -->
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
        <div class="text-caption q-mb-md">
          {{ $t('AGREEMENT.CONTENT') }}
        </div>
        <Markdown :source="agreement.content" />
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
import { useUserService } from '@/users/services'

import ProfilePicture from '@/users/components/ProfilePicture'
import Markdown from '@/utils/components/Markdown'

const { agreement } = useActiveAgreementService()
const { getUserById } = useUserService()

const { getAgreementIsActive } = useAgreementHelpers()

const isActive = computed(() => agreement.value && getAgreementIsActive(agreement.value))

const { isEditor } = useCurrentGroupService()

const lastChangedBy = computed(() => agreement.value?.lastChangedBy && getUserById(agreement.value.lastChangedBy))

</script>

<style scoped lang="sass">
.agreement-actions
  position: absolute
  top: -24px
  right: 10px
</style>
