import {global} from 'angular2/src/facade/lang';
export declare var Worker;

export class WorkerWrapper{
  static create(url: string): Worker{
    return new Worker(url + ".js");
  }
  static onMessage(worker: Worker, fn: EventListener): void{
    worker.addEventListener("message", fn);
  }
  static postMessage(worker: Worker, message: Object): void{
    worker.postMessage(message);
  }
  static terminate(worker): void{
    worker.terminate();
  }
}
