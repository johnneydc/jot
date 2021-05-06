import {EventEmitter, Injectable} from '@angular/core';
import {Toast} from './toast';

@Injectable()
export class ToastService {

  public readonly queue: EventEmitter<Toast> = new EventEmitter<Toast>();

  public async show(message: string): Promise<void> {
    const toast = Toast.Info(message);
    this.queue.emit(toast);
    return toast.promise;
  }

  public async showError(message: string): Promise<void> {
    const toast = Toast.Error(message);
    this.queue.emit(toast);
    return toast.promise;
  }

  public async showSuccess(message: string): Promise<void> {
    const toast = Toast.Success(message);
    this.queue.emit(toast);
    return toast.promise;
  }
}
