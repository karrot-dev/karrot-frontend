const GroupLayout = () => import('@/components/Layout/GroupLayout')
const GroupWall = () => import('@/pages/Group/Wall')
const GroupPickups = () => import('@/pages/Group/Pickups')
const GroupFeedback = () => import('@/pages/Group/Feedbacks')
const GroupMap = () => import('@/pages/Map')
const GroupSettings = () => import('@/pages/Group/Settings')
const GroupEdit = () => import('@/pages/Group/Edit')
const GroupManageAgreement = () => import('@/pages/Group/ManageAgreement')
const GroupCreate = () => import('@/pages/Group/Create')
const GroupPreview = () => import('@/pages/GroupPreview')
const GroupGallery = () => import('@/pages/GroupGallery')
const StoreLayout = () => import('@/pages/Store/Layout')
const StorePickups = () => import('@/pages/Store/Pickups')
const StoreFeedback = () => import('@/pages/Store/Feedbacks')
const StoreHistory = () => import('@/pages/Store/History')
const StorePickupsManage = () => import('@/pages/Store/PickupsManage')
const StoreEdit = () => import('@/pages/Store/Edit')
const StoreCreate = () => import('@/pages/Store/Create')
const StoreList = () => import('@/pages/Store/Stores')
const HistoryDetail = () => import('@/pages/HistoryDetail')
const GroupInvitations = () => import('@/pages/Group/Invitations')
const GroupDescription = () => import('@/pages/Group/Description')
const GroupMembers = () => import('@/pages/Group/Members')
const GroupHistory = () => import('@/pages/Group/History')
// const GroupMapAndStoresSidenav = () => import('@/components/Sidenav/SidenavMapAndStores')
// const GroupMapAndStoresSidenav = () => import('@/components/Sidenav/ShinyNewSidenav')
const ShinyNewSidenav = () => import('@/components/Sidenav/ShinyNewSidenav')
const GroupGroupSidenav = () => import('@/components/Sidenav/SidenavGroup')
const GroupStoreSidenav = () => import('@/components/Sidenav/SidenavStore')
const Settings = () => import('@/pages/Settings')
const User = () => import('@/pages/User/User')
const PickupFeedback = () => import('@/pages/Group/Feedback')
const MobileDetail = () => import('@/pages/MobileDetail')

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
      fullPage: GroupGallery,
      sidenav: ShinyNewSidenav,
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
      sidenav: ShinyNewSidenav,
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
      sidenav: ShinyNewSidenav,
    },
  },
  {
    name: 'historyDetail',
    path: '/history/:historyId',
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { translation: 'HISTORY.DETAILS', route: { name: 'historyDetail' } },
      ],
      beforeEnter: 'history/setActive',
      afterLeave: 'history/clearActive',
    },
    components: {
      default: HistoryDetail,
      sidenav: ShinyNewSidenav,
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
      sidenav: ShinyNewSidenav,
    },
    children: [
      {
        name: 'group',
        path: 'wall',
        meta: {
          beforeEnter: 'conversations/fetchForGroup',
          afterLeave: 'conversations/clearForGroup',
        },
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
          beforeEnter: 'feedback/fetchForGroup',
          afterLeave: 'feedback/clear',
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
          default: GroupHistory,
          sidenav: GroupGroupSidenav,
        },
      },
      {
        name: 'groupInvitations',
        path: 'invites',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.INVITATIONS', route: { name: 'groupInvitations' } },
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
        name: 'groupSettings',
        path: 'settings',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.SETTINGS', route: { name: 'groupSettings' } },
          ],
          beforeEnter: 'auth/getFailedEmailDeliveries',
        },
        components: {
          default: GroupSettings,
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
        name: 'messageReplies',
        path: 'message/:messageId/replies',
        meta: {
          requiredLoggedIn: true,
          breadcrumbs: [
            { type: 'currentGroup' },
          ],
          beforeEnter: 'detail/routeEnter',
          afterLeave: 'detail/routeLeave',
        },
        // On desktop will get redirected inside "detail/routeEnter" action
        component: MobileDetail,
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
        components: {
          default: StoreLayout,
          sidenav: GroupGroupSidenav,
          secondSidenav: GroupStoreSidenav,
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
            name: 'pickupDetail',
            path: 'pickups/:pickupId/detail',
            meta: {
              requiredLoggedIn: true,
              breadcrumbs: [
                { translation: 'GROUP.PICKUP' },
              ],
              beforeEnter: 'detail/routeEnter',
              afterLeave: 'detail/routeLeave',
            },
            // On desktop will get redirected inside "detail/routeEnter" action
            component: MobileDetail,
          },
          {
            name: 'storePickupsManage',
            path: 'pickups/manage',
            meta: {
              breadcrumbs: [
                { translation: 'PICKUPMANAGE.TITLE', route: { name: 'storePickupsManage' } },
              ],
              beforeEnter: 'pickupSeries/fetchListForActiveStore',
              afterLeave: 'pickupSeries/clearList',
            },
            component: StorePickupsManage,
          },
          {
            name: 'storeFeedback',
            path: 'feedback',
            meta: {
              breadcrumbs: [
                { translation: 'PICKUP_FEEDBACK.TITLE', route: { name: 'storeFeedback' } },
              ],
              beforeEnter: 'feedback/fetchForStore',
              afterLeave: 'feedback/clear',
            },
            component: StoreFeedback,
          },
          {
            name: 'storeHistory',
            path: 'history',
            meta: {
              breadcrumbs: [
                { translation: 'GROUP.HISTORY', route: { name: 'storeHistory' } },
              ],
              beforeEnter: 'history/fetchForStore',
            },
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
        path: 'give-feedback/:feedbackId?',
        meta: {
          breadcrumbs: [
            { translation: 'PICKUP_FEEDBACK.TITLE', route: { name: 'pickupFeedback' } },
          ],
          beforeEnter: 'feedback/select',
          afterLeave: 'feedback/clear',
        },
        components: {
          default: PickupFeedback,
          sidenav: GroupGroupSidenav,
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
      fullScreen: true,
    },
    components: {
      default: GroupMap,
      sidenav: ShinyNewSidenav,
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
      beforeEnter: 'auth/getFailedEmailDeliveries',
      afterLeave: 'auth/clearSettingsStatus',
    },
    components: {
      default: Settings,
      sidenav: ShinyNewSidenav,
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
      sidenav: ShinyNewSidenav,
    },
  },
  {
    name: 'userDetail',
    path: '/user/:userId/detail',
    meta: {
      requiredLoggedIn: true,
      breadcrumbs: [
        { type: 'activeUser' },
      ],
      beforeEnter: 'detail/routeEnter',
      afterLeave: 'detail/routeLeave',
    },
    // On desktop will get redirected inside "detail/routeEnter" action
    components: {
      default: MobileDetail,
      sidenav: ShinyNewSidenav,
    },
  },
]
