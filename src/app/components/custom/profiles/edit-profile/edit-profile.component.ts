import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../../../../interfaces/user';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-profile',
    imports: [CommonModule, MatCardModule, MatDividerModule, MatButtonModule],
    templateUrl: './edit-profile.component.html',
    styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit 
{
  userId: number;
  private userArr: IUser[] = [];
  public user: IUser;
  
  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
      // console.log(this.userId);
    });
    
    //console.log('AccountCode:',accountCode);
    this.userService.getUser(this.userId).subscribe({
      next: response => {
        this.user = response;
        console.log('from userService',this.user);
      },
      error: error => {
        console.error('Error fetching users:', error);
        // Handle error here (e.g., show error message)
      }
    });
  }    
}
