library angular2.examples.web_workers.text_analyzer.file_drop;

import 'file_drop_mixin.dart';
import 'dart:html';

class FileDrop extends HtmlElement with FileDropMixin {
  FileDrop.created() : super.created();
}

main() {
  document.registerElement("file-drop", FileDrop);
}
