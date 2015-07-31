export 'dart:html' show FileReader, ImageData;

import 'dart:typed_data';

class Uint8ArrayWrapper {
  static Uint8ClampedList create(ByteBuffer buffer) {
    return new Uint8ClampedList.view(buffer);
  }
}

abstract class ArrayBuffer extends ByteBuffer {
}

abstract class Uint8ClampedArray extends Uint8ClampedList {
  Uint8ClampedArray(int length) {
    super.Uint8ClampedArray(length);
  }

  Uint8ClampedArray(ByteBuffer buffer, int length) {
    super.view(buffer, length);
  }
}

class DataView {
  ByteData _view;

  DataView(ByteBuffer buffer) {
    this._view = new ByteData.view(buffer);
  }

  int getUint16(int byteOffset, bool BIG_ENDIAN) {
    return _view.getUint16(byteOffset, _convertEndianness(BIG_ENDIAN));
  }

  int getUint32(int byteOffset, bool BIG_ENDIAN) {
    return _view.getUint32(byteOffset, _convertEndianness(BIG_ENDIAN));
  }

  Endianness _convertEndianness(bool BIG_ENDIAN) {
    return (BIG_ENDIAN) ? Endianness.BIG_ENDIAN : Endianness.LITTLE_ENDIAN;
  }
}
