import ReconnectingWebsocket from 'reconnecting-websocket'

import store from '@/store'

export const WEBSOCKET_ENDPOINT = [
  window.location.protocol.replace(/^http/, 'ws'),
  '//',
  window.location.host,
  '/api/ws'
].join('')

export const options = {
  reconnectInterval: 500
}

export const socket = new ReconnectingWebsocket(WEBSOCKET_ENDPOINT, undefined, options)

socket.addEventListener('open', () => {
  console.info('state.socket opened!')
})

socket.addEventListener('message', (event) => {
  let data
  try {
    data = JSON.parse(event.data)
  }
  catch (err) {
    console.error('socket message was not json', event.data)
    return
  }
  receiveMessage(data)
})

export function receiveMessage ({ topic, payload }) {
  if (topic === 'conversations:message') {
    store.dispatch('conversations/receiveMessage', { message: payload })
  }
}
