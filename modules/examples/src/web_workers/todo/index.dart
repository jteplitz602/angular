library angular2.examples.web_workers.todo.index;

import "package:angular2_worker/ui.dart" show bootstrap;
import "package:angular2/src/core/reflection/reflection_capabilities.dart";
import "package:angular2/src/core/reflection/reflection.dart";

main() {
  reflector.reflectionCapabilities = new ReflectionCapabilities();
  bootstrap("background_index.dart");
}
