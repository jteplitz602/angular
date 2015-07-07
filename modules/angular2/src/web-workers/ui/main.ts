import {
  MessageBus,
  MessageBusSource,
  MessageBusSink,
  SourceListener
} from "angular2/src/web-workers/shared/message_bus";

export function bootstrap(uri: string): void{
  // TODO: Attach renderer listener to this MessageBus
  spawnWorker(uri);
}

export function spawnWorker(uri: string): MessageBus{
  var worker: Worker = new Worker(uri);
  return new UIMessageBus(new UIMessageBusSink(worker), new UIMessageBusSource(worker));
}

class UIMessageBus implements MessageBus{
  sink: UIMessageBusSink;
  source: UIMessageBusSource;

  constructor(sink: UIMessageBusSink, source: UIMessageBusSource){
    this.sink = sink;
    this.source = source;
  }
}

class UIMessageBusSink implements MessageBusSink{
  private worker: Worker;

  constructor(worker: Worker){
    this.worker = worker;
  }

  public send(message: Object){
    this.worker.postMessage(message);
  }
}

class UIMessageBusSource implements MessageBusSource{
  private worker: Worker;

  constructor(worker: Worker){
    this.worker = worker;
  }

  public listen(fn: SourceListener){
    this.worker.addEventListener("message", fn);
  }
}
