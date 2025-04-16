import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'custom-user',
  standalone: true,
  imports: [MatMenuModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  accountCode: string;
  accountId: string;
  userName: string;
  userInitial: string;
  roleName: string;
  constructor(private userService: UserService, private cdr: ChangeDetectorRef){

  }

  ngOnInit(): void {
    this.userService.getAccountCode().subscribe(accountCode => {
      this.accountCode = accountCode;
      this.cdr.detectChanges();
    });

    this.userService.getAccountId().subscribe(accountId => {
      this.accountId = accountId;
      this.cdr.detectChanges();
    });

    this.userService.getUserName().subscribe(userName => {
      this.userName = userName;
      this.userInitial = userName.charAt(0);
      this.cdr.detectChanges();
    });

    this.userService.getRoleName().subscribe(roleName => {
      this.roleName = roleName;
      this.cdr.detectChanges();
    });

  }

}
