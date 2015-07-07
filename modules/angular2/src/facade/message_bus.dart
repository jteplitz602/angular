import 'dart:isolate';

class MessageBus{
  MessageBusSink sink;
  MessageBusSource source;



  MessageBus(SendPort sPort, ReceivePort rPort){

  }
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

  MessageBusSource(ReceivePort port)
      : _port = port;
}
