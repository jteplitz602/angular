var _FileReader = FileReader;
var _DataView = DataView;
var _ArrayBuffer = ArrayBuffer;
var _Uint8ClampedArray = Uint8Array;
var _ImageData = ImageData;

export {
  _FileReader as FileReader,
  _DataView as DataView,
  _ArrayBuffer as ArrayBuffer,
  _Uint8ClampedArray as Uint8ClampedArray,
  _ImageData as ImageData
};

export class Uint8ArrayWrapper {
  static create(buffer: ArrayBuffer) { return new Uint8Array(buffer); }
}
