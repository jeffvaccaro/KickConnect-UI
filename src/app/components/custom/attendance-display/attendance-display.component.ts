import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { SchedulerService } from '../../../services/scheduler.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-attendance-display',
    standalone: true,
    imports: [CommonModule, QRCodeComponent],
    templateUrl: './attendance-display.component.html',
    styleUrl: './attendance-display.component.scss'
})
export class AttendanceDisplayComponent {
  public classArr: any[] = [];
  accountCode: string;
  accountId: number;
  constructor(private scheduler: SchedulerService, private snackBarService: SnackbarService) {}

  ngOnInit(): void {
    this.scheduler.getNextClass(2).subscribe({
      next: response => {
        this.classArr = response;
        if (this.classArr.length === 0 || !this.classArr[0]?.eventId) {
          console.error('No valid data for QR Code!');
        }else{
          console.log('eventId',this.classArr[0]?.eventId);
        }
      },
      error: error => {
        this.snackBarService.openSnackBar('Error fetching next class: ' + error.message, '', []);
      }
    });
  }
}
