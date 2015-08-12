import {Component, View, NgIf} from 'angular2/angular2';
import {ListWrapper, StringMapWrapper} from 'angular2/src/facade/collection';
import {FileReader} from "./html_facade";
import {tagWords} from "./tagger";

var TAG_MAP: StringMap<string, string> = {
  "CC": "Conjunction",
  "CD": "Number",
  "DT": "Determiner",
  "FW": "Foreign",
  "IN": "Preposition",
  "JJ": "Adjective",
  "JJR": "Adjective",
  "JJS": "Adjective",
  "MD": "Modal",
  "NN": "Noun",
  "NNS": "Noun",
  "NNP": "Proper Noun",
  "NNPS": "Proper Noun",
  "PP$": "Pronoun",
  "PRP": "Pronoun",
  "RB": "Adverb",
  "RBR": "Adverb",
  "RBS": "Adverb",
  "UH": "Injerection",
  "VB": "Verb",
  "VBG": "Verb",
  "VBD": "Verb",
  "VBN": "Verb",
  "VBP": "Verb",
  "VBZ": "Verb",
  "WH": "Pronoun",
  "WH$": "Pronoun",
  "WRB": "Adverb"
};

@Component({selector: "word-tree"})
@View({templateUrl: "word-tree.html", directives: [NgIf]})
export class WordTree {
  rows: List<List<any>> = [];
  showTree: boolean = false;
  loading: boolean = false;
  chartOptions: any = {title: 'Parts of Speech', height: 500, width: 800};

  readFile(e) {
    var files = e.target.value;
    var reader = new FileReader();
    reader.addEventListener("load", this.handleReaderLoad(reader));
    reader.readAsText(files[0]);

    this.loading = true;
  };

  handleReaderLoad(reader: FileReader){
    return (e) => {
      var text = reader.result;
      var rows = [];

      var tags = this._countTags(text);

      StringMapWrapper.forEach(tags, (v: number, k: string) => { rows.push([k, v]); });

      this.rows = rows;

      this.showTree = true;
      this.loading = false;
    }
  };

  private _countTags(text: string): StringMap<string, number> {
    var taggedWords = tagWords(text);
    var tags = {};

    for (var i = 0; i < taggedWords.length; i++) {
      var tag = taggedWords[i][1];
      if (!StringMapWrapper.contains(TAG_MAP, tag)) {
        // some of the tags are fairly esoteric and will only clutter up our chart
        continue;
      }

      tag = TAG_MAP[tag];
      if (!tags[tag]) {
        tags[tag] = 0;
      }
      tags[tag]++;
    }

    return tags;
  }
}
