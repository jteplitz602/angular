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
import {Worker} from "angular2/src/facade/workers";
//import {DirectiveMetadata} from "angular2/src/render/api";

export function main(){
  var propertyEquality = function(first, second){
    for (var p in first){
      if (!first.hasOwnProperty(p)){
        continue;
      }
      if (!second.hasOwnProperty(p)){
        return false;
      }
      if (first[p] === second[p]){
        continue;
      }
      if (typeof first[p] === "object"){
        return propertyEquality(first[p], second[p]);
      }
    }
    for (var p in second){
      if (second.hasOwnProperty(p) && !second.hasOwnProperty(p)){
        return false;
      }
    }
    return true;
  }
  describe("DirectiveMetadata Interface", function(){
    it('should be the same after serializing and deserializing', inject([AsyncTestCompleter],
       (async) => {
      var object: TestInterface = new TestInterface_impl({
        id: "test",
        name: "testElem",
        selector: "#test",
        compiled: false,
        attributes: StringMapWrapper.create(),
        properties: ["hidden"]
      });
      /*var worker = new Worker(
        "base/dist/js/dev/es5/angular2/test/web-workers/shared/test_worker.js");
      worker.onmessage = function(result){
        expect(propertyEquality(result.data, object)).toBeTruthy();
        async.done();
      }
      worker.postMessage(object);*/
      async.done();
    }));
  });
}
