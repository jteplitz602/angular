library angular2_worker.src.worker.web_socket_message_bus;

import 'dart:html';
import 'dart:convert' show JSON;
import 'package:angular2_worker/src/shared/generic_message_bus.dart';

class WebSocketMessageBus extends GenericMessageBus {
  WebSocketMessageBus(
      WebSocketMessageBusSink sink, WebSocketMessageBusSource source)
      : super(sink, source);

  WebSocketMessageBus.fromWebSocket(WebSocket webSocket)
      : super(new WebSocketMessageBusSink(webSocket),
            new WebSocketMessageBusSource(webSocket));
}

class WebSocketMessageBusSink extends GenericMessageBusSink {
  final WebSocket _webSocket;

  WebSocketMessageBusSink(this._webSocket);

  void sendMessages(List<dynamic> messages) {
    _webSocket.send(JSON.encode(messages));
  }
}

class WebSocketMessageBusSource extends GenericMessageBusSource {
  WebSocketMessageBusSource(WebSocket webSocket) : super(webSocket.onMessage);

  List<dynamic> decodeMessages(MessageEvent event) {
    var messages = event.data;
    return JSON.decode(messages);
  }
}
