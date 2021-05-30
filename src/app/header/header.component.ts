import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

    isloggedIn = false;
    private authStatusSubs: Subscription;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.isloggedIn = this.authService.getIsAuthenticated();
        this.authStatusSubs = this.authService.getAuthStatusListener()
            .subscribe(authStatus => {
                this.isloggedIn = authStatus;
            });
    }

    ngOnDestroy() {
        this.authStatusSubs.unsubscribe();
    }

    onLogout() {
        this.authService.logout();
    }

}