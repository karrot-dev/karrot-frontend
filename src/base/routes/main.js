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
const PlaceLayout = () => import('@/places/pages/Layout')
const PlacePickups = () => import('@/pickups/components/PlacePickups')
const PlaceFeedback = () => import('@/feedback/components/PlaceFeedback')
const PlaceHistory = () => import('@/history/pages/PlaceHistory')
const PlacePickupsManage = () => import('@/pickups/pages/PickupsManage')
const PlaceEdit = () => import('@/places/pages/Edit')
const PlaceCreate = () => import('@/places/pages/Create')
const PlaceList = () => import('@/places/pages/Places')
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
        name: 'places',
        path: 'place',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.STORES', route: { name: 'places' } },
          ],
        },
        component: PlaceList,
      },
      {
        name: 'placeCreate',
        path: 'place/create',
        meta: {
          breadcrumbs: [
            { translation: 'CREATESTORE.TITLE', route: { name: 'placeCreate' } },
          ],
        },
        component: PlaceCreate,
      },
      {
        redirect: '/group/:groupId/place/:placeId/wall',
        path: 'place/:placeId',
        meta: {
          breadcrumbs: [
            { type: 'activePlace' },
          ],
          beforeEnter: 'places/selectPlace',
          afterLeave: 'places/clearSelectedPlace',
        },
        components: {
          default: PlaceLayout,
          subheader: { render: h => h('router-view', {
            props: {
              name: 'subheader',
            },
          }) },
        },
        children: [
          {
            name: 'place',
            path: '',
            redirect: 'pickups',
          },
          {
            name: 'placePickups',
            path: 'pickups',
            component: PlacePickups,
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
            name: 'placePickupsManage',
            path: 'pickups/manage',
            meta: {
              breadcrumbs: [
                { translation: 'PICKUPMANAGE.TITLE', route: { name: 'placePickupsManage' } },
              ],
              beforeEnter: 'pickupSeries/fetchListForActivePlace',
              afterLeave: 'pickupSeries/clearList',
            },
            component: PlacePickupsManage,
          },
          {
            name: 'placeFeedback',
            path: 'feedback',
            meta: {
              breadcrumbs: [
                { translation: 'PICKUP_FEEDBACK.TITLE', route: { name: 'placeFeedback' } },
              ],
              beforeEnter: 'feedback/fetch',
              afterLeave: 'feedback/clear',
            },
            component: PlaceFeedback,
          },
          {
            name: 'placeHistory',
            path: 'history',
            meta: {
              breadcrumbs: [
                { translation: 'GROUP.HISTORY', route: { name: 'placeHistory' } },
              ],
              beforeEnter: 'history/fetch',
            },
            component: PlaceHistory,
          },
          {
            name: 'placeEdit',
            path: 'edit',
            meta: {
              breadcrumbs: [
                { translation: 'STOREDETAIL.EDIT', route: { name: 'placeEdit' } },
              ],
            },
            component: PlaceEdit,
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
