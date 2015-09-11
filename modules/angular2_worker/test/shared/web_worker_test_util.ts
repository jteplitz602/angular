import {Parser} from 'angular2/src/core/change_detection/parser/parser';
import {Injector} from 'angular2/src/core/di';
import {StringMap, StringMapWrapper, ListWrapper} from 'angular2/src/core/facade/collection';
import {MessageBusSink, MessageBusSource, MessageBus} from 'angular2_worker/src/shared/message_bus';
import {MockEventEmitter} from './mock_event_emitter';
import {BaseException} from 'angular2/src/core/facade/lang';
import {Serializer} from 'angular2_worker/src/shared/serializer';
import {NgZone} from 'angular2/src/core/zone/ng_zone';
import {RenderProtoViewRefStore} from "angular2_worker/src/shared/render_proto_view_ref_store";
import {
  RenderViewWithFragmentsStore,
} from 'angular2_worker/src/shared/render_view_with_fragments_store';

/**
 * Returns two MessageBus instances that are attached to each other.
 * Such that whatever goes into one's sink comes out the others source.
 */
export function createPairedMessageBuses(): PairedMessageBuses {
  var firstChannels: StringMap<string, MockEventEmitter> = {};
  var workerMessageBusSink = new MockMessageBusSink(firstChannels);
  var uiMessageBusSource = new MockMessageBusSource(firstChannels);

  var secondChannels: StringMap<string, MockEventEmitter> = {};
  var uiMessageBusSink = new MockMessageBusSink(secondChannels);
  var workerMessageBusSource = new MockMessageBusSource(secondChannels);

  return new PairedMessageBuses(new MockMessageBus(uiMessageBusSink, uiMessageBusSource),
                                new MockMessageBus(workerMessageBusSink, workerMessageBusSource));
}

export class PairedMessageBuses {
  constructor(public ui: MessageBus, public worker: MessageBus) {}
}

export class MockMessageBusSource implements MessageBusSource {
  constructor(private _channels: StringMap<string, MockEventEmitter>) {}

  initChannel(channel: string, runInZone = true) {
    if (!StringMapWrapper.contains(this._channels, channel)) {
      this._channels[channel] = new MockEventEmitter();
    }
  }

  from(channel: string): MockEventEmitter {
    if (!StringMapWrapper.contains(this._channels, channel)) {
      throw new BaseException(`${channel} is not set up. Did you forget to call initChannel?`);
    }
    return this._channels[channel];
  }

  attachToZone(zone: NgZone) {}
}

export class MockMessageBusSink implements MessageBusSink {
  constructor(private _channels: StringMap<string, MockEventEmitter>) {}

  initChannel(channel: string, runInZone = true) {
    if (!StringMapWrapper.contains(this._channels, channel)) {
      this._channels[channel] = new MockEventEmitter();
    }
  }

  to(channel: string): MockEventEmitter {
    if (!StringMapWrapper.contains(this._channels, channel)) {
      this._channels[channel] = new MockEventEmitter();
    }
    return this._channels[channel];
  }

  attachToZone(zone: NgZone) {}
}

/**
 * Mock implementation of the {@link MessageBus} for tests.
 * Runs syncronously, and does not support running within the zone.
 */
export class MockMessageBus extends MessageBus {
  constructor(public sink: MockMessageBusSink, public source: MockMessageBusSource) { super(); }

  initChannel(channel: string, runInZone = true) {
    this.sink.initChannel(channel, runInZone);
    this.source.initChannel(channel, runInZone);
  }

  to(channel: string): MockEventEmitter { return this.sink.to(channel); }

  from(channel: string): MockEventEmitter { return this.source.from(channel); }

  attachToZone(zone: NgZone) {}
}

export function createSerializer(injector: Injector,
                                 protoViewRefStore: RenderProtoViewRefStore = null,
                                 renderViewStore: RenderViewWithFragmentsStore = null): Serializer {
  protoViewRefStore =
      (protoViewRefStore != null) ? protoViewRefStore : injector.get(RenderProtoViewRefStore);
  renderViewStore =
      (renderViewStore != null) ? renderViewStore : injector.get(RenderViewWithFragmentsStore);
  return new Serializer(injector.get(Parser), protoViewRefStore, renderViewStore);
}
