import ReconnectingWebsocket from 'reconnecting-websocket'
import { debounce, AppVisibility } from 'quasar'

import store from '@/base/store'
import log from '@/utils/log'
import auth from '@/authuser/api/auth'
import { getter } from '@/utils/datastore/storeHelpers'

import { camelizeKeys } from '@/utils/utils'
import { convert as convertApplication } from '@/applications/api/groupApplications'
import { convert as convertMessage } from '@/messages/api/messages'
import { convert as convertConversation } from '@/messages/api/conversations'
import { convert as convertPickup } from '@/pickups/api/pickups'
import { convert as convertSeries } from '@/pickups/api/pickupSeries'
import { convert as convertFeedback } from '@/feedback/api/feedback'
import { convert as convertHistory } from '@/history/api/history'
import { convert as convertInvitation } from '@/invitations/api/invitations'
import { convert as convertGroup } from '@/group/api/groups'
import { convert as convertNotification, convertMeta as convertNotificationMeta } from '@/notifications/api/notifications'

let WEBSOCKET_ENDPOINT

if (__ENV.CORDOVA) {
  WEBSOCKET_ENDPOINT = [
    __ENV.BACKEND.replace(/^http/, 'ws'),
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

const options = {
  reconnectInterval: 500,
}

let ws, pingTimer, pingTimeout

const ping = () => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }))
  }
  clearTimeout(pingTimeout)
  pingTimeout = setTimeout(() => {
    if (!AppVisibility.appVisible) return
    store.commit('connectivity/websocket', false)
  }, 2000)
}

const startPing = () => {
  ping()
  pingTimer = setInterval(ping, 10000)
}

const stopPing = () => {
  clearTimeout(pingTimeout)
  clearInterval(pingTimer)
}

let listeners = []
function addEventListener (target, event, fn) {
  target.addEventListener(event, fn)
  listeners.push({ target, event, fn })
}

function removeEventListeners () {
  const toBeRemoved = listeners
  listeners = []
  toBeRemoved.forEach(({ target, event, fn }) => {
    target.removeEventListener(event, fn)
  })
}

const socket = {
  connect (protocols) {
    if (ws) return
    ws = new ReconnectingWebsocket(WEBSOCKET_ENDPOINT, protocols, options)

    addEventListener(ws, 'open', () => {
      // ping immediately if connection was opened
      // we need to stop existing pings beforehand to avoid overlap
      stopPing()
      startPing()
      log.debug('socket opened!')
    })

    addEventListener(ws, 'close', () => {
      // we check if we really lost the connection
      // maybe a new connection was opened before the old one was closed
      stopPing()
      startPing()
      log.debug('socket closed!')
    })

    addEventListener(ws, 'message', (event) => {
      let data
      try {
        data = JSON.parse(event.data)
      }
      catch (err) {
        log.error('socket message was not json', event.data)
        return
      }

      store.commit('connectivity/websocket', true)
      if (data.type && data.type === 'pong') {
        clearTimeout(pingTimeout)
      }

      receiveMessage(data)
    })

    function watchConnection () {
      const debouncedReconnect = debounce(() => ws.reconnect(), 500)

      // this should work in cordova, maybe
      addEventListener(document, 'online', () => {
        if (!store.getters['connectivity/websocket']) {
          debouncedReconnect()
        }
      })

      // this uses the draft Network Information API if available
      // https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (!connection) return

      addEventListener(connection, 'change', () => {
        if (!store.getters['connectivity/websocket']) {
          debouncedReconnect()
        }
      })
    }

    watchConnection()
  },
  disconnect () {
    removeEventListeners()
    stopPing()
    if (ws) {
      ws.close(undefined, undefined, { keepClosed: true })
      ws = null
    }
  },
}

function receiveMessage ({ topic, payload }) {
  if (topic === 'applications:update') {
    store.commit('groupApplications/update', [convertApplication(camelizeKeys(payload))])
  }
  else if (topic === 'conversations:message') {
    const message = convertMessage(camelizeKeys(payload))
    if (message.thread) {
      store.dispatch('currentThread/receiveMessage', message)
      store.dispatch('latestMessages/updateThreadsAndRelated', { messages: [message] })
    }
    if (!message.thread || message.thread === message.id) {
      store.dispatch('conversations/receiveMessage', message)
      store.dispatch('latestMessages/updateConversationsAndRelated', { messages: [message] })
      if (message.thread) {
        store.dispatch('latestMessages/updateThreadsAndRelated', { threads: [message] })
      }
    }
  }
  else if (topic === 'conversations:conversation') {
    const conversation = convertConversation(camelizeKeys(payload))
    store.dispatch('conversations/updateConversation', conversation)
    store.dispatch('latestMessages/updateConversationsAndRelated', { conversations: [conversation] })
  }
  else if (topic === 'conversations:leave') {
    store.dispatch('conversations/clearConversation', payload.id)
  }
  else if (topic === 'groups:group_detail') {
    store.dispatch('currentGroup/update', convertGroup(camelizeKeys(payload)))
  }
  else if (topic === 'groups:group_preview') {
    store.commit('groups/update', [camelizeKeys(payload)])
  }
  else if (topic === 'invitations:invitation') {
    store.dispatch('invitations/add', convertInvitation(camelizeKeys(payload)))
  }
  else if (topic === 'invitations:invitation_accept') {
    // delete invitation from list until there is a better way to display it
    store.dispatch('invitations/delete', payload.id)
  }
  else if (topic === 'stores:store') {
    store.dispatch('stores/update', camelizeKeys(payload))
  }
  else if (topic === 'pickups:pickupdate') {
    store.commit('pickups/update', [convertPickup(camelizeKeys(payload))])
  }
  else if (topic === 'pickups:pickupdate_deleted') {
    store.commit('pickups/delete', convertPickup(camelizeKeys(payload)).id)
  }
  else if (topic === 'pickups:series') {
    store.commit('pickupSeries/update', [convertSeries(camelizeKeys(payload))])
  }
  else if (topic === 'pickups:series_deleted') {
    store.commit('pickupSeries/delete', convertSeries(camelizeKeys(payload)).id)
  }
  else if (topic === 'feedback:feedback') {
    store.dispatch('feedback/update', convertFeedback(camelizeKeys(payload)))
  }
  else if (topic === 'pickups:feedback_possible') {
    const pickup = convertPickup(camelizeKeys(payload))
    store.dispatch('pickups/addFeedbackPossible', pickup)
  }
  else if (topic === 'auth:user') {
    const user = camelizeKeys(payload)
    store.dispatch('auth/update', user)
    store.dispatch('users/update', user)
  }
  else if (topic === 'auth:logout') {
    store.dispatch('auth/refresh')
  }
  else if (topic === 'users:user') {
    store.dispatch('users/update', camelizeKeys(payload))
  }
  else if (topic === 'history:history') {
    store.dispatch('history/update', convertHistory(camelizeKeys(payload)))
  }
  else if (topic === 'notifications:notification') {
    store.dispatch('notifications/update', convertNotification(camelizeKeys(payload)))
  }
  else if (topic === 'notifications:notification_deleted') {
    store.dispatch('notifications/delete', payload.id)
  }
  else if (topic === 'notifications:meta') {
    store.dispatch('notifications/setEntryMeta', convertNotificationMeta(camelizeKeys(payload)))
  }
}

store.watch(getter('presence/toggle/away'), away => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: away ? 'away' : 'back' }))
  }
})

store.watch(getter('auth/isLoggedIn'), isLoggedIn => {
  if (isLoggedIn) {
    if (__ENV.CORDOVA) {
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

store.watch(state => state.connectivity.requestReconnect, request => {
  if (!request) return
  store.commit('connectivity/requestReconnect', false)
  ws.reconnect()
})
