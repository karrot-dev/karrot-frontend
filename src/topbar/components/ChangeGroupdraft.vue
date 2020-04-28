<template>
    <div class="logo">
      <RouterLink
        v-if="!$q.platform.is.mobile"
        :to="'/'"
        class="q-ml-sm"
      >
        <QBtnDropdown
          class="logo"
          split
          @click="onMainClick"
        >
          <template v-slot:label>
            <img
              v-if="currentGroup && currentGroup.hasPhoto"
              :src="currentGroup.photoUrls.thumbnail"
              class="logo"
            >
            <KarrotLogo
              v-else
              show-loading
              class="logo"
            />
          </template>
          <QList>
            <QItem
              v-close-popup
              clickable
              @click="onItemClick"
            >
              <QItemSection>
                <pre>
                  {{ myGroups }}
                </pre>
              </QItemSection>
            </QItem>
          </QList>
        </QBtnDropdown>
      </RouterLink>
    </div>
</template>

<script>
/*
      <QList dense>
        <QItem v-for="{ label, to, handler} in groups"
          :key="label"
          :to="to"
          clickable
          @click="handler && handler()"
        >
          <QItemSection>
            {{ label }}
          </QItemSection>
        <QItem>
    here maybe a v-for like the one in SidenavMenu? Or should it be in KTopbarUI.vue?
think of group images and group icon instead of image when there is none.
consider hasMyGroupstoShow
*/


// at KTopbarUI

/*        <img
          v-if="currentGroup && currentGroup.hasPhoto"
          :src="currentGroup.photoUrls.thumbnail"
          style="height: 95%"
        >
        <KarrotLogo
          v-else
          show-loading
        />
        */

</script>