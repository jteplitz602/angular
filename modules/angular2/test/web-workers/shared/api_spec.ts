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

//import {DirectiveMetadata, DirectiveMetadataFactory} from "angular2/src/web-workers/shared/api";
import {DirectiveMetadata} from "angular2/src/render/api";
import {Json} from "angular2/src/facade/lang";

export function main(){
  describe("DirectiveMetadata Interface", function(){
    it('should be the same after serializing and deserializing', () => {
      //var metadata: DirectiveMetadata = DirectiveMetadataFactory.create({
      var metadata = new DirectiveMetadata({
        id: "id1",
        selector: "#id1",
        compileChildren: true,
        type: 1,
        callOnDestroy: false,
        callOnCheck: false,
        callOnInit: false,
        callOnChange: false,
        callOnAllChangesDone: false
      });
      var stringified = Json.stringify(metadata);
      expect(Json.parse(stringified)).toEqual(metadata);
    });
  });
}
