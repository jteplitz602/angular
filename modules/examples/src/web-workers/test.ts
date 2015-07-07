import {
  AsyncTestCompleter,
  beforeEach,
  xdescribe,
  ddescribe,
  describe,
  el,
  expect,
  iit,
  inject,
  IS_DARTIUM,
  it,
  SpyObject,
  proxy
} from 'angular2/test_lib';

import {TestInterface, TestInterface_impl} from "angular2/src/web-workers/shared/api";
import {StringMapWrapper, ListWrapper} from "angular2/src/facade/collection";
import {MessageBus} from "angular2/src/facade/message_bus";
import {Promise, PromiseWrapper} from "angular2/src/facade/async";
import {isJsObject} from "angular2/src/facade/lang";

export function main(){
  var object: TestInterface = new TestInterface_impl({
    id: "test",
    name: "testElem",
    selector: "#test",
    compiled: false,
    attributes: StringMapWrapper.create(),
    properties: ["hidden"]
  });
  var messageBusPromise: Promise<MessageBus> = MessageBus.createWorkerBus("test_worker");
  PromiseWrapper.then(messageBusPromise, (bus: MessageBus) => {
    bus.source.listen((result: any) => {
      if (propertyEquality(result.data, object)){
        document.write("success");
      } else {
        document.write("failure");
      }
    });
    bus.sink.send(object);
  });
}
function propertyEquality(first, second){
  if (first === second){
    return true;
  }
  if (first instanceof Array){
    if (!(second instanceof Array) || first.length !== second.length){
      return false;
    }
    var valid = true;
    for (var i = 0; i < first.length; i++){
      valid = propertyEquality(first[i], second[i]);
    }
    return valid;
  }
  var valid = true;
  StringMapWrapper.forEach(first, (v, k) => {
    if (!StringMapWrapper.contains(second, k)){
      valid = false;
    }
    var secondV = StringMapWrapper.get(second, k)
    if (v === secondV){
      return;
    }
    if (isJsObject(v)){
      valid = propertyEquality(v, secondV);
    }
  });
  StringMapWrapper.forEach(second, (v, k) => {
    if (!StringMapWrapper.contains(first, k)){
      valid = false;
    }
  });
  return valid;
}
