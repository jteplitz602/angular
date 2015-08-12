import {document} from "angular2/src/facade/browser";

import {FileDropMixin} from './file_drop_mixin';

class FileDrop extends HTMLElement implements FileDropMixin {
  shadow: any = null;
  value: any = null;
  createdCallback: () => void;
  handleDragOver: (e) => void;
  handleDragOut: (e) => void;
  handleDrop: (e) => void;
}

applyMixins(FileDrop, [FileDropMixin]);

export function main() {
  var _document = <any>document;
  _document.registerElement("file-drop", {prototype: FileDrop.prototype});
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {Object.getOwnPropertyNames(baseCtor.prototype)
                                     .forEach(name => {
                                       derivedCtor.prototype[name] = baseCtor.prototype[name];
                                     })});
}
