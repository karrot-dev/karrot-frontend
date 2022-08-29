<template>
  <div>
    <div
      class="row no-wrap items-center justify-between bg-white q-px-sm q-py-xs"
    >
      <QSelect
        v-model="status"
        :options="statusOptions"
        emit-value
        map-options
        outlined
        hide-bottom-space
        dense
      />
    </div>
    <KSpinner v-show="isLoading" />
    <QInfiniteScroll
      ref="infiniteScroll"
      :disable="!hasNextPage"
      @load="maybeFetchMore"
    >
      <div class="row">
        <div
          v-if="status === 'active' && !isLoading"
          class="col-md-4 col-6 new-offer"
        >
          <QCard>
            <QImg
              no-spinner
              no-transition
              :ratio="4/3"
            />
            <QItem style="min-height: 57px;" />
            <RouterLink
              class="absolute-center fit"
              :to="{ name: 'offerCreate', params: { groupId } }"
              :title="$t('OFFER.CREATE_TITLE')"
            >
              <QIcon
                size="5em"
                class="fit"
                name="fas fa-plus"
              />
            </RouterLink>
          </QCard>
        </div>
        <div
          v-for="offer in offers"
          :key="offer.id"
          v-measure
          class="col-md-4 col-6"
        >
          <RouterLink :to="detailRouteFor(offer.id)">
            <QCard
              class="cursor-pointer"
              :title="offer.name"
            >
              <QImg
                v-if="offer.images[0]"
                no-spinner
                no-transition
                :src="offer.images[0].imageUrls['600']"
                :ratio="4/3"
              />
              <QImg
                v-else
                no-spinner
                no-transition
                :ratio="4/3"
              >
                <QIcon
                  color="grey"
                  size="xl"
                  class="fit"
                  name="fas fa-gift"
                />
              </QImg>
              <QItem clickable>
                <QItemSection avatar>
                  <ProfilePicture
                    :user="getUserById(offer.user)"
                    :membership="getMembership(offer.user)"
                    :size="36"
                  />
                </QItemSection>
                <QItemSection>
                  <QItemLabel class="ellipsis full-width">
                    {{ offer.name }}
                  </QItemLabel>
                  <QItemLabel class="ellipsis full-width">
                    <DateAsWords
                      :date="offer.createdAt"
                      class="text-caption"
                    />
                  </QItemLabel>
                </QItemSection>
              </QItem>
            </QCard>
          </RouterLink>
        </div>
      </div>
    </QInfiniteScroll>
  </div>
</template>

<script setup>
import {
  QIcon,
  QSelect,
  QCard,
  QItem,
  QItemSection,
  QItemLabel,
  QImg,
  QInfiniteScroll,
} from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useCurrentGroupService } from '@/group/services'
import { DEFAULT_STATUS, useOfferListQuery } from '@/offers/queries'
import { useUserService } from '@/users/services'
import { useQueryParams } from '@/utils/mixins/bindRoute'

import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'
import KSpinner from '@/utils/components/KSpinner'

const { t } = useI18n()

const statusOptions = [
  {
    label: t('OFFER.FILTER.STATUS.ACTIVE'),
    value: 'active',
  },
  {
    label: t('OFFER.FILTER.STATUS.ARCHIVED'),
    value: 'archived',
  },
]

const { groupId, getMembership } = useCurrentGroupService()

const { getUserById } = useUserService()

const { status } = useQueryParams({
  status: DEFAULT_STATUS,
})

const {
  isLoading,
  isFetching,
  hasNextPage,
  fetchNextPage,
  offers,
} = useOfferListQuery({ groupId, status })

async function maybeFetchMore (index, done) {
  if (!isFetching.value && hasNextPage.value) await fetchNextPage()
  done(!hasNextPage.value)
}

const route = useRoute()

function detailRouteFor (offerId) {
  return {
    name: 'offerDetail',
    params: { groupId: groupId.value, offerId },
    query: route.query,
  }
}

</script>
