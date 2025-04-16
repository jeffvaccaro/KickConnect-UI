import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserService } from '../../../../services/user.service';
import { EventService } from '../../../../services/event.service';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
    selector: 'app-event-list',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatTabsModule],
    templateUrl: './event-list.component.html',
    styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit, AfterViewInit {
  private eventArr: any[] = [];
  accountCode: string;
  accountId: number;
  displayedColumns: string[] = ['Name', 'Description','Action'];
  dataSource = new MatTableDataSource(this.eventArr);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private eventService: EventService, private userService: UserService, private router: Router,
              private route: ActivatedRoute, private cdr: ChangeDetectorRef, 
              private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.userService.getAccountCode().subscribe(accountCode => {
      this.accountCode = accountCode;
      this.cdr.detectChanges();
    });

    this.userService.getAccountId().subscribe(accountId => {
      this.accountId = Number(accountId);
      this.cdr.detectChanges;
    })
    this.getEventList(this.accountId);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  active = true;
  inactive = true;

  getEventList(accountId: number, status = 'Active'): void {
    this.eventService.getEvents(accountId).subscribe({
      next: response => {
        this.eventArr = response;
        this.dataSource.data = status === 'All' ? this.eventArr : this.eventArr.filter(item => item.isActive === (status === 'Active' ? 1 : 0));
      },
      error: error => {
        this.snackbarService.openSnackBar('Error fetching event data!','',[]);
      }
    });
  }

  onTabChange(event: MatTabChangeEvent): void {
    let status: string;
    switch (event.index) {
      case 0:
        status = 'Active';
        break;
      case 1:
        status = 'InActive';
        break;
      case 2:
        status = 'All';
        break;
      default:
        status = 'Active';
    }
    this.getEventList(this.accountId, status);
  }

  btnAddNewClick() {
    this.router.navigate(['/app-add-new-event']);
  }

  editEvent(eventId: number){
    this.router.navigate(['/app-edit-event', eventId]);
  }

  deleteEvent(eventId: number){
    this.eventService.deactivateEvent(this.accountId,eventId).subscribe({
      next: response => {
        this.getEventList(this.accountId);
      },
      error: error => {
        this.snackbarService.openSnackBar('Error Deleting the Event!','',[]);
      }
    });


    
  }

  filterLocations(){
  }
}
