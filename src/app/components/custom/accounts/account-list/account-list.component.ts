import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../../../../services/account.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
    selector: 'app-account-list',
    imports: [MatButtonModule, MatCardModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatTabsModule, MatTooltipModule],
    templateUrl: './account-list.component.html',
    styleUrl: './account-list.component.scss'
})
export class AccountListComponent implements OnInit, AfterViewInit {
  private accountArr: any[] = [];
  //displayedColumns: string[] = ['accountName', 'accountPhone', 'accountEmail', 'accountAddress', 'accountCity', 'accountState', 'accountZip'];
  displayedColumns: string[] = ['accountName', 'accountPhone', 'accountEmail', 'accountAddress'];
  dataSource = new MatTableDataSource(this.accountArr);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private accountService: AccountService, private userService: UserService, private router: Router, private route: ActivatedRoute){

  }
  ngOnInit(): void {
    this.getAccounts();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAccounts(status: string = ''): void {
    this.accountService.getAccounts().subscribe({
      next: response => {
        this.accountArr = response;
        this.resetDataSource();
        if (status === 'Active') {
          this.dataSource.data = this.accountArr.filter(account => account.isActive === 1);
        } else if (status === 'InActive') {
          this.dataSource.data = this.accountArr.filter(account => account.isActive === 0);
        }
      },
      error: error => {
        console.error('Error fetching accounts:', error);
      }
    });
  }
  
  onTabChange(event: MatTabChangeEvent): void {
    let status: string;
    switch (event.index) {
      case 0:
        status = 'Active';
        this.getAccounts('Active');
        break;
      case 1:
        status = 'InActive';
        this.getAccounts('InActive');
        break;
      default:
        status = 'Active';
        this.getAccounts('Active');
    }    
  }

  btnAddNewClick() {
    this.router.navigate(['/app-add-new-account']);
  }

  copyToClipboard(accountCode: string): void {
    navigator.clipboard.writeText(accountCode).then(() => {
      // console.log(`Copied to clipboard: ${accountCode}`);
    }).catch(err => {
      console.error('Error copying to clipboard', err);
    });
  }
  
  resetDataSource(): void {
    //console.log('this.accountArr',this.accountArr);
    this.dataSource.data = this.accountArr;
  }

  resetPassword(userId: number, accountCode: string){
    console.log(userId, accountCode);
    //this.userService.sendUserResetLink(userId.ToString(), accountCode);
  }
  
}
