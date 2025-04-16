import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SnackbarService } from '../../../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '../../../../services/skill.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'app-skill-list',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatTabsModule],
    templateUrl: './skill-list.component.html',
    styleUrl: './skill-list.component.scss'
})
export class SkillListComponent implements OnInit, AfterViewInit {
  private skillsArr: any[] = [];
  accountCode: string;
  accountId: number;
  displayedColumns: string[] = ['skillName','skillDescription','action'];
  dataSource = new MatTableDataSource(this.skillsArr);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private skillService: SkillService, private snackBarService: SnackbarService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.skillService.getAllSkills().subscribe({
      next: response => {
        this.skillsArr = response;
        this.dataSource.data = this.skillsArr;
      },
      error: error => {
        this.snackBarService.openSnackBar('Error fetching Skills:' + error.message, '',  []);
      }
    });    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  btnAddNewClick() {
    this.router.navigate(['/app-add-new-skill']);
  }

  editSkill(skillId: number){
    this.router.navigate(['/app-edit-skill', skillId]);
  }
}

