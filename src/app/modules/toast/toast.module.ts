import {NgModule} from '@angular/core';
import {ToastComponent} from './toast.component';
import {CommonModule} from '@angular/common';
import {ToastService} from './toast.service';

@NgModule({
  declarations: [ToastComponent],
  imports: [
    CommonModule
  ],
  exports: [ToastComponent],
  providers: [ToastService]
})
export class ToastModule { }
