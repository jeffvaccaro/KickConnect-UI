import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../../../services/user.service';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatTabsModule, NgIf],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, AfterViewInit {
  private userArr: any[] = [];
  accountCode: string;
  accountId: number;
  displayedColumns: string[] = ['name', 'roleName','phone','action'];
  dataSource = new MatTableDataSource(this.userArr);
  roleName: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userService: UserService, private snackBarService: SnackbarService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    let status: string = '';
    this.route.queryParams.subscribe(params => {
      status = params['status'];
    });
  
    this.userService.getAccountCode().subscribe(accountCode => {
      this.accountCode = accountCode;
      this.cdr.detectChanges();
    });

    this.userService.getAccountId().subscribe(accountId => {
      this.accountId = Number(accountId);
      this.cdr.detectChanges;
    })

    this.userService.getRoleName().subscribe(roleName => {
      this.roleName.push(roleName);
      this.cdr.detectChanges();
    });  

    if(this.hasRoles(['Super Admin'])){
      this.displayedColumns.splice(1, 0, 'accountName'); // Add 'accountName' after 'name'
      this.getSuperUserAllUsers();
    }else{
      this.getUsers(this.accountCode);
    }
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  active = true;
  inactive = true;

  getSuperUserAllUsers(): void {
    this.userService.getSuperUserAllUsers().subscribe({
      next: response => {
        this.userArr = response;
        this.dataSource.data = this.userArr; // Update the dataSource here
        console.log(this.userArr);
      },
      error: error => {
        console.error('Error fetching users:', error);
        // Handle error here (e.g., show error message)
      }
    });    
  }

  getUsers(accountCode: string): void {
    //console.log('AccountCode:',accountCode);
    this.userService.getAllUsers(accountCode).subscribe({
      next: response => {
        this.userArr = response;
        this.dataSource.data = this.userArr; // Update the dataSource here
        console.log(this.userArr);
      },
      error: error => {
        console.error('Error fetching users:', error);
        // Handle error here (e.g., show error message)
      }
    });
  }

  getUsersByStatus(accountId: number, status: string): void {
    console.log('accountId:',accountId);
    console.log('status:',status);
    this.userService.getUsersByStatus(accountId, status).subscribe({
      next: response => {
        this.userArr = response;
        this.dataSource.data = this.userArr;
        console.log(this.userArr);
      },
      error: error => {
        this.snackBarService.openSnackBar('Error fetching User:' + error.message, '',  []);
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
      default:
        status = 'Active';
    }
    this.getUsersByStatus(this.accountId,status);
  }

  btnAddNewClick() {
    this.router.navigate(['/app-add-new-user']);
  }

  editUser(userId: number){
    this.router.navigate(['/app-edit-user', userId]);
  }
  filterLocations(){
    this.router.navigate(['/app-user-list'], { queryParams: { status: 'InActive' } });
  }

  hasRoles(roles: string[]): boolean {
    return roles.some(role => this.roleName.includes(role));
  }

  viewProfile(userId: number){
    this.router.navigate(['/app-edit-profile',userId]);
  }

  resetPassword(userId: number, accountCode: string) {
    if (!userId || !accountCode) {
      console.error('Invalid parameters:', { userId, accountCode });
      return;
    }
  
    //console.log('Sending reset link for user:', userId, 'with account code:', accountCode);
  
    this.userService.sendUserResetLink(userId.toString(), accountCode).subscribe({
      next: (response) => {
        // console.log('Reset link sent successfully:', response);
      },
      error: (error) => {
        console.error('Error sending reset link:', error);
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }
}




