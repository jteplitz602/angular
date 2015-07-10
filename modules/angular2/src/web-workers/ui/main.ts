/*
 * This file is the entry point for the main thread
 * It takes care of spawning the worker and sending it the initial init message
 * It also acts and the messenger between the worker thread and the renderer running on the UI
 * thread
 * TODO: This class might need to be refactored to match application.ts...
*/

import {DOM} from 'angular2/src/dom/dom_adapter';
import {Injector} from "angular2/di";
import {createInjector} from "./di";
import {
  Renderer,
  RenderCompiler,
  DirectiveMetadata,
  ProtoViewDto,
  ViewDefinition,
  RenderProtoViewRef,
  RenderProtoViewMergeMapping,
  RenderViewRef,
  RenderFragmentRef
} from "angular2/src/render/api";
import {Type, print, BaseException} from "angular2/src/facade/lang";
import {Promise, PromiseWrapper} from "angular2/src/facade/async";
import {Serializer} from "angular2/src/web-workers/shared/serializer";
import {MessageBus} from "angular2/src/web-workers/shared/message_bus";
import {
  RenderViewWithFragmentsStore
} from 'angular2/src/web-workers/shared/render_view_with_fragments_store';
import {createNgZone} from "angular2/src/core/application";
import {WorkerElementRef} from 'angular2/src/web-workers/shared/api';

export class WebWorkerMain {
  private _rootUrl: string;
  private _injector: Injector;
  private _renderCompiler: RenderCompiler;
  private _renderer: Renderer;
  private _renderViewWithFragmentsStore: RenderViewWithFragmentsStore;
  private _serializer: Serializer;

  constructor(private bus: MessageBus, errorReporter: Function = null) {
    var zone = createNgZone(errorReporter);
    zone.run(() => {
      this._injector = createInjector(zone);
      this._renderCompiler = this._injector.get(RenderCompiler);
      this._renderer = this._injector.get(Renderer);
      this._renderViewWithFragmentsStore = this._injector.get(RenderViewWithFragmentsStore);
      this._serializer = this._injector.get(Serializer);
      // Get the root url
      var a = DOM.createElement('a');
      DOM.resolveAndSetHref(a, './', null);
      this._rootUrl = DOM.getHref(a);

      bus.source.addListener((message) => { this._handleWorkerMessage(message); });
    });
  }

  private _sendInitMessage() { this._sendWorkerMessage("init", {"rootUrl": this._rootUrl}); }

  /*
   * Sends an error back to the worker thread in response to an opeartion on the UI thread
   */
  private _sendWorkerError(id: string, error: any) {
    this._sendWorkerMessage("error", {"id": id, "error": error});
  }

  private _sendWorkerMessage(type: string, data: StringMap<string, any>) {
    this.bus.sink.send({'type': type, 'value': data});
  }

  // TODO: Transfer the types with the serialized data so this can be automated?
  private _handleCompilerMessage(data: ReceivedMessage) {
    var promise: Promise<any>;
    switch (data.method) {
      case "compileHost":
        var directiveMetadata = this._serializer.deserialize(data.args[0], DirectiveMetadata);
        promise = this._renderCompiler.compileHost(directiveMetadata);
        this._wrapWorkerPromise(data.id, promise, ProtoViewDto);
        break;
      case "compile":
        var view = this._serializer.deserialize(data.args[0], ViewDefinition);
        promise = this._renderCompiler.compile(view);
        this._wrapWorkerPromise(data.id, promise, ProtoViewDto);
        break;
      case "mergeProtoViewsRecursively":
        var views = this._serializer.deserialize(data.args[0], RenderProtoViewRef);
        promise = this._renderCompiler.mergeProtoViewsRecursively(views);
        this._wrapWorkerPromise(data.id, promise, RenderProtoViewMergeMapping);
        break;
      default:
        throw new BaseException("not implemented");
    }
  }

  private _createViewHelper(args: List<any>, method) {
    var hostProtoView = this._serializer.deserialize(args[0], RenderProtoViewRef);
    var fragmentCount = args[1];
    var startIndex, renderViewWithFragments;
    if (method == "createView") {
      startIndex = args[2];
      renderViewWithFragments = this._renderer.createView(hostProtoView, fragmentCount);
    } else {
      var selector = args[2];
      startIndex = args[3];
      renderViewWithFragments =
          this._renderer.createRootHostView(hostProtoView, fragmentCount, selector);
    }
    this._renderViewWithFragmentsStore.store(renderViewWithFragments, startIndex);
  }

  private _handleRendererMessage(data: ReceivedMessage) {
    var args = data.args;
    switch (data.method) {
      case "createRootHostView":
      case "createView":
        this._createViewHelper(args, data.method);
        break;
      case "destroyView":
        var viewRef = this._serializer.deserialize(args[0], RenderViewRef);
        this._renderer.destroyView(viewRef);
        break;
      case "attachFragmentAfterFragment":
        var previousFragment = this._serializer.deserialize(args[0], RenderFragmentRef);
        var fragment = this._serializer.deserialize(args[1], RenderFragmentRef);
        this._renderer.attachFragmentAfterFragment(previousFragment, fragment);
        break;
      case "attachFragmentAfterElement":
        var element = this._serializer.deserialize(args[0], WorkerElementRef);
        var fragment = this._serializer.deserialize(args[1], RenderFragmentRef);
        this._renderer.attachFragmentAfterElement(element, fragment);
        break;
      case "detachFragment":
        var fragment = this._serializer.deserialize(args[0], RenderFragmentRef);
        this._renderer.detachFragment(fragment);
        break;
      case "hydrateView":
        var viewRef = this._serializer.deserialize(args[0], RenderViewRef);
        this._renderer.hydrateView(viewRef);
        break;
      case "dehydrateView":
        var viewRef = this._serializer.deserialize(args[0], RenderViewRef);
        this._renderer.dehydrateView(viewRef);
        break;
      case "setText":
        var viewRef = this._serializer.deserialize(args[0], RenderViewRef);
        var textNodeIndex = args[1];
        var text = args[2];
        this._renderer.setText(viewRef, textNodeIndex, text);
        break;
      case "setElementProperty":
        var elementRef = this._serializer.deserialize(args[0], WorkerElementRef);
        var propName = args[1];
        var propValue = args[2];
        this._renderer.setElementProperty(elementRef, propName, propValue);
        break;
      case "setElementAttribute":
        var elementRef = this._serializer.deserialize(args[0], WorkerElementRef);
        var attributeName = args[1];
        var attributeValue = args[2];
        this._renderer.setElementAttribute(elementRef, attributeName, attributeValue);
        break;
      case "setElementClass":
        var elementRef = this._serializer.deserialize(args[0], WorkerElementRef);
        var className = args[1];
        var isAdd = args[2];
        this._renderer.setElementClass(elementRef, className, isAdd);
        break;
      case "setElementStyle":
        var elementRef = this._serializer.deserialize(args[0], WorkerElementRef);
        var styleName = args[1];
        var styleValue = args[2];
        this._renderer.setElementStyle(elementRef, styleName, styleValue);
        break;
      case "invokeElementMethod":
        var elementRef = this._serializer.deserialize(args[0], WorkerElementRef);
        var methodName = args[1];
        var methodArgs = args[2];
        this._renderer.invokeElementMethod(elementRef, methodName, methodArgs);
        break;
      default:
        throw new BaseException("Not Implemented");
    }
  }

  // TODO: Create message type
  private _handleWorkerMessage(message: StringMap<string, any>) {
    var data: ReceivedMessage = new ReceivedMessage(message['data']);
    switch (data.type) {
      case "ready":
        return this._sendInitMessage();
      case "compiler":
        return this._handleCompilerMessage(data);
      case "renderer":
        return this._handleRendererMessage(data);
    }
  }

  private _wrapWorkerPromise(id: string, promise: Promise<any>, type: Type): void {
    PromiseWrapper.then(promise, (result: any) => {
      try {
        this._sendWorkerMessage("result",
                                {"id": id, "value": this._serializer.serialize(result, type)});
      } catch (e) {
        print(e);
      }
    }, (error: any) => { this._sendWorkerError(id, error); });
  }
}

class ReceivedMessage {
  method: string;
  args: List<any>;
  id: string;
  type: string;

  constructor(data: StringMap<string, any>) {
    this.method = data['method'];
    this.args = data['args'];
    this.id = data['id'];
    this.type = data['type'];
  }
}
