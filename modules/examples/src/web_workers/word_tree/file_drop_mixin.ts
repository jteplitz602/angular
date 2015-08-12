import {document} from 'angular2/src/facade/browser';
import {createChangeEvent} from './event_facade';

export class FileDropMixin {
  shadow: any;
  value: any;

  createdCallback(): void {
    var self = <any>this;

    this.shadow = self.createShadowRoot();
    var template = <any>document.querySelector("#file-drop");
    var clone = document.importNode(template.content, true);
    this.shadow.appendChild(clone);

    self.addEventListener("dragover", this.handleDragOver, false);
    self.addEventListener("dragleave", this.handleDragOut, false);
    self.addEventListener("drop", this.handleDrop, false);
  }

  // Dart uses different names for custom element lifecycle callbacks
  created(): void { this.createdCallback(); }

  handleDragOver(e): void {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (e.dataTransfer.files) {
      this.shadow.querySelector(".message").innerText = "Drop it";
    }
  }

  handleDragOut(e): void {
    this.shadow.querySelector(".message").innerText = "Drop .txt File Here";
  }

  handleDrop(e): void {
    var self = <any>this;
    e.stopPropagation();
    e.preventDefault();

    this.value = e.dataTransfer.files;

    var event = createChangeEvent();
    self.dispatchEvent(event);
    this.shadow.querySelector(".message").innerText = "Drop .txt File Here";
  }
}
