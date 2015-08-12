library examples.src.web_workers.word_tree.tagger;

import 'dart:js';

List<dynamic> tagWords(String text) {
  var lexer = new JsObject(context['Lexer']);
  var words = lexer.callMethod('lex', [text]);

  var tagger = new JsObject(context['POSTagger']);
  var taggedWords = tagger.callMethod('tag', [words]);

  return taggedWords;
}
