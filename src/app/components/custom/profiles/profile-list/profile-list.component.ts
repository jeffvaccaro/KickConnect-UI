    import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
    import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
    import { MatTableDataSource, MatTableModule } from '@angular/material/table';
    import { ActivatedRoute, Router } from '@angular/router';
    import { MatCardModule } from '@angular/material/card';
    import { MatButtonModule } from '@angular/material/button';
    import { MatMenuModule } from '@angular/material/menu';
    import { MatCheckboxModule } from '@angular/material/checkbox';
    import { UserService } from '../../../../services/user.service';
    import { IProfile } from '../../../../interfaces/profile';
    
    @Component({
    selector: 'app-profile-list',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatCheckboxModule, MatPaginatorModule],
    templateUrl: 'profile-list.component.html',
    styleUrls: ['./profile-list.component.scss']
})
    export class ProfileListComponent {
        accountCode: string;
        userArr: any[] = [];
        profile: IProfile;
        displayedColumns: string[] = ['name', 'city', 'email', 'skills', 'action'];
        dataSource = new MatTableDataSource(this.userArr);

        @ViewChild(MatPaginator) paginator: MatPaginator;

        constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) { 
            //public dialog: MatDialog
        }
        
        ngAfterViewInit() {
            this.dataSource.paginator = this.paginator;
        }
        ngOnInit(): void {
            this.userService.getAccountCode().subscribe(accountCode => {
                this.accountCode = accountCode;
                this.cdr.detectChanges();
                this. getAllUsers();
            });
        }
        
        getAllUsers(){
            this.userService.getAllUsers(this.accountCode).subscribe({
                next: response => {
                    this.userArr = response;
                    console.log(this.userArr,'unfiltered');
                    this.dataSource.data = this.userArr.filter(user => {
                        const roleNames = user.roleNames.split(',').map((name: string) => name.trim()); // Split roleId string into an array and trim spaces
                        return roleNames.includes('Instructor'); // Check if '5' is included in the array
                      });
                    console.log(this.dataSource.data,'filtered');
                },
                error: error => {
                  console.error('Error fetching users:', error);
                  // Handle error here (e.g., show error message)
                }
              });
        }

        editUser(userId: number){
            this.router.navigate(['/app-edit-user', userId]);
        }

        viewProfile(userId: number){
            this.router.navigate(['/app-edit-profile', userId]);
        }
        active = true;
        inactive = true;
    }