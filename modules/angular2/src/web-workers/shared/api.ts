import {StringMap, List, StringMapWrapper} from "angular2/src/facade/collection";
import {isPresent, isBlank, RegExpWrapper} from "angular2/src/facade/lang";

export interface DirectiveMetadata {
  DIRECTIVE_TYPE: number,
  COMPONENT_TYPE: number,
  id: any;
  selector: string;
  compileChildren: boolean;
  events: List<string>;
  properties: List<string>;
  readAttributes: List<string>;
  type: number;
  callOnDestroy: boolean;
  callOnChange: boolean;
  callOnCheck: boolean;
  callOnInit: boolean;
  callOnAllChangesDone: boolean;
  changeDetection: string;
  exportAs: string;
  hostListeners: StringMap<string, string>;
  hostProperties: StringMap<string, string>;
  hostAttributes: StringMap<string, string>;
  hostActions: StringMap<string, string>;
}

var hostRegExp = RegExpWrapper.create('^(?:(?:\\[([^\\]]+)\\])|(?:\\(([^\\)]+)\\))|(?:@(.+)))$');

export class DirectiveMetadataFactory{
  static create({id, selector, compileChildren, events, host, properties, readAttributes, type,
                 callOnDestroy, callOnChange, callOnCheck, callOnInit, callOnAllChangesDone,
                 changeDetection, exportAs}: {
    id?: string,
    selector?: string,
    compileChildren?: boolean,
    events?: List<string>,
    host?: StringMap<string, string>,
    properties?: List<string>,
    readAttributes?: List<string>,
    type?: number,
    callOnDestroy?: boolean,
    callOnChange?: boolean,
    callOnCheck?: boolean,
    callOnInit?: boolean,
    callOnAllChangesDone?: boolean,
    changeDetection?: string,
    exportAs?: string
  }): DirectiveMetadata {
    let hostListeners = StringMapWrapper.create();
    let hostProperties = StringMapWrapper.create();
    let hostAttributes = StringMapWrapper.create();
    let hostActions = StringMapWrapper.create();

    if (isPresent(host)) {
      StringMapWrapper.forEach(host, (value: string, key: string) => {
        var matches = RegExpWrapper.firstMatch(hostRegExp, key);
        if (isBlank(matches)) {
          StringMapWrapper.set(hostAttributes, key, value);
        } else if (isPresent(matches[1])) {
          StringMapWrapper.set(hostProperties, matches[1], value);
        } else if (isPresent(matches[2])) {
          StringMapWrapper.set(hostListeners, matches[2], value);
        } else if (isPresent(matches[3])) {
          StringMapWrapper.set(hostActions, matches[3], value);
        }
      });
    }

    return {
      DIRECTIVE_TYPE: 0,
      COMPONENT_TYPE: 1,
      id: id,
      selector: selector,
      compileChildren: compileChildren,
      events: events,
      hostListeners: hostListeners,
      hostProperties: hostProperties,
      hostAttributes: hostAttributes,
      hostActions: hostActions,
      properties: properties,
      readAttributes: readAttributes,
      type: type,
      callOnDestroy: callOnDestroy,
      callOnChange: callOnChange,
      callOnCheck: callOnCheck,
      callOnInit: callOnInit,
      callOnAllChangesDone: callOnAllChangesDone,
      changeDetection: changeDetection,
      exportAs: exportAs
    }
  }
}
