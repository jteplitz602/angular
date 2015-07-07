import {isPresent} from "angular2/src/facade/lang";
import {Promise, PromiseWrapper} from "angular2/src/facade/async";

export class MessageBus{
  sink: MessageBusSink;
  source: MessageBusSource;

  /**
   * To be called from the main thread to spawn and communicate with the worker thread
   */
  static createWorkerBus(url: string): Promise<MessageBus>{
    var promise: Promise<MessageBus> = PromiseWrapper.completer();
    promise.resolve(new MessageBus(new Worker(url + ".js")));
    return promise;
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

  send(message: Object): void{
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

  listen(fn: EventListener): void{
    if (isPresent(this.worker)){
      this.worker.addEventListener("message", fn);
    } else {
      addEventListener("message", fn);
    }
  }
}
