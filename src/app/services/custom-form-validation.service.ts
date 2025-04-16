import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomFormValidationService {
  setupConditionalValidators(formGroup: FormGroup): void {
    formGroup.get('existingEventValue')?.valueChanges.subscribe(value => {
      const eventNameControl = formGroup.get('eventName');
      const eventDescriptionControl = formGroup.get('eventDescription');
      const existingEventNameControl = formGroup.get('existingEventName');
      
      if (value === 'newEventClass') {
        eventNameControl?.setValidators([Validators.required]);
        eventDescriptionControl?.setValidators([Validators.required]);
      } else {
        eventNameControl?.clearValidators();
        eventDescriptionControl?.clearValidators();
      }
  
      eventNameControl?.updateValueAndValidity();
      eventDescriptionControl?.updateValueAndValidity();
      existingEventNameControl?.updateValueAndValidity();
    });
  
    formGroup.get('isReservation')?.valueChanges.subscribe(value => {
      const reservationCountControl = formGroup.get('reservationCount');
  
      if (value) {
        reservationCountControl?.setValidators([Validators.required]);
      } else {
        reservationCountControl?.clearValidators();
      }
      reservationCountControl?.updateValueAndValidity();
    });
  
    formGroup.get('isCostToAttend')?.valueChanges.subscribe(value => {
      const costToAttendControl = formGroup.get('costToAttend');
  
      if (value) {
        costToAttendControl?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        costToAttendControl?.clearValidators();
      }
      costToAttendControl?.updateValueAndValidity();
    });
  
    const eventDescriptionControl = formGroup.get('eventDescription');
    eventDescriptionControl?.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      if (!eventDescriptionControl?.value || eventDescriptionControl.value.trim() === "") {
        eventDescriptionControl?.setErrors({ required: true });
      } else {
        eventDescriptionControl?.setErrors(null);
      }
      eventDescriptionControl?.updateValueAndValidity({ emitEvent: false });
    });
  
    formGroup.updateValueAndValidity();
  }
  
  updateFormControlStates(form: FormGroup, isPopulated: boolean) {
    const controlsToUpdate = ['existingClassValue', 'existingClassName', 'eventName', 'eventDescription', 'isReservation', 'isCostToAttend', 'reservationCount', 'costToAttend'];
    controlsToUpdate.forEach(control => {
        if (isPopulated) {
          form.get(control)?.disable();
        } else {
          form.get(control)?.enable();
        }
    });
  }

}
