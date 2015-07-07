library angular.core.facade.workers;

import "dart:html";
export 'dart:html' show Worker;

class WorkerWrapper{
  static Worker create(String url){
    return new Worker(url + ".js");
  }
  static void onMessage(Worker worker, fn(data)){
    worker.onMessage.listen((data){
      fn(data);
    });
  }
  static void postMessage(Worker worker, message){
    worker.postMessage(message);
  }
  static void terminate(Worker worker){
    worker.terminate();
  }
}
