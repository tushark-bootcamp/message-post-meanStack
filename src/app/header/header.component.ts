import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    
    newPost = 'NO CONTENT';
    enteredValue = '';

    onAddPost() {
        this.newPost = this.enteredValue;
    }
}