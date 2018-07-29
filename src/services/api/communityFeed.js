import axios from '@/services/axios'

const backend = CORDOVA ? BACKEND : ''

export default {
  async latestTopics () {
    const data = (await axios.get('/community_proxy/latest.json?order=created')).data
    const users = data.users
    const topics = data.topicList.topics
    return topics.map(topic => {
      const lastPoster = users.find(u => u.id === topic.posters[0].userId)
      return {
        ...topic,
        createdAt: new Date(topic.createdAt),
        lastPostedAt: new Date(topic.lastPostedAt),
        link: `https://community.foodsaving.world/t/${topic.slug}/${topic.id}`,
        originalPosterAvatar: backend + '/community_proxy' + lastPoster.avatarTemplate.split('{size}').join('45'),
        originalPosterUsername: lastPoster.username,
      }
    })
  },
}
