import axios from '@/base/api/axios'

const backend = __ENV.CORDOVA ? __ENV.BACKEND : ''

export default {
  async latestTopics () {
    const data = (await axios.get('/community_proxy/latest.json?order=created')).data
    const users = data.users
    const topics = data.topicList.topics
    return topics.map(topic => {
      const lastPoster = users.find(u => u.username === topic.lastPosterUsername)
      return {
        ...topic,
        createdAt: new Date(topic.createdAt),
        lastPostedAt: new Date(topic.lastPostedAt),
        link: `https://community.foodsaving.world/t/${topic.slug}/${topic.id}`,
        lastPosterAvatar: backend + '/community_proxy' + lastPoster.avatarTemplate.split('{size}').join('45'),
        lastPosterUsername: lastPoster.username,
      }
    })
  },
}
