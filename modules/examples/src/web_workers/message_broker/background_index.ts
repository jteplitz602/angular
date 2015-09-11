import {bootstrapWebWorker} from "angular2_worker/worker";
import {App} from "./index_common";

export function main() {
  bootstrapWebWorker(App);
}
