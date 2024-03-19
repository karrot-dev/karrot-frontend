const PublicActivitiesEmbed = () => import('@/groupInfo/pages/PublicActivitiesEmbed.vue')

export default [
  {
    name: 'publicActivitiesEmbed',
    path: '/embed/public-activities/:groupId',
    component: PublicActivitiesEmbed,
    meta: {
      noRedirect: true,
    },
  },
]
