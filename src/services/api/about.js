import axios from 'axios'

export default {
  async get () {
    return (await axios.get('/about.json')).data
  }
}
