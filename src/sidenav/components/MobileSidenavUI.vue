<template>
  <div>
    <SidenavBox
      v-if="currentUserId"
      :expandable="false"
    >
      <template slot="icon">
        <QIcon name="fas fa-fw fa-user-circle" />
      </template>

      <template slot="name">
        {{ $t('USERDATA.ACCOUNT') }}
      </template>

      <QList
        no-border
        link
      >
        <QItem
          item
          :to="{name: 'user', params: {userId: currentUserId}}"
        >
          <QItemSide>
            <i class="fas fa-user fa-fw"/>
          </QItemSide>
          <QItemMain :label="$t('TOPBAR.USERPROFILE')" />
        </QItem>

        <QItem
          item
          :to="{name: 'groupsGallery'}"
        >
          <QItemSide>
            <i class="fas fa-exchange-alt"/>
          </QItemSide>
          <QItemMain :label="$t('TOPBAR.CHANGE_GROUP')" />
        </QItem>

        <QItem
          item
          :to="{name: 'settings'}"
        >
          <QItemSide>
            <i class="fas fa-cog fa-fw"/>
          </QItemSide>
          <QItemMain :label="$t('SETTINGS.TITLE')" />
        </QItem>

        <QItem
          @click.native="$emit('logout'), $emit('toggleSidenav')"
        >
          <QItemSide>
            <i class="fas fa-sign-out-alt fa-fw"/>
          </QItemSide>
          <QItemMain :label="$t('TOPBAR.LOGOUT')" />
        </QItem>
      </QList>
    </SidenavBox>
    <SidenavBox :expandable="false">
      <template slot="icon">
        <QIcon name="fas fa-info-circle" />
      </template>

      <template slot="name">
        Info
      </template>

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
            <i class="fas fa-users"/>
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
          href="https://foodsaving.world"
        >
          <QItemSide>
            <i class="fas fa-paint-roller"/>
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
            <i class="far fa-newspaper"/>
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
          href="https://github.com/yunity/karrot-frontend"
        >
          <QItemSide>
            <i class="fab fa-git"/>
          </QItemSide>
          <QItemMain
            label="Git"
            :sublabel="$t('SIDENAV.GIT_SUB')"
          />
        </QItem>
      </QList>
    </SidenavBox>
  </div>
</template>
<script>

import {
  QList,
  QListHeader,
  QIcon,
  QItem,
  QItemSeparator,
  QItemSide,
  QItemMain,
} from 'quasar'
import SidenavBox from '@/sidenav/components/SidenavBox'

export default {
  components: {
    QList,
    QListHeader,
    QIcon,
    QItem,
    QItemSeparator,
    QItemSide,
    QItemMain,
    SidenavBox,
  },
  props: {
    currentUserId: {
      type: Number | null,
      default: null,
    },
  },
}
</script>
