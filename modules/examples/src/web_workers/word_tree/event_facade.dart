library angular2.examples.web_workers.text_analyzer.event_facade;

import 'dart:html';

Event createChangeEvent(){
  return new Event.eventType("InputEvent", "change");
}
