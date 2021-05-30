import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  // Commenting below code as we are not using EventEmitter
  // title = 'app';
  // storedPosts: Post[] = [];

  // onPostCreated(post: Post) {
  //   this.storedPosts.push(post)
  // }

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
