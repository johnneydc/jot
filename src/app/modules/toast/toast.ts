import {v4} from 'uuid';

export class Toast {

  public promise: Promise<void>;
  public resolve: () => any;
  public state: ToastState = ToastState.NONE;

  constructor(
    public id: string,
    public content: string,
    public type: ToastType
  ) {
    this.promise = new Promise<void>(resolve => {
      this.resolve = resolve;
    });
  }

  static Error(content: string) {
    return new Toast(v4(), content, ToastType.ERROR);
  }

  static Info(content: string) {
    return new Toast(v4(), content, ToastType.INFO);
  }

  static Success(content: string) {
    return new Toast(v4(), content, ToastType.SUCCESS);
  }
}

export enum ToastState {
  NONE = 'n', SHOWN = 's', HIDDEN = 'h'
}

export enum ToastType {
  INFO = 'info', ERROR = 'error', SUCCESS = 'success'
}
