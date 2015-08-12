export function createChangeEvent(): Event {
  var event = <any>document.createEvent("HTMLEvents");
  event.initEvent("change", false, true);
  return event;
}
