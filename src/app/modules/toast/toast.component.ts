import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Toast, ToastState} from './toast';
import {ToastService} from './toast.service';
import {Subscription} from 'rxjs';
import {time} from '../core/utils/time';
import {Arrays} from '../core/utils/arrays';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'toast-box',
  template: `
    <div class="toast--box">
      <div *ngFor="let toast of toasts; trackBy: trackById" class="toast" [@state]="toast.state">
        <ng-container [ngSwitch]="toast.type">
            <mat-icon *ngSwitchCase="'success'" class="toast--icon success">check_circle</mat-icon>
            <mat-icon *ngSwitchCase="'error'" class="toast--icon error">error</mat-icon>
            <mat-icon *ngSwitchCase="'info'" class="toast--icon info">info</mat-icon>
        </ng-container>
        <span class="toast--text">{{ toast.content }}</span>
        <span class="toast--close-btn--box">
          <button class="toast--close-btn" type="button">&times;</button>
        </span>
      </div>
    </div>
  `,
  animations: [
    trigger('state', [
      state(ToastState.SHOWN, style({ opacity: 1 })),
      state(ToastState.HIDDEN, style({ opacity: 0 })),
      transition(`${ToastState.SHOWN} => ${ToastState.HIDDEN}`, animate('100ms')),
      transition(`${ToastState.HIDDEN} => ${ToastState.SHOWN}`, animate('50ms')),
    ])
  ],
  styles: [`
    :host {
      background: transparent;
      position: fixed;
      z-index: 1070;
      width: 100%;
      padding: 5%;
      padding-top: 30px;
      box-sizing: border-box;
      pointer-events: none;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {

  public toasts: Toast[] = [];
  private toastSub: Subscription;
  public trackById = (i: number, item: Toast) => item.id;

  constructor(
    private readonly toastService: ToastService,
    private readonly cdRef: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.toastSub = this.toastService.queue.asObservable()
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
    this.cdRef.markForCheck();
  }
}
