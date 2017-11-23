import ReconnectingWebsocket from 'reconnecting-websocket'

import store from '@/store'
import log from '@/services/log'
import auth from '@/services/api/auth'
import { getter } from '@/store/storeHelpers'
import { camelizeKeys } from '@/services/utils'

let WEBSOCKET_ENDPOINT

if (CORDOVA) {
  WEBSOCKET_ENDPOINT = [
    BACKEND.replace(/^http/, 'ws'),
    '/api/ws',
  ].join('')
}
else {
  WEBSOCKET_ENDPOINT = [
    window.location.protocol.replace(/^http/, 'ws'),
    '//',
    window.location.host,
    '/api/ws',
  ].join('')
}

export const options = {
  reconnectInterval: 500,
}

let ws, timer

const socket = {
  connect (protocols) {
    if (ws) return
    ws = new ReconnectingWebsocket(WEBSOCKET_ENDPOINT, protocols, options)

    timer = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 10000)

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
    if (timer) clearTimeout(timer)
    if (ws) {
      ws.close(undefined, undefined, { keepClosed: true })
      ws = null
    }
  },
}

export function receiveMessage ({ topic, payload }) {
  if (topic === 'conversations:message') {
    const message = camelizeKeys(payload)
    store.dispatch('conversations/receiveMessage', {
      ...message,
      createdAt: new Date(message.createdAt),
    })
  }
}

store.watch(getter('auth/isLoggedIn'), isLoggedIn => {
  if (isLoggedIn) {
    if (CORDOVA) {
      const token = auth.getToken()
      socket.connect([
        'karrot.token',
        /* token value is encoded as base64 without the padding (as "=" is not allowed)
          this means it's not valid base64, and we have to specifically re-pad again in the backend */
        `karrot.token.value.${btoa(token).replace(/=/g, '')}`,
      ])
    }
    else {
      socket.connect()
    }
  }
  else {
    socket.disconnect()
  }
}, { immediate: true })
