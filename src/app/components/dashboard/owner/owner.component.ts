import { Component } from '@angular/core';
import { LocationListComponent } from '../../custom/locations/location-list/location-list.component';
import { UserListComponent } from '../../custom/user/user-list/user-list.component';

@Component({
    selector: 'app-owner',
    imports: [
        LocationListComponent,
        UserListComponent
    ],
    templateUrl: './owner.component.html',
    styleUrl: './owner.component.scss'
})
export class OwnerComponent {

}

