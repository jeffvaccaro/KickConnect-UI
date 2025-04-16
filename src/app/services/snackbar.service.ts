import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string, panelClasses: string[]) {
    this.snackBar.open(message, action, {
      duration: 2000, // Duration in milliseconds
      panelClass: panelClasses,
    });
  }
}
