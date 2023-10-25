import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Auth, signInWithEmailAndPassword, authState, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isLoggedInGuard: boolean = false;

    constructor(
        private afAuth: Auth,
        private toastr: ToastrService,
        private router: Router
    ) { }

    login(email: string, password: string) {
        return signInWithEmailAndPassword(this.afAuth, email, password)
            .then(user => {
                this.setUserToLS();
                this.loggedIn$$.next(true);
                this.isLoggedInGuard = true;

                this.toastr.success(`Welcome back, ${email}!`)
                this.router.navigate([ '/dashboard' ]);
            })
            .catch((err: FirebaseError) => {
                this.toastr.warning('Wrong Email or Password!')
            });
    }

    private setUserToLS(): void {
        authState(this.afAuth).subscribe(user => {
            localStorage.setItem('user', JSON.stringify(user));
        })
    }

    logout() {
        signOut(this.afAuth).then(() => {
            localStorage.removeItem('user');
            this.loggedIn$$.next(false);
            this.isLoggedInGuard = false;

            this.toastr.info('Logged Out... Goodbye!')
            this.router.navigate([ '/login' ]);

        }).catch(err => {
            this.toastr.warning('Sorry, there\'s been an error!')
            this.router.navigate([ '/page-not-found' ]);
        })
    }

    isLoggedIn$() {
        return this.loggedIn$$.asObservable();
    }
}
