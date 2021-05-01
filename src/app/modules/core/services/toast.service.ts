import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class ToastService {
  constructor(
    private readonly snackBar: MatSnackBar
  ) { }

  public show(message: string) {
    this.snackBar.open(message, null, {
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      duration: 1000
    });
  }
}
