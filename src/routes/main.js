const GroupWall = () => import('@/pages/Group/Wall')
const GroupPickups = () => import('@/pages/Group/Pickups')
const GroupFeedback = () => import('@/pages/Group/Feedbacks')
const GroupMessages = () => import('@/pages/Group/Messages')
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
const GroupApplications = () => import('@/pages/Group/Applications')
const GroupDescription = () => import('@/pages/Group/Description')
const GroupMembers = () => import('@/pages/Group/Members')
const GroupHistory = () => import('@/pages/Group/History')
const Sidenav = () => import('@/components/Sidenav/Sidenav')
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
      beforeEnter: 'groupApplications/fetchMine',
      afterLeave: 'groupApplications/clearEntries',
    },
    components: {
      fullPage: GroupGallery,
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
    component: GroupPreview,
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
    component: GroupCreate,
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
    component: HistoryDetail,
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
      default: { render: h => h('router-view') }, // passthrough
      sidenav: Sidenav,
    },
    children: [
      {
        name: 'group',
        path: 'wall',
        meta: {
          beforeEnter: 'conversations/fetchForGroup',
          afterLeave: 'conversations/clearForGroup',
        },
        component: GroupWall,
      },
      {
        name: 'map',
        path: 'map',
        meta: {
          disableDesktopSidenav: true,
          breadcrumbs: [
            { translation: 'GROUPMAP.TITLE', route: { name: 'map' } },
          ],
        },
        component: GroupMap,
      },
      {
        name: 'groupPickups',
        path: 'pickups',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.PICKUPS', route: { name: 'groupPickups' } },
          ],
        },
        component: GroupPickups,
      },
      {
        name: 'groupMessages',
        path: 'messages',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.MESSAGES', route: { name: 'groupMessages' } },
          ],
        },
        component: GroupMessages,
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
        component: GroupFeedback,
      },
      {
        name: 'groupDescription',
        path: 'description',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.DESCRIPTION', route: { name: 'groupDescription' } },
          ],
        },
        component: GroupDescription,
      },
      {
        name: 'groupMembers',
        path: 'members',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.MEMBERS', route: { name: 'groupMembers' } },
          ],
        },
        component: GroupMembers,
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
        component: GroupHistory,
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
        component: GroupInvitations,
      },
      {
        name: 'groupApplications',
        path: 'applications',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.APPLICATIONS', route: { name: 'groupApplications' } },
          ],
        },
        component: GroupApplications,
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
        component: GroupEdit,
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
        component: GroupSettings,
      },
      {
        name: 'groupManageAgreement',
        path: 'agreement',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.MANAGE_AGREEMENT', route: { name: 'groupManageAgreement' } },
          ],
        },
        component: GroupManageAgreement,
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
        component: StoreList,
      },
      {
        name: 'storeCreate',
        path: 'store/create',
        meta: {
          breadcrumbs: [
            { translation: 'CREATESTORE.TITLE', route: { name: 'storeCreate' } },
          ],
        },
        component: StoreCreate,
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
        component: StoreLayout,
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
        component: PickupFeedback,
      },
    ],
  },
  {
    name: 'applicationDetail',
    path: '/group/:groupId/applications/:applicationId',
    meta: {
      requiredLoggedIn: true,
      breadcrumbs: [
        { translation: 'APPLICATION.APPLICATION', route: { name: 'applicationDetail' } },
      ],
      beforeEnter: 'detail/applicationRouteEnter',
      afterLeave: 'detail/routeLeave',
    },
    // On desktop will get redirected inside "detail/routeEnter" action
    component: MobileDetail,
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
    component: Settings,
  },
  {
    name: 'user',
    path: '/user/:userId',
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { type: 'currentGroup' },
        { type: 'activeUser' },
      ],
      beforeEnter: 'users/selectUser',
      afterLeave: 'users/clearSelectedUser',
    },
    components: {
      default: User,
      sidenav: Sidenav,
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
    component: MobileDetail,
  },
]
