library angular.core.facade.message_bus;

import 'dart:isolate';
import 'dart:async';

class MessageBus{
  final MessageBusSink _sink;
  final MessageBusSource _source;

  const String LOADER_URI = "loader.dart";

  /**
   * To be called from the main thread to spawn and communicate with the worker thread
   */
  static Future<MessageBus> createWorkerBus(Uri uri){
    var receivePort = new ReceivePort();
    var isolateEndSendPort = receivePort.sendPort;
    return Isolate.spawnUri(uri, const [], isolateEndSendPort).then((_) {
      var source = new IsolateMessageSource(receivePort);
      return source.sink.then((sendPort) => new MessageBus(sendPort, receivePort));
    });
  }

  /**
   * To be called from the worker thread to spawn and communite with the main thread
   */
  static MessageBus createMainThreadBus(){

  }

  MessageBus(SendPort sPort, ReceivePort rPort)
      : _sink = new MessageBusSink(sPort),
        _source = new MessageBusSource(rPort);
}

class MessageBusSink{
  final SendPort _port;

  MessageBusSink(SendPort port)
      : _port = port;

  void send(message){
    _port.send(message);
  }
}

class MessageBusSource{
  final ReceivePort _port;
  final Stream rawDataStream;

  MessageBusSource(ReceivePort port)
      : _port = port,
        rawDataStream = port.asBroadcastStream();

  Future<SendPort> get sink => rawDataStream.firstWhere((message){
    return message is SendPort;
  });
}
