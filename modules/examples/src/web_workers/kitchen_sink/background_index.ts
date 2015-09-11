import {HelloCmp} from "./index_common";
import {bootstrapWebWorker} from "angular2_worker/worker";

export function main() {
  bootstrapWebWorker(HelloCmp);
}
