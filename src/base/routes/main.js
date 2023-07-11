import { Platform } from 'quasar'
import { h } from 'vue'
import { RouterView } from 'vue-router'
const Empty = { render: () => null }
const Landing = () => import('@/base/pages/Landing.vue')
const GroupWall = () => import('@/group/pages/Wall.vue')
const GroupActivities = () => import('@/activities/pages/GroupActivities.vue')
const GroupOffers = () => import('@/offers/pages/GroupOffers.vue')
const OfferCreate = () => import('@/offers/pages/OfferCreate.vue')
const OfferEdit = () => import('@/offers/pages/OfferEdit.vue')
const OfferDetailHeader = () => import('@/offers/components/OfferDetailHeader.vue')
const OfferDetailBody = () => import('@/offers/components/OfferDetailBody.vue')
const OfferDetail = () => import('@/offers/components/OfferDetail.vue')
const OfferDetailHeaderIfMobile = Platform.is.mobile ? OfferDetailHeader : Empty
const OfferDetailOrBodyIfMobile = Platform.is.mobile ? OfferDetailBody : OfferDetail
const GroupFeedback = () => import('@/feedback/pages/GroupFeedback.vue')
const Messages = () => import('@/messages/pages/Messages.vue')
const LatestConversations = () => import('@/messages/components/LatestConversations.vue')
const LatestThreads = () => import('@/messages/components/LatestThreads.vue')
const Notifications = () => import('@/notifications/pages/Notifications.vue')
const GroupMap = () => import('@/maps/pages/Map.vue')
const GroupEditLayout = () => import('@/group/pages/EditLayout.vue')
const GroupEdit = () => import('@/group/pages/Edit.vue')
const GroupEditActivityTypes = () => import('@/group/pages/EditActivityTypes.vue')
const GroupEditPlaceTypes = () => import('@/group/pages/EditPlaceTypes.vue')
const GroupCreate = () => import('@/group/pages/Create.vue')
const GroupPreview = () => import('@/groupInfo/pages/GroupPreview.vue')
const GroupGallery = () => import('@/groupInfo/pages/GroupGallery.vue')
const PlaceWall = () => import('@/places/pages/Wall.vue')
const PlaceLayout = () => import('@/places/pages/Layout.vue')
const PlaceActivities = () => import('@/activities/components/PlaceActivities.vue')
const PlaceFeedback = () => import('@/feedback/components/PlaceFeedback.vue')
const PlaceHistory = () => import('@/history/pages/PlaceHistory.vue')
const PlaceActivitiesManage = () => import('@/activities/pages/ActivitiesManage.vue')
const PlaceEdit = () => import('@/places/pages/Edit.vue')
const PlaceCreate = () => import('@/places/pages/Create.vue')
const PlaceList = () => import('@/places/pages/Places.vue')
const HistoryDetail = () => import('@/history/pages/HistoryDetail.vue')
const PublicActivity = () => import('@/activities/pages/PublicActivity.vue')
const Applications = () => import('@/applications/pages/Applications.vue')
const GroupDescription = () => import('@/group/pages/Description.vue')
const GroupMembers = () => import('@/users/pages/Members.vue')
const GroupHistory = () => import('@/history/pages/GroupHistory.vue')
const Sidenav = () => import('@/sidenav/components/Sidenav.vue')
const Settings = () => import('@/authuser/pages/Settings.vue')
const User = () => import('@/users/pages/Profile.vue')
const ActivityFeedback = () => import('@/feedback/pages/ActivityFeedback.vue')
const Detail = () => import('@/messages/components/Detail.vue')
const DetailHeader = () => import('@/messages/components/DetailHeader.vue')
const IssueLayout = () => import('@/issues/pages/IssueLayout.vue')
const IssueTabs = () => import('@/issues/components/IssueTabs.vue')
const IssueTabsIfMobile = Platform.is.mobile ? IssueTabs : Empty
const IssueList = () => import('@/issues/pages/IssueList.vue')
const IssueChat = () => import('@/issues/pages/IssueChat.vue')
const IssueCompose = () => import('@/issues/pages/IssueCompose.vue')
const IssueVoteAndHistory = () => import('@/issues/pages/IssueVoteAndHistory.vue')
const ActivityHistoryStatistics = () => import('@/statistics/pages/ActivityHistoryStatistics.vue')
const Agreements = () => import('@/agreements/pages/Agreements.vue')
const Agreement = () => import('@/agreements/pages/Agreement.vue')
const CreateAgreement = () => import('@/agreements/pages/CreateAgreement.vue')
const EditAgreement = () => import('@/agreements/pages/EditAgreement.vue')

const RouterViewSubheader = h(RouterView, { name: 'subheader' })
RouterViewSubheader.displayName = 'RouterViewSubheader'

const RouterViewDetail = h(RouterView, { name: 'detail' })
RouterViewDetail.displayName = 'RouterViewDetail'

const RouterViewFooter = h(RouterView, { name: 'footer' })
RouterViewFooter.displayName = 'RouterViewFooter'

const RouterViewIssueFooter = h(RouterView, { name: 'issueFooter' })
RouterViewIssueFooter.displayName = 'RouterViewIssueFooter'

const RouterViewIssueFooterIfMobile = Platform.is.mobile ? RouterViewIssueFooter : Empty

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
        { name: 'KARROT' },
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
    name: 'publicActivity',
    path: '/a/:activityPublicId',
    meta: {
      hideHeaderIfLoggedOut: true,
      breadcrumbs: [{ type: 'publicActivity' }],
    },
    component: PublicActivity,
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
        name: 'agreementCreate',
        path: 'agreements/create',
        meta: {
          requireLoggedIn: true,
          requireFeature: 'agreements',
          breadcrumbs: [
            { translation: 'GROUP.AGREEMENTS', route: { name: 'agreements' } },
            { translation: 'AGREEMENT.NEW', route: { name: 'agreementCreate' } },
          ],
        },
        components: {
          default: CreateAgreement,
        },
      },
      {
        name: 'agreements',
        path: 'agreements',
        meta: {
          requireLoggedIn: true,
          requireFeature: 'agreements',
          breadcrumbs: [
            { translation: 'GROUP.AGREEMENTS', route: { name: 'agreements' } },
          ],
        },
        component: Agreements,
      },
      {
        name: 'agreement',
        path: 'agreements/:agreementId',
        meta: {
          requireLoggedIn: true,
          breadcrumbs: [
            { translation: 'GROUP.AGREEMENTS', route: { name: 'agreements' } },
            { type: 'activeAgreement' },
          ],
        },
        component: Agreement,
      },
      {
        name: 'agreementEdit',
        path: 'agreements/:agreementId/edit',
        meta: {
          requireLoggedIn: true,
          breadcrumbs: [
            { translation: 'GROUP.AGREEMENTS', route: { name: 'agreements' } },
            { type: 'activeAgreement' },
          ],
        },
        component: EditAgreement,
      },
      {
        name: 'issueList',
        path: 'issues',
        meta: {
          requireLoggedIn: true,
          breadcrumbs: [
            { translation: 'ISSUE.TITLE', route: { name: 'issueList' } },
          ],
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
              footer: RouterViewIssueFooterIfMobile,
            },
            meta: {
              requireLoggedIn: true,
              breadcrumbs: [
                { type: 'activeIssue' },
              ],
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
        },
        component: GroupHistory,
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
          {
            name: 'groupEditPlaceTypes',
            path: 'place-types',
            component: GroupEditPlaceTypes,
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
      afterLeave: 'unsubscribe/clear',
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
