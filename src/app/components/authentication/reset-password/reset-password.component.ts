import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../services/user.service';
import { catchError, of, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';


@Component({
    selector: 'app-reset-password',
    imports: [RouterLink, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    hide = true;
    form: FormGroup;
    userId: string;
    accountId: string;
    accountCode: string;

    constructor(public themeService: CustomizerSettingsService, private fb: FormBuilder, private route: ActivatedRoute, private userService: UserService, private router: Router) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            console.log('Query params in component:', params);
            this.userId = params['userId'];
            this.accountId = params['accountId'];
            this.accountCode = params['accountCode'];
        });

        this.form = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    onSubmit(event: Event) {
        event.preventDefault();
        if (this.form.valid) {
            console.log('Form is valid:', this.form.value);
            const userData = { password: this.form.get('newPassword')!.value as string };

            this.userService.updateUserPassword(this.accountCode, parseInt(this.userId), parseInt(this.accountId), userData).pipe(
                tap((response: any) => {
                    console.log('User updated password successfully:', response?.message);
                }),
                catchError(error => {
                    console.error('Error updating User password:', error.message);
                    return of(); // Return an observable to complete the stream
                })
            ).subscribe();
        } else {
            console.error('Form is invalid:', this.form.errors);
        }
    }
}
