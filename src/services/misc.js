import axios from '@/services/axios'

export default {
  async commit (data) {
    return (await axios.get('/.commit')).data
  }
}
