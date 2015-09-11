import {ClientMessageBroker} from 'angular2_worker/src/shared/client_message_broker';

import {SpyObject, proxy} from 'angular2/test_lib';

export class SpyMessageBroker extends SpyObject {
  constructor() { super(ClientMessageBroker); }
}
