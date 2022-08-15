import { h } from 'vue'
import { RouterView } from 'vue-router'
import { Platform } from 'quasar'
const Empty = Promise.resolve({ render: () => null })
const Landing = () => import('@/base/pages/Landing')
const GroupWall = () => import('@/group/pages/Wall')
const GroupActivities = () => import('@/activities/pages/GroupActivities')
const GroupOffers = () => import('@/offers/pages/GroupOffers')
const OfferCreate = () => import('@/offers/pages/OfferCreate')
const OfferEdit = () => import('@/offers/pages/OfferEdit')
const OfferDetailHeaderIfMobile = () => Platform.is.mobile ? import('@/offers/components/OfferDetailHeader') : Empty
const OfferDetailOrBodyIfMobile = () => Platform.is.mobile ? import('@/offers/components/OfferDetailBody') : import('@/offers/components/OfferDetail')
const GroupFeedback = () => import('@/feedback/pages/GroupFeedback')
const Messages = () => import('@/messages/pages/Messages')
const LatestConversations = () => import('@/messages/components/LatestConversations')
const LatestThreads = () => import('@/messages/components/LatestThreads')
const Notifications = () => import('@/notifications/pages/Notifications')
const GroupMap = () => import('@/maps/pages/Map')
const GroupEditLayout = () => import('@/group/pages/EditLayout')
const GroupEdit = () => import('@/group/pages/Edit')
const GroupEditActivityTypes = () => import('@/group/pages/EditActivityTypes')
const GroupCreate = () => import('@/group/pages/Create')
const GroupPreview = () => import('@/groupInfo/pages/GroupPreview')
const GroupGallery = () => import('@/groupInfo/pages/GroupGallery')
const PlaceWall = () => import('@/places/pages/Wall')
const PlaceLayout = () => import('@/places/pages/Layout')
const PlaceActivities = () => import('@/activities/components/PlaceActivities')
const PlaceFeedback = () => import('@/feedback/components/PlaceFeedback')
const PlaceHistory = () => import('@/history/pages/PlaceHistory')
const PlaceActivitiesManage = () => import('@/activities/pages/ActivitiesManage')
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
const ActivityFeedback = () => import('@/feedback/pages/ActivityFeedback')
const Detail = () => import('@/messages/components/Detail')
const DetailHeader = () => import('@/messages/components/DetailHeader')
const IssueLayout = () => import('@/issues/pages/IssueLayout')
const IssueTabsIfMobile = () => Platform.is.mobile ? import('@/issues/components/IssueTabs') : Promise.resolve({ render: () => null })
const IssueList = () => import('@/issues/pages/IssueList')
const IssueChat = () => import('@/issues/pages/IssueChat')
const IssueCompose = () => import('@/issues/pages/IssueCompose')
const IssueVoteAndHistory = () => import('@/issues/pages/IssueVoteAndHistory')
const ActivityHistoryStatistics = () => import('@/statistics/pages/ActivityHistoryStatistics')

const RouterViewSubheader = () => h(RouterView, { name: 'subheader' })
RouterViewSubheader.displayName = 'RouterViewSubheader'

const RouterViewDetail = () => h(RouterView, { name: 'detail' })
RouterViewDetail.displayName = 'RouterViewDetail'

const RouterViewFooter = () => h(RouterView, { name: 'footer' })
RouterViewFooter.displayName = 'RouterViewFooter'

const RouterViewIssueFooter = h(RouterView, { name: 'issueFooter' })
RouterViewIssueFooter.displayName = 'RouterViewIssueFooter'

export default [
  {
    name: 'home',
    path: '/',
  },
  {
    name: 'landing',
    path: '/welcome',
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
    },
    component: HistoryDetail,
  },
  {
    path: '/group/:groupId',
    redirect: { name: 'group' },
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { type: 'currentGroup' },
      ],
    },
    components: {
      default: RouterView,
      subheader: RouterViewSubheader,
      detail: RouterViewDetail,
      footer: RouterViewFooter,
      sidenav: Sidenav,
    },
    children: [
      {
        name: 'group',
        path: 'wall',
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
          subheader: RouterViewSubheader,
          detail: RouterView,
          footer: RouterViewFooter,
        },
        children: [
          {
            name: 'issueDetail',
            path: ':issueId',
            redirect: { name: 'issueChat' },
            components: {
              default: IssueLayout,
              subheader: IssueTabsIfMobile,
              footer: () => Platform.is.mobile ? RouterViewIssueFooter : Empty,
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
        name: 'groupActivities',
        path: 'activities',
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.ACTIVITIES', route: { name: 'groupActivities' } },
          ],
        },
        component: GroupActivities,
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
        },
        components: {
          default: GroupOffers,
          detail: RouterView,
          subheader: RouterViewSubheader,
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
            { translation: 'ACTIVITY_FEEDBACK.TITLE', route: { name: 'groupFeedback' } },
          ],
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
        },
        component: Applications,
      },
      {
        name: 'groupEdit',
        path: 'edit',
        redirect: { name: 'groupEditDetails' },
        meta: {
          breadcrumbs: [
            { translation: 'GROUP.EDIT', route: { name: 'groupEdit' } },
          ],
          beforeEnter: 'timezones/fetch',
        },
        components: {
          default: GroupEditLayout,
        },
        children: [
          {
            name: 'groupEditDetails',
            path: 'details',
            component: GroupEdit,
          },
          {
            name: 'groupEditActivityTypes',
            path: 'activity-types',
            component: GroupEditActivityTypes,
          },
        ],
      },
      {
        // TODO: kept for transitionary purposes, remove in some months
        name: 'groupSettings',
        path: 'settings',
        redirect: { name: 'settings', hash: '#notifications' },
      },
      {
        name: 'messageReplies',
        path: 'message/:messageId/replies',
        meta: {
          requireLoggedIn: true,
          breadcrumbs: [
            { type: 'currentGroup' },
          ],
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
        path: 'place/:placeId',
        meta: {
          breadcrumbs: [
            { type: 'activePlace' },
          ],
        },
        components: {
          default: PlaceLayout,
          subheader: RouterViewSubheader,
        },
        children: [
          {
            name: 'placeWall',
            path: 'wall',
            component: PlaceWall,
          },
          {
            name: 'placeActivities',
            path: 'activities',
            component: PlaceActivities,
          },
          {
            name: 'placeActivitiesManage',
            path: 'activities/manage',
            component: PlaceActivitiesManage,
          },
          {
            name: 'placeFeedback',
            path: 'feedback',
            component: PlaceFeedback,
          },
          {
            name: 'placeHistory',
            path: 'history',
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
        name: 'activityDetail',
        path: 'place/:placeId/activities/:activityId/detail',
        meta: {
          requireLoggedIn: true,
          breadcrumbs: [
            { translation: 'GROUP.ACTIVITY' },
          ],
        },
        // On desktop will get redirected inside "detail/routeEnter" action
        components: {
          default: Detail,
          subheader: DetailHeader,
        },
      },
      {
        name: 'giveFeedback',
        path: 'give-feedback/:activityId?',
        meta: {
          breadcrumbs: [
            { translation: 'ACTIVITY_FEEDBACK.TITLE', route: { name: 'giveFeedback' } },
          ],
        },
        component: ActivityFeedback,
      },
      {
        name: 'editFeedback',
        path: 'feedback/:feedbackId',
        meta: {
          breadcrumbs: [
            { translation: 'ACTIVITY_FEEDBACK.TITLE', route: { name: 'editFeedback' } },
          ],
        },
        component: ActivityFeedback,
      },
      {
        name: 'statistics',
        path: 'statistics',
        redirect: { name: 'activityHistoryStatistics' },
      },
      {
        name: 'activityHistoryStatistics',
        path: 'statistics/activity-history',
        meta: {
          requireLoggedIn: true,
          breadcrumbs: [
            { translation: 'GROUP.STATISTICS', route: { name: 'statistics' } },
          ],
        },
        components: {
          default: ActivityHistoryStatistics,
          sidenav: Sidenav,
        },
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
        { type: 'activeUser' },
      ],
    },
    components: {
      default: User,
      sidenav: Sidenav,
    },
  },
  {
    name: 'userInGroup',
    path: '/group/:groupId/user/:userId',
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { type: 'activeUser' },
      ],
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
    },
    components: {
      default: Notifications,
      sidenav: Sidenav,
    },
  },
]
