import axios from '@/services/axios'

export default {
  async list () {
    await delay(1000)
    return (await axios.get('/api/groups/')).data
  }
}

function delay (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
