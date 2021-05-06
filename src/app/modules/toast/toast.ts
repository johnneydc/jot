export class Toast {

  public promise: Promise<void>;
  public resolve: () => any;
  public state: ToastState = ToastState.NONE;

  constructor(
    public id: string,
    public content: string
  ) {
    this.promise = new Promise<void>(resolve => {
      this.resolve = resolve;
    });
  }
}

export enum ToastState {
  NONE = 'n', SHOWN = 's', HIDDEN = 'h'
}
