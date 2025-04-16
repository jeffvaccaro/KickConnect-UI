import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-add-new-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './add-new-profile.component.html',
    styleUrl: './add-new-profile.component.scss'
})
export class AddNewProfileComponent {
  btnAddNewClick(){

  }

  imageSrc: string | ArrayBuffer | null = null;

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

}


