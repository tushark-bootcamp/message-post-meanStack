import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';

// {providedIn: 'root'} ensures there is a single instance of AuthService i.e. Singleton pattern
@Injectable({ providedIn: 'root' })
export class AuthService {

    private token: string;
    private isAuthenticated = false;
    private tokenTimer: any;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getIsAuthenticated() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        };
        this.http.post<{ message: string, user: User }>("http://localhost:3000/api/user/signup", authData)
            .subscribe(respData => {
                console.log(respData);
                this.router.navigate(["/"]);
            });
    }

    login(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        };
        this.http.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", authData)
            .subscribe(respData => {
                console.log(respData);
                const token = respData.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = respData.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    console.log(expirationDate);
                    this.saveAuthData(token, expirationDate);
                    this.router.navigate(["/"]);
                }
            });
    }

    autoAuthUser() {
        const authInfo = this.getAuthData();
        if (authInfo) {
            const now = new Date();
            const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
            if (expiresIn > 0) {
                this.token = authInfo.token;
                this.isAuthenticated = true;
                this.setAuthTimer(expiresIn / 1000);
                this.authStatusListener.next(true);
                //this.router.navigate(["/"]);
            }
        }
    }

    private setAuthTimer(duration: number) {
        console.log("Setting logout timer: " + duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(["/login"]);
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expiration = localStorage.getItem("expiration");
        if (!token || !expiration) {
            return;
        } else {
            return {
                token: token,
                expirationDate: new Date(expiration)
            };
        }
    }
}