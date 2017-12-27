const GroupLayout = () => import('@/components/Layout/GroupLayout')
const GroupWall = () => import('@/pages/Group/Wall')
const GroupPickups = () => import('@/pages/Group/Pickups')
const GroupFeedback = () => import('@/pages/Group/Feedbacks')
const GroupMap = () => import('@/pages/Map')
const GroupEdit = () => import('@/pages/Group/Edit')
const GroupManageAgreement = () => import('@/pages/Group/ManageAgreement')
const GroupCreate = () => import('@/pages/Group/Create')
const GroupPreview = () => import('@/pages/GroupPreview')
const GroupGallery = () => import('@/pages/GroupGallery')
const StoreLayout = () => import('@/pages/Store/Layout')
const StorePickups = () => import('@/pages/Store/Pickups')
const StorePickupsManage = () => import('@/pages/Store/PickupsManage')
const StoreEdit = () => import('@/pages/Store/Edit')
const StoreCreate = () => import('@/pages/Store/Create')
const StoreList = () => import('@/pages/Store/Stores')
const History = () => import('@/pages/History')
const HistoryDetail = () => import('@/pages/HistoryDetail')
const GroupInvitations = () => import('@/pages/Group/Invitations')
const GroupDescription = () => import('@/pages/Group/Description')
const GroupMembers = () => import('@/pages/Group/Members')
const GroupMapAndStoresSidenav = () => import('@/components/Sidenav/SidenavMapAndStores')
const GroupGroupSidenav = () => import('@/components/Sidenav/SidenavGroup')
const GroupStoreSidenav = () => import('@/components/Sidenav/SidenavStore')
const Settings = () => import('@/pages/Settings')
const User = () => import('@/pages/User/User')
const PickupFeedback = () => import('@/pages/Group/Feedback')

export default [
  {
    name: 'groupsGallery',
    path: '/groupPreview',
    meta: {
      breadcrumbs: [
        { translation: 'JOINGROUP.ALL_GROUPS' },
      ],
    },
    components: {
      default: GroupGallery,
    },
  },
  {
    name: 'groupPreview',
    path: '/groupPreview/:groupPreviewId',
    meta: {
      breadcrumbs: [
        { translation: 'JOINGROUP.ALL_GROUPS', route: { name: 'groupsGallery' } },
        { type: 'activeGroupPreview' },
      ],
      beforeEnter: 'groups/selectPreview',
      afterLeave: 'groups/clearGroupPreview',
    },
    components: {
      default: GroupPreview,
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
      beforeEnter: 'timezones/fetch',
    },
    components: {
      default: GroupCreate,
    },
  },
  {
    name: 'historyDetail',
    path: '/history/:historyId',
    components: {
      default: HistoryDetail,
    },
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { translation: 'HISTORY.DETAILS', route: { name: 'historyDetail' } },
      ],
      beforeEnter: 'history/setActive',
      afterLeave: 'history/clearActive',
    },
  },
  {
    path: '/group/:groupId',
    redirect: '/group/:groupId/wall',
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { type: 'currentGroup' },
      ],
      beforeEnter: 'currentGroup/select',
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
        name: 'groupPickups',
        path: 'pickups',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.PICKUPS', route: { name: 'groupPickups' } },
          ],
        },
        components: {
          default: GroupPickups,
          sidenav: GroupGroupSidenav,
        },
      },
      {
        name: 'groupFeedback',
        path: 'feedback',
        meta: {
          breadcrumbs: [
            { translation: 'PICKUP_FEEDBACK.TITLE', route: { name: 'groupFeedback' } },
          ],
        },
        components: {
          default: GroupFeedback,
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
          beforeEnter: 'history/fetchForGroup',
        },
        components: {
          default: History,
          sidenav: GroupGroupSidenav,
        },
      },
      {
        name: 'groupInvitations',
        path: 'invites',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.INVITE_TITLE', route: { name: 'groupInvitations' } },
          ],
          beforeEnter: 'invitations/fetch',
        },
        components: {
          default: GroupInvitations,
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
          beforeEnter: 'timezones/fetch',
        },
        components: {
          default: GroupEdit,
          sidenav: GroupGroupSidenav,
        },
      },
      {
        name: 'groupManageAgreement',
        path: 'agreement',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.MANAGE_AGREEMENT', route: { name: 'groupManageAgreement' } },
          ],
        },
        components: {
          default: GroupManageAgreement,
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
          beforeEnter: 'stores/selectStore',
          afterLeave: 'stores/clearSelectedStore',
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
            meta: {
              breadcrumbs: [
                { translation: 'PICKUPMANAGE.TITLE', route: { name: 'storePickupsManage' } },
              ],
              beforeEnter: 'pickupSeries/fetchListForActiveStore',
              afterLeave: 'pickupSeries/clearList',
            },
          },
          {
            name: 'storeHistory',
            path: 'history',
            component: History,
            meta: {
              breadcrumbs: [
                { translation: 'GROUP.HISTORY', route: { name: 'storeHistory' } },
              ],
              beforeEnter: 'history/fetchForStore',
            },
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
        path: 'give-feedback',
        meta: {
          breadcrumbs: [
            { translation: 'PICKUP_FEEDBACK.TITLE', route: { name: 'pickupFeedback' } },
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
        { type: 'currentGroup' },
        { translation: 'GROUPMAP.TITLE', route: { name: 'map' } },
      ],
      beforeEnter: 'currentGroup/select',
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
      afterLeave: 'auth/clearSettingsStatus',
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
      beforeEnter: 'users/selectUser',
      afterLeave: 'users/clearSelectedUser',
    },
    components: {
      default: User,
    },
  },
]
