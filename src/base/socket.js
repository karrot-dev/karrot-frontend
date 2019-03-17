import ReconnectingWebsocket from 'reconnecting-websocket'
import { debounce, AppVisibility } from 'quasar'

import datastore from '@/base/datastore'
import log from '@/utils/log'
import auth from '@/authuser/api/auth'

import { camelizeKeys } from '@/utils/utils'
import { convert as convertApplication } from '@/applications/api/applications'
import { convert as convertMessage } from '@/messages/api/messages'
import { convert as convertCommunityFeedMeta } from '@/communityFeed/api/communityFeed'
import { convert as convertConversation, convertMeta as convertConversationMeta } from '@/messages/api/conversations'
import { convert as convertPickup } from '@/pickups/api/pickups'
import { convert as convertSeries } from '@/pickups/api/pickupSeries'
import { convert as convertFeedback } from '@/feedback/api/feedback'
import { convert as convertHistory } from '@/history/api/history'
import { convert as convertInvitation } from '@/invitations/api/invitations'
import { convert as convertIssue } from '@/issues/api/issues'
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
    datastore.commit('connectivity/websocket', false)
  }, 5000)
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

      datastore.commit('connectivity/websocket', true)
      if (data.type && data.type === 'pong') {
        clearTimeout(pingTimeout)
      }

      receiveMessage(data)
    })

    // reconnect when browser tells us the connection is back
    function watchConnection () {
      const debouncedReconnect = debounce(() => ws.reconnect(), 500)

      // this should work in cordova, maybe
      addEventListener(document, 'online', () => {
        if (!datastore.getters['connectivity/websocket']) {
          debouncedReconnect()
        }
      })

      // this uses the draft Network Information API if available
      // https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (!connection) return

      // apparently cordova doesn't support addEventListener, but we don't need it there
      if (!connection.addEventListener) return

      addEventListener(connection, 'change', () => {
        if (!datastore.getters['connectivity/websocket']) {
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
    datastore.commit('applications/update', [convertApplication(camelizeKeys(payload))])
  }
  else if (topic === 'conversations:message') {
    const message = convertMessage(camelizeKeys(payload))
    if (message.thread) {
      datastore.dispatch('currentThread/receiveMessage', message)
      datastore.dispatch('latestMessages/updateThreadsAndRelated', { messages: [message] })
    }
    if (!message.thread || message.thread === message.id) {
      datastore.dispatch('conversations/receiveMessage', message)
      datastore.dispatch('latestMessages/updateConversationsAndRelated', { messages: [message] })
      if (message.thread) {
        datastore.dispatch('latestMessages/updateThreadsAndRelated', { threads: [message] })
      }
    }
  }
  else if (topic === 'conversations:conversation') {
    const conversation = convertConversation(camelizeKeys(payload))
    datastore.dispatch('conversations/updateConversation', conversation)
    datastore.dispatch('latestMessages/updateConversationsAndRelated', { conversations: [conversation] })
  }
  else if (topic === 'conversations:meta') {
    datastore.commit('latestMessages/setEntryMeta', convertConversationMeta(camelizeKeys(payload)))
  }
  else if (topic === 'community_feed:meta') {
    datastore.commit('communityFeed/setMeta', convertCommunityFeedMeta(camelizeKeys(payload)))
  }
  else if (topic === 'conversations:leave') {
    // refresh latest messages
    if (!datastore.getters['latestMessages/fetchInitialPending']) {
      datastore.dispatch('latestMessages/clear')
      datastore.dispatch('latestMessages/fetchInitial')
    }
  }
  else if (topic === 'groups:group_detail') {
    datastore.dispatch('currentGroup/maybeUpdate', convertGroup(camelizeKeys(payload)))
  }
  else if (topic === 'groups:group_preview') {
    datastore.commit('groups/update', [camelizeKeys(payload)])
  }
  else if (topic === 'invitations:invitation') {
    datastore.commit('invitations/update', [convertInvitation(camelizeKeys(payload))])
  }
  else if (topic === 'invitations:invitation_accept') {
    // delete invitation from list until there is a better way to display it
    datastore.commit('invitations/delete', payload.id)
  }
  else if (topic === 'issues:issue') {
    datastore.commit('issues/update', [convertIssue(camelizeKeys(payload))])
  }
  else if (topic === 'places:place') {
    datastore.dispatch('places/update', [camelizeKeys(payload)])
  }
  else if (topic === 'pickups:pickupdate') {
    datastore.commit('pickups/update', [convertPickup(camelizeKeys(payload))])
  }
  else if (topic === 'pickups:pickupdate_deleted') {
    datastore.commit('pickups/delete', convertPickup(camelizeKeys(payload)).id)
  }
  else if (topic === 'pickups:series') {
    datastore.commit('pickupSeries/update', [convertSeries(camelizeKeys(payload))])
  }
  else if (topic === 'pickups:series_deleted') {
    datastore.commit('pickupSeries/delete', convertSeries(camelizeKeys(payload)).id)
  }
  else if (topic === 'feedback:feedback') {
    datastore.dispatch('feedback/updateOne', convertFeedback(camelizeKeys(payload)))
  }
  else if (topic === 'auth:user') {
    const user = camelizeKeys(payload)
    datastore.commit('auth/setUser', user)
    datastore.commit('users/update', [user])
    datastore.dispatch('users/refreshProfile', user)
  }
  else if (topic === 'auth:logout') {
    datastore.dispatch('auth/refresh')
  }
  else if (topic === 'users:user') {
    const user = camelizeKeys(payload)
    datastore.commit('users/update', [user])
    datastore.dispatch('users/refreshProfile', user)
  }
  else if (topic === 'history:history') {
    datastore.commit('history/update', [convertHistory(camelizeKeys(payload))])
  }
  else if (topic === 'notifications:notification') {
    datastore.commit('notifications/update', [convertNotification(camelizeKeys(payload))])
  }
  else if (topic === 'notifications:notification_deleted') {
    datastore.commit('notifications/delete', payload.id)
  }
  else if (topic === 'notifications:meta') {
    datastore.commit('notifications/setEntryMeta', convertNotificationMeta(camelizeKeys(payload)))
  }
}

datastore.watch((_, getters) => getters['presence/toggle/away'], away => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: away ? 'away' : 'back' }))
  }
})

datastore.watch((_, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
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

datastore.watch(state => state.connectivity.requestReconnect, request => {
  if (!request) return
  datastore.commit('connectivity/requestReconnect', false)
  ws.reconnect()
})
