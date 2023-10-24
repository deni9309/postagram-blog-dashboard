import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: [ './header.component.css' ]
})
export class HeaderComponent implements OnInit {
    hasUser$: Observable<boolean>;
    userEmail: string;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.userEmail = JSON.parse(localStorage.getItem('user'))?.email;

        this.hasUser$ = this.authService.isLoggedIn$();
    }

    logoutUser() {
        this.authService.logout();
    }
}
