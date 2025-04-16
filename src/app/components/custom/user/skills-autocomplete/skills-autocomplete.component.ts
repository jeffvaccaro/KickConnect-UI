import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SkillService } from '../../../../services/skill.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-skills-autocomplete',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, MatChipsModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatIconModule, NgFor],
    templateUrl: './skills-autocomplete.component.html',
    styleUrls: ['./skills-autocomplete.component.scss']
})

export class SkillsAutocompleteComponent implements OnInit {
  @Input() initialSkills: any[] = [];
  @Output() skillCollection = new EventEmitter<any[]>();

  skillsArr: any[] = [];
  currentSkillControl = new FormControl('');
  skillsControl = new FormControl<any[]>([]);

  constructor(private skillService: SkillService, private snackBarService: SnackbarService) { }

  ngOnInit(): void {
    this.skillService.getAllSkills().subscribe({
      next: response => {
        this.skillsArr = response;
        //console.log(this.skillsArr, 'skillsArr');
        this.setInitialSkills();  // Ensure skills are set after fetching them
      },
      error: error => {
        this.snackBarService.openSnackBar('Error fetching Skills:' + error.message, '', []);
      }
    });
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  get filteredSkills() {
    const currentSkill = this.currentSkillControl.value?.toLowerCase() || '';
    return currentSkill
      ? this.skillsArr.filter(skill => skill.skillName.toLowerCase().includes(currentSkill))
      : this.skillsArr.slice();
  }

  readonly announcer = inject(LiveAnnouncer);

  trackBySkill(index: number, skill: any): number {
    return skill.skillId;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const currentSkills = this.skillsControl.value || [];

    const selectedSkill = this.skillsArr.find(skill => skill.skillName === value);

    if (selectedSkill && !currentSkills.some(skill => skill.skillId === selectedSkill.skillId)) {
      this.skillsControl.setValue([...(currentSkills || []), selectedSkill]);
    } else if (!selectedSkill && value) {
      const newSkill = { skillName: value, skillId: `new-${value}` };
      this.skillsControl.setValue([...(currentSkills || []), newSkill]);
    }

    this.skillCollection.emit(this.skillsControl.value ?? []);
    
    if (event.chipInput) {
      event.chipInput.clear();
    }

    this.currentSkillControl.setValue('');
  }

  remove(skill: any): void {
    const currentSkills = this.skillsControl.value || [];

    this.skillsControl.setValue(currentSkills.filter(s => s.skillId !== skill.skillId));
    this.skillCollection.emit(this.skillsControl.value ?? []);
    this.announcer.announce(`Removed ${skill.skillName}`);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const currentSkills = this.skillsControl.value || [];
    const value = event.option.value;

    if (!currentSkills.some(skill => skill.skillId === value.skillId)) {
      this.skillsControl.setValue([...currentSkills, value]);
      this.skillCollection.emit(this.skillsControl.value ?? []);
    }

    this.currentSkillControl.setValue('');
    event.option.deselect();
  }

  private setInitialSkills(): void {
    //console.log('Initial Skills:', this.initialSkills);
    if (this.initialSkills.length > 0) {
      const initialSkills = this.initialSkills.map(skill => {
        if (typeof skill === 'string') {
          // Handle case where skill is a string
          const existingSkill = this.skillsArr.find(s => s.skillName === skill);
          return existingSkill 
            ? existingSkill 
            : {
                skillName: skill,
                skillId: `new-${skill}`
              };
        } else {
          // Handle case where skill is an object
          const existingSkill = this.skillsArr.find(s => s.skillName === skill.skillName);
          return existingSkill 
            ? existingSkill 
            : {
                skillName: skill.skillName,
                skillId: skill.skillId && typeof skill.skillId === 'string' && skill.skillId.startsWith('new-')
                  ? skill.skillId 
                  : `new-${skill.skillName}`
            };
        }
      });
      this.skillsControl.setValue(initialSkills);
      //console.log('Skills Control Value:', this.skillsControl.value);
      this.skillCollection.emit(initialSkills); // Emit the initial skills
    }
  }

}


