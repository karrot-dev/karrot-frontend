import ReconnectingWebsocket from 'reconnecting-websocket'

import store from '@/store'
import log from '@/services/log'
import auth from '@/services/api/auth'
import { getter } from '@/store/storeHelpers'

import { camelizeKeys } from '@/services/utils'
import { convert as convertApplication } from '@/services/api/groupApplications'
import { convert as convertMessage } from '@/services/api/messages'
import { convert as convertConversation } from '@/services/api/conversations'
import { convert as convertPickup } from '@/services/api/pickups'
import { convert as convertSeries } from '@/services/api/pickupSeries'
import { convert as convertFeedback } from '@/services/api/feedback'
import { convert as convertHistory } from '@/services/api/history'
import { convert as convertInvitation } from '@/services/api/invitations'
import { convert as convertGroup } from '@/services/api/groups'

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
  if (topic === 'applications:update') {
    store.dispatch('groupApplications/update', convertApplication(camelizeKeys(payload)))
  }
  else if (topic === 'conversations:message') {
    const message = convertMessage(camelizeKeys(payload))
    if (message.thread) {
      store.dispatch('currentThread/receiveMessage', message)
    }
    if (!message.thread || message.thread === message.id) {
      store.dispatch('conversations/receiveMessage', message)
      if (message.thread) {
        store.dispatch('latestMessages/updateThread')
      }
    }
  }
  else if (topic === 'conversations:conversation') {
    const conversation = convertConversation(camelizeKeys(payload))
    store.dispatch('conversations/updateConversation', conversation)
    store.dispatch('latestMessages/updateConversation', conversation)
  }
  else if (topic === 'conversations:leave') {
    store.dispatch('conversations/clearConversation', payload.id)
  }
  else if (topic === 'groups:group_detail') {
    store.dispatch('currentGroup/update', convertGroup(camelizeKeys(payload)))
  }
  else if (topic === 'groups:group_preview') {
    store.dispatch('groups/update', camelizeKeys(payload))
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
    store.dispatch('pickups/update', convertPickup(camelizeKeys(payload)))
  }
  else if (topic === 'pickups:pickupdate_deleted') {
    store.dispatch('pickups/delete', convertPickup(camelizeKeys(payload)).id)
  }
  else if (topic === 'pickups:series') {
    store.dispatch('pickupSeries/update', convertSeries(camelizeKeys(payload)))
  }
  else if (topic === 'pickups:series_deleted') {
    store.dispatch('pickupSeries/delete', convertSeries(camelizeKeys(payload)).id)
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
  else if (topic === 'users:user') {
    store.dispatch('users/update', camelizeKeys(payload))
  }
  else if (topic === 'history:history') {
    store.dispatch('history/update', convertHistory(camelizeKeys(payload)))
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
