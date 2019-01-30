const GroupWall = () => import('@/group/pages/Wall')
const GroupPickups = () => import('@/pickups/pages/GroupPickups')
const GroupFeedback = () => import('@/feedback/pages/GroupFeedback')
const Messages = () => import('@/messages/pages/Messages')
const Notifications = () => import('@/notifications/pages/Notifications')
const GroupMap = () => import('@/maps/pages/Map')
const GroupSettings = () => import('@/group/pages/Settings')
const GroupEdit = () => import('@/group/pages/Edit')
const GroupManageAgreement = () => import('@/agreements/pages/ManageAgreement')
const GroupCreate = () => import('@/group/pages/Create')
const GroupPreview = () => import('@/groupInfo/pages/GroupPreview')
const GroupGallery = () => import('@/groupInfo/pages/GroupGallery')
const StoreLayout = () => import('@/stores/pages/Layout')
const StorePickups = () => import('@/pickups/components/StorePickups')
const StoreFeedback = () => import('@/feedback/components/StoreFeedback')
const StoreHistory = () => import('@/history/pages/StoreHistory')
const StorePickupsManage = () => import('@/pickups/pages/PickupsManage')
const StoreEdit = () => import('@/stores/pages/Edit')
const StoreCreate = () => import('@/stores/pages/Create')
const StoreList = () => import('@/stores/pages/Stores')
const HistoryDetail = () => import('@/history/pages/HistoryDetail')
const GroupInvitations = () => import('@/invitations/pages/Invitations')
const Applications = () => import('@/applications/pages/Applications')
const GroupDescription = () => import('@/group/pages/Description')
const GroupMembers = () => import('@/users/pages/Members')
const GroupHistory = () => import('@/history/pages/GroupHistory')
const Sidenav = () => import('@/sidenav/components/Sidenav')
const Settings = () => import('@/authuser/pages/Settings')
const User = () => import('@/users/pages/Profile')
const PickupFeedback = () => import('@/feedback/pages/GiveFeedback')
const Detail = () => import('@/messages/components/Detail')
const DetailHeader = () => import('@/messages/components/DetailHeader')
const IssueTabs = () => import('@/issues/pages/IssueTabs')
const IssueList = () => import('@/issues/pages/IssueList')

export default [
  {
    name: 'groupsGallery',
    path: '/groupPreview',
    meta: {
      breadcrumbs: [
        { translation: 'JOINGROUP.ALL_GROUPS' },
      ],
      beforeEnter: 'applications/fetchMine',
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
      subheader: { render: h => h('router-view', {
        props: {
          name: 'subheader',
        },
      }) },
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
        name: 'issueTabs',
        path: 'issues/:issueId',
        meta: {
          requiredLoggedIn: true,
          breadcrumbs: [
            { translation: 'CONFLICT.TITLE', route: { name: 'issueTabs' } },
          ],
          beforeEnter: 'issues/fetchOne',
        },
        components: {
          default: IssueTabs,
        },
      },
      {
        name: 'issueList',
        path: 'issues',
        meta: {
          requiredLoggedIn: true,
          breadcrumbs: [
            { translation: 'ISSUE.TITLE', route: { name: 'issueList' } },
          ],
          beforeEnter: 'issues/fetchByGroupId',
        },
        components: {
          default: IssueList,
        },
      },
      {
        name: 'map',
        path: 'map',
        meta: {
          disableDesktopSidenav: true,
          disablePullToRefresh: true,
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
        name: 'groupFeedback',
        path: 'feedback',
        meta: {
          breadcrumbs: [
            { translation: 'PICKUP_FEEDBACK.TITLE', route: { name: 'groupFeedback' } },
          ],
          beforeEnter: 'feedback/fetch',
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
          beforeEnter: 'history/fetch',
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
        name: 'applications',
        path: 'applications',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.APPLICATIONS', route: { name: 'applications' } },
          ],
          beforeEnter: 'applications/fetchByGroupId',
        },
        component: Applications,
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
        components: {
          default: Detail,
          subheader: DetailHeader,
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
        components: {
          default: StoreLayout,
          subheader: { render: h => h('router-view', {
            props: {
              name: 'subheader',
            },
          }) },
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
            components: {
              default: Detail,
              subheader: DetailHeader,
            },
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
              beforeEnter: 'feedback/fetch',
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
              beforeEnter: 'history/fetch',
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
        name: 'giveFeedback',
        path: 'give-feedback/:pickupId?',
        meta: {
          breadcrumbs: [
            { translation: 'PICKUP_FEEDBACK.TITLE', route: { name: 'giveFeedback' } },
          ],
        },
        component: PickupFeedback,
      },
      {
        name: 'editFeedback',
        path: 'feedback/:feedbackId?',
        meta: {
          breadcrumbs: [
            { translation: 'PICKUP_FEEDBACK.TITLE', route: { name: 'editFeedback' } },
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
    components: {
      default: Detail,
      subheader: DetailHeader,
      sidenav: Sidenav,
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
        { type: 'currentGroup' },
        { type: 'activeUser' },
      ],
      beforeEnter: 'detail/routeEnter',
      afterLeave: 'detail/routeLeave',
    },
    // On desktop will get redirected inside "detail/routeEnter" action
    components: {
      default: Detail,
      subheader: DetailHeader,
      sidenav: Sidenav,
    },
  },
  {
    name: 'messages',
    path: 'messages',
    meta: {
      requiredLoggedIn: true,
      breadcrumbs: [
        { translation: 'GROUP.MESSAGES', route: { name: 'messages' } },
      ],
      beforeEnter: 'currentGroup/selectFromCurrentUser',
    },
    components: {
      default: Messages,
      sidenav: Sidenav,
    },
  },
  {
    name: 'notifications',
    path: 'notifications',
    meta: {
      requiredLoggedIn: true,
      breadcrumbs: [
        { translation: 'NOTIFICATION_BELLS_LIST.TITLE', route: { name: 'notifications' } },
      ],
      beforeEnter: 'currentGroup/selectFromCurrentUser',
    },
    components: {
      default: Notifications,
      sidenav: Sidenav,
    },
  },
]
