import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;

  private authStatusSubs: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSubs = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  onLogin(form: NgForm) {
    //console.log(form.value);
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    //.subscribe( resp => {})
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }

}
