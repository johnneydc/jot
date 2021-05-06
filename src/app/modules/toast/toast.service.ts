import {EventEmitter, Injectable} from '@angular/core';
import {Toast} from './toast';
import {v4} from 'uuid';

@Injectable()
export class ToastService {

  public readonly queue: EventEmitter<Toast> = new EventEmitter<Toast>();

  public async show(message: string): Promise<void> {
    const toast = new Toast(v4(), message);
    this.queue.emit(toast);
    return toast.promise;
  }
}
