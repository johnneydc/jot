import {canBeAnImage, canBeAUrl} from '../utils';

export enum ClipboardObjectType {
  IMAGE, LINK, TEXT
}

export class ClipboardObject {
  type: ClipboardObjectType;

  constructor(ev: ClipboardEvent) {
    if (canBeAnImage(ev.clipboardData)) {
      this.type = ClipboardObjectType.IMAGE;
    } else if (canBeAUrl(ev.clipboardData)) {
      this.type = ClipboardObjectType.LINK;
    } else {
      this.type = ClipboardObjectType.TEXT;
    }
  }
}
