library angular.web-workers.ui;

import 'dart:isolate';
import 'dart:async';

void bootstrap(uri: String){
  // TODO: Attach renderer listener to the MessageBus returned in the Future
  spawnWorker(Uri.parse(uri));
}

/**
 * To be called from the main thread to spawn and communicate with the worker thread
 */
Future<UIMessageBus> spawnWorker(Uri uri){
  var receivePort = new ReceivePort();
  var isolateEndSendPort = receivePort.sendPort;
  return Isolate.spawnUri(uri, const [], isolateEndSendPort).then((_) {
    var source = new IsolateMessageSource(receivePort);
    return source.sink.then((sendPort) => new UIMessageBus(sendPort, receivePort));
  });
}

class UIMessageBus{
  final UIMessageBusSink _sink;
  final UIMessageBusSource _source;

  MessageBus(SendPort sPort, ReceivePort rPort)
    : _sink = new UIMessageBusSink(sPort),
      _source = new UIMessageBusSource(rPort);
}

class UIMessageBusSink{
  final SendPort _port;

  UIMessageBusSink(SendPort port)
      : _port = port;

  void send(message){
    _port.send(message);
  }
}

class UIMessageBusSource{
  final ReceivePort _port;
  final Stream rawDataStream;

  UIMessageBusSource(ReceivePort port)
      : _port = port,
        rawDataStream = port.asBroadcastStream();

  Future<SendPort> get sink => rawDataStream.firstWhere((message){
    return message is SendPort;
  });
}
