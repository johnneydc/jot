import {NgModule} from '@angular/core';
import {ToastComponent} from './toast.component';
import {CommonModule} from '@angular/common';
import {ToastService} from './toast.service';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [ToastComponent],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [ToastComponent],
  providers: [ToastService]
})
export class ToastModule { }
