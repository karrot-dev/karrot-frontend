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
              :to="{ name: 'offerCreate' }"
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
                    :user="getUserRef(offer.user).value"
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
// For some reason need *some* vue import or get this error:
//   ReferenceError: _vue is not defined
// eslint-disable-next-line no-unused-vars
import { ref } from 'vue'

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

import ProfilePicture from '@/users/components/ProfilePicture'
import KSpinner from '@/utils/components/KSpinner'
import DateAsWords from '@/utils/components/DateAsWords'

import { DEFAULT_STATUS, useOfferListQuery } from '@/offers/queries'

import { useRouteParam } from '@/utils/mixins/bindRoute'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUsers } from '@/users/queries'
import { useCurrentGroupIdRef } from '@/group/queries'

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

const group = useCurrentGroupIdRef()
const status = useRouteParam('status', DEFAULT_STATUS)

const { getUserRef } = useUsers()

const {
  isLoading,
  isFetching,
  hasNextPage,
  fetchNextPage,
  offers,
} = useOfferListQuery({ group, status })

async function maybeFetchMore (index, done) {
  if (!isFetching.value && hasNextPage.value) await fetchNextPage()
  done(!hasNextPage.value)
}

const route = useRoute()

function detailRouteFor (offerId) {
  return {
    name: 'offerDetail',
    params: { offerId },
    query: route.query,
  }
}

</script>
