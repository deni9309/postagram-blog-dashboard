import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.css' ]
})
export class LoginComponent {

    loginForm = this.fb.group({
        Email: [ '', [ Validators.required, Validators.email ] ],
        Password: [ '', [ Validators.required, Validators.minLength(6) ] ]
    });

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

    get fc() {
        return this.loginForm.controls;
    }

    onSubmit() {
        if (this.loginForm.invalid) return;

        this.authService.login(this.loginForm.value.Email, this.loginForm.value.Password)
            .then(() => {
                this.loginForm.reset();
            });
    }
}
