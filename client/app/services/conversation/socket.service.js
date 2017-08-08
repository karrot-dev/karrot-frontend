import ReconnectingWebSocket from "reconnecting-websocket";

export const WEBSOCKET_ENDPOINT = [
  window.location.protocol.replace(/^http/, "ws"),
  "//",
  window.location.host,
  "/api/ws"
].join("");

class SocketService {

  constructor($q, $log) {
    "ngInject";
    this.socket = null;
    this.$q = $q;
    this.$log = $log;
    this.subscribers = [];
    this.options = {
      reconnectInterval: 500
    };
  }

  /* Subscribe to receive all websocket messages
     returns an unsubscribe function */
  subscribe(fn) {
    this.subscribers.push(fn);
    return () => {
      let idx = this.subscribers.indexOf(fn);
      if (idx !== -1) {
        this.subscribers.splice(idx, 1);
      }
    };
  }

  /* Connect if not already connected */
  connect() {
    if (this.socket) return;
    this.socket = new ReconnectingWebSocket(
      WEBSOCKET_ENDPOINT, undefined, this.options);
    this.socket.addEventListener("open", () => {
      this.$log.info("socket opened!");
    });
    this.socket.addEventListener("message", (event) => {
      let data;
      try {
        data = angular.fromJson(event.data);
      } catch (err) {
        this.$log.error("websocket message was not json", event.data);
        return;
      }
      this.subscribers.forEach((fn) => fn(data));
    });
  }

}

export default SocketService;
