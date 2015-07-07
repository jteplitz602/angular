import {isPresent} from "angular2/src/facade/lang";

export class MessageBus{
  sink: MessageBusSink;
  source: MessageBusSource;

  /**
   * To be called from the main thread to spawn and communicate with the worker thread
   */
  static createWorkerBus(url: string): MessageBus{
    return new MessageBus(new Worker(url + ".js"));
  }

  /**
   * To be called from the worker thread to communicate with the main thread
   */
  static createMainThreadBus(): MessageBus{
    return new MessageBus();
  }

  constructor(worker?: Worker){
    this.sink = new MessageBusSink(worker);
    this.source = new MessageBusSource(worker);
  }
}

export class MessageBusSink{
  worker: Worker;

  constructor(worker?: Worker){
    this.worker = worker;
  }

  send(message: Object){
    if (isPresent(this.worker)){
      this.worker.postMessage(message, null);
    } else {
      postMessage(message, null);
    }
  }
}

export class MessageBusSource{
  worker: Worker;

  constructor(worker?: Worker){
    this.worker = worker;
  }

  listen(fn: EventListener){
    if (isPresent(this.worker)){
      this.worker.addEventListener("message", fn);
    } else {
      addEventListener("message", fn);
    }
  }
}
