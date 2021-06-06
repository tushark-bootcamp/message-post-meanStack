import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSubs: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSubs = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  onSignup(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    console.log(form.value);
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
