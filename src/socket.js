import ReconnectingWebsocket from 'reconnecting-websocket'

import store from '@/store'
import log from '@/services/log'
import { getter } from '@/store/helpers'
import { camelizeKeys } from '@/services/utils'

export const WEBSOCKET_ENDPOINT = [
  window.location.protocol.replace(/^http/, 'ws'),
  '//',
  window.location.host,
  '/api/ws',
].join('')

export const options = {
  reconnectInterval: 500,
}

let ws

const socket = {
  connect () {
    if (ws) return
    ws = new ReconnectingWebsocket(WEBSOCKET_ENDPOINT, undefined, options)

    ws.addEventListener('open', () => {
      log.debug('socket opened!')
    })

    ws.addEventListener('close', () => {
      log.debug('socket closed!')
    })

    ws.addEventListener('message', (event) => {
      let data
      try {
        data = JSON.parse(event.data)
      }
      catch (err) {
        log.error('socket message was not json', event.data)
        return
      }
      receiveMessage(data)
    })
  },
  disconnect () {
    if (ws) {
      ws.close(undefined, undefined, { keepClosed: true })
      ws = null
    }
  },
}

export function receiveMessage ({ topic, payload }) {
  if (topic === 'conversations:message') {
    store.dispatch('conversations/receiveMessage', { message: camelizeKeys(payload) })
  }
}

store.watch(getter('auth/isLoggedIn'), isLoggedIn => {
  if (isLoggedIn) {
    socket.connect()
  }
  else {
    socket.disconnect()
  }
}, { immediate: true })
