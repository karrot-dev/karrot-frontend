const ReconnectingWebSocket = require('reconnecting-websocket');
const EventEmitter = require('eventemitter3');
const Vue = require('vue/dist/vue');

const socket = new ReconnectingWebSocket(
  "ws://" + window.location.host + "/",
  undefined,
  {
    reconnectInterval: 500
  }
);

const events = new EventEmitter();

socket.onmessage = function(event) {
    var data;
    try {
        data = JSON.parse(event.data);
    } catch (err) {
        console.error('websocket message was not json', event.data);
        throw err;
    }
    events.emit(data.topic, data.payload);
}
socket.onopen = function() {
    events.emit('connected')
}

socket.onclose = function() {
    events.emit('disconnected')
}

// keep pinging the backend to keep prescence updated
setInterval(function() {
    socket.send(JSON.stringify({ type: 'ping' }));
}, 5000);

// Call onopen directly if socket is already open
if (socket.readyState == WebSocket.OPEN) socket.onopen();

const app = new Vue({
    el: '#app',
    data: {
        connected: false,
        conversations: []
    }
});

events.on('connected', function(){
    console.log('connected!');
    app.connected = true;
});

events.on('disconnected', function(){
    app.connected = false;
});

events.on('conversations:join', function(data){
    console.log('joined a conversation!', data);
    var idx = getConversationId(data.id);
    if (idx === -1) {
        data.messages = [];
        app.conversations.push(data);
    }
});

events.on('conversations:leave', function(data){
    console.log('left a conversation!', data);
    var idx = getConversationId(data.id);
    if (idx !== -1) {
        app.conversations.splice(idx, 1);
    }
});

events.on('conversations:message', function(data){
    console.log('got a message!', data);
    var idx = getConversationId(data.conversation.id);
    if (idx !== -1) {
        delete data.conversation;
        console.log('added message to conversation', idx);
        app.conversations[idx].messages.push(data);
    }
});

function getConversationId(id) {
    return app.conversations.findIndex(function(item) {
        return item.id === id;
    });
}