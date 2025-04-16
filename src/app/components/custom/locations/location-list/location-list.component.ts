import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

import { LocationService } from '../../../../services/location.service';

@Component({
    selector: 'app-location-list',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatTabsModule],
    templateUrl: './location-list.component.html',
    styleUrl: './location-list.component.scss'
})
export class LocationListComponent implements OnInit, AfterViewInit {
  private locationArr: any[] = [];
  displayedColumns: string[] = ['Name', 'Address', 'Phone', 'Email', 'Action'];
  dataSource = new MatTableDataSource(this.locationArr);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private locationService: LocationService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    let status: string = '';
    this.route.queryParams.subscribe(params => {
      status = params['status'];
    });
    this.getLocations('Active');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  active = true;
  inactive = true;

  getLocations(status: string): void {
    this.locationService.getLocations(status).subscribe({
      next: response => {
        this.locationArr = response;
        this.dataSource.data = this.locationArr; 
      },
      error: error => {
        console.error('Error fetching locations:', error);
        // Handle error here (e.g., show error message)
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
    this.getLocations(status);
  }

  btnAddNewClick() {
    this.router.navigate(['/app-add-new-location']);
  }

  editLocation(locationId: number){
    this.router.navigate(['/app-edit-location', locationId]);
  }

  assignments(locationId: number){
    this.router.navigate(['/app-assignments', locationId]);
  }

  filterLocations(){
    //this.router.navigate(['/app-location-list'], { queryParams: { status: 'InActive' } });
  }


}
