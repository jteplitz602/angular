library examples.src.web_workers.word_tree.background_index;

import "index_common.dart" show WordTree;
import "dart:isolate";
import "package:angular2/src/web-workers/worker/application.dart"
    show bootstrapWebWorker;
import "package:angular2/src/reflection/reflection_capabilities.dart";
import "package:angular2/src/reflection/reflection.dart";

main(List<String> args, SendPort replyTo) {
  importScripts("tagger/lexicon.js, tagger/lexer.js, tagger/POSTagger.js");
  reflector.reflectionCapabilities = new ReflectionCapabilities();
  bootstrapWebWorker(replyTo, WordTree).catchError((error) => throw error);
}
