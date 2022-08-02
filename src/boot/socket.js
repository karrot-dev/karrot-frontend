import ReconnectingWebsocket from 'reconnecting-websocket'
import { debounce, AppVisibility } from 'quasar'
import mitt from 'mitt'

import log from '@/utils/log'
import auth from '@/authuser/api/auth'

import { camelizeKeys } from '@/utils/utils'
import { convert as convertApplication } from '@/applications/api/applications'
import { convert as convertMessage } from '@/messages/api/messages'
import { convert as convertCommunityFeedMeta } from '@/communityFeed/api/communityFeed'
import { convert as convertConversation, convertMeta as convertConversationMeta } from '@/messages/api/conversations'
import { convert as convertActivity } from '@/activities/api/activities'
import { convert as convertSeries } from '@/activities/api/activitySeries'
import { convert as convertFeedback } from '@/feedback/api/feedback'
import { convert as convertHistory } from '@/history/api/history'
import { convert as convertInvitation } from '@/invitations/api/invitations'
import { convert as convertIssue } from '@/issues/api/issues'
import { convert as convertOffer } from '@/offers/api/offers'
import { convert as convertGroup } from '@/group/api/groups'
import { convert as convertNotification, convertMeta as convertNotificationMeta } from '@/notifications/api/notifications'

// Global event bus for websocket events
export const socketEvents = mitt()

export default async function ({ store: datastore }) {
  let WEBSOCKET_ENDPOINT

  if (process.env.MODE === 'cordova') {
    WEBSOCKET_ENDPOINT = [
      process.env.KARROT.BACKEND.replace(/^http/, 'ws'),
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

        if (data.topic) {
          receiveMessage(data)
        }
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

  function convertPayload (topic, payload) {
    switch (topic) {
      case 'applications:update': return convertApplication(payload)
      case 'conversations:message': return convertMessage(payload)
      case 'conversations:conversation': return convertConversation(payload)
      case 'conversations:meta': return convertConversationMeta(payload)
      case 'community_feed:meta': return convertCommunityFeedMeta(payload)
      case 'groups:group_detail': return convertGroup(payload)
      case 'invitations:invitation': return convertInvitation(payload)
      case 'issues:issue': return convertIssue(payload)
      case 'activities:activity': return convertActivity(payload)
      case 'activities:activity_deleted': return convertActivity(payload)
      case 'activities:series': return convertSeries(payload)
      case 'activities:series_deleted': return convertSeries(payload)
      case 'offers:offer': return convertOffer(payload)
      case 'offers:offer_deleted': return convertOffer(payload)
      case 'feedback:feedback': return convertFeedback(payload)
      case 'history:history': return convertHistory(payload)
      case 'notifications:notification': return convertNotification(payload)
      case 'notifications:meta': return convertNotificationMeta(payload)
      default: return payload
    }
  }

  function receiveMessage ({ topic, payload }) {
    payload = convertPayload(topic, camelizeKeys(payload))

    socketEvents.emit(topic, payload)

    if (topic === 'applications:update') {
      datastore.commit('applications/update', [payload])
    }
    else if (topic === 'conversations:message') {
      const message = payload
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
        datastore.dispatch('conversations/fetchRelatedUserInfo', [message])
      }
    }
    else if (topic === 'conversations:conversation') {
      const conversation = payload
      datastore.dispatch('conversations/updateConversation', conversation)
      datastore.dispatch('latestMessages/updateConversationsAndRelated', { conversations: [conversation] })
    }
    else if (topic === 'conversations:meta') {
      datastore.commit('latestMessages/setEntryMeta', payload)
    }
    else if (topic === 'community_feed:meta') {
      datastore.commit('communityFeed/setMeta', payload)
    }
    else if (topic === 'conversations:leave') {
      // refresh latest messages
      if (!datastore.getters['latestMessages/fetchInitialPending']) {
        datastore.dispatch('latestMessages/clear')
        datastore.dispatch('latestMessages/fetchInitial')
      }
    }
    else if (topic === 'groups:group_detail') {
      datastore.dispatch('currentGroup/maybeUpdate', payload)
    }
    else if (topic === 'groups:group_preview') {
      datastore.commit('groups/update', [payload])
    }
    else if (topic === 'groups:user_joined') {
      datastore.dispatch('users/fetch', null, { root: true })
    }
    else if (topic === 'groups:user_left') {
      datastore.dispatch('users/fetch', null, { root: true })
    }
    else if (topic === 'invitations:invitation') {
      datastore.commit('invitations/update', [payload])
    }
    else if (topic === 'invitations:invitation_accept') {
      // delete invitation from list until there is a better way to display it
      datastore.commit('invitations/delete', payload.id)
    }
    else if (topic === 'issues:issue') {
      datastore.commit('issues/update', [payload])
    }
    else if (topic === 'places:place') {
      datastore.dispatch('places/update', [payload])
    }
    else if (topic === 'activities:activity') {
      datastore.commit('activities/update', [payload])
    }
    else if (topic === 'activities:activity_deleted') {
      datastore.commit('activities/delete', payload.id)
    }
    else if (topic === 'activities:series') {
      datastore.commit('activitySeries/update', [payload])
    }
    else if (topic === 'activities:series_deleted') {
      datastore.commit('activitySeries/delete', payload.id)
    }
    else if (topic === 'activities:type') {
      datastore.commit('activityTypes/update', [payload])
    }
    else if (topic === 'activities:type_deleted') {
      datastore.commit('activityTypes/delete', payload.id)
    }
    else if (topic === 'offers:offer') {
      datastore.commit('latestMessages/updateRelated', { type: 'offer', items: [payload] })
    }
    else if (topic === 'offers:offer_deleted') {
      datastore.commit('latestMessages/deleteRelated', { type: 'offer', ids: [payload.id] })
    }
    else if (topic === 'feedback:feedback') {
      // datastore.dispatch('feedback/updateOne', payload)
    }
    else if (topic === 'auth:user') {
      const user = payload
      datastore.commit('auth/setUser', user)
      datastore.commit('users/update', [user])
      datastore.dispatch('users/refreshProfile', user)
    }
    else if (topic === 'auth:logout') {
      datastore.dispatch('auth/refresh')
    }
    else if (topic === 'users:user') {
      const user = payload
      datastore.commit('users/update', [user])
      datastore.dispatch('users/refreshProfile', user)
    }
    else if (topic === 'history:history') {
      datastore.commit('history/update', [payload])
    }
    else if (topic === 'notifications:notification') {
      datastore.commit('notifications/update', [payload])
    }
    else if (topic === 'notifications:notification_deleted') {
      datastore.commit('notifications/delete', payload.id)
    }
    else if (topic === 'notifications:meta') {
      datastore.commit('notifications/setEntryMeta', payload)
    }
    else if (topic === 'status') {
      datastore.commit('status/update', payload)
    }
  }

  datastore.watch((_, getters) => getters['presence/toggle/away'], away => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: away ? 'away' : 'back' }))
    }
  })

  datastore.watch((_, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (isLoggedIn) {
      if (process.env.MODE === 'cordova') {
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
}
