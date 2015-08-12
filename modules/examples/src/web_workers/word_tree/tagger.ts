import {List} from 'angular2/src/facade/collection';

// TODO: Make a typings file for these and import properly
declare var POSTagger;
declare var Lexer;

export function tagWords(text: string): List<any> {
  var words = new Lexer().lex(text);
  var taggedWords = new POSTagger().tag(words);
  return taggedWords;
}
