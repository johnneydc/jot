import {Component, OnDestroy, OnInit} from '@angular/core';
import {Toast, ToastState} from './toast';
import {ToastService} from './toast.service';
import {Subscription} from 'rxjs';
import {time} from '../core/utils/time';
import {Arrays} from '../core/utils/arrays';

@Component({
  selector: 'toast',
  template: `
    <div class="toast-container">
      <ng-container *ngFor="let toast of toasts">
        <div class="toast">
          <span class="toast--text">{{ toast.content }}</span>
        </div>
      </ng-container>
    </div>
  `
})
export class ToastComponent implements OnInit, OnDestroy {

  public toasts: Toast[] = [];
  private toastSub: Subscription;

  constructor(
    private readonly toastService: ToastService
  ) { }

  async ngOnInit() {
    this.toastSub = this.toastService.toastQueue.asObservable()
      .subscribe(toast => this.push(toast));
  }

  private async push(toast: Toast) {
    this.toasts.push(toast);

    await time(100);
    toast.state = ToastState.SHOWN;
    toast.resolve();

    const timeToRemoveToast = Math.min(Math.max(toast.content.length * 50, 2000), 7000);

    await time(timeToRemoveToast);
    await this.remove(toast);
  }

  ngOnDestroy() {
    this.toastSub.unsubscribe();
  }

  private async remove(toast: Toast) {
    toast.state = ToastState.HIDDEN;
    await time(600);
    Arrays.remove(toast, this.toasts);
  }
}
