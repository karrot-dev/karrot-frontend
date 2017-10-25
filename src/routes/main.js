const GroupLayout = () => import('@/components/Layout/GroupLayout')
const GroupWall = () => import('@/pages/Group/Wall.vue')
const GroupMap = () => import('@/pages/Map.vue')
const GroupEdit = () => import('@/pages/Group/Edit.vue')
const GroupCreate = () => import('@/pages/Group/Create.vue')
const GroupInfo = () => import('@/pages/GroupInfo.vue')
const GroupsGallery = () => import('@/pages/GroupsGallery.vue')
const StoreLayout = () => import('@/pages/Store/Layout.vue')
const StorePickups = () => import('@/pages/Store/Pickups.vue')
const StorePickupsManage = () => import('@/pages/Store/PickupsManage.vue')
const StoreHistory = () => import('@/pages/Store/History.vue')
const StoreEdit = () => import('@/pages/Store/Edit.vue')
const StoreCreate = () => import('@/pages/Store/Create.vue')
const StoreList = () => import('@/pages/Store/Stores.vue')
const GroupHistory = () => import('@/pages/Group/History.vue')
const GroupInvites = () => import('@/pages/Group/Invites.vue')
const GroupDescription = () => import('@/pages/Group/Description.vue')
const GroupMembers = () => import('@/pages/Group/Members.vue')
const GroupMapAndStoresSidenav = () => import('@/components/Sidenav/SidenavMapAndStores.vue')
const GroupGroupSidenav = () => import('@/components/Sidenav/SidenavGroup.vue')
const GroupStoreSidenav = () => import('@/components/Sidenav/SidenavStore.vue')
const Settings = () => import('@/pages/Settings.vue')
const User = () => import('@/pages/User/User.vue')
const PickupFeedback = () => import('@/pages/Group/Feedback.vue')

export default [
  {
    name: 'groupsGallery',
    path: '/groupInfo',
    meta: {
      breadcrumbs: [
        { translation: 'JOINGROUP.ALL_GROUPS' },
      ],
    },
    components: {
      default: GroupsGallery,
    },
  },
  {
    name: 'groupInfo',
    path: '/groupInfo/:groupInfoId',
    meta: {
      breadcrumbs: [
        { translation: 'JOINGROUP.ALL_GROUPS', route: { name: 'groupsGallery' } },
        { type: 'activeGroupInfo' },
      ],
    },
    components: {
      default: GroupInfo,
    },
  },
  {
    name: 'groupCreate',
    path: '/group/create',
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { translation: 'JOINGROUP.ALL_GROUPS', route: { name: 'groupsGallery' } },
        { translation: 'GROUP.CREATE_TITLE', route: { name: 'groupCreate' } },
      ],
    },
    components: {
      default: GroupCreate,
    },
  },
  {
    path: '/group/:groupId',
    redirect: '/group/:groupId/wall',
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { type: 'activeGroup' },
      ],
    },
    components: {
      default: GroupLayout,
      sidenav: GroupMapAndStoresSidenav,
    },
    children: [
      {
        name: 'group',
        path: 'wall',
        components: {
          default: GroupWall,
          sidenav: GroupGroupSidenav,
        },
      },
      {
        name: 'groupDescription',
        path: 'description',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.DESCRIPTION', route: { name: 'groupDescription' } },
          ],
        },
        components: {
          default: GroupDescription,
          sidenav: GroupGroupSidenav,
        },
      },
      {
        name: 'groupMembers',
        path: 'members',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.MEMBERS', route: { name: 'groupMembers' } },
          ],
        },
        components: {
          default: GroupMembers,
          sidenav: GroupGroupSidenav,
        },
      },
      {
        name: 'groupHistory',
        path: 'history',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.HISTORY', route: { name: 'groupHistory' } },
          ],
        },
        components: {
          default: GroupHistory,
          sidenav: GroupGroupSidenav,
        },
      },
      {
        name: 'groupInvites',
        path: 'invites',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.INVITE_TITLE', route: { name: 'groupInvites' } },
          ],
        },
        components: {
          default: GroupInvites,
          sidenav: GroupGroupSidenav,
        },
      },
      {
        name: 'groupEdit',
        path: 'edit',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.EDIT', route: { name: 'groupEdit' } },
          ],
        },
        components: {
          default: GroupEdit,
          sidenav: GroupGroupSidenav,
        },
      },
      {
        name: 'stores',
        path: 'store',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.STORES', route: { name: 'stores' } },
          ],
        },
        components: {
          default: StoreList,
          sidenav: GroupStoreSidenav,
        },
      },
      {
        name: 'storeCreate',
        path: 'store/create',
        meta: {
          breadcrumbs: [
            { translation: 'CREATESTORE.TITLE', route: { name: 'storeCreate' } },
          ],
        },
        components: {
          default: StoreCreate,
          sidenav: GroupGroupSidenav,
        },
      },
      {
        redirect: '/group/:groupId/store/:storeId/wall',
        path: 'store/:storeId',
        meta: {
          breadcrumbs: [
            { type: 'activeStore' },
          ],
        },
        props: {
          sidenav: true,
        },
        components: {
          default: StoreLayout,
          sidenav: GroupStoreSidenav,
        },
        children: [
          {
            name: 'store',
            path: '',
            redirect: 'pickups',
          },
          {
            name: 'storePickups',
            path: 'pickups',
            component: StorePickups,
          },
          {
            name: 'storePickupsManage',
            path: 'pickups/manage',
            component: StorePickupsManage,
          },
          {
            name: 'storeHistory',
            path: 'history',
            component: StoreHistory,
          },
          {
            name: 'storeEdit',
            path: 'edit',
            meta: {
              breadcrumbs: [
                { translation: 'STOREDETAIL.EDIT', route: { name: 'storeEdit' } },
              ],
            },
            component: StoreEdit,
          },
        ],
      },
      {
        name: 'pickupFeedback',
        path: 'feedback',
        meta: {
          breadcrumbs: [
            { translation: 'FEEDBACK.TITLE', route: { name: 'pickupFeedback' } },
          ],
        },
        components: {
          default: PickupFeedback,
        },
      },
    ],
  },
  {
    name: 'map',
    path: '/group/:groupId/map',
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { type: 'activeGroup' },
        { translation: 'GROUPMAP.TITLE', route: { name: 'map' } },
      ],
    },
    components: {
      default: GroupMap,
    },
  },
  {
    name: 'settings',
    path: '/settings',
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { translation: 'SETTINGS.TITLE', route: { name: 'settings' } },
      ],
    },
    components: {
      default: Settings,
    },
  },
  {
    name: 'user',
    path: '/user/:userId',
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { type: 'activeUser' },
      ],
    },
    components: {
      default: User,
    },
  },
]
