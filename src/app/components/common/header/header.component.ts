import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToggleService } from './toggle.service';
import { NgClass, DatePipe } from '@angular/common';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-header',
    imports: [RouterLink, NgClass, MatMenuModule, MatIconModule, MatButtonModule, DatePipe,],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    isToggled = false;
      accountCode: string;
      accountId: string;
      userId: string;
      userName: string;
      userInitial: string;
      roleName: string;

    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService,
        private userService: UserService, private cdr: ChangeDetectorRef, private router: Router
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.currentDate = new Date();
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

        this.userService.getUserId().subscribe(userId => {
            this.userId = userId;
            this.cdr.detectChanges();
        })
    
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

    currentDate: Date;
    toggle() {
        this.toggleService.toggle();
    }
    profile(){
        this.router.navigate(['app-edit-user', this.accountId]);
    }

    // toggleTheme() {
    //     this.themeService.toggleTheme();
    // }


    // toggleSidebarTheme() {
    //     this.themeService.toggleSidebarTheme();
    // }

    // toggleHideSidebarTheme() {
    //     this.themeService.toggleHideSidebarTheme();
    // }

    // toggleCardBorderTheme() {
    //     this.themeService.toggleCardBorderTheme();
    // }

    // toggleHeaderTheme() {
    //     this.themeService.toggleHeaderTheme();
    // }

    // toggleCardBorderRadiusTheme() {
    //     this.themeService.toggleCardBorderRadiusTheme();
    // }

    // toggleRTLEnabledTheme() {
    //     this.themeService.toggleRTLEnabledTheme();
    // }

}