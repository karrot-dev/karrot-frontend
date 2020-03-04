import { Platform } from 'quasar'
const Landing = () => import('@/base/pages/Landing')
const GroupWall = () => import('@/group/pages/Wall')
const GroupPickups = () => import('@/pickups/pages/GroupPickups')
const GroupOffers = () => import('@/offers/pages/GroupOffers')
const OfferCreate = () => import('@/offers/pages/OfferCreate')
const OfferEdit = () => import('@/offers/pages/OfferEdit')
const OfferDetailHeaderIfMobile = () => Platform.is.mobile ? import('@/offers/components/OfferDetailHeader') : Promise.resolve({ render: () => null })
const OfferDetailOrBodyIfMobile = () => Platform.is.mobile ? import('@/offers/components/OfferDetailBody') : import('@/offers/components/OfferDetail')
const GroupFeedback = () => import('@/feedback/pages/GroupFeedback')
const Messages = () => import('@/messages/pages/Messages')
const LatestConversations = () => import('@/messages/components/LatestConversations')
const LatestThreads = () => import('@/messages/components/LatestThreads')
const Notifications = () => import('@/notifications/pages/Notifications')
const GroupMap = () => import('@/maps/pages/Map')
const GroupEdit = () => import('@/group/pages/Edit')
const GroupManageAgreement = () => import('@/agreements/pages/ManageAgreement')
const GroupCreate = () => import('@/group/pages/Create')
const GroupPreview = () => import('@/groupInfo/pages/GroupPreview')
const GroupGallery = () => import('@/groupInfo/pages/GroupGallery')
const PlaceWall = () => import('@/places/pages/Wall')
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
const IssueLayout = () => import('@/issues/pages/IssueLayout')
const IssueTabsIfMobile = () => Platform.is.mobile ? import('@/issues/components/IssueTabs') : Promise.resolve({ render: () => null })
const IssueList = () => import('@/issues/pages/IssueList')
const IssueChat = () => import('@/issues/pages/IssueChat')
const IssueCompose = () => import('@/issues/pages/IssueCompose')
const IssueVoteAndHistory = () => import('@/issues/pages/IssueVoteAndHistory')

export default [
  {
    name: 'home',
    path: '/home',
    meta: {
      fullpage: true,
      breadcrumbs: [
        { translation: 'KARROT' },
      ],
    },
    component: Landing,
  },
  {
    name: 'groupsGallery',
    path: '/groupPreview',
    meta: {
      fullpage: true,
      breadcrumbs: [
        { translation: 'JOINGROUP.ALL_GROUPS' },
      ],
      beforeEnter: 'applications/fetchMine',
    },
    component: GroupGallery,
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
      subheader: {
        render: h => h('router-view', {
          props: {
            name: 'subheader',
          },
        }),
      },
      detail: {
        render: h => h('router-view', {
          props: {
            name: 'detail',
          },
        }),
      },
      footer: { render: h => h('router-view', { props: { name: 'footer' } }) },
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
        name: 'issueList',
        path: 'issues',
        meta: {
          requireLoggedIn: true,
          breadcrumbs: [
            { translation: 'ISSUE.TITLE', route: { name: 'issueList' } },
          ],
          beforeEnter: 'issues/fetchByGroupId',
        },
        components: {
          default: IssueList,
          detail: { render: h => h('router-view') },
          subheader: { render: h => h('router-view', { props: { name: 'subheader' } }) },
          footer: { render: h => h('router-view', { props: { name: 'footer' } }) },
        },
        children: [
          {
            name: 'issueDetail',
            path: ':issueId',
            redirect: { name: 'issueChat' },
            components: {
              default: IssueLayout,
              subheader: IssueTabsIfMobile,
              footer: { render: h => Platform.is.mobile ? h('router-view', { props: { name: 'issueFooter' } }) : null },
            },
            meta: {
              requireLoggedIn: true,
              breadcrumbs: [
                { type: 'activeIssue' },
              ],
              beforeEnter: 'issues/select',
              isDetail: true,
            },
            children: [
              {
                name: 'issueChat',
                path: 'chat',
                components: {
                  default: IssueChat,
                  issueFooter: IssueCompose,
                },
              },
              {
                name: 'issueVote',
                path: 'vote',
                component: IssueVoteAndHistory,
              },
            ],
          },
        ],
      },
      {
        name: 'map',
        path: 'map',
        meta: {
          disableDesktopSidenav: true,
          disablePullToRefresh: true,
          fullpage: true,
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
        name: 'offerCreate',
        path: 'offer/create',
        meta: {
          requireLoggedIn: true,
          requireFeature: 'offers',
          breadcrumbs: [
            { translation: 'GROUP.OFFERS', route: { name: 'groupOffers' } },
            { translation: 'OFFER.CREATE_TITLE', route: { name: 'offerCreate' } },
          ],
        },
        components: {
          default: OfferCreate,
        },
      },
      {
        name: 'offerEdit',
        path: 'offers/:offerId/edit',
        meta: {
          requireLoggedIn: true,
          requireFeature: 'offers',
          breadcrumbs: [
            { translation: 'GROUP.OFFERS', route: { name: 'groupOffers' } },
            { type: 'activeOffer' },
          ],
          beforeEnter: 'currentOffer/select',
          afterLeave: 'currentOffer/clear',
        },
        components: {
          default: OfferEdit,
        },
      },
      {
        name: 'groupOffers',
        path: 'offers',
        meta: {
          requireLoggedIn: true,
          requireFeature: 'offers',
          breadcrumbs: [
            { translation: 'GROUP.OFFERS', route: { name: 'groupOffers' } },
          ],
          afterLeave: 'offers/clear',
        },
        components: {
          default: GroupOffers,
          detail: { render: h => h('router-view') },
          subheader: {
            render: h => h('router-view', {
              props: {
                name: 'subheader',
              },
            }),
          },
        },
        children: [
          {
            name: 'offerDetail',
            path: ':offerId',
            meta: {
              requireLoggedIn: true,
              breadcrumbs: [
                { type: 'activeOffer' },
              ],
              beforeEnter: 'currentOffer/select',
              afterLeave: 'currentOffer/clear',
              isDetail: true,
            },
            components: {
              default: OfferDetailOrBodyIfMobile,
              subheader: OfferDetailHeaderIfMobile,
            },
          },
        ],
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
        // TODO: kept for transitionary purposes, remove in some months
        name: 'groupSettings',
        path: 'settings',
        redirect: { name: 'settings', hash: '#notifications' },
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
          requireLoggedIn: true,
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
        // Redirect legacy "store" urls
        path: 'store/:rest*',
        redirect: to => `place/${to.params.rest}`,
      },
      {
        name: 'places',
        path: 'place',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.PLACES', route: { name: 'places' } },
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
        name: 'place',
        redirect: { name: 'placePickups' },
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
          subheader: {
            render: h => h('router-view', {
              props: {
                name: 'subheader',
              },
            }),
          },
        },
        children: [
          {
            name: 'placeWall',
            path: 'wall',
            component: PlaceWall,
            meta: {
              beforeEnter: 'conversations/fetchForPlace',
              afterLeave: 'conversations/clearForPlace',
            },
          },
          {
            name: 'placePickups',
            path: 'pickups',
            component: PlacePickups,
          },
          {
            name: 'placePickupsManage',
            path: 'pickups/manage',
            meta: {
              beforeEnter: 'pickupSeries/fetchListForActivePlace',
              afterLeave: 'pickupSeries/clearList',
            },
            component: PlacePickupsManage,
          },
          {
            name: 'placeFeedback',
            path: 'feedback',
            meta: {
              beforeEnter: 'places/beforeEnterFeedback',
              afterLeave: 'feedback/clear',
            },
            component: PlaceFeedback,
          },
          {
            name: 'placeHistory',
            path: 'history',
            meta: {
              beforeEnter: 'history/fetch',
            },
            component: PlaceHistory,
          },
          {
            name: 'placeEdit',
            path: 'edit',
            component: PlaceEdit,
          },
        ],
      },
      {
        name: 'pickupDetail',
        path: 'place/:placeId/pickups/:pickupId/detail',
        meta: {
          requireLoggedIn: true,
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
        name: 'giveFeedback',
        path: 'give-feedback/:pickupId?',
        meta: {
          breadcrumbs: [
            { translation: 'PICKUP_FEEDBACK.TITLE', route: { name: 'giveFeedback' } },
          ],
          beforeEnter: 'feedback/fetch',
          afterLeave: 'feedback/clear',
        },
        component: PickupFeedback,
      },
      {
        name: 'editFeedback',
        path: 'feedback/:feedbackId',
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
      requireLoggedIn: true,
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
      beforeEnter: ['auth/getFailedEmailDeliveries', 'currentGroup/selectFromCurrentUser'],
      afterLeave: ['auth/clearSettingsStatus', 'unsubscribe/clear'],
    },
    components: {
      default: Settings,
      sidenav: Sidenav,
    },
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
      requireLoggedIn: true,
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
    redirect: { name: 'latestConversations' },
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { translation: 'GROUP.MESSAGES', route: { name: 'messages' } },
      ],
      beforeEnter: 'currentGroup/selectFromCurrentUser',
    },
    components: {
      default: Messages,
      sidenav: Sidenav,
    },
    children: [
      {
        name: 'latestConversations',
        path: 'conversations',
        component: LatestConversations,
      },
      {
        name: 'latestThreads',
        path: 'threads',
        component: LatestThreads,
      },
    ],
  },
  {
    name: 'notifications',
    path: 'notifications',
    meta: {
      requireLoggedIn: true,
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
