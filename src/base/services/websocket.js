import mitt from 'mitt'
import { AppVisibility, debounce } from 'quasar'
import ReconnectingWebsocket from 'reconnecting-websocket'
import { watch } from 'vue'

import { convert as convertActivity } from '@/activities/api/activities'
import { convert as convertSeries } from '@/activities/api/activitySeries'
import { convert as convertApplication } from '@/applications/api/applications'
import auth from '@/authuser/api/auth'
import { useAuthService } from '@/authuser/services'
import { usePresenceService } from '@/base/services/presence'
import { convert as convertCommunityFeedMeta } from '@/communityFeed/api/communityFeed'
import { convert as convertFeedback } from '@/feedback/api/feedback'
import { convert as convertGroup } from '@/group/api/groups'
import { convert as convertHistory } from '@/history/api/history'
import { convert as convertIssue } from '@/issues/api/issues'
import { convert as convertConversation, convertMeta as convertConversationMeta } from '@/messages/api/conversations'
import { convert as convertMessage } from '@/messages/api/messages'
import {
  convert as convertNotification,
} from '@/notifications/api/notifications'
import { convert as convertOffer } from '@/offers/api/offers'
import { defineService } from '@/utils/datastore/helpers'
import log from '@/utils/log'
import { useConnectivity } from '@/utils/services'
import { camelizeKeys, devSleep } from '@/utils/utils'

// Global event bus for websocket events
export const socketEvents = mitt()
export const useWebsocket = defineService(() => {
  let WEBSOCKET_ENDPOINT

  const {
    isConnected,
    setConnected,
    isReconnectedRequested,
    resetRequestReconnect,
  } = useConnectivity()

  const { isLoggedIn } = useAuthService()

  const { isAway } = usePresenceService()

  if (import.meta.env.MODE === 'cordova') {
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
      setConnected(false)
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

        setConnected(true)
        if (data.type && data.type === 'pong') {
          clearTimeout(pingTimeout)
        }

        if (data.topic) {
          // add artificial delay for dev env
          if (import.meta.env.DEV) {
            devSleep().then(() => receiveMessage(data))
          }
          else {
            receiveMessage(data)
          }
        }
      })

      // reconnect when browser tells us the connection is back
      function watchConnection () {
        const debouncedReconnect = debounce(() => ws.reconnect(), 500)

        // this should work in cordova, maybe
        addEventListener(document, 'online', () => {
          if (!isConnected.value) {
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
          if (!isConnected.value) {
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
      case 'applications:update':
        return convertApplication(payload)
      case 'conversations:message':
        return convertMessage(payload)
      case 'conversations:conversation':
        return convertConversation(payload)
      case 'conversations:meta':
        return convertConversationMeta(payload)
      case 'community_feed:meta':
        return convertCommunityFeedMeta(payload)
      case 'groups:group_detail':
        return convertGroup(payload)
      case 'issues:issue':
        return convertIssue(payload)
      case 'activities:activity':
        return convertActivity(payload)
      case 'activities:activity_deleted':
        return convertActivity(payload)
      case 'activities:series':
        return convertSeries(payload)
      case 'activities:series_deleted':
        return convertSeries(payload)
      case 'offers:offer':
        return convertOffer(payload)
      case 'offers:offer_deleted':
        return convertOffer(payload)
      case 'feedback:feedback':
        return convertFeedback(payload)
      case 'history:history':
        return convertHistory(payload)
      case 'notifications:notification':
        return convertNotification(payload)
      default:
        return payload
    }
  }

  function receiveMessage ({ topic, payload }) {
    socketEvents.emit(topic, convertPayload(topic, camelizeKeys(payload)))
  }

  watch(isAway, value => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: value ? 'away' : 'back' }))
    }
  })

  watch(isLoggedIn, value => {
    if (value) {
      if (import.meta.env.MODE === 'cordova') {
        // TODO: check cordova login works...
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

  watch(isReconnectedRequested, value => {
    if (value) {
      resetRequestReconnect()
      ws.reconnect()
    }
  })

  // datastore.watch(state => state.connectivity.requestReconnect, request => {
  //   if (!request) return
  //   datastore.commit('connectivity/requestReconnect', false)
  //   ws.reconnect()
  // })
})
